const path = require('path')
const clc = require("cli-color")

const defaultPlugins = [
  '@specss/css'
]

const defaultHooks = {
  'execute': Promise.resolve,
  'after:execute': Promise.resolve,
  'before:execute': Promise.resolve,
}

function hookLogger(plugin, hookStage, loadedPlugin) {
  if (!loadedPlugin.specss.args.verbose) return;
  if (!loadedPlugin[hookStage]) return
  return (instance) => {
    console.log(' -> ', clc.green(hookStage) + clc.yellow(':') + clc.cyan('hook'))
  }
}

function executeSequence(plugin, loadedPlugin) {
  console.log(clc.bold(` -- ${plugin}`))
  const hooks = { ...defaultHooks, ...loadedPlugin.hooks };
  return Promise.resolve()
    .then(hookLogger(plugin, 'before:execute', loadedPlugin))
    .then(hooks.beforeExecute)
    .then(hookLogger(plugin, 'execute', loadedPlugin))
    .then(hooks.execute)
    .then(hookLogger(plugin, 'after:execute', loadedPlugin))
    .then(hooks.afterExecute)
}

async function loadPluginModule(pathname, plugin, specss) {
  const options = ((specss.configs.plugins||{}).options||{})[plugin] || {}
  const ImportedPlugin = require(pathname)
  const loadedPlugin = new ImportedPlugin(specss, options)
  await executeSequence(plugin, loadedPlugin)
}

module.exports = async (specss) => {
  // internals/native plugins
  for(const plugin of defaultPlugins) {
    await loadPluginModule(plugin, plugin, specss)
  }
  // externals/custom plugins
  for(const plugin of (specss.configs.plugins.packages || [])) {
    await loadPluginModule(path.join(process.env.PWD, 'node_modules', plugin), plugin, specss)
  }
}
