import purgeCSS from '@fullhuman/postcss-purgecss'
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import path from 'path'
import presetEnv from 'postcss-preset-env'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

const isDev = process.env.NODE_ENV === 'development'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const baseDir = __dirname
const srcDir = path.resolve(baseDir, 'src')
const outDir = path.resolve(baseDir, 'build')

export default defineConfig({
  root: srcDir,
  envDir: baseDir,
  server: {
    host: '0.0.0.0',
  },
  plugins: [
    svelte({
      preprocess: vitePreprocess(),
    }),
    createHtmlPlugin({
      minify: true,
    })
  ],
  css: {
    postcss: {
      plugins: [
        presetEnv({
          features: {
            'nesting-rules': true,
          },
        }),
        ...isDev ? [] : [
          purgeCSS({
            content: [
              path.join(srcDir, '**/*.html'),
              path.join(srcDir, '**/*.svelte'),
            ],
            safelist: [/svelte-/],
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
          }),
        ],
      ],
    },
  },
  publicDir: path.resolve(baseDir, 'static'),
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(srcDir, 'index.html'),
      },
    },
  },
})
