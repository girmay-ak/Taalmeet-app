/**
 * Lint-staged Configuration
 * 
 * Runs linters and formatters on git staged files.
 * Only processes files that are staged for commit.
 * 
 * @see https://github.com/okonet/lint-staged
 */

module.exports = {
  // TypeScript and TSX files
  '*.{ts,tsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  
  // JavaScript and JSX files
  '*.{js,jsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  
  // JSON, Markdown, and other text files
  '*.{json,md,yml,yaml}': [
    'prettier --write',
  ],
  
  // Configuration files
  '*.{js,ts}': [
    'eslint --fix',
  ],
};

