import path from 'path';
const __dirname = path.resolve();
import { defineConfig, build } from 'vite';
const resolvePath = (str: string) => path.resolve(__dirname, str);

(async () => {
    const config = defineConfig({
        build: {
            outDir: resolvePath('./dist'),
            emptyOutDir: false,
            lib: {
                entry: resolvePath('./src/content_scripts/main.ts'),
                formats: ['iife'],
                name: 'popup',
                fileName: () => `content_scripts.js`,
            },
        },
    });
    await build({ configFile: false, envFile: false, ...config });
})();
