import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Automatically collect all HTML files from the root and portfolio/ directory
function getHtmlEntries() {
  const entries = {};

  // Root HTML files
  const rootFiles = fs.readdirSync(__dirname);
  rootFiles.forEach(file => {
    if (file.endsWith('.html')) {
      const name = file.replace('.html', '');
      entries[name] = resolve(__dirname, file);
    }
  });

  // Portfolio detail HTML files
  const portfolioDir = resolve(__dirname, 'portfolio');
  if (fs.existsSync(portfolioDir)) {
    const portfolioFiles = fs.readdirSync(portfolioDir);
    portfolioFiles.forEach(file => {
      if (file.endsWith('.html')) {
        const name = `portfolio/${file.replace('.html', '')}`;
        entries[name] = resolve(portfolioDir, file);
      }
    });
  }

  // Blog detail HTML files
  const blogDir = resolve(__dirname, 'blog');
  if (fs.existsSync(blogDir)) {
    const blogFiles = fs.readdirSync(blogDir);
    blogFiles.forEach(file => {
      if (file.endsWith('.html')) {
        const name = `blog/${file.replace('.html', '')}`;
        entries[name] = resolve(blogDir, file);
      }
    });
  }

  return entries;
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: getHtmlEntries(),
    },
  },
});
