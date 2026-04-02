import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@splinetool')) return 'vendor-spline';
            if (id.includes('framer-motion')) return 'vendor-framer';
            if (id.includes('lucide-react') || id.includes('canvas-confetti')) return 'vendor-ui';
            if (id.includes('@supabase')) return 'vendor-db';
            return 'vendor';
          }
        }
      }
    }
  },
  server: {
    port: 5176, // Matches your current running port
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})