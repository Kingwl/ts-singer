const esbuild = require('esbuild')
const path = require('path')

esbuild.build({
    entryPoints: [
        path.resolve(__dirname, '../src/index.ts')
    ],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outdir: path.resolve(__dirname, '../dist')
})