import { defineNuxtConfig } from 'nuxt/config';

import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';

export default defineNuxtConfig({
    compatibilityDate: '2025-05-15',
    ssr: true,

    server: {
        port: process.env.NITRO_PORT || 8000,
        host: process.env.NITRO_HOST || '127.0.0.1'
    },

    alias: {
        '@': path.resolve(__dirname, './'),
    },

    plugins: [
        '@/plugins/pinia/pinia.js',
        //'@/plugins/router/router.js'
    ],

    app: {
        head: {
            title: 'Чертоги героев — аутентичный клуб для игр в D&D в Москве',
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { 
                    name: 'description', 
                    content: 'Чертоги героев — атмосферный клуб настольных ролевых игр D&D в Москве. Играйте в подземелья и драконов с опытными мастерами и уютной компанией.' 
                },
                { 
                    name: 'keywords', 
                    content: 'Чертоги героев, клуб D&D Москва, настольные ролевые игры, подземелья и драконы, ролевые вечера, клуб настольных игр, мастер D&D' 
                }
            ]
        },
        pageTransition: { name: 'page', mode: 'out-in' },
        scrollBehavior(to, from, savedPosition) {
            if (savedPosition) return savedPosition
            return { top: 0, left: 0 }
        }
    },

    runtimeConfig: {
        public: {
            siteBaseURL: process.env.SITE_BASE_URL
        }
    },


    devtools: { enabled: true },
    modules: ['@nuxt/fonts', '@nuxt/image'],
    //plugins: ['~/plugins/animations/gsap.cleaner.js'],

    image: {
        provider: 'ipx',
        formats: ['webp'],
        domains: ['26.189.166.185:5000'],
        screens: {
            xs: 320,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            xxl: 1536
        },
        presets: {
            default: {
                sizes: 'xs:100vw sm:100vw md:50vw lg:33vw xl:25vw'
            }
        }
    },

    css: [
        '@/assets/styles/main.scss'
    ],

    serverMiddleware: [
        { path: '/', handler: '~/server/middleware/compression.js' }
    ],

    vite: {
        //plugins: [compression()],
        build: {
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                },
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@import "@/assets/styles/global/wrapper.scss";`
                }
            }
        }
    },

    hooks: {
        async 'build:before'() {
            const imagesFrom = path.resolve('assets/images');
            const imagesTo = path.resolve('public/images');

            if (await fse.pathExists(imagesFrom)) {
                await fse.copy(imagesFrom, imagesTo);
                console.log('Картинки скопированы: assets/images → public/images');
            } 
            else {
                console.warn('Папка assets/images не найдена');
            }

            const modelsFrom = path.resolve('assets/models');
            const modelsTo = path.resolve('public/models');

            if (await fse.pathExists(modelsFrom)) {
                await fse.copy(modelsFrom, modelsTo);
                console.log('Модели скопированы: assets/models → public/models');
            } 
            else {
                console.warn('Папка assets/models не найдена');
            }
        }
    }
})
