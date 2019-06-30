const fs = require('fs');
const path = require('path');

class FileStream {
  constructor(filePath) {
    this.filePath = filePath;
  }

  write(text) {
    this.writeStream = fs.createWriteStream(this.filePath)
    this.writeStream.write(text);

    this.readStream = fs.createReadStream(this.filePath);
    this.readStream.pipe(this.writeStream);
    this.writeStream.end();

    this.writeStream = fs.createWriteStream(this.filePath);
    this.readStream = fs.createReadStream(this.filePath);
  }
}

module.exports = FileStream
