import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import glsl from 'vite-plugin-glsl'

export default defineConfig({
  plugins: [
    glsl({
      include: [/\.glsl$/, /\.vert$/, /\.frag$/],
      defaultExtension: 'glsl',
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '',
      },
    },
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
})
