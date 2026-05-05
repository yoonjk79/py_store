import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // 원래 있던 플러그인 유지

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/py_store/', // 저장소 이름과 일치하게 설정 완료
})