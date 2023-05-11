import { FetchError, FetchOptions, SearchParams, $fetch } from 'ohmyfetch'
import { Router } from 'vue-router'
import {useNotificationStore} from "~/store/notification";



export interface ApiConfig {
    fetchOptions: FetchOptions<'json'>
    webURL: string
    apiURL: string
}



export default class Api {
    public token = useCookie('token', { path: '/', maxAge: 60*60*24*30 })
    public config: ApiConfig
    public $user = reactive<models.User>({
        role: '',
        name: '',
        avatar: ''
    })

    public mailVerification = reactive({
        isRequired: false,
        email: '',
        after: '',
        message: ''
    })

    public isAuth = ref(false)
    public isShowAuthModal = ref(false)

    constructor(config: ApiConfig) {
        this.config = { ...config }
    }
    public async login(object) {
        const response = await this.post('/login', object);
        if (response.status) {
            if (!response.isRequiredEmailVerification) {
                const { name, token, avatar, role } = response;
                this.isAuth.value = true;
                this.token.value = token;
                Object.assign(this.$user, { avatar, role, name })
                this.setIsShowAuthModal(false);
            } else {
                this.setEmailVerification({ email: response.email, after: 'login', message: response.message });
            }

        }

        const notificationStore = useNotificationStore();
        notificationStore.setSuccess('Вы удачно авторизировались');
    }

    public setEmailVerification({ after, email, message }) {
        this.mailVerification = { isRequired: true, after, email, message };
    }

    public verifyEmail() {
        this.mailVerification = {
            isRequired: false,
            after: '',
            email: '',
            message: ''
        };
    }

    public async loginWithService(service) {
        const { url } = await this.get(`/login/${service}`);
        if (url) {
            window.location.href = url;
        }
    }

    public async loginViaSocialServices(obj) {
        const { user_name, token, avatar, role } = obj;
        this.isAuth.value = true;
        this.token.value = token;
        Object.assign(this.$user, {  avatar, role, name: user_name })
        this.setIsShowAuthModal(false);
    }

    public async register(object) {
        const response = await this.post('/register', object);

        if (response.isRequiredEmailVerification) {
            this.setEmailVerification({ email: response.email, after: 'register', message: response.message });
        } else {
            const notificationStore = useNotificationStore();
            notificationStore.setSuccess(response.message);
        }
    }

    public async changePassword(object) {
        const { message } = await this.post('/change-password', object);
        if (message) {
            const notificationStore = useNotificationStore();
            notificationStore.setSuccess(message);
        }
    }

    public async resendVerificationEmail() {
        const { message } = await this.post('/email/verification-notification', { email: this.mailVerification.email });
        if (message) {
            const notificationStore = useNotificationStore();
            notificationStore.setSuccess(message);
        }
    }

    public async recover(email) {
        const { message } = await this.post('/forgot-password', { email });
        const notificationStore = useNotificationStore();
        notificationStore.setSuccess(message);
    }

    public async checkAuth() {
        if (this.token.value) {
            try {
                this.isAuth.value = true;
                const { data } = await this.get('/me');
                Object.assign(this.$user, data);
            } catch (e) {
                await this.logout();
            }
        } else {
            this.isAuth.value = false;
        }
    }

    public async logout() {
        await this.post('/logout');
        this.token.value = undefined;
        this.isAuth.value = false;
        this.resetUser();
    }

    public resetUser() {
        this.$user.name = '';
        this.$user.avatar = '';
        this.$user.role = '';
    }

    public setIsShowAuthModal(payload) {
        this.isShowAuthModal.value = payload;
    }

    private async fetchOptions(params?: SearchParams, method = 'GET') {
        const fetchOptions = {...this.config.fetchOptions}
        fetchOptions.headers = {
            Accept: 'application/json',
            Authorization: `Bearer ${this.token.value}`,
            Referer: this.config.webURL,
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