const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Map file extensions to MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Normalize URL and get file path
  let url = req.url;
  
  // If url is '/', serve index.html
  if (url === '/') {
    url = '/index.html';
  }
  
  // Handle redirects for non-existent HTML pages to login
  if (url.endsWith('.html') && !fs.existsSync(path.join(__dirname, url))) {
    res.writeHead(302, { 'Location': '/login.html' });
    res.end();
    return;
  }
  
  const filePath = path.join(__dirname, url);
  const extname = path.extname(filePath);
  const contentType = mimeTypes[extname] || 'text/plain';
  
  // Read file and serve it
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // If file doesn't exist
      if (err.code === 'ENOENT') {
        // Check if it's an API request
        if (url.startsWith('/api/')) {
          // Simulate API response for mock data
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'API not implemented in frontend-only mode' }));
        } else {
          // Serve 404 page
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(`<h1>404 Not Found</h1><p>The requested resource could not be found: ${url}</p>`);
        }
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success - serve the file
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Press Ctrl+C to stop the server`);
});