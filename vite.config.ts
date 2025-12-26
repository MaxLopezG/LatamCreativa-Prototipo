import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        strategies: 'generateSW',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: "Latam Creativa",
          short_name: "LatamCreativa",
          description: "Plataforma para creativos y desarrolladores de Latinoamérica",
          theme_color: "#030304",
          background_color: "#030304",
          display: "standalone",
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      }),
      visualizer({
        filename: 'bundle-stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true
      })
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    build: {
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          manualChunks: {
            // Firebase in its own chunk
            'firebase': [
              'firebase/app',
              'firebase/auth',
              'firebase/firestore',
              'firebase/storage'
            ],
            // Framer Motion separate
            'framer': ['framer-motion'],
            // React and core
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            // Icons
            'icons': ['lucide-react'],
            // State management
            'state': ['zustand', '@tanstack/react-query']
          }
        }
      }
    }
  };
});