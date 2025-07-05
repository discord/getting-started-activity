import {defineConfig} from 'vite';

// 호스트 체크를 완전히 우회하는 강력한 플러그인
const disableHostCheck = () => {
  return {
    name: 'disable-host-check',
    configureServer(server) {
      // 서버 시작 시 호스트 체크 비활성화
      server.middlewares.use((req, res, next) => {
        // 모든 호스트 허용
        next();
      });
      
      // 추가 미들웨어로 호스트 헤더 무시
      server.middlewares.use((req, res, next) => {
        req.headers.host = 'localhost:3000';
        next();
      });
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  envDir: '../',
  plugins: [disableHostCheck()],
  server: {
    port: 3000,
    host: true, // 모든 인터페이스에서 접근 허용
    strictPort: false,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
    hmr: {
      clientPort: 443,
    },
    allowedHosts: 'all' // 모든 호스트 허용
  },
  define: {
    __VITE_DISABLE_HOST_CHECK__: true
  }
});
