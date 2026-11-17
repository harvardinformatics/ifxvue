/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import { resolve } from 'path';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue(), vuetify({
    autoImport: true
  })],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
    extensions: ['.js', '.vue', '.json', '.scss']
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/entrypoint.js'),
      name: 'ifxvue',
      fileName: format => `ifxvue.${format}.js`,
      formats: ['es']
    },
    rollupOptions: {
      external: [/^vue($|\/)/, /^vuetify($|\/)/],
      output: {
        globals: { vue: 'Vue', vuetify: 'Vuetify' },
      },
    },
    minify: 'terser',
    sourcemap: false,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000
  },
  css: {
    preprocessorOptions: {
      scss: {
        // TODO: ifxvue SCSS cleanup (V3 migration)
        // - src/sass/variables.scss has `@use 'vuetify/lib/styles/main.sass'` (Vuetify 2 path).
        //   additionalData prepends it to every <style lang="scss"> block, so each block
        //   bundles Vuetify's CSS. Scoped, its reset zeroes padding (e.g. IFXForbidden).
        //   Likely also why ifxvue.css is ~4.7 MB.
        // - Most of the variable overrides are Vuetify 2 names and do nothing in V3.
        // - Real CSS rules in variables.scss (.text-label, .field-name, .ar-field-*, etc.)
        //   should move to a global stylesheet imported once in entrypoint.js.
        // - BEFORE removing the @use line: every consuming app must `import 'vuetify/styles'`
        //   (e.g. in plugins/vuetify.js). HeRS may currently get Vuetify's global CSS
        //   from ifxvue.css by accident.
        // - V3 customization goes through vuetify({ styles: { configFile } }) in each app.
        // - Workaround until then: use <style lang="css"> where SCSS features aren't needed.
        additionalData: `@use "@/sass/variables.scss" as *;`
      }
    }
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  }
});