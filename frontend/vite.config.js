import { defineConfig } from 'vitest/config' // Import from vitest/config
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // This adds support for the browser-like environment needed for React components
    environment: 'jsdom',
    // This allows you to use 'describe', 'it', and 'expect' without importing them in every file
    globals: true,
  },
})
