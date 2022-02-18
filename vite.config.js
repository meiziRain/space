import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            dts: 'src/auto-imports.d.ts', // 可以自定义文件生成的位置，默认是根目录下
            imports: ['vue']
        })],
    server: {
        port: 10000
    }
})
