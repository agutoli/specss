const fs = require('fs');
const path = require('path');

class FileStream {
  constructor(filePath) {
    this.filePath = filePath;
    this.writeStream = fs.createWriteStream(filePath);
  }

  write(text) {
    this.writeStream.write(text);
    this.writeStream.end()
    this.readStream = fs.createReadStream(this.filePath);
  }
}

module.exports = FileStream
