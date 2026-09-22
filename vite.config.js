import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/BMAI/' : '/',
  server: {
    watch: {
      ignored: ['**/.edge-audit-desktop/**', '**/dist/**']
    }
  }
});
