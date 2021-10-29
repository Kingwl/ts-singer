const esbuild = require('esbuild')
const path = require('path')

esbuild.build({
    entryPoints: [
        path.resolve(__dirname, '../tests/index.ts')
    ],
    bundle: true,
    platform: 'node',
    outdir: path.resolve(__dirname, '../out')
})