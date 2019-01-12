const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const clc = require("cli-color")

function loadSpecFile(filename) {
  try {
    return yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
  } catch (e) {
    console.log(clc.red(`SyntaxError: Can not parse ${filename} file!`, e))
    return null
  }
}

module.exports = (configs) => {
  if (!configs) {
    return null
  }

  const specsFolder = path.resolve(configs.global.specsFolder)
  const files = fs.readdirSync(specsFolder)
  console.log(clc.green('Loading!'))
  const specsLoaded = []
  files.forEach((file) => {
    const filename = path.join(specsFolder, file)
    if (fs.lstatSync(filename).isFile()) {
      specsLoaded.push(loadSpecFile(filename))
    }
  })

  return specsLoaded
}
