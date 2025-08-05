/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    // Run database tests sequentially to avoid race conditions
    fileParallelism: false,
    env: {
      // Load test environment variables
      DATABASE_URL: process.env.DATABASE_URL_TEST || process.env.DATABASE_URL,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})