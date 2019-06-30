const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const mkdirp = require('mkdirp');
const YAML = require('yaml')

class CssSpecssPlugin {
  constructor(specss, options = {}) {
    this.specss = specss;
    this.options = options;
    this.types = ['fonts', 'colors', 'sizes'];
    this.outputCss = [];

    this.hooks = {
      'before:execute': () => this.beforeExecute(),
      'execute': () => this.execute(),
      'after:execute': () => this.afterExecute()
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

  async loadSpecsByTheme(theme) {
    const themePath = path.join(this.options.themesFolder, theme);
    const items = [];
    try {
      const specs = fs.readdirSync(themePath);
      for(let specName of specs) {
        items.push(await this.specss.loadSpecFile(path.join(themePath, specName)));
      }
      return items;
    } catch(e) {
      this.specss.error(e);
      return items;
    }
  }

  async beforeExecute() {
    // start streams
    this.baseFile = await this.specss.startStream('base.css');
  }

  async afterExecute() {
    await this.baseFile.write(this.outputCss.join(''));
  }

  async execute() {
    const header_outputs = []
    const body_outputs = []
    const footer_outputs = []

    let globalSpecs = {};
    for (let specType of this.types) {
      this.specss.logger(`Processing: ${specType}`);
      const executeStrategy = require(`./strategies/${specType}.js`);
      const specs = this.specss.specIdentities.find(x => x[specType]);
      const { header, body, footer } = await executeStrategy(this, specType, specs);
      if (header) header_outputs.push(header);
      if (body) body_outputs.push(body);
      if (footer) footer_outputs.push(footer);
      Object.assign(globalSpecs, specs);
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
      this.themeFile = await this.specss.startStream(`themes/${theme}.css`);
      this.specss.logger(`Processing: Theme ${theme}`);
      const executeThemeStrategy = require(`./strategies/theme.js`);
      const specs = await this.loadSpecsByTheme(theme);
      const { header, body, footer } = await executeThemeStrategy(this, theme, specs, globalSpecs);
      this.themeFile.write(body);
    }
  }

  renderVarValue(value) {
    return value
  }
}

module.exports = CssSpecssPlugin
