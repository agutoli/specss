const path = require('path')
const clc = require("cli-color")

const defaultPlugins = [
  '@specss/css'
]

function hookLogger(plugin, hookStage, loaded) {
  if (!loaded[hookStage]) return
  return (instance) => {
    console.log(' -> ', clc.green(hookStage) + clc.yellow(':') + clc.cyan('hook'))
  }
}

function executeSequence(plugin, loadedPlugin) {
  console.log('\n' + clc.bold(`${plugin}`))
  return Promise.resolve()
    .then(hookLogger(plugin, 'beforeExecute', loadedPlugin))
    .then(loadedPlugin.beforeExecute)
    .then(hookLogger(plugin, 'execute', loadedPlugin))
    .then(loadedPlugin.execute)
    .then(hookLogger(plugin, 'afterExecute', loadedPlugin))
    .then(loadedPlugin.afterExecute)
}

async function loadPluginModule(pathname, plugin, specssInstance) {
  const options = ((specssInstance.configs.plugins||{}).options||{})[plugin] || {}
  const ImportedPlugin = require(pathname)
  const loadedPlugin = new ImportedPlugin(specssInstance, options)
  await executeSequence(plugin, loadedPlugin)
}

module.exports = async (specssInstance) => {
  // internals/native plugins
  for(let plugin of defaultPlugins) {
    await loadPluginModule(plugin, plugin, specssInstance)
  }
  // externals/custom plugins
  for(let plugin of (specssInstance.configs.plugins.packages || [])) {
    await loadPluginModule(path.join(process.env.PWD, 'node_modules', plugin), plugin, specssInstance)
  }
}
