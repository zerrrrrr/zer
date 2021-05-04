const path = require('path')
const { babel } = require('@rollup/plugin-babel')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const cjs = require('@rollup/plugin-commonjs')
const json = require('@rollup/plugin-json')
const pkg = require('./package.json')

const extensions = ['.js', '.ts']

const resolve = function(...args) {
  return path.resolve(__dirname, ...args)
}

module.exports = {
  input: resolve('./src/cli.ts'),
  output: {
    file: resolve('./', pkg.main), // 为了项目的统一性，这里读取 package.json 中的配置项
    format: 'cjs',
  },
  plugins: [
    json(),
    nodeResolve({
      extensions,
      modulesOnly: true,
    }),
    babel({
      exclude: 'node_modules/**',
      extensions,
    }),
    cjs()
  ],
}
