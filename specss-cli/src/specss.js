const fs = require('fs');
const clc = require("cli-color");
const path = require('path');

class Specks {
  constructor({ specIdentities, configs, args }) {
    this.args = args
    this.configs = configs
    this.specIdentities = specIdentities
  }

  startStreams() {
    const { domain } = this.configs;
    const { outputFolder } = this.configs.global;

    this.streams = {
      base: fs.createWriteStream(path.join(process.cwd(), outputFolder, `${domain}.css`))
    };
  }

  endStreams() {
    for (const stream in this.streams) {
      this.streams[stream].end();
    }
  }

  logger(msg) {
    if (!this.args.verbose) return;
    console.log(clc.white('  .  ' + msg))
  }
}

module.exports = Specks
