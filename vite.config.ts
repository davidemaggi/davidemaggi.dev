import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The MonkeyProof RSS feed has no CORS headers: serve it from our own origin (mirrors docker/nginx.conf).
const blogFeedProxy = {
  '/feeds/monkeyproof.xml': {
    target: 'https://monkeyproof.dev',
    changeOrigin: true,
    rewrite: () => '/rss.xml',
  },
}

// https://vite.dev/config/
export default defineConfig({
  // Relative base keeps assets valid on both /<repo>/ (github.io) and / (custom domain)
  base: './',
  plugins: [react(), tailwindcss()],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? '0.0.0'),
    __APP_BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  server:{
    allowedHosts:['127.0.0.1','davidemba','davidemaggi.dev'],
    proxy: blogFeedProxy,
  },
  preview: {
    proxy: blogFeedProxy,
  }
})
