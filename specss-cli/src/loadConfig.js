const fs = require('fs')
const path = require('path')
const YAML = require('yaml')
const clc = require("cli-color")

module.exports = () => {
  try {
    return YAML.parse(fs.readFileSync(path.join(process.env.PWD, '.specss.yml'), 'utf8'));
  } catch (e) {
    console.log(clc.red('Ops! Can not find .specss.yml file!'))
  }
}
