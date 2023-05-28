import { defineConfig } from 'vite';
import { resolve } from 'path'; // 主要用于alias文件路径别名

export default defineConfig({
    // ...
    build: {
        outDir: 'dist',
        lib: {
            entry: 'src/main.ts',
            formats: ['iife'],
            name: 'content_scripts',
            fileName: format => 'content_scripts.js',
        },
    },
    // server: {
    //     open: '/popup.html',
    // },
});
