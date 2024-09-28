import axiosInst from "@/utility/axiosInstance"
export type googleAuthenticationActions = {
    requestGoogleOauthRedirectionToDjango(): Promise<void>
}
const actions: googleAuthenticationActions = {
    async requestGoogleOauthRedirectionToDjango(): Promise<void> {
        return axiosInst.djangoAxiosInst.get('/google_oauth/google').then((res) => {
            window.location.href = res.data.url
        })
    },
}
export default actions;