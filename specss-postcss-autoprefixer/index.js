const fs = require('fs');
const BbPromise = require('bluebird');
const autoprefixer = require('autoprefixer')
const postcss = require('postcss')

class AutoprefixerSpecssPlugin {
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
      postcss([ autoprefixer ]).process(chunk.toString()).then(result => {
        result.warnings().forEach(warn => {
          base.write(warn.toString());
        });
      });
    });

    return Promise.resolve();
  }

  async afterExecute() {
    // console.log('after:execute: ', this.specss.args);
  }

  async beforeExecute() {
    // console.log('before:execute: ', this.specss.args);
  }
}

module.exports = AutoprefixerSpecssPlugin
