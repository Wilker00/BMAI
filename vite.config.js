import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    watch: {
      ignored: ['**/.edge-audit-desktop/**', '**/dist/**']
    }
  }
});
