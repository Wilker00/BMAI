import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    watch: {
      ignored: ['**/.edge-audit-desktop/**', '**/dist/**']
    }
  }
});
