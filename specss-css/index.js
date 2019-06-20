const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const mkdirp = require('mkdirp');
const BbPromise = require('bluebird');


class CssSpecssPlugin {
  constructor(specss, options = {}) {
    this.specss = specss;
    this.priorities = ['fonts', 'colors', 'sizes'];
    this.outputCss = [];

    this.hooks = {
      'execute': () => BbPromise.bind(this)
        .then(() => this.execute()),
      'after:execute': () => BbPromise.bind(this)
        .then(() => this.afterExecute())
    }
  }

  async loadTemplate(specType, variables) {
    return ejs.renderFile(path.join(__dirname, `./templates/${specType}.ejs`), variables)
  }

  async afterExecute() {
    const { base } = this.specss.streams
    base.write(this.outputCss.join(''));
    return Promise.resolve();
  }

  async execute() {
    const header_outputs = []
    const body_outputs = []
    const footer_outputs = []

    for (let specType of this.priorities) {
      this.specss.logger(`Processing: ${specType}`);
      const executeStrategy = require(`./strategies/${specType}.js`)
      const { header, body, footer } = await executeStrategy(this, specType, this.specss.specIdentities.find(x => x[specType]))
      if (header) header_outputs.push(header);
      if (body) body_outputs.push(body);
      if (footer) footer_outputs.push(footer);
    }

    this.outputCss = [
      header_outputs.join(''),
      '\n:root {\n',
      body_outputs.join(''),
      '}\n',
      footer_outputs.join(''),
    ]
  }

  renderVarValue(value) {
    return value
  }
}

module.exports = CssSpecssPlugin
