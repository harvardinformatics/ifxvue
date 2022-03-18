// vite.config.js
import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'

const { createVuePlugin } = require('vite-plugin-vue2')

export default defineConfig({
  plugins: [createVuePlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
