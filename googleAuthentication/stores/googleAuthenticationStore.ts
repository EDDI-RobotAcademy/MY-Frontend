
import { defineStore } from "pinia"
import { createAxiosInstances } from '../../utility/axiosInstance'
import { AxiosResponse } from "axios"

export const useGoogleAuthenticationStore = defineStore('GoogleAuthStore', {
    actions: {
        async requestGoogleOauthRedirectionToDjango(): Promise<void> {
            const { djangoAxiosInst } = createAxiosInstances()
            console.log('requestGoogleOauthRedirectionToDjango()')
            return djangoAxiosInst.get('/google_oauth/google').then((res) => {
                console.log('url:', res.data.url)
                window.location.href = res.data.url
            })
        },
        async requestAccessTokenToDjangoRedirection(payload: { code: string }): Promise<string> {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                console.log('requestAccessTokenToDjangoRedirection()')
                const { code } = payload
                const response = await djangoAxiosInst.post(
                    'google_oauth/google/access-token', { code })
                console.log('accessToken:', response.data.accessToken.access_token)
                return response.data.accessToken.access_token
            } catch (error) {
                console.log('Access Token 요청 중 문제 발생:', error)
                throw error
            }
        },
        async requestGoogleUserInfoToDjango(payload: { accessToken: string }): Promise<any> {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const { accessToken } = payload
                const userInfoResponse: AxiosResponse<any> =
                    await djangoAxiosInst.post(
                        '/google_oauth/google/user-info',
                        { access_token: accessToken });

                console.log('User Info:', userInfoResponse.data.user_info);
                return userInfoResponse.data.user_info;
            } catch (error) {
                alert('사용자 정보 가져오기 실패!');
                throw error;
            }
        }
    }
})