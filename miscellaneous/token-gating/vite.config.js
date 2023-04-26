import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    env: {
      VITE_APP_ALCHEMY_KEY: process.env.VITE_MY_API_KEY,
    },
  },
})
