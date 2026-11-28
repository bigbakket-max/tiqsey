import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';

function renameEntryHtmlToIndex(sourceFileName: string, outDir: string): Plugin {
  return {
    name: 'rename-entry-html-to-index',
    closeBundle() {
      const from = path.resolve(__dirname, outDir, sourceFileName);
      const to = path.resolve(__dirname, outDir, 'index.html');
      if (fs.existsSync(from)) {
        fs.renameSync(from, to);
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const buildTarget = (process.env.BUILD_TARGET || env.BUILD_TARGET || '').trim().toLowerCase();
  const isAdminBuild = buildTarget === 'admin';
  const isPublicBuild = buildTarget === 'public';

  const outDir = isAdminBuild ? 'dist-admin' : isPublicBuild ? 'dist-public' : 'dist';
  const entryHtml = isAdminBuild ? 'admin.html' : isPublicBuild ? 'public.html' : 'index.html';

  const plugins: Plugin[] = [react(), tailwindcss()];
  if (isAdminBuild) {
    plugins.push(renameEntryHtmlToIndex('admin.html', outDir));
  } else if (isPublicBuild) {
    plugins.push(renameEntryHtmlToIndex('public.html', outDir));
  }

  return {
    plugins,
    define: {
      // Only expose public, browser-safe Supabase URL and publishable/anon key.
      // Never expose SUPABASE_SERVICE_ROLE_KEY, ADMIN_PASSWORD, or GEMINI_API_KEY to the frontend.
      ...(env.VITE_SUPABASE_URL || env.SUPABASE_URL
        ? { 'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || env.SUPABASE_URL) }
        : {}),
      ...(env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY
        ? { 'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY) }
        : {}),
    },
    build: {
      outDir,
      emptyOutDir: true,
      rollupOptions: {
        input: path.resolve(__dirname, entryHtml),
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
      dedupe: ['react', 'react-dom'],
    },

    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
