class DocsSpecssPlugin {
  constructor(specssInstance, options) {
    this.specss = specssInstance
    this.beforeExecute = this._beforeExecute.bind(this)
    this.execute = this._execute.bind(this)
    this.afterExecute = this._afterExecute.bind(this)
  }

  async _afterExecute() {

  }

  async _beforeExecute() {

  }

  async _execute() {
    console.log(this.specss.configs.plugins);
  }
}

module.exports = DocsSpecssPlugin
