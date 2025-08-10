const isTest = process.env.VITEST || process.env.NODE_ENV === 'test'

const config = {
  plugins: isTest ? [] : ['@tailwindcss/postcss']
}

export default config
