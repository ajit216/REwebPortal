/** @type {import("eslint").Linter.Config} */
const base = require('./eslint')

module.exports = {
  ...base,
  extends: [...(base.extends ?? []), 'next/core-web-vitals'],
  rules: {
    ...base.rules,
    // Next.js specific overrides
    '@next/next/no-html-link-for-pages': 'error',
    'react/jsx-key': 'error',
  },
}
