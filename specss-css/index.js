const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')

class CssSpecssPlugin {
  constructor(specssInstance, options = {}) {
    console.log(options);
    this.specss = specssInstance
    this.priorities = ['fonts', 'colors', 'sizes']
    this.beforeExecute = this._beforeExecute.bind(this)
    this.execute = this._execute.bind(this)
    this.afterExecute = this._afterExecute.bind(this)
  }

  async loadTemplate(specType, variables) {
    return ejs.renderFile(path.join(__dirname, `./templates/${specType}.ejs`), variables)
  }

  renderVarValue(value) {
    return value
  }

  async _afterExecute() {
    this.specss.logger("Finish");
  }

  async _beforeExecute() {
    this.specss.logger("Compiling...");
  }

  async _execute() {
    const header_outputs = []
    const body_outputs = []
    const footer_outputs = []

    for (let specType of this.priorities) {
      this.specss.logger(`Processing: ${specType}`);
      const executeStrategy = require(`./strategies/${specType}.js`)
      const { header, body, footer } = await executeStrategy(this, specType, this.specss.specIdentities.find(x => x[specType]))
      if (header) header_outputs.push(header)
      if (body) body_outputs.push(body)
      if (footer) footer_outputs.push(footer)
    }

    const cssText = [
      header_outputs.join(''),
      '\n:root {\n',
      body_outputs.join(''),
      '}\n',
      footer_outputs.join(''),
    ].join('')

    return this.saveCssFile(cssText)
  }

  saveCssFile(outputs) {
    return new Promise((resolve, reject) => {
      const outputFolder = path.join(process.env.PWD, this.specss.configs.global.outputFolder)
      mkdirp(outputFolder, (err) => {
        if (err) {
          return reject(err)
        }
        const filename = path.join(outputFolder, 'base.css')
        this.specss.logger(`File ${filename} created!`);
        fs.writeFileSync(filename, outputs)
        resolve()
      });
    })
  }
}

module.exports = CssSpecssPlugin
