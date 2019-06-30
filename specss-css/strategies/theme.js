const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const lodashGet = require('lodash.get')
const hexRgb = require('hex-rgb')

function parseTokens(token, text, callback) {
  const regex = RegExp(`\@${token}\\(([^)]+)\\)`,'g');
  while ((response = regex.exec(text)) !== null) {
    callback(response);
  }
}

function parseValues (values, globalSpecs) {
  let response;
  for (const key in values) {
    parseTokens('spec', values[key], (tokens) => {
      const v = lodashGet(globalSpecs, tokens[1], '');
      values[key] = values[key].replace(tokens[0], v);
    });
    parseTokens('opacity', values[key], (tokens) => {
      const [ color, opacity = 1 ] = tokens[1].split(',');
      if (/^#/.test(color)) {
        const rgb = hexRgb(color);
        values[key] = `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, ${opacity})`;
      }
    });
  }
  return values;
}

function parseSpecs (specs, globalSpecs) {
  return specs.reduce((stored, current) => {
    if (!current) return stored;
    const section = Object.keys(current)[0];
    const values = Object.values(current[section])[0];

    stored.push({
      section,
      items: parseValues(values, globalSpecs)
    });
    return stored;
  }, []);
}

module.exports = async (plugin, theme, specs, globalSpecs) => {
  const { domain, global } = plugin.specss.configs;
  const body = await plugin.loadTemplate('theme', {
    specs: parseSpecs(specs, globalSpecs),
    theme,
    domain,
    cssVarsPrefix: global.cssVarsPrefix,
    renderVarValue: plugin.renderVarValue
  })
  return { body };
}
