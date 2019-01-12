#!/usr/bin/env node
!function () {
  const { ArgumentParser } = require('argparse')

  const Specss = require('./specss')
  const loadConfig = require('./loadConfig')
  const loadSpecs = require('./loadSpecs')
  const executePlugins = require('./executePlugins')

  const parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'Argparse example'
  })

  parser.addArgument([ '-f', '--foo' ], { help: 'foo bar' })
  parser.addArgument([ '-b', '--bar' ], { help: 'bar foo' })
  parser.addArgument('--baz', { help: 'baz bar' })

  const args = parser.parseArgs()
  const configs = loadConfig()
  const specIdentities = loadSpecs(configs)

  const specss = new Specss({ specIdentities, configs, args })

  if (!configs) {
    return
  }

  executePlugins(specss)
}()
