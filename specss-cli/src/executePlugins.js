const path = require('path')
const clc = require("cli-color")

const defaultPlugins = [
  '@specss/css',
  // '@specss/minify'
]

const defaultHooks = {
  'execute': async () => {},
  'after:execute': async () => {},
  'before:execute': async () => {},
}

function nullable() {}

function hookLogger(plugin, hookStage, loadedPlugin) {
  if (!loadedPlugin.specss.args.verbose) return nullable;
  if (!loadedPlugin.hooks[hookStage]) return nullable;
  return (instance) => {
    console.log(' -> ', clc.green(hookStage) + clc.yellow(':') + clc.cyan('hook'))
  }
}

async function executeSequence(plugin, loadedPlugin) {
  console.log(clc.bold(` -- ${plugin}`))
  const hooks = { ...defaultHooks, ...loadedPlugin.hooks };

  hookLogger(plugin, 'before:execute', loadedPlugin)()
  await hooks['before:execute']()
  hookLogger(plugin, 'execute', loadedPlugin)()
  await hooks.execute()
  hookLogger(plugin, 'after:execute', loadedPlugin)()
  await hooks['after:execute']()
}

async function loadPluginModule(pathname, plugin, specss) {
  const options = ((specss.configs.plugins||{}).options||{})[plugin] || {};
  const ImportedPlugin = require(pathname);
  const loadedPlugin = new ImportedPlugin(specss, options);
  await executeSequence(plugin, loadedPlugin);
}

module.exports = async (specss) => {
  // internals/native plugins
  for(const plugin of defaultPlugins) {
    try {
      await loadPluginModule(plugin, plugin, specss);
    } catch(e) {
      console.log(e);
    }
  }
  // externals/custom plugins
  for(const plugin of (specss.configs.plugins.packages || [])) {
    await loadPluginModule(path.join(process.env.PWD, 'node_modules', plugin), plugin, specss);
  }
}
