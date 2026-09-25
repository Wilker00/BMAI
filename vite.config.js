import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    watch: {
      ignored: ['**/.edge-audit-desktop/**', '**/dist/**']
    }
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/tone')) return 'tone-vendor';
          if (id.includes('/src/ui.js') || id.includes('/src/icons.js') || id.includes('/src/equipment-art.js')) return 'ui-shell';
          if (
            id.includes('/src/daw-bridge.js') ||
            id.includes('/src/transport.js') ||
            id.includes('/src/arrangement-engine.js') ||
            id.includes('/src/playlist.js') ||
            id.includes('/src/project-format.js') ||
            id.includes('/src/project-storage.js') ||
            id.includes('/src/pro-features.js') ||
            id.includes('/src/starter-templates.js')
          ) return 'project-core';
        }
      }
    }
  }
});
