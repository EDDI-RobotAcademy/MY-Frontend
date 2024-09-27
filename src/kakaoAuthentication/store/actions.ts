import axiosInst from "@/utility/axiosInstance"

export type KakaoAuthenticationActions = {
    requestKakaoOauthRedirectionToDjango(): Promise<void>
}

const actions: KakaoAuthenticationActions = {
    async requestKakaoOauthRedirectionToDjango(): Promise<void> {
        console.log('requestKakaoOauthRedirectionToDjango()')
        return axiosInst.djangoAxiosInst.get('/kakao_oauth/kakao').then((res) => {
            console.log('url:', res.data.url)
            window.location.href = res.data.url
        })
    },
};

export default actions;