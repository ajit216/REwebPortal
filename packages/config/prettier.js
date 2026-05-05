/** @type {import("prettier").Config} */
module.exports = {
  semi: false,
  singleQuote: true,
  jsxSingleQuote: false,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',
  endOfLine: 'lf',

  // Plugin order
  importOrder: [
    '^(react|next)$',
    '^@nestjs/(.*)$',
    '<THIRD_PARTY_MODULES>',
    '^@rewebportal/(.*)$',
    '^[./]',
  ],
}
