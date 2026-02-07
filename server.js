import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Media & Data Config
const MEDIA_ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PLAYLISTS_FILE = path.join(DATA_DIR, 'playlists.json');
const HISTORY_DIR = path.join(DATA_DIR, 'history');
if (!fs.existsSync(HISTORY_DIR)) fs.mkdirSync(HISTORY_DIR);

// Initialize data files
if (!fs.existsSync(PLAYLISTS_FILE)) fs.writeFileSync(PLAYLISTS_FILE, JSON.stringify([]));

const initializeUsers = () => {
  let users = {};
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE));
  }
  const adminCreds = Buffer.from("admin:songku@123").toString('base64');
  if (!users['admin']) {
    users['admin'] = {
      name: 'System Admin',
      username: 'admin',
      creds: adminCreds,
      role: 'admin'
    };
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  }
  return users;
};
initializeUsers();

// Session Setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'zyngliss-media-box-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

const isAuth = (req, res, next) => {
  if (req.session && req.session.user) return next();
  res.status(401).json({ error: 'Unauthorized' });
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') return next();
  res.status(403).json({ error: 'Forbidden' });
};

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = req.body.path || '';
    const safePath = path.normalize(uploadPath).replace(/^(\.\.[\/\\])+/, '');
    const fullPath = path.join(MEDIA_ROOT, safePath);
    if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB Cloudflare Limit
});

// --- AUTH & USER ---

app.post('/api/register', (req, res) => {
  const { name, username, password } = req.body;
  if (!name || !username || !password) return res.status(400).json({ error: 'Missing fields' });
  if (password.length < 6 || password.length > 10) return res.status(400).json({ error: 'Password must be 6-10 chars' });

  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  if (users[username]) return res.status(400).json({ error: 'Username taken' });

  users[username] = {
    name,
    username,
    creds: Buffer.from(`${username}:${password}`).toString('base64'),
    role: 'contributor'
  };
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.json({ success: true });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  const user = users[username];
  if (!user || user.creds !== Buffer.from(`${username}:${password}`).toString('base64')) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  req.session.user = { username: user.username, name: user.name, role: user.role };
  res.json({ success: true, user: req.session.user });
});

app.get('/api/me', (req, res) => res.json({ user: req.session.user || null }));

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// --- HISTORY ---
app.post('/api/history', (req, res) => {
  const userId = req.session.user ? req.session.user.username : 'anonymous';
  const historyFile = path.join(HISTORY_DIR, `${userId}.json`);
  let history = [];
  if (fs.existsSync(historyFile)) history = JSON.parse(fs.readFileSync(historyFile));

  const activity = { ...req.body, timestamp: new Date().toISOString() };
  history.unshift(activity);
  history = history.slice(0, 50); // Keep last 50
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
  res.json({ success: true });
});

app.get('/api/history', (req, res) => {
  const userId = req.session.user ? req.session.user.username : 'anonymous';
  const historyFile = path.join(HISTORY_DIR, `${userId}.json`);
  if (!fs.existsSync(historyFile)) return res.json([]);
  res.json(JSON.parse(fs.readFileSync(historyFile)));
});

// --- PLAYLISTS (USER MAPPING) ---
app.get('/api/playlists', (req, res) => {
  const playlists = JSON.parse(fs.readFileSync(PLAYLISTS_FILE));
  // Return all public playlists or those belonging to the user
  const userId = req.session.user ? req.session.user.username : null;
  res.json(playlists.filter(p => !p.private || p.owner === userId));
});

app.post('/api/playlists', isAuth, (req, res) => {
  const { name, tracks, isPrivate } = req.body;
  const playlists = JSON.parse(fs.readFileSync(PLAYLISTS_FILE));
  const newPlaylist = {
    id: Date.now().toString(),
    name,
    tracks: tracks || [],
    owner: req.session.user.username,
    ownerName: req.session.user.name,
    private: !!isPrivate,
    createdAt: new Date().toISOString()
  };
  playlists.push(newPlaylist);
  fs.writeFileSync(PLAYLISTS_FILE, JSON.stringify(playlists, null, 2));
  res.json(newPlaylist);
});

app.delete('/api/playlists/:id', isAuth, (req, res) => {
  let playlists = JSON.parse(fs.readFileSync(PLAYLISTS_FILE));
  const playlist = playlists.find(p => p.id === req.params.id);
  if (!playlist) return res.status(404).send('Not found');
  if (playlist.owner !== req.session.user.username && req.session.user.role !== 'admin') {
    return res.status(403).send('Unauthorized');
  }
  playlists = playlists.filter(p => p.id !== req.params.id);
  fs.writeFileSync(PLAYLISTS_FILE, JSON.stringify(playlists, null, 2));
  res.json({ success: true });
});

// --- MEDIA ---
app.use('/media', express.static(MEDIA_ROOT));

app.get('/api/files', (req, res) => {
  const reqPath = req.query.path || '';
  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const fullPath = path.join(MEDIA_ROOT, safePath);
  if (!fullPath.startsWith(MEDIA_ROOT)) return res.status(403).send('Denied');
  try {
    if (!fs.existsSync(fullPath)) return res.status(404).send('Not found');
    const items = fs.readdirSync(fullPath, { withFileTypes: true });
    const result = items.map(item => {
      if (item.name === 'web_player' || item.name.startsWith('.') || item.name === 'node_modules') return null;
      return {
        name: item.name,
        type: item.isDirectory() ? 'directory' : 'file',
        path: path.join(safePath, item.name).replace(/\\/g, '/')
      };
    }).filter(Boolean);
    res.json(result);
  } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/mkdir', isAuth, (req, res) => {
  const { path: parentPath, name } = req.body;
  const fullPath = path.join(MEDIA_ROOT, parentPath, name);
  if (!fullPath.startsWith(MEDIA_ROOT)) return res.status(403).send('Denied');
  try {
    fs.mkdirSync(fullPath, { recursive: true });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/upload', isAuth, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File too large. Cloudflare limit is 100MB.' });
    }
    if (err) return res.status(500).json({ error: err.message });
    next();
  });
}, (req, res) => {
  res.json({ success: true, file: req.file });
});

app.post('/api/delete', isAdmin, (req, res) => {
  const { path: reqPath } = req.body;
  const fullPath = path.join(MEDIA_ROOT, reqPath);
  if (!fullPath.startsWith(MEDIA_ROOT)) return res.status(403).send('Denied');
  try {
    if (fs.lstatSync(fullPath).isDirectory()) fs.rmSync(fullPath, { recursive: true });
    else fs.unlinkSync(fullPath);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.use(express.static(path.join(__dirname, 'dist')));
app.use((req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

app.listen(3000, '0.0.0.0', () => console.log(`Server running at http://localhost:3000`));
