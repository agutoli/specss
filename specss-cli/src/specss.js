const fs = require('fs');
const clc = require("cli-color");
const path = require('path');
const FileStream = require('./fileStream');

class Specks {
  constructor({ specIdentities, configs, args }) {
    this.args = args
    this.configs = configs
    this.specIdentities = specIdentities

    const { outputFolder } = configs.global;
    this.distFolder = path.join(process.cwd(), outputFolder, '/');

    this.init();
  }

  init() {
    const { domain } = this.configs;
    this.files = {
      base: this.touchFile(`${domain}.css`)
    };
    this.streams = {};
  }

  touchFile(file) {
    const { domain } = this.configs;
    const filePath = path.join(this.distFolder, file);

    fs.closeSync(fs.openSync(filePath, 'w'));

    return filePath;
  }

  startStreams() {
    const { domain } = this.configs;

    for(const file in this.files) {
      this.streams[file] = new FileStream(this.files[file])
    }
  }

  endStreams() {
    for (const stream in this.streams) {
      // this.streams[stream].end();
    }
  }

  logger(msg) {
    if (!this.args.verbose) return;
    console.log(clc.white('  .  ' + msg))
  }
}

module.exports = Specks
