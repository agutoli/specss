const ejs = require('ejs')
const fs = require('fs')
const path = require('path')

module.exports = async (plugin, specType, specItem) => {
  const importers = specItem[specType].map(x => `@import "${x.url}";\n`)
  const body = await plugin.loadTemplate(specType, {
    fonts: specItem[specType],
    cssVarsPrefix: plugin.specss.configs.global.cssVarsPrefix,
    renderVarValue: plugin.renderVarValue
  })

  return {
    header: importers.join(''),
    body
  }
}
