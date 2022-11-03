// import { FetchOptions } from "ohmyfetch";
//
// const serverRoute: string = "http://sanctum";
// const apiRoute: string = `${serverRoute}/api`;
//
//
// export const useApi = async (url: string, options?: FetchOptions) => {
//
//
//     // Here we will create a default set of headers for every request
//     // if present we will also spread the `headers` set by the user
//     // then we will delete them to avoid collision in next spread
//     const headers: HeadersInit = {
//         Accept: "application/json",
//         "Cache-Control": "no-cache",
//         ...options?.headers
//     };
//
//     // At this point all the `headers` passed by the user where correctly
//     // set in the defaults, now we will spread `options` to remove the
//     // `headers` attribute so we don't spread it again in `useFetch`
//     const opts: FetchOptions = options ? (({ headers, ...opts }) => opts)(options) : null;
//
//     const baseURL = !options?.baseURL ? apiRoute : options.baseURL;
//
//     return useFetch(url, {
//         baseURL: baseURL,
//         headers,
//         ...opts
//     });
// };