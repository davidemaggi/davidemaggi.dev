import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const basePath =
  process.env.VITE_BASE_PATH ??
  (process.env.GITHUB_ACTIONS === 'true' && repositoryName ? `/${repositoryName}/` : '/')

// https://vite.dev/config/
export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss()],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? '0.0.0'),
    __APP_BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  server:{
    allowedHosts:['127.0.0.1','davidemba','davidemaggi.dev'],
  }
})
