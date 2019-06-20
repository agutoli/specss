const fs = require('fs');
const path = require('path');

class FileStream {
  constructor(filePath) {
    this.filePath = filePath;
    this.read = fs.createReadStream(filePath);
  }

  write(text) {
    const w = fs.createWriteStream(this.filePath);
    w.write(text)
    this.read.pipe(w);
    w.end()
  }
}

module.exports = FileStream
