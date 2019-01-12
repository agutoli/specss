const path = require('path')
const clc = require("cli-color")

const defaultPlugins = [
  '@specss/css'
]

function hookLogger(plugin, hookStage) {
  return (instance) => {
    console.log(' -> ', clc.green(hookStage) + clc.yellow(':') + clc.cyan('hook'))
  }
}

function executeSequence(plugin, loadedPlugin) {
  console.log('\n' + clc.bold(`${plugin}`))
  return Promise.resolve()
    .then(hookLogger(plugin, 'beforeExecute'))
    .then(loadedPlugin.beforeExecute)
    .then(hookLogger(plugin, 'execute'))
    .then(loadedPlugin.execute)
    .then(hookLogger(plugin, 'afterExecute'))
    .then(loadedPlugin.afterExecute)
}

module.exports = async (specssInstance) => {
  for(let plugin of defaultPlugins) {
    const options = ((specssInstance.configs.plugins||{}).options||{})[plugin] || {}
    const ImportedPlugin = require(plugin)
    const loadedPlugin = new ImportedPlugin(specssInstance, options)
    await executeSequence(plugin, loadedPlugin)
  }

  for(let plugin of (specssInstance.configs.plugins.packages || [])) {
    const options = ((specssInstance.configs.plugins||{}).options||{})[plugin] || {}
    const loadedPlugin = new require(path.join(process.env.PWD, 'node_modules', plugin))(specssInstance, options)
    await executeSequence(plugin, loadedPlugin)
  }
}
