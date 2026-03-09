require('dotenv').config();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const path = require('path');
const dns = require('dns');

// CRITICAL FIX FOR RAILWAY IPv4
dns.setDefaultResultOrder('ipv4first');

const User = require('./models/User');

const dryRun = process.argv.includes('--dry-run');

async function sendFeaturePromo() {
    console.log('🌟 Launching Duckshow Premium Feature Showcase');
    if (dryRun) console.log('🧪 DRY RUN MODE - Targeted at admin email only.');

    if (!process.env.MONGODB_URI || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('❌ Environment variables missing.');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const transporter = nodemailer.createTransport({
            host: '142.251.10.108', // Hardcoded IPv4 for smtp.gmail.com
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                servername: 'smtp.gmail.com',
                rejectUnauthorized: false
            }
        });

        const users = await User.find({});
        console.log(`📋 Recipients: ${users.length} users.`);

        // Skip logic for resumption
        const alreadySent = [
            'abhisingh940927@gmail.com',
            'tester@test.com',
            'himanshujaipur77@gmail.com',
            'abhisingh329624@gmail.com',
            'adivemnm@gmail.com',
            'himanshusaini9256@gmail.com',
            'godararoshan2006@gmail.com',
            'roshi200god@gmail.com',
            'tester2@test.com'
        ];

        for (const user of users) {
            const recipientEmail = dryRun ? process.env.EMAIL_USER : (user.email || user.phone);
            
            if (!dryRun && alreadySent.includes(recipientEmail)) {
                console.log(`⏩ Skipping ${user.name} (${recipientEmail}) - Already sent.`);
                continue;
            }

            if (!dryRun && (!user.email || !user.email.includes('@'))) {
                console.warn(`⚠️ Skipping ${user.name} - Invalid email.`);
                continue;
            }

            const mailOptions = {
                from: `"Duckshow Elite" <${process.env.EMAIL_USER}>`,
                to: recipientEmail,
                subject: '💎 Discover the Art of Streaming at Duckshow',
                html: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #000; color: #fff; padding: 0; margin: 0; width: 100%;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000;">
                        <tr>
                            <td align="center" style="padding: 20px;">
                                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; border-radius: 20px; overflow: hidden; border: 1px solid #1a1a1a;">
                                    <!-- Banner Image -->
                                    <tr>
                                        <td>
                                            <img src="cid:featureBanner" alt="Duckshow Elite Features" style="width: 100%; display: block;">
                                        </td>
                                    </tr>
                                    <!-- Content -->
                                    <tr>
                                        <td style="padding: 50px 40px;">
                                            <div style="text-align: center; margin-bottom: 40px;">
                                                <h1 style="color: #FFD600; font-size: 32px; margin: 0; letter-spacing: 6px; text-transform: uppercase; font-weight: 900;">ELITE EXPERIENCE</h1>
                                                <p style="color: #666; font-size: 14px; margin-top: 10px; text-transform: uppercase; letter-spacing: 2px;">Beyond the Screen</p>
                                            </div>

                                            <p style="font-size: 18px; line-height: 1.6; color: #fff; margin-bottom: 30px;">
                                                We've built something "expensive" for people who value quality. Dear ${user.name}, it's time to explore the full potential of your Duckshow account.
                                            </p>
                                            
                                            <!-- Feature 1: Themes -->
                                            <div style="margin-bottom: 40px; background: #0f0f0f; padding: 25px; border-radius: 12px; border-left: 3px solid #00f2ff;">
                                                <h3 style="color: #00f2ff; font-size: 18px; margin: 0 0 10px 0; display: flex; align-items: center;">
                                                    🎨 Bespoke Themes
                                                </h3>
                                                <p style="color: #888; font-size: 14px; line-height: 1.6; margin: 0;">
                                                    Duckshow isn't just about movies; it's about the mood. Toggle between <strong>Dark Onyx</strong>, <strong>Golden Cinema</strong>, and <strong>Neon Nights</strong> to match your streaming environment.
                                                </p>
                                            </div>

                                            <!-- Feature 2: 4K & Sound -->
                                            <div style="margin-bottom: 40px; background: #0f0f0f; padding: 25px; border-radius: 12px; border-left: 3px solid #FFD600;">
                                                <h3 style="color: #FFD600; font-size: 18px; margin: 0 0 10px 0;">
                                                    🎞️ Cinematic Fidelity
                                                </h3>
                                                <p style="color: #888; font-size: 14px; line-height: 1.6; margin: 0;">
                                                    Our platform supports <strong>4K Ultra HD</strong> and <strong>Spatial Audio</strong>. Feel every frame and hear every whisper with the clarity you deserve.
                                                </p>
                                            </div>

                                            <!-- Feature 3: Premium Facilities -->
                                            <div style="margin-bottom: 40px; background: #141414; padding: 30px; border-radius: 12px; border: 1px dashed #444; text-align: center;">
                                                <p style="color: #FFD600; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0;">Exclusive Subscription Benefits</p>
                                                <h2 style="color: #fff; font-size: 22px; margin: 0 0 20px 0;">Duckshow Premium Facilities</h2>
                                                <table width="100%" border="0" cellspacing="0" cellpadding="10" style="color: #888; font-size: 14px; text-align: left;">
                                                    <tr>
                                                        <td align="center">✅ Ad-Free Universe</td>
                                                        <td align="center">✅ Multi-Device Sync</td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center">✅ Offline Freedom</td>
                                                        <td align="center">✅ Early Access</td>
                                                    </tr>
                                                </table>
                                            </div>

                                            <div align="center" style="margin: 50px 0;">
                                                <a href="http://duckshow.net/" style="background-color: #FFD600; color: #000; padding: 20px 60px; border-radius: 100px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 10px 30px rgba(255, 214, 0, 0.3);">START EXPLORING</a>
                                            </div>

                                            <p style="color: #444; font-size: 12px; font-style: italic; text-align: center; border-top: 1px solid #1a1a1a; padding-top: 30px;">
                                                "Movies are the most powerful weapon in the world, as long as the popcorn is good."
                                            </p>
                                        </td>
                                    </tr>
                                    <!-- Footer -->
                                    <tr>
                                        <td align="center" style="padding: 30px; background-color: #050505; border-top: 1px solid #1a1a1a;">
                                            <p style="color: #333; font-size: 10px; margin: 0; letter-spacing: 1px;">CURATED BY DUCKSHOW GLOBAL</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
                `,
                attachments: [{
                    filename: 'feature-banner.png',
                    path: path.join(__dirname, 'feature-banner.png'),
                    cid: 'featureBanner'
                }]
            };

            await transporter.sendMail(mailOptions);
            console.log(`✨ Feature Promo sent to: ${user.name} (${recipientEmail})`);

            if (dryRun) {
                console.log('🧪 Dry run complete. Verify the email in your inbox.');
                break;
            }
            
            await new Promise(resolve => setTimeout(resolve, 2000)); // Throttled for stability
        }

        console.log('🏁 Feature Showcase Campaign Finalized!');
        process.exit(0);

    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

sendFeaturePromo();
