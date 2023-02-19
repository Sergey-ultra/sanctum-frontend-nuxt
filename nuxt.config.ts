// https://v3.nuxtjs.org/api/configuration/nuxt.config
import dynamicRoutes from './client/utils/dynamicRoutes'

export default defineNuxtConfig({
    srcDir: 'client/',
    // static: {
    //     prefix: true
    // },
    css: [
        "@/assets/css/normalize.css",
        "@/assets/css/app.css",
        "@/assets/css/style.css",
        '@fortawesome/fontawesome-svg-core/styles.css'
    ],
    meta: {
        title: 'Smart-Beautiful - агрегатор цен косметических товаров',
    },
    app: {
        // meta: [               { name: 'description', content: 'My amazing site.' }      ],
        head: {
            link: [
                {
                    rel: "apple-touch-icon", sizes: "180x180", href: "/favicon/apple-touch-icon.png"
                },
                {
                    rel: 'icon', type: "image/png", sizes: "32x32", href: '/favicon/favicon-32x32.png'
                },
                {
                    rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon/favicon-16x16.png"
                },
                {
                    rel: "manifest", href: "/favicon/site.webmanifest"
                },
                {
                    rel: "mask-icon", href: "/favicon/safari-pinned-tab.svg", color: "#5bbad5"
                }
            ]
        }
    },
    runtimeConfig: {
        public: {
            webURL: process.env.WEB_URL || 'http://localhost:3000',
            APP_URL: process.env.APP_URL || 'http://sanctum',
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
    modules: [
        '@funken-studio/sitemap-nuxt-3',
    ],
    sitemap: {
        hostname: 'https://smart-beautiful.ru',
        exclude: [
            '/comparison',
            '/edit-profile',
            '/favorites',
            '/search',
            '/social-callback',
            '/profile/**'

        ],
        routes: dynamicRoutes
    },
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
