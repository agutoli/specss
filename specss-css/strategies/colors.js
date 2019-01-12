const ejs = require('ejs')
const fs = require('fs')
const path = require('path')

module.exports = async (plugin, specType, specItem) => {
  const body = await plugin.loadTemplate(specType, {
    specItem,
    cssVarsPrefix: plugin.specss.configs.global.cssVarsPrefix,
    renderVarValue: plugin.renderVarValue
  })
  return { body }
}
