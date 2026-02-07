import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// The media root is one level up
const MEDIA_ROOT = path.resolve(__dirname, '..');

// Serve media files statically
app.use('/media', express.static(MEDIA_ROOT));

// Endpoint to list files
app.get('/api/files', (req, res) => {
  const reqPath = req.query.path || '';
  // Sanitize path to prevent directory traversal
  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const fullPath = path.join(MEDIA_ROOT, safePath);

  // Ensure we are still inside MEDIA_ROOT
  if (!fullPath.startsWith(MEDIA_ROOT)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Path not found' });
    }
    const items = fs.readdirSync(fullPath, { withFileTypes: true });
    const result = items.map(item => {
      // Skip the web_player folder itself to avoid recursion/clutter
      if (item.name === 'web_player' || item.name.startsWith('.') || item.name === 'node_modules') return null;

      const itemPath = path.join(fullPath, item.name);

      let type = 'file';
      if (item.isDirectory()) {
        type = 'directory';
      }

      return {
        name: item.name,
        type: type,
        path: path.join(safePath, item.name).replace(/\\/g, '/')
      };
    }).filter(Boolean);

    // Sort directories first, then files
    result.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name, undefined, { numeric: true });
      return a.type === 'directory' ? -1 : 1;
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list directory' });
  }
});

// Endpoint to search files
app.get('/api/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  if (!query) return res.json([]);

  const results = [];
  const walk = (dir, relativePath = '') => {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      if (item.name === 'web_player' || item.name.startsWith('.') || item.name === 'node_modules') continue;

      const currentRelativePath = path.join(relativePath, item.name).replace(/\\/g, '/');
      if (item.name.toLowerCase().includes(query)) {
        results.push({
          name: item.name,
          type: item.isDirectory() ? 'directory' : 'file',
          path: currentRelativePath
        });
      }

      if (item.isDirectory()) {
        try {
          walk(path.join(dir, item.name), currentRelativePath);
        } catch (e) {
          // Skip directories we can't read
        }
      }

      // Limit search results for performance
      if (results.length > 100) break;
    }
  };

  try {
    walk(MEDIA_ROOT);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Serve frontend (after build)
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback for SPA
app.use((req, res) => {
  const originalUrl = req.originalUrl || req.url;
  if (originalUrl.startsWith('/api') || originalUrl.startsWith('/media')) {
    res.status(404).send('Not found');
  } else {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
