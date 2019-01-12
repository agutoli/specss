
class SpecssDocsPlugin {
  constructor(specssInstance) {
    this.specss = specssInstance
    this.beforeExecute = this._beforeExecute.bind(this)
    this.execute = this._execute.bind(this)
    this.afterExecute = this._afterExecute.bind(this)
  }

  async _afterExecute() {

  }

  async _beforeExecute() {
    // console.log(this.specss.configs.plugins);
  }

  async _execute() {
  }
}

module.exports = (specssInstance) => {
  return new SpecssDocsPlugin(specssInstance)
}
