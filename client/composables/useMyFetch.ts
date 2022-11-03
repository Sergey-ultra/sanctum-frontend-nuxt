// export const useMyFetch = (url: string, options?: FetchOptions) => {
//     return useFetch(url, {
//         ...options,
//         async onResponse({ request, response, options }) {
//             const data = JSON.parse(localStorage.getItem('userData'))
//             if (data) {
//                 options.headers['Authorization'] = `Bearer ${data.token}`
//             }
//
//             return options;
//             //console.log('[fetch response]')
//         },
//         async onResponseError({ request, response, options }) {
//             console.log('[fetch response error]')
//         },
//
//         async onRequest({ request, options }) {
//             console.log('[fetch request]')
//         },
//         async onRequestError({ request, options, error }) {
//             console.log('[fetch request error]')
//         }
//     })
// }