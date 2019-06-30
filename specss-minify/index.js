const fs = require('fs');
const csso = require('csso');

class MinifySpecssPlugin {
  constructor(specss, options) {
    this.specss = specss
    this.hooks = {
      'execute': () => this.execute()
    }
  }

  async execute() {
    for (const stream of this.specss.pluginStreams) {
      stream.readStream.on('data', (chunk) => {
        const result = csso.minify(chunk.toString());
        stream.writeStream.write(result.css);
      })
    }
  }
}

module.exports = MinifySpecssPlugin
