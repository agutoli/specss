const fs = require('fs');
const BbPromise = require('bluebird');
const csso = require('csso');

class MinifySpecssPlugin {
  constructor(specss, options) {
    this.specss = specss
    this.hooks = {
      'after:execute': () => BbPromise.bind(this)
        .then(this.afterExecute()),
      'execute': () => BbPromise.bind(this)
        .then(this.execute()),
      'before:execute': () => BbPromise.bind(this)
        .then(this.beforeExecute())
    }
  }

  async execute() {
    const { base } = this.specss.streams

    base.read.on('data', (chunk) => {
      const result = csso.minify(chunk.toString());
      base.write(result.css);
    })

    return Promise.resolve();
  }

  async afterExecute() {
    // console.log('after:execute: ', this.specss.args);
  }

  async beforeExecute() {
    // console.log('before:execute: ', this.specss.args);
  }
}

module.exports = MinifySpecssPlugin
