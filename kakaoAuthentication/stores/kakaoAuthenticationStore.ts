
import { defineStore } from "pinia"
import { createAxiosInstances } from '../../utility/axiosInstance'
import { AxiosResponse } from "axios"

export const useKakaoAuthenticationStore = defineStore('KakaoAuthStore', {
    actions: {
        async requestKakaoOauthRedirectionToDjango(): Promise<void> {
            const { djangoAxiosInst } = createAxiosInstances()
            return djangoAxiosInst.get('/kakao_oauth/kakao').then((res) => {
                
                window.location.href = res.data.url
            })
        },
        async requestAccessTokenToDjangoRedirection(payload: { code: string }): Promise<string> {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const { code } = payload
                const response = await djangoAxiosInst.post(
                    'kakao_oauth/kakao/access-token', { code })
                
                return response.data.accessToken.access_token
            } catch (error) {
                
                throw error
            }
        },
        async requestKakaoUserInfoToDjango(payload: { accessToken: string }): Promise<any> {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const { accessToken } = payload
                const userInfoResponse: AxiosResponse<any> =
                    await djangoAxiosInst.post(
                        '/kakao_oauth/kakao/user-info',
                        { access_token: accessToken });

                
                return userInfoResponse.data.user_info;
            } catch (error) {
                alert('사용자 정보 가져오기 실패!');
                throw error;
            }
        }
    }
})