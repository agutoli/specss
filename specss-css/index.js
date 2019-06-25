const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const mkdirp = require('mkdirp');
const BbPromise = require('bluebird');
const yaml = require('js-yaml');

class CssSpecssPlugin {
  constructor(specss, options = {}) {
    this.specss = specss;
    this.options = options;
    this.types = ['fonts', 'colors', 'sizes'];
    this.outputCss = [];

    this.hooks = {
      'before:execute': () => BbPromise.bind(this)
        .then(() => this.beforeExecute()),
      'execute': () => BbPromise.bind(this)
        .then(() => this.execute()),
      'after:execute': () => BbPromise.bind(this)
        .then(() => this.afterExecute())
    }
  }

  async loadTemplate(specType, variables) {
    return ejs.renderFile(path.join(__dirname, `./templates/${specType}.ejs`), variables)
  }

  async discoverThemes() {
    try {
      return fs.readdirSync(this.options.themesFolder);
    } catch(e) {
      return [];
    }
  }

  async loadThemeSpecByName(theme, name) {
    const themePath = path.join(this.options.themesFolder, theme);
    try {
      return yaml.safeLoad(fs.readFileSync(path.join(themePath, name)));
    } catch(e) {
      return null;
    }
  }

  async loadSpecsByTheme(theme) {
    const themePath = path.join(this.options.themesFolder, theme);
    const items = [];
    try {
      const specs = fs.readdirSync(themePath);
      for(let specName of specs) {
        items.push(await this.loadThemeSpecByName(theme, specName));
      }
      return items;
    } catch(e) {
      return items;
    }
  }

  async beforeExecute() {

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

    for (let specType of this.types) {
      this.specss.logger(`Processing: ${specType}`);
      const executeStrategy = require(`./strategies/${specType}.js`);
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
    ];

    const themes = await this.discoverThemes();

    for (let theme of themes) {
      this.specss.logger(`Processing: Theme ${theme}`);
      const executeThemeStrategy = require(`./strategies/theme.js`);
      const specs = await this.loadSpecsByTheme(theme);
      const { header, body, footer } = await executeThemeStrategy(this, theme, specs);
      console.log(body);
      // this.specss.fileStream('');
      // console.log('before',JSON.stringify(specs, null, 2));
    }
  }

  renderVarValue(value) {
    return value
  }
}

module.exports = CssSpecssPlugin
