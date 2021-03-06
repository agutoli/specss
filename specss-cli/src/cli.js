#!/usr/bin/env node
const path = require('path');
const { version } = require(path.resolve(path.join(__dirname, '../package.json')));

!function () {
  const { ArgumentParser } = require('argparse')

  const Specss = require('./specss')
  const loadConfig = require('./loadConfig')
  const executePlugins = require('./executePlugins')

  const parser = new ArgumentParser({
    version,
    addHelp: true,
    description: 'Specss cli too'
  })

  parser.addArgument([ '-vv', '--verbose' ], {
    action: 'storeTrue',
    help: 'Verbose mode'
  });

  parser.addArgument([ '-b', '--bar' ], { help: 'bar foo' })
  parser.addArgument('--baz', { help: 'baz bar' })

  const args = parser.parseArgs()
  const configs = loadConfig()

  const specss = new Specss({ configs, args });

  if (!configs) {
    return
  }

  specss.init(executePlugins)
}()
