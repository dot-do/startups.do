import { defineConfig } from 'vitest/config'

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
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage'
    }
  }
})
