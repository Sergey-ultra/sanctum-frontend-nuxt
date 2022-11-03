// https://v3.nuxtjs.org/api/configuration/nuxt.config

export default defineNuxtConfig({
    srcDir: 'client/',
    css: [
        "@/assets/css/normalize.css",
        "@/assets/css/app.css",
    ],
    runtimeConfig: {
        public: {
            webURL: process.env.WEB_URL || 'http://localhost:3000',
            apiURL: process.env.API_URL || 'http://sanctum/api',
        },
    },
    vite: {
        server: {
            proxy: {
                'api': {
                    target: 'http://sanctum/api',
                    changeOrigin: true,
                    secure:false,
                    //ws: false
                },
            },
        },
    },
    // vite: {
    //     server: {
    //         proxy: {
    //             '/api/resources': {
    //                 target: process.env.API_URL,
    //                 changeOrigin: true,
    //                 rewrite: (path) => path.replace(/^\/api\/resources/, '')
    //             }
    //         }
    //     }
    // },
    axios :{
      proxy: true,
    },
    // proxy: {
    //     '/api': 'http://sanctum/api/'
    // },
    // runtimeConfig: {
    //     apiSecret: '',
    //     public: {
    //         apiBase: '/api',
    //     }
    // },
    imports: {
        dirs: ['stores'],
    },
    // components: [
    //     '~/components',
    // ],
    buildModules: [
        [
            '@pinia/nuxt',
            {
                autoImports: [
                    // automatically imports `defineStore`
                    'defineStore', // import { defineStore } from 'pinia'
                    // automatically imports `defineStore` as `definePiniaStore`
                    ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
                ],
            },
        ],
    ]
})
