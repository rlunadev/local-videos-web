const fs = require("fs");
const path = require("path");

const baseDir = __dirname;
const coursePath = path.join(baseDir, "certified-cloud-practitioner-aws");

const videoExtensions = [
  ".mp4",
  ".mkv",
  ".avi",
  ".mov",
  ".webm",
  ".flv",
  ".wmv",
  ".m4v",
];

function getAllVideos(dir, parentPath = "") {
  const videos = [];

  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    items.forEach((item) => {
      const fullPath = path.join(dir, item.name);
      const relPath = parentPath ? path.join(parentPath, item.name) : item.name;

      if (item.isDirectory()) {
        const subVideos = getAllVideos(fullPath, relPath);
        videos.push(...subVideos);
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        if (videoExtensions.includes(ext)) {
          const relativePath = path
            .join(parentPath, item.name)
            .replace(/\\/g, "/");
          videos.push({
            name: item.name,
            path: "certified-cloud-practitioner-aws/" + relativePath,
          });
        }
      }
    });
  } catch (err) {
    console.error("Error:", err);
  }

  return videos;
}

const allVideos = getAllVideos(coursePath);
const grouped = {};

allVideos.forEach((video) => {
  const parts = video.path.split("/");
  const section = parts.slice(0, 2).join("/");

  if (!grouped[section]) {
    grouped[section] = [];
  }
  grouped[section].push(video);
});

const data = {};
Object.keys(grouped)
  .sort()
  .forEach((section) => {
    const sectionName = section.split("/")[1];
    data[sectionName] = grouped[section].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  });

const outputPath = path.join(baseDir, "videos-data.json");
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

console.log("✓ Total de videos: " + allVideos.length);
console.log("✓ Total de secciones: " + Object.keys(data).length);
console.log("✓ Archivo guardado: videos-data.json");
