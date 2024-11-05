import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist', // ensures the output folder is dist
    sourcemap: true, // optional: includes source maps for easier debugging
     rollupOptions: {
       external: ['axios'], // Add axios here to externalize it
     }
  },
  plugins: [react()],
})
