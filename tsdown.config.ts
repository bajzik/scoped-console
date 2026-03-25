import { defineConfig } from 'tsdown'

export default defineConfig([
    {
        entry: { index: 'src/index.ts' },
        format: ['esm', 'cjs'],
        dts: true,
        clean: true,
        outDir: 'dist/development',
        outExtensions({ format }) {
            return {
                js: format === 'cjs' ? '.cjs' : '.mjs',
                dts: format === 'cjs' ? '.d.cts' : '.d.ts',
            }
        },
    },
    {
        entry: { index: 'src/index.prod.ts' },
        format: ['esm', 'cjs'],
        dts: true,
        clean: true,
        outDir: 'dist/production',
        outExtensions({ format }) {
            return {
                js: format === 'cjs' ? '.cjs' : '.mjs',
                dts: format === 'cjs' ? '.d.cts' : '.d.ts',
            }
        },
    },
])