// @ts-ignore
import path from 'path';
const __dirname = path.resolve();
import { defineConfig, build } from 'vite';
import vue from '@vitejs/plugin-vue';

const resolvePath = (str: string) => path.resolve(__dirname, str);
// import AutoImport from 'unplugin-auto-import/vite';
// import Components from 'unplugin-vue-components/vite';
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

(async () => {
    const config = defineConfig({
        define: {
            'process.env': {},
        },
        build: {
            outDir: resolvePath('./dist'),
            emptyOutDir: false,
            lib: {
                entry: resolvePath('./src/popup/index.ts'),
                formats: ['iife'],
                name: 'popup',
                fileName: () => `popup.js`,
            },
        },
        plugins: [
            vue(),
            // AutoImport({
            //     resolvers: [ElementPlusResolver()],
            // }),
            // Components({
            //     resolvers: [ElementPlusResolver()],
            // }),
        ],
    });
    await build({ configFile: false, envFile: false, ...config });
})();
