import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv, type Plugin, type PluginOption } from 'vite';

function finalizeTargetBundle(sourceFileName: string, outDir: string, isAdminBuild: boolean): Plugin {
  return {
    name: 'finalize-target-bundle',
    closeBundle() {
      const targetDir = path.resolve(__dirname, outDir);
      const from = path.resolve(targetDir, sourceFileName);
      const to = path.resolve(targetDir, 'index.html');
      if (fs.existsSync(from)) {
        fs.renameSync(from, to);
      }
      if (isAdminBuild && fs.existsSync(targetDir)) {
        // Admin bundle must not inherit public _redirects blocking /admin or /api
        fs.writeFileSync(path.resolve(targetDir, '_redirects'), '/* /index.html 200\n', 'utf8');
        fs.writeFileSync(
          path.resolve(targetDir, 'robots.txt'),
          'User-agent: *\nDisallow: /\n',
          'utf8'
        );
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

  const plugins: PluginOption[] = [react(), tailwindcss()];
  if (isAdminBuild) {
    plugins.push(finalizeTargetBundle('admin.html', outDir, true));
  } else if (isPublicBuild) {
    plugins.push(finalizeTargetBundle('public.html', outDir, false));
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
