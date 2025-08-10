import { defineConfig } from 'vitest/config'
import 'dotenv/config'

export default defineConfig({
  css: {
    postcss: {
      plugins: []
    }
  },
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
    exclude: ['node_modules', '.next', 'dist', '.turbo'],
    testTimeout: 120000,
    hookTimeout: 120000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage'
    }
  }
})
