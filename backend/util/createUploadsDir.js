const fs = require('fs');
const path = require('path');

function ensureUploadsDir() {
  const uploadsDir = path.join(__dirname, '../public/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Carpeta public/uploads creada');
  }
}

module.exports = ensureUploadsDir;
