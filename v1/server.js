const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 8000;
const BASE_DIR = __dirname;
const REACT_BUILD_DIR = path.join(__dirname, 'react-app', 'dist');

// Check if React build exists
const useReactBuild = fs.existsSync(REACT_BUILD_DIR);

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url || "/", true);
  let pathname = "/";

  try {
    pathname = decodeURIComponent(parsedUrl.pathname || "/");
  } catch (e) {
    pathname = parsedUrl.pathname || "/";
  }

  let trimmed = (pathname || "/").replace(/^\/+/, "");

  // If root, serve from React build if exists, otherwise original HTML
  if (!trimmed || trimmed === '/') {
    trimmed = "index.html";
  }

  // Determine which directory to serve from
  const isVideoOrJson = trimmed.startsWith('certified-cloud-practitioner-aws') || trimmed.includes('.json');
  const serveDir = (useReactBuild && !isVideoOrJson) ? REACT_BUILD_DIR : BASE_DIR;

  const fullPath = path.join(serveDir, trimmed);
  const resolvedPath = path.resolve(fullPath);
  const resolvedBase = path.resolve(serveDir);

  if (!resolvedPath.startsWith(resolvedBase)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Acceso prohibido");
    return;
  }

  fs.stat(resolvedPath, (err, stat) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Archivo no encontrado");
      } else {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error del servidor");
      }
      return;
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    let contentType = "text/plain";

    switch (ext) {
      case ".html":
        contentType = "text/html";
        break;
      case ".json":
        contentType = "application/json";
        break;
      case ".js":
        contentType = "application/javascript";
        break;
      case ".css":
        contentType = "text/css";
        break;
      case ".mp4":
        contentType = "video/mp4";
        break;
      case ".mkv":
        contentType = "video/x-matroska";
        break;
      case ".webm":
        contentType = "video/webm";
        break;
      case ".avi":
        contentType = "video/x-msvideo";
        break;
      case ".mov":
        contentType = "video/quicktime";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpeg";
        break;
      case ".gif":
        contentType = "image/gif";
        break;
      case ".svg":
        contentType = "image/svg+xml";
        break;
    }

    if ([\".mp4\", \".mkv\", \".webm\", \".avi\", \".mov\"].includes(ext)) {
      const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        res.writeHead(416, {
          "Content-Range": `bytes */${fileSize}`,
          "Content-Type": contentType,
        });
        res.end();
        return;
      }

      const chunkSize = end - start + 1;

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": contentType,
      });

      fs.createReadStream(resolvedPath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Accept-Ranges": "bytes",
        "Content-Type": contentType,
      });

      fs.createReadStream(resolvedPath).pipe(res);
    }
  } else {
    fs.readFile(resolvedPath, (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Archivo no encontrado");
        } else {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Error del servidor");
        }
        return;
      }

      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  const mode = useReactBuild ? 'React App (Build)' : 'HTML Original       ';
  console.log(`
╔════════════════════════════════════════════════════╗
║  🎓 AWS Certified Cloud Practitioner - Servidor   ║
║                                                    ║
║  Abre tu navegador en: http://localhost:${PORT}      ║
║  Sirviendo: ${mode}                    ║
║                                                    ║
║  Presiona Ctrl+C para detener el servidor        ║
╚════════════════════════════════════════════════════╝
  `);
});
