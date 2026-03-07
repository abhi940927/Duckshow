const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'db.json');

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve all HTML, CSS, JS files

// ─── Clean URL Page Routes (no .html needed in browser) ──────────────────────
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
    app.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, file));
    });
});

// ─── Root / Gateway — Redirect based on login state ──────────────────────────
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Duckshow — Loading...</title>
<style>
    body { background: #070707; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: sans-serif; }
    .logo { color: #FFD600; font-size: 2rem; letter-spacing: 4px; animation: pulse 1s ease-in-out infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
</style>
</head>
<body>
<div class="logo">🦆 DUCKSHOW</div>
<script>
    // Check if session exists in browser localStorage
    if (localStorage.getItem('duckshow_auth') === 'true') {
        window.location.replace('/home');
    } else {
        window.location.replace('/login');
    }
</script>
</body>
</html>`);
});

// ─── DB Helpers ───────────────────────────────────────────────────────────────
function readDB() {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
}

function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ─── Movie Data (mirrors the MOVIES array in index.js) ────────────────────────
const MOVIES = [
    { id: '1', title: 'DARK WATERS',   color: 'teal',   emoji: '🌊', year: '2025', runtime: '2h 14m', rating: '16+', genre: 'Thriller',  type: 'Original',  desc: 'A marine biologist uncovers a chilling conspiracy beneath the ocean\'s surface.', tags: ['ORIGINAL','THRILLER','4K'] },
    { id: '2', title: 'ECLIPSE',        color: 'purple', emoji: '🌑', year: '2025', runtime: '1h 58m', rating: '15+', genre: 'Sci-Fi',    type: 'Original',  desc: 'A physicist discovers the sun is dimming — but the cause is anything but natural.', tags: ['ORIGINAL','SCI-FI','4K'] },
    { id: '3', title: 'NEON SAINTS',    color: 'red',    emoji: '🔫', year: '2025', runtime: '2h 02m', rating: '18+', genre: 'Action',    type: 'Movie',     desc: 'A retired assassin is pulled back into the shadows.', tags: ['ACTION','HD'] },
    { id: '4', title: 'HOLLOW CROWN',   color: 'amber',  emoji: '👑', year: '2025', runtime: '1h 45m', rating: '12+', genre: 'Drama',     type: 'Movie',     desc: 'The rise and fall of a tech dynasty told across three generations.', tags: ['DRAMA','HD'] },
    { id: '5', title: 'FREQUENCY',      color: 'blue',   emoji: '📡', year: '2024', runtime: '1h 52m', rating: '12+', genre: 'Mystery',   type: 'Series',    desc: 'A radio operator receives transmissions from a future that hasn\'t happened yet.', tags: ['MYSTERY','HD'] },
    { id: '6', title: 'BONE GARDEN',    color: 'green',  emoji: '🦴', year: '2025', runtime: '1h 34m', rating: '16+', genre: 'Horror',    type: 'Movie',     desc: 'An isolated greenhouse on an abandoned estate holds unspeakable secrets.', tags: ['HORROR','HD'] },
    { id: '7', title: 'VELOCITY',       color: 'amber',  emoji: '🏎️', year: '2025', runtime: '2h 08m', rating: '12+', genre: 'Action',    type: 'Movie',     desc: 'The fastest street racer in Asia must outrun both the law and a cartel.', tags: ['ACTION','4K'] },
    { id: '8', title: 'THE QUIET HOUR', color: 'purple', emoji: '🌙', year: '2024', runtime: '1h 40m', rating: '15+', genre: 'Drama',     type: 'Original',  desc: 'Two strangers meet during forbidden hours and fall dangerously in love.', tags: ['ORIGINAL','HD'] },
    { id: '9', title: 'IRONCLAD',       color: 'teal',   emoji: '⚓', year: '2025', runtime: '2h 22m', rating: '15+', genre: 'War',       type: 'Movie',     desc: 'The true untold story of the last naval battle in a war that reshaped the modern world.', tags: ['WAR','4K'] },
    { id: '10', title: 'GHOST SIGNAL',  color: 'blue',   emoji: '👻', year: '2025', runtime: '1h 48m', rating: '16+', genre: 'Thriller', type: 'Original',  desc: 'Deep in the digital grid, an AI starts dreaming — and those dreams are nightmares.', tags: ['ORIGINAL','SCI-FI'] },
];

// ─── API Routes ───────────────────────────────────────────────────────────────

// GET /api/ping — Health check
app.get('/api/ping', (req, res) => {
    res.json({ status: 'ok', message: '🦆 Duckshow API is running!', timestamp: new Date() });
});

// GET /api/movies — Return all movies
app.get('/api/movies', (req, res) => {
    const { genre, type, q } = req.query;
    let results = [...MOVIES];

    if (genre) results = results.filter(m => m.genre.toLowerCase() === genre.toLowerCase());
    if (type)  results = results.filter(m => m.type.toLowerCase() === type.toLowerCase());
    if (q)     results = results.filter(m =>
        m.title.toLowerCase().includes(q.toLowerCase()) ||
        m.genre.toLowerCase().includes(q.toLowerCase())
    );

    res.json({ count: results.length, movies: results });
});

// GET /api/movies/:id — Return single movie
app.get('/api/movies/:id', (req, res) => {
    const movie = MOVIES.find(m => m.id === req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
});

// POST /api/register — Register a new user
app.post('/api/register', (req, res) => {
    const { name, email, password, age } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required.' });
    }
    if (age !== undefined && Number(age) < 9) {
        return res.status(400).json({ error: 'You must be at least 9 years old to register.' });
    }

    const db = readDB();
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const newUser = {
        id: uuidv4(),
        name,
        email,
        password, // NOTE: In production, always hash passwords (e.g. with bcrypt)
        age: Number(age) || null,
        createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDB(db);

    // Return user without password
    const { password: _, ...safeUser } = newUser;
    res.status(201).json({ success: true, user: safeUser });
});

// POST /api/login — Login with email + password
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });

    const db = readDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
});

// DELETE /api/users/:id — Delete a user account
app.delete('/api/users/:id', (req, res) => {
    const db = readDB();
    const idx = db.users.findIndex(u => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'User not found.' });

    db.users.splice(idx, 1);
    delete db.mylist[req.params.id];
    delete db.subscriptions[req.params.id];
    writeDB(db);

    res.json({ success: true, message: 'Account deleted.' });
});

// GET /api/mylist/:userId — Get user's My List
app.get('/api/mylist/:userId', (req, res) => {
    const db = readDB();
    const list = db.mylist[req.params.userId] || [];
    res.json({ mylist: list });
});

// POST /api/mylist — Add a movie to My List
app.post('/api/mylist', (req, res) => {
    const { userId, movieTitle } = req.body;
    if (!userId || !movieTitle) return res.status(400).json({ error: 'userId and movieTitle required.' });

    const db = readDB();
    if (!db.mylist[userId]) db.mylist[userId] = [];
    if (!db.mylist[userId].includes(movieTitle)) {
        db.mylist[userId].push(movieTitle);
        writeDB(db);
    }
    res.json({ success: true, mylist: db.mylist[userId] });
});

// DELETE /api/mylist — Remove a movie from My List
app.delete('/api/mylist', (req, res) => {
    const { userId, movieTitle } = req.body;
    if (!userId || !movieTitle) return res.status(400).json({ error: 'userId and movieTitle required.' });

    const db = readDB();
    if (db.mylist[userId]) {
        db.mylist[userId] = db.mylist[userId].filter(t => t !== movieTitle);
        writeDB(db);
    }
    res.json({ success: true, mylist: db.mylist[userId] || [] });
});

// POST /api/subscribe — Save subscription for a user
app.post('/api/subscribe', (req, res) => {
    const { userId, plan } = req.body;
    if (!userId || !plan) return res.status(400).json({ error: 'userId and plan required.' });

    const db = readDB();
    const nextBilling = new Date();
    nextBilling.setMonth(nextBilling.getMonth() + 1);

    db.subscriptions[userId] = {
        plan,
        subscribedAt: new Date().toISOString(),
        nextBillingDate: nextBilling.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };
    writeDB(db);

    res.json({ success: true, subscription: db.subscriptions[userId] });
});

// GET /api/subscription/:userId — Get user's subscription details
app.get('/api/subscription/:userId', (req, res) => {
    const db = readDB();
    const sub = db.subscriptions[req.params.userId];
    if (!sub) return res.json({ active: false });
    res.json({ active: true, ...sub });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
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
