const fs = require('fs');
const clc = require("cli-color");
const path = require('path');
const mkdirp = require('mkdirp');
const FileStream = require('./fileStream');

class Specks {
  constructor({ specIdentities, configs, args }) {
    this.args = args
    this.configs = configs
    this.specIdentities = specIdentities

    const { outputFolder } = configs.global;
    this.distFolder = path.join(process.cwd(), outputFolder, '/');
  }

  async init(executePlugins) {
    const { domain } = this.configs;
    this.files = {
      base: await this.touchFile(`${domain}.css`)
    };

    this.streams = {};

    // execute all plugins
    executePlugins(this);
  }

  async touchFile(file) {
    const { domain } = this.configs;
    const filePath = path.join(this.distFolder, file);

    return new Promise((resolve, reject) => {
      mkdirp(this.distFolder, (err) => {
        if (err) {
          return reject(err);
        }
        fs.closeSync(fs.openSync(filePath, 'w'));
        resolve(filePath);
      });
    })
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
