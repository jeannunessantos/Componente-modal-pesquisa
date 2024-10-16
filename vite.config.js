import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Verificar se as variáveis de ambiente estão definidas
const keyPath = process.env.SSL_KEY_FILE;
const certPath = process.env.SSL_CRT_FILE;

if (!keyPath || !certPath) {
  throw new Error("Certificados SSL não definidos. Verifique o arquivo .env");
}

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, keyPath)),
      cert: fs.readFileSync(path.resolve(__dirname, certPath)),
    },
    port: 3000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'App': path.resolve(__dirname, './src/App'),
      'AppContext': path.resolve(__dirname, './src/AppContext'),
      'main.routes': path.resolve(__dirname, './src/main.routes'),
      'styles': path.resolve(__dirname, './src/stylesheet'),
      'pages': path.resolve(__dirname, './src/pages'),
      '_common': path.resolve(__dirname, './src/_common')
    }
  }
})
