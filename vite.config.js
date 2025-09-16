/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
        },
        define: {
            'process.env': {},
        },
        plugins: [react()],
        base: '/iss-track-react/',
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@features': path.resolve(__dirname, './src/features'),
                '@components': path.resolve(__dirname, './src/components'),
                '@hooks': path.resolve(__dirname, './src/hooks'),
                '@services': path.resolve(__dirname, './src/services'),
                '@stores': path.resolve(__dirname, './src/stores'),
                '@types': path.resolve(__dirname, './src/types'),
                '@utils': path.resolve(__dirname, './src/utils'),
                '@context': path.resolve(__dirname, './src/context'),
            },
        },
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: ['./src/test/setup.ts'],
            css: true,
            coverage: {
                provider: 'v8',
                reporter: ['text', 'html', 'json'],
                exclude: [
                    'node_modules/',
                    'src/test/',
                    '**/*.d.ts',
                    '**/*.config.js',
                    'build/',
                    'coverage/',
                ],
            },
        }
    };
});