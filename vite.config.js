/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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