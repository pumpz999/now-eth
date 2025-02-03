import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { splitVendorChunkPlugin } from 'vite';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-transform-runtime'],
        ],
      },
    }),
    splitVendorChunkPlugin(),
  ],
  build: {
    target: 'esnext',
    minify: 'terser',
    cssMinify: true,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': ['@mui/material', '@mui/lab', '@emotion/react', '@emotion/styled'],
          'vendor-web3': ['ethers', 'web3'],
          'vendor-charts': ['recharts'],
          'vendor-utils': ['framer-motion', 'react-parallax-tilt'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@mui/lab',
      'framer-motion',
      'react-parallax-tilt',
      'ethers',
    ],
  },
  server: {
    port: 3000,
    host: true,
    hmr: {
      overlay: true,
    }
  },
  preview: {
    port: 3000,
  },
});
