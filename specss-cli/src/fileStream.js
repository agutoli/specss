const fs = require('fs');
const path = require('path');

class FileStream {
  constructor(filePath) {
    this.filePath = filePath;
    fs.closeSync(fs.openSync(filePath, 'w'));
  }

  write(text) {
    this.writeStream = fs.createWriteStream(this.filePath)
    this.writeStream.write(text);
    this.writeStream.end();

    this.readStream = fs.createReadStream(this.filePath);
    this.readStream.pipe(this.writeStream);

    this.writeStream = fs.createWriteStream(this.filePath);
    this.readStream = fs.createReadStream(this.filePath);
  }
}

module.exports = FileStream
