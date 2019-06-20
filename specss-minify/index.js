const fs = require('fs');
const BbPromise = require('bluebird');

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
      console.log(chunk.toString());
    })

    // const r = fs.createReadStream(this.specss.streams.base.path)
    // r.pipe(this.specss.streams.base)

    // console.log('execute: ', this.specss.args);
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
