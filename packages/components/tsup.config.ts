import { defineConfig } from 'tsup'

// The package is single-sourced from the docs app: its entries re-export the
// same component and token modules the live library renders, so the published
// package can never drift from the reference site.
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    tokens: 'src/tokens.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['react', 'react-dom'],
})
