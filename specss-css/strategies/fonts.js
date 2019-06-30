const ejs = require('ejs')
const fs = require('fs')
const path = require('path')

module.exports = async (plugin, specType, specItem) => {
  const fonts = Object.values(specItem[specType]);
  const importers = fonts.map(x => `@import "${x.url}";\n`)

  const body = await plugin.loadTemplate(specType, {
    fonts: specItem[specType],
    cssVarsPrefix: plugin.specss.configs.global.cssVarsPrefix,
    renderVarValue: plugin.renderVarValue
  });

  return {
    header: importers.join(''),
    body
  }
}
