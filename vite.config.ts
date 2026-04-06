import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

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
  }
})
