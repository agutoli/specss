const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const clc = require("cli-color")

module.exports = () => {
  try {
    return yaml.safeLoad(fs.readFileSync(path.join(process.env.PWD, '.specss.yml'), 'utf8'));
  } catch (e) {
    console.log(clc.red('Ops! Can not find .specss.yml file!'))
  }
}
