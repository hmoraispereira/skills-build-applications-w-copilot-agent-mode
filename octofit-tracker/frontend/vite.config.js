import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_CODESPACE_NAME': JSON.stringify(
      process.env.CODESPACE_NAME || process.env.VITE_CODESPACE_NAME || '',
    ),
  },
})
