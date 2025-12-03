import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ============================================================================
// VITE CONFIG: OPTIMIZACIÓN DE DEPENDENCIAS Y CHUNKING
// ============================================================================
// PROPÓSITO: Reducir análisis constante y separar bibliotecas grandes
// ============================================================================

export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 3000,
    open: true,
    hmr: {
      overlay: true
    }
  },

  // ========================================================================
  // OPTIMIZACIÓN: Pre-bundle de dependencias pesadas
  // ========================================================================
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'mathjs'
    ],
    force: false
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    
    // ========================================================================
    // CHUNKING MANUAL: Separar bibliotecas grandes en chunks independientes
    // ========================================================================
    rollupOptions: {
      output: {
        manualChunks: {
          // React ecosystem
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // Biblioteca matemática grande (500KB)
          'mathjs-vendor': ['mathjs'],
          
          // Bootstrap si está presente
          'bootstrap-vendor': ['bootstrap']
        }
      }
    }
  }
})