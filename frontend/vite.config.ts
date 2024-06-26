import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.PORT as string) || 5173,  // Default to 5173 if PORT is not set
    host: '0.0.0.0',
  },
  preview: {
    port: parseInt(process.env.PORT as string) || 4173,  // Default to 4173 if PORT is not set
    host: '0.0.0.0',
  },
  build: {
    outDir: 'dist',
  },
})
