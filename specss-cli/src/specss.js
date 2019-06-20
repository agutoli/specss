const clc = require("cli-color")

class Specks {
  constructor({ specIdentities, configs, args }) {
    this.args = args
    this.configs = configs
    this.specIdentities = specIdentities
  }

  logger(msg) {
    if (!this.args.verbose) return;
    console.log(clc.white('  .  ' + msg))
  }
}

module.exports = Specks
