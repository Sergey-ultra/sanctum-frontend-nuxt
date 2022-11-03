//
// const config = useRuntimeConfig()
// const baseURL = config.public.apiURL
//
// console.log(baseURL);
//
// export default defineEventHandler(async event => {
//     const method = useMethod(event)
//     const params = useQuery(event)
//     const body = method === "GET" ? undefined : await useBody(event)
//
//     return await $fetch(event.req.url, {
//         headers: {
//             "Content-Type": "application/json"
//         },
//         baseURL,
//         method,
//         params,
//         body
//     })
// })