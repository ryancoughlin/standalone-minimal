import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), vue()],
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/main.ts',
      name: 'MaestroMinimal',
      fileName: 'maestro-minimal'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
