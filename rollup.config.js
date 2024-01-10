import { nodeExternals } from 'rollup-plugin-node-externals'

/**
 * @type {import("rollup").RollupOptions[]}
 */
export default [
  {
    input: ['./src/index.js', './src/base32.js'],
    plugins: [nodeExternals()],
    output: {
      entryFileNames: '[name].cjs',
      format: 'cjs',
      dir: 'dist',
    },
  },
]
