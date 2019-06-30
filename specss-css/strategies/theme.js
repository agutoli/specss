const ejs = require('ejs')
const fs = require('fs')
const path = require('path')

function parseSpecs (specs) {
  return specs.reduce((stored, current) => {
    if (!current) return stored;
    const section = Object.keys(current)[0];
    const values = Object.values(current[section])[0];
    stored.push({
      section,
      items: values
    });
    return stored;
  }, []);
}

module.exports = async (plugin, theme, specs) => {
  const { domain, global } = plugin.specss.configs;
  const body = await plugin.loadTemplate('theme', {
    specs: parseSpecs(specs),
    theme,
    domain,
    cssVarsPrefix: global.cssVarsPrefix,
    renderVarValue: plugin.renderVarValue
  })
  return { body };
}
