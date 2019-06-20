const BbPromise = require('bluebird');

class DocsSpecssPlugin {
  constructor(specss, options) {
    this.specss = specss
    this.hooks = {
      'after:execute': BbPromise.bind(this)
        .then(this.afterExecute),
      'execute': BbPromise.bind(this)
        .then(this.execute),
      'before:execute': BbPromise.bind(this)
        .then(this.beforeExecute)
    }
  }

  async execute() {
    // console.log('execute: ', this.specss.args);
  }

  async afterExecute() {
    // console.log('after:execute: ', this.specss.args);
  }

  async beforeExecute() {
    // console.log('before:execute: ', this.specss.args);
  }
}

module.exports = DocsSpecssPlugin
