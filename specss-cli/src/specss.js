const fs = require('fs');
const clc = require("cli-color");
const path = require('path');
const mkdirp = require('mkdirp');
const FileStream = require('./fileStream');
const loadSpecs = require('./loadSpecs')
const YAML = require('yaml');

class Specks {
  constructor({ configs, args }) {
    this.args = args
    this.configs = configs
    this.pluginStreams = [];
    this.specIdentities = loadSpecs(configs);
  }

  async init(executePlugins) {
    // execute all plugins
    executePlugins(this);
  }

  async startStream(filename) {
    const { outputFolder } = this.configs.global;
    this.distFolder = path.join(process.cwd(), outputFolder, '/');
    const streamFile = path.join(this.distFolder, filename);
    const streamDir = path.dirname(streamFile);
    return new Promise((resolve, reject) => {
      mkdirp(streamDir, (err) => {
        if (err) return reject(err);
        const stream = new FileStream(streamFile);
        this.pluginStreams.push(stream);
        resolve(stream);
      })
    })
  }

  async loadSpecFile(filename) {
    try {
      return YAML.parse(fs.readFileSync(filename, 'utf8'));
    } catch (e) {
      console.log(clc.red(`SyntaxError: Can not parse ${filename} file!`, e))
      return null
    }
  }

  logger(msg) {
    if (!this.args.verbose) return;
    console.log(clc.white('  .  ' + msg))
  }

  error(e) {
    console.log(clc.red('Error:', e));
  }
}

module.exports = Specks
