import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    outDir: '../server/public',
    emptyOutDir: true
  },
  server: {
    proxy: {
      '/destinations': {
        target: 'http://localhost:3001'
      }
    }
  },
  plugins: [
    {
      name: 'copy-style-for-static-pages',
      closeBundle() {
        const src = path.resolve(__dirname, 'style.css')
        const dest = path.resolve(__dirname, '../server/public/style.css')
        fs.copyFileSync(src, dest)
      }
    }
  ]
})
