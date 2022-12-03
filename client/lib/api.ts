import { FetchError, FetchOptions, SearchParams, $fetch } from 'ohmyfetch'
import { Router } from 'vue-router'

export interface UserData {
    token: string
    userName: string
    avatar: string
    role: string
}

export interface ApiConfig {
    fetchOptions: FetchOptions<'json'>
    webURL: string
    apiURL: string
}



export default class Api {
    public userData = useCookie('userData', { path: '/', maxAge: 60*60*24*30 })
    public config: ApiConfig

    constructor(config: ApiConfig) {
        this.config = { ...config }
    }

    public setUserData(userData: UserData) {
        this.userData.value = JSON.stringify(userData)
    }

    public async getUserData() {
        if (this.userData.value) {
            return this.userData.value
        }
        return undefined
    }

    public removeUserData() {
        this.userData.value = undefined
    }

    private  fetchOptions(params?: SearchParams, method = 'GET'): FetchOptions<'json'> {
        const fetchOptions = {...this.config.fetchOptions}
        fetchOptions.headers = {
            Accept: 'application/json',
            Referer: this.config.webURL,
        }

        const userData =  this.getUserData()
        if (userData.token) {
            fetchOptions.headers.Authorization = `Bearer ${userData.token}`
        }


        fetchOptions.method = method

        if (params) {
            if (method === 'POST' || method === 'PUT') {
                fetchOptions.body = params
            } else {
                fetchOptions.params = params
            }
        }

        return fetchOptions
    }





    public async get(endpoint: string, params?: SearchParams, cb?: (e: FetchError) => void, toast = true) {
        try {
            if (params && params.hasOwnProperty('params')) {
                let queryArray = []
                for (let [key, value] of Object.entries(params.params)) {
                    if (Array.isArray(value) && value.length) {
                        value.forEach(el => queryArray.push(`${key}[]=${el}`))
                    } else if (("string" === typeof value && value !== '') || "number" === typeof value) {
                        queryArray.push(`${key}=${value}`)
                    }
                }
                delete params.params

                if (queryArray.length) {
                    endpoint += '?' + queryArray.join('&')
                }
            }

            const fetchOptions = await this.fetchOptions(params, 'GET');

            return await $fetch(endpoint, fetchOptions)
        } catch (error) {
            if (cb) cb(error)
            if (toast) await this.handleError(error)
        }
    }

    public async post(endpoint: string, params?: SearchParams, cb?: (e: FetchError) => void, toast = true) {
        try {
            const fetchOptions = await this.fetchOptions(params, 'POST');
            return await $fetch(endpoint, fetchOptions);
        } catch (error) {
            if (cb) cb(error)
            if (toast) await this.handleError(error)
        }
    }

    public async put(endpoint: string, params?: SearchParams, cb?: (e: FetchError) => void, toast = true) {
        try {
            const fetchOptions =  await this.fetchOptions(params, 'PUT');
            return await $fetch(endpoint, fetchOptions)
        } catch (error) {
            if (cb) cb(error)
            if (toast) await this.handleError(error)
        }
    }

    public async delete(endpoint: string, params?: SearchParams, cb?: (e: FetchError) => void, toast = true) {
        try {
            const fetchOptions =  await this.fetchOptions(params, 'DELETE');
            return await $fetch(endpoint, fetchOptions)
        } catch (error) {
            if (cb) cb(error)
            if (toast) await this.handleError(error)
        }
    }

    public async handleError (error: FetchError): Promise<void> {

        // if (error.response?.status === 401)
        //     return await this.invalidate()
        //
        // console.log('handling our 402')
        // if (error.response?.status === 402 && this.config.paymentToast)
        //     return this.$toast.show(this.config.paymentToast)
        //
        //
        // if (!this.$toast) throw error
        //
        // if (error.response._data && error.response._data.errors)
        //     for (const err of error.response._data.errors)
        //         this.$toast.show({
        //             type: 'danger',
        //             message: err.detail ?? err.message ?? '',
        //             timeout: 12,
        //         })
        //
        // if (error.response?.status === 403)
        //     return this.$toast.show({
        //         type: 'denied',
        //         message: error.response._data.message,
        //         timeout: 0,
        //     })
        //
        // if (error.response._data.exception)
        //     this.$toast.show({
        //         type: 'danger',
        //         message: `<b>[${error.response._data.exception}]</b> <br /> ${error.response._data.message} <br /> <a href="phpstorm://open?file=/${error.response._data.file}&line=${error.response._data.line}">${error.response._data.file}:${error.response._data.line}</a>`,
        //         timeout: 0,
        //     })
    }



    public async invalidate (router?: Router): Promise<void> {
        // this.token.value = undefined
        // if (router) await router.push(this.config.redirect.logout)
        // else if (process.client && document.location.pathname !== this.config.redirect.logout)
        //     document.location.href = this.config.redirect.logout
    }

}