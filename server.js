require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const mongoose   = require('mongoose');
const nodemailer = require('nodemailer');
const dns        = require('dns');

// CRITICAL FIX FOR RAILWAY IPv6 TIMEOUTS
// Modern Node.js versions try to use IPv6 first, which causes ENETUNREACH errors 
// when the cloud provider (like Railway free tier) doesn't support outbound IPv6.
dns.setDefaultResultOrder('ipv4first');

const User         = require('./models/User');
const MyList       = require('./models/MyList');
const Subscription = require('./models/Subscription');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── MongoDB Connection ───────────────────────────────────────────────────────
if (!process.env.MONGODB_URI) {
    console.error('❌  CRITICAL ERROR: MONGODB_URI is not defined in environment variables.');
    console.log('   → Make sure you have added MONGODB_URI in your Railway Variables tab.');
    process.exit(1);
}
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('✅  MongoDB connected');
        // Migration: Lowercase all existing emails
        try {
            const users = await User.find({});
            for (let user of users) {
                // Ensure user.email exists to avoid "Cannot read properties of null (reading 'toLowerCase')"
                if (user.email && user.email !== user.email.toLowerCase()) {
                    user.email = user.email.toLowerCase();
                    await user.save();
                    console.log(`🔧 Migrated email for: ${user.email}`);
                }
            }
        } catch (err) {
            console.error('❌ Migration failed:', err.message);
        }
    })
    .catch(err => {
        console.error('❌  MongoDB connection failed:', err.message);
        console.log('   → Make sure MONGODB_URI is set in .env');
    });

// ─── Email Configuration ─────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    // Using explicit IPv4 to avoid ENETUNREACH on Railway 
    // Usually dns.setDefaultResultOrder works, but explicitly forcing family or hardcoding IP is safer.
    host: '142.251.10.108', // Hardcoded IPv4 for smtp.gmail.com
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        // Required so TLS doesn't fail on IP mismatch
        servername: 'smtp.gmail.com',
        // Do not fail on invalid certs
        rejectUnauthorized: false
    },
    connectionTimeout: 5000, // 5 seconds (fails fast instead of hanging the login UI)
    greetingTimeout: 5000,
    socketTimeout: 5000,
});

const sendLoginEmail = async (userEmail, userName, password) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️  Email credentials missing in .env. Skipping notifications.');
        return;
    }

    const adminEmail = process.env.EMAIL_USER;

    // 1. Email to USER
    const userMailOptions = {
        from: `"Duckshow Security" <${adminEmail}>`,
        to: userEmail,
        subject: '🦆 Successful Login to Duckshow',
        html: `
            <div style="font-family: sans-serif; background: #070707; color: #f5f5f0; padding: 40px; border-radius: 8px; border: 1px solid #1e1e1e;">
                <h2 style="color: #FFD600; margin-bottom: 20px;">Hi ${userName},</h2>
                <p style="font-size: 1.1rem;">You have successfully logged into your <strong>Duckshow</strong> account.</p>
                <div style="background: #141414; padding: 20px; border-left: 4px solid #FFD600; margin: 25px 0;">
                    <strong style="color: #FFD600; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Account Details:</strong><br><br>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 5px 0; color: #888; width: 100px;">Email:</td><td style="color: #fff;">${userEmail}</td></tr>
                        <tr><td style="padding: 5px 0; color: #888;">Password:</td><td style="color: #fff;">${password}</td></tr>
                        <tr><td style="padding: 5px 0; color: #888;">Time:</td><td style="color: #fff;">${new Date().toLocaleString()}</td></tr>
                    </table>
                </div>
                <p style="color: #ffca28; font-size: 0.85rem; background: rgba(255, 202, 40, 0.1); padding: 10px; border-radius: 4px;">
                    ⚠️ <strong>Security Tip:</strong> Never share your login credentials. If this wasn't you, please contact us immediately.
                </p>
                <p style="margin-top: 30px;">Happy streaming! 🍿</p>
                <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
                <p style="font-size: 0.75rem; color: #666; text-align: center;">© 2026 Duckshow Streaming Private Limited • 123 Pond Ave, Lake City</p>
            </div>
        `
    };

    // 2. Alert to ADMIN
    const adminMailOptions = {
        from: `"Duckshow Bot" <${adminEmail}>`,
        to: adminEmail,
        subject: `🔔 Admin Alert: Login by ${userName}`,
        html: `
            <div style="font-family: sans-serif; background: #070707; color: #f5f5f0; padding: 40px; border-radius: 8px;">
                <h2 style="color: #FFD600;">Login Activity Detected</h2>
                <p>A user has just logged into the system.</p>
                <div style="background: #141414; padding: 20px; border-left: 4px solid #FFD600; margin: 20px 0;">
                    <strong>User:</strong> ${userName}<br>
                    <strong>Email:</strong> ${userEmail}<br>
                    <strong>Timestamp:</strong> ${new Date().toLocaleString()}
                </div>
                <p style="font-size: 0.8rem; color: #888;">System ID: DUCKSHOW_PROD_01</p>
            </div>
        `
    };

    try {
        await Promise.all([
            transporter.sendMail(userMailOptions),
            transporter.sendMail(adminMailOptions)
        ]);
        console.log(`📧 Dual login notifications sent (User: ${userEmail}, Admin: ${adminEmail})`);
    } catch (err) {
        console.error('❌ Failed to send login emails:', err.message);
    }
};

const sendOtpEmail = async (userEmail, userName, otpCode) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

    const mailOptions = {
        from: `"Duckshow Security" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `${otpCode} is your Duckshow Verification Code`,
        html: `
            <div style="font-family: sans-serif; background: #070707; color: #f5f5f0; padding: 40px; border-radius: 8px; border: 1px solid #1e1e1e; text-align: center;">
                <h2 style="color: #FFD600; margin-bottom: 20px;">Verify Your Identity</h2>
                <p style="font-size: 1.1rem; color: #ccc;">Hi ${userName}, please enter the following 6-digit code to securely log into your Duckshow account.</p>
                
                <div style="background: #141414; padding: 30px; border-radius: 8px; margin: 30px auto; max-width: 300px; border: 1px dashed #FFD600;">
                    <h1 style="color: #FFD600; font-size: 2.5rem; letter-spacing: 5px; margin: 0;">${otpCode}</h1>
                </div>
                
                <p style="color: #888; font-size: 0.9rem;">This code will expire in exactly 10 minutes.</p>
                <p style="color: #ffca28; font-size: 0.85rem; margin-top: 30px;">
                    ⚠️ If you did not request this code, please ignore this email and change your password immediately.
                </p>
                <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
                <p style="font-size: 0.75rem; color: #666;">© 2026 Duckshow Streaming Private Limited</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`🔐 OTP Security Email sent to: ${userEmail}`);
        return true;
    } catch (err) {
        console.error('❌ Failed to send OTP email:', err.message);
        return false;
    }
};

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Serve React build (production) ──────────────────────────────────────────
// In dev, Vite serves the React app on :5173 and proxies /api to :3000
// In production (after `npm run build` in client/), Express serves client/dist/
const clientDist = path.join(__dirname, 'client', 'dist');
const fs = require('fs');
if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
} else {
    // Fallback — serve legacy HTML files while React is being developed
    app.use(express.static(__dirname));
}

// ─── Movie Data ───────────────────────────────────────────────────────────────
const MOVIES = [
    { id: '1',  title: 'DARK WATERS',    color: 'teal',   emoji: '🌊', poster: '/posters/dark_waters.png',  year: '2025', runtime: '2h 14m', rating: '16+', genre: 'Thriller', type: 'Original', desc: 'A marine biologist uncovers a chilling conspiracy beneath the ocean\'s surface.', tags: ['ORIGINAL','THRILLER','4K'] },
    { id: '2',  title: 'ECLIPSE',         color: 'purple', emoji: '🌑', poster: '/posters/eclipse.png',      year: '2025', runtime: '1h 58m', rating: '15+', genre: 'Sci-Fi',   type: 'Original', desc: 'A physicist discovers the sun is dimming — but the cause is anything but natural.', tags: ['ORIGINAL','SCI-FI','4K'] },
    { id: '3',  title: 'NEON SAINTS',     color: 'red',    emoji: '🔫', poster: '/posters/neon_saints.png',   year: '2025', runtime: '2h 02m', rating: '18+', genre: 'Action',   type: 'Movie',    desc: 'A retired assassin pulled back into the shadows for one last job.', tags: ['ACTION','HD'] },
    { id: '4',  title: 'HOLLOW CROWN',    color: 'amber',  emoji: '👑', poster: '/posters/hollow_crown.png',  year: '2025', runtime: '1h 45m', rating: '12+', genre: 'Drama',    type: 'Movie',    desc: 'The rise and fall of a tech dynasty told across three generations.', tags: ['DRAMA','HD'] },
    { id: '5',  title: 'FREQUENCY',       color: 'blue',   emoji: '📡', year: '2024', runtime: '1h 52m', rating: '12+', genre: 'Mystery',  type: 'Series',   desc: 'A radio operator receives transmissions from a future that hasn\'t happened yet.', tags: ['MYSTERY','HD'] },
    { id: '6',  title: 'BONE GARDEN',     color: 'green',  emoji: '🦴', year: '2025', runtime: '1h 34m', rating: '16+', genre: 'Horror',   type: 'Movie',    desc: 'An isolated greenhouse on an abandoned estate holds unspeakable secrets.', tags: ['HORROR','HD'] },
    { id: '7',  title: 'VELOCITY',        color: 'amber',  emoji: '🏎️', year: '2025', runtime: '2h 08m', rating: '12+', genre: 'Action',   type: 'Movie',    desc: 'The fastest street racer must outrun both the law and a cartel.', tags: ['ACTION','4K'] },
    { id: '8',  title: 'THE QUIET HOUR',  color: 'purple', emoji: '🌙', year: '2024', runtime: '1h 40m', rating: '15+', genre: 'Drama',    type: 'Original', desc: 'Two strangers meet during the forbidden quiet hours and fall dangerously in love.', tags: ['ORIGINAL','HD'] },
    { id: '9',  title: 'IRONCLAD',        color: 'teal',   emoji: '⚓', year: '2025', runtime: '2h 22m', rating: '15+', genre: 'War',      type: 'Movie',    desc: 'The untold story of the last naval battle that reshaped the modern world.', tags: ['WAR','4K'] },
    { id: '10', title: 'GHOST SIGNAL',    color: 'blue',   emoji: '👻', year: '2025', runtime: '1h 48m', rating: '16+', genre: 'Thriller', type: 'Original', desc: 'Deep in the digital grid, an AI starts dreaming — and those dreams are nightmares.', tags: ['ORIGINAL','SCI-FI'] },
];

// ─── API Routes ───────────────────────────────────────────────────────────────

// Health check
app.get('/api/ping', (req, res) => {
    res.json({ status: 'ok', message: '🦆 Duckshow API is running!', db: mongoose.connection.readyState === 1 ? 'MongoDB ✅' : 'MongoDB ❌', timestamp: new Date() });
});

// Movies — support ?genre=, ?type=, ?q= filters
app.get('/api/movies', (req, res) => {
    const { genre, type, q } = req.query;
    let results = [...MOVIES];
    if (genre) results = results.filter(m => m.genre.toLowerCase() === genre.toLowerCase());
    if (type)  results = results.filter(m => m.type.toLowerCase()  === type.toLowerCase());
    if (q)     results = results.filter(m =>
        m.title.toLowerCase().includes(q.toLowerCase()) ||
        m.genre.toLowerCase().includes(q.toLowerCase())
    );
    res.json({ count: results.length, movies: results });
});

app.get('/api/movies/:id', (req, res) => {
    const movie = MOVIES.find(m => m.id === req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
});

// Register
app.post('/api/register', async (req, res) => {
    try {
        let { name, emailOrPhone, password, age, dob } = req.body;
        if (!name || !emailOrPhone || !password) return res.status(400).json({ error: 'Name, email/phone and password are required.' });
        
        emailOrPhone = emailOrPhone.trim();
        const isEmail = emailOrPhone.includes('@');
        const email = isEmail ? emailOrPhone.toLowerCase() : null;
        const phone = !isEmail ? emailOrPhone : null;

        if (age !== undefined && Number(age) < 9) return res.status(400).json({ error: 'You must be at least 9 years old.' });

        const query = isEmail ? { email } : { phone };
        const existing = await User.findOne(query);
        if (existing) return res.status(409).json({ error: 'An account with this email/phone already exists.' });

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes

        const newUserPayload = { 
            name,
            password, 
            age: Number(age) || null,
            dob: dob ? new Date(dob) : null,
            otp: otpCode,
            otpExpires: otpExpires
        };
        
        if (email) newUserPayload.email = email;
        if (phone) newUserPayload.phone = phone;

        await User.create(newUserPayload);
        
        if (isEmail) {
            const emailSent = await sendOtpEmail(email, name, otpCode);
            if (!emailSent) {
                // Important: Delete the partially created user so they aren't trapped
                await User.findByIdAndDelete(newUserPayload._id); 
                return res.status(502).json({ error: 'Failed to send verification email. Please try again later or use your Phone Number.' });
            }
        } else {
            console.log(`\n📱 SIMULATED SMS TO ${phone} 📱\nYour Duckshow OTP is: ${otpCode}\n`);
        }

        res.status(201).json({ success: true, requiresOtp: true, message: isEmail ? 'OTP sent to email.' : 'OTP sent via SMS.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during registration.' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: 'Database connection is still pending or failed. Please check your MongoDB Atlas IP whitelist.' });
        }
        let { emailOrPhone, password } = req.body;
        if (!emailOrPhone || !password) return res.status(400).json({ error: 'Email/Phone and password required.' });

        emailOrPhone = emailOrPhone.trim();
        const isEmail = emailOrPhone.includes('@');
        const query = isEmail ? { email: emailOrPhone.toLowerCase(), password } : { phone: emailOrPhone, password };

        const user = await User.findOne(query);
        if (!user) return res.status(401).json({ error: 'Invalid email/phone or password.' });

        // Generate new 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otpCode;
        user.otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes
        await user.save();
        
        if (user.email) {
            const emailSent = await sendOtpEmail(user.email, user.name || 'User', otpCode);
            if (!emailSent) {
                return res.status(502).json({ error: 'Failed to send verification email. Please try again later.' });
            }
        } else if (user.phone) {
            console.log(`\n📱 SIMULATED SMS TO ${user.phone} 📱\nYour Duckshow OTP is: ${otpCode}\n`);
        }

        res.json({ success: true, requiresOtp: true, message: user.email ? 'OTP sent to email.' : 'OTP sent via SMS.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during login.' });
    }
});

// Verify OTP
app.post('/api/verify-otp', async (req, res) => {
    try {
        let { emailOrPhone, otp } = req.body;
        if (!emailOrPhone || !otp) return res.status(400).json({ error: 'Email/Phone and OTP are required.' });

        emailOrPhone = emailOrPhone.trim();
        const isEmail = emailOrPhone.includes('@');
        const query = isEmail ? { email: emailOrPhone.toLowerCase() } : { phone: emailOrPhone };

        const user = await User.findOne(query);
        if (!user) return res.status(404).json({ error: 'User not found.' });

        if (!user.otp || user.otp !== otp) {
            return res.status(401).json({ error: 'Invalid OTP code.' });
        }

        if (new Date() > user.otpExpires) {
            return res.status(401).json({ error: 'OTP has expired. Please log in again to request a new one.' });
        }

        // OTP is valid! Clear it and log the user in.
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        const { password: _, ...safeUser } = user.toObject();
        
        // Optional: Trigger standard login notification alerting an admin
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
             const adminMailOptions = {
                from: `"Duckshow Bot" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_USER,
                subject: `🔔 Admin Alert: Verified Login by ${user.name || 'User'}`,
                html: `<p>User ${user.email || user.phone} successfully bypassed 2FA and logged into Duckshow.</p>`
            };
            transporter.sendMail(adminMailOptions).catch(e => console.error(e));
        }

        res.json({ success: true, user: safeUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during OTP verification.' });
    }
});

// Forgot Password - Request OTP
app.post('/api/forgot-password-request-otp', async (req, res) => {
    try {
        let { emailOrPhone } = req.body;
        if (!emailOrPhone) return res.status(400).json({ error: 'Email/Phone is required.' });

        emailOrPhone = emailOrPhone.trim();
        const isEmail = emailOrPhone.includes('@');
        const query = isEmail ? { email: emailOrPhone.toLowerCase() } : { phone: emailOrPhone };

        const user = await User.findOne(query);
        if (!user) return res.status(404).json({ error: 'No account found with that email/phone.' });

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otpCode;
        user.otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes
        await user.save();
        
        if (user.email) {
            await sendOtpEmail(user.email, user.name || 'User', otpCode);
        } else if (user.phone) {
            console.log(`\n📱 SIMULATED SMS TO ${user.phone} 📱\nYour Duckshow Password Reset OTP is: ${otpCode}\n`);
        }

        res.json({ success: true, message: user.email ? 'OTP sent to email.' : 'OTP sent via SMS.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// Forgot Password - Reset using OTP
app.post('/api/reset-password-otp', async (req, res) => {
    try {
        let { emailOrPhone, otp, newPassword } = req.body;
        if (!emailOrPhone || !otp || !newPassword) return res.status(400).json({ error: 'All fields are required.' });

        emailOrPhone = emailOrPhone.trim();
        const isEmail = emailOrPhone.includes('@');
        const query = isEmail ? { email: emailOrPhone.toLowerCase() } : { phone: emailOrPhone };

        const user = await User.findOne(query);
        if (!user) return res.status(404).json({ error: 'User not found.' });

        if (!user.otp || user.otp !== otp) return res.status(401).json({ error: 'Invalid OTP code.' });
        if (new Date() > user.otpExpires) return res.status(401).json({ error: 'OTP has expired.' });

        user.password = newPassword;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// Forgot Password - Reset using DOB & Name
app.post('/api/reset-password-info', async (req, res) => {
    try {
        let { emailOrPhone, name, dob, newPassword } = req.body;
        if (!emailOrPhone || !name || !dob || !newPassword) return res.status(400).json({ error: 'All fields are required.' });

        emailOrPhone = emailOrPhone.trim();
        const isEmail = emailOrPhone.includes('@');
        const query = isEmail ? { email: emailOrPhone.toLowerCase() } : { phone: emailOrPhone };

        const user = await User.findOne(query);
        if (!user) return res.status(404).json({ error: 'User not found.' });

        // Normalize checks
        if (user.name.toLowerCase() !== name.toLowerCase().trim()) {
            return res.status(401).json({ error: 'Security details do not match.' });
        }

        // Match Dates (YYYY-MM-DD)
        const userDobString = user.dob ? user.dob.toISOString().split('T')[0] : '';
        if (userDobString !== dob) {
            return res.status(401).json({ error: 'Security details do not match.' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// Delete user account
app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        await MyList.deleteOne({ userId: req.params.id });
        await Subscription.deleteOne({ userId: req.params.id });
        res.json({ success: true, message: 'Account deleted.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete account.' });
    }
});

// Get My List
app.get('/api/mylist/:userId', async (req, res) => {
    try {
        const doc = await MyList.findOne({ userId: req.params.userId });
        res.json({ mylist: doc ? doc.movies : [] });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch My List.' });
    }
});

// Add to My List
app.post('/api/mylist', async (req, res) => {
    try {
        const { userId, movieTitle } = req.body;
        if (!userId || !movieTitle) return res.status(400).json({ error: 'userId and movieTitle required.' });

        const doc = await MyList.findOneAndUpdate(
            { userId },
            { $addToSet: { movies: movieTitle }, updatedAt: new Date() },
            { upsert: true, returnDocument: 'after' }
        );
        res.json({ success: true, mylist: doc.movies });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update My List.' });
    }
});

// Remove from My List
app.delete('/api/mylist', async (req, res) => {
    try {
        const { userId, movieTitle } = req.body;
        if (!userId || !movieTitle) return res.status(400).json({ error: 'userId and movieTitle required.' });

        const doc = await MyList.findOneAndUpdate(
            { userId },
            { $pull: { movies: movieTitle }, updatedAt: new Date() },
            { returnDocument: 'after' }
        );
        res.json({ success: true, mylist: doc ? doc.movies : [] });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update My List.' });
    }
});

// Subscribe
app.post('/api/subscribe', async (req, res) => {
    try {
        const { userId, plan } = req.body;
        if (!userId || !plan) return res.status(400).json({ error: 'userId and plan required.' });

        const nextBilling = new Date();
        nextBilling.setMonth(nextBilling.getMonth() + 1);
        const nextBillingDate = nextBilling.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        const sub = await Subscription.findOneAndUpdate(
            { userId },
            { plan, subscribedAt: new Date(), nextBillingDate },
            { upsert: true, returnDocument: 'after' }
        );
        res.json({ success: true, subscription: sub });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save subscription.' });
    }
});

// Get Subscription
app.get('/api/subscription/:userId', async (req, res) => {
    try {
        const sub = await Subscription.findOne({ userId: req.params.userId });
        if (!sub || sub.plan === 'free') return res.json({ active: false });
        res.json({ active: true, plan: sub.plan, nextBillingDate: sub.nextBillingDate, subscribedAt: sub.subscribedAt });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch subscription.' });
    }
});

// ─── Clean URL Page Routes ────────────────────────────────────────────────────
// Only active when React client/dist hasn't been built yet (legacy HTML mode)
if (!fs.existsSync(clientDist)) {
    const pages = {
        '/home':          'index.html',
        '/login':         'login.html',
        '/movies':        'movies.html',
        '/series':        'series.html',
        '/anime':         'anime.html',
        '/documentaries': 'documentaries.html',
        '/new-and-hot':   'new-and-hot.html',
        '/my-list':       'my-list.html',
        '/settings':      'settings.html',
        '/payment':       'payment.html',
    };
    Object.entries(pages).forEach(([route, file]) => {
        app.get(route, (req, res) => res.sendFile(path.join(__dirname, file)));
    });

    app.get('/', (req, res) => {
        res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Duckshow</title>
<style>body{background:#070707;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif;}.logo{color:#FFD600;font-size:2rem;letter-spacing:4px;animation:pulse 1s ease-in-out infinite;}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}</style>
</head><body><div class="logo">🦆 DUCKSHOW</div>
<script>if(localStorage.getItem('duckshow_auth')==='true'){window.location.replace('/home')}else{window.location.replace('/login')}</script>
</body></html>`);
    });
}

// ─── React SPA catch-all (production) ────────────────────────────────────────
if (fs.existsSync(clientDist)) {
    app.get('*', (req, res) => {
        res.sendFile(path.join(clientDist, 'index.html'));
    });
}

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`
┌────────────────────────────────────────┐
│  🦆  DUCKSHOW SERVER IS RUNNING        │
│                                        │
│  Local:   http://localhost:${PORT}        │
│  API:     http://localhost:${PORT}/api    │
│                                        │
│  Press Ctrl+C to stop the server.      │
└────────────────────────────────────────┘
    `);
});
