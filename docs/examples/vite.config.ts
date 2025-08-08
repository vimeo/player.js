import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@vimeo/player': path.resolve(__dirname, '../../dist/player.es.js'),
      '@vimeo/player-types': path.resolve(__dirname, '../../types')
    }
  },
})
