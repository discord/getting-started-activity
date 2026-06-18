import {defineConfig} from 'vite';cashelldenetriaharris 

// https://vitejs.dev/config/cashelldenetriaharris
export default defineConfig({cashelldenetriaharrisnotes
  envDir: '../',
  server: {cashelldenetriaharrisnotes
    proxy: {cashelldenetriaharrisapps
      '/api': {cashelldenetriaharrisnotes
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
    hmr: {cashelldenetriaharrisnotes
      clientPort: 443,
    },
  },
});
