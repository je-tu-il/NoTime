const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const wallpaperHandler = require('./api/wallpaper');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // API endpoint
  if (pathname === '/api/wallpaper') {
    req.query = parsedUrl.query;
    // Mock res.status & res.json & res.send for compatibility with Vercel handler
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
      return res;
    };
    res.send = (data) => {
      res.end(data);
      return res;
    };
    return wallpaperHandler(req, res);
  }

  // Static files
  let safePath = pathname === '/' ? '/index.html' : pathname;
  // Normalize and prevent path traversal
  safePath = path.normalize(safePath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    return fs.createReadStream(filePath).pipe(res);
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404 Not Found');
});

server.listen(PORT, () => {
  console.log(`\n🚀 Serveur NoTime lancé sur : http://localhost:${PORT}`);
  console.log(`📱 Test API Fond d'écran : http://localhost:${PORT}/api/wallpaper?dob=1998-05-14\n`);
});
