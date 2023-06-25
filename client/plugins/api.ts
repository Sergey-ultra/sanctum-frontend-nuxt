import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import Api from '~/lib/api';
import Toast from '~/lib/toast';


export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    return {
        provide: {
            api: new Api({
                    fetchOptions: {
                        baseURL: config.public.apiURL,
                    },
                    apiURL: config.public.apiURL,
                    webURL: config.public.webURL,
                },
                new Toast(),
            ),

        },
    }
})

declare module '#app' {
  interface NuxtApp {
    $api: Api
  }
}
