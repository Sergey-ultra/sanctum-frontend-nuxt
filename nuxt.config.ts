// https://v3.nuxtjs.org/api/configuration/nuxt.config
import dynamicRoutes from './client/utils/dynamicRoutes'

let script = [];
if (process.env.NODE_ENV === 'production') {
    script.push({
        src:'/ym.js',
    });
}
export default defineNuxtConfig({
    srcDir: 'client/',
    // static: {
    //     prefix: true
    // },
    css: [
        "@/assets/css/normalize.css",
        "@/assets/css/app.css",
        "@/assets/css/style.css",
        "@/assets/css/ckeditor.css",
        '@fortawesome/fontawesome-svg-core/styles.css',
        '@/assets/scss/colors.scss',
        '@/assets/scss/form.scss',
        '@/assets/scss/table.scss',
    ],
    meta: {
        title: 'Smart-Beautiful - отзывы о косметики и парфюмерии',
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
            ],
            script: script,
        }
    },
    runtimeConfig: {
        public: {
            webURL: process.env.WEB_URL || 'http://localhost:3000',
            APP_URL: process.env.APP_URL || 'http://localhost:8000',
            apiURL: process.env.API_URL || 'http://localhost:8000/api',
            siteTitle: process.env.SITE_TITLE || 'Smart-Beautiful - отзывы о косметики и парфюмерии',
        },
    },
    plugins:[
            // { src: '~/plugins/ckeditorComponent.client.js'},
    ],
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
        // css: {
        //     preprocessorOptions: {
        //         scss: {
        //             additionalData: '@import "@/assets/scss/colors.scss";'
        //         }
        //     }
        // }
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
    pinia: {
        autoImports: [
            // automatically imports `defineStore`
            'defineStore', // import { defineStore } from 'pinia'
            ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
        ],
    },
    // components: [
    //     '~/components',
    // ],
    modules: [
        '@funken-studio/sitemap-nuxt-3',
        "@pinia/nuxt",
        // [
        //     '@nuxtjs/yandex-metrika',
        //     {
        //         id: '87589913',
        //         webvisor: true,
        //         // clickmap: true,
        //         // useCDN: false,
        //         // trackLinks: true,
        //         // accurateTrackBounce: true,
        //     }
        // ]
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
    // buildModules: [
    //     [
    //         '@pinia/nuxt',
    //         {
    //             autoImports: [
    //                 // automatically imports `defineStore`
    //                 'defineStore', // import { defineStore } from 'pinia'
    //                 // automatically imports `defineStore` as `definePiniaStore`
    //                 ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    //             ],
    //         },
    //     ],
    // ]
})
