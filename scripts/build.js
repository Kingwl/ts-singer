const esbuild = require('esbuild')
const path = require('path')

esbuild.build({
    entryPoints: [
        path.resolve(__dirname, '../src/index.ts')
    ],
    outdir: path.resolve(__dirname, '../dist/index.js')
})