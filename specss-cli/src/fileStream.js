const fs = require('fs');
const path = require('path');

class FileStream {
  constructor(filePath) {
    this.writeStream = fs.createWriteStream(filePath);
    this.readStream = fs.createReadStream(filePath);
  }

  write(text) {
    this.writeStream.write(text);
    this.readStream.pipe(this.writeStream);
    this.writeStream.end()
  }
}

module.exports = FileStream
