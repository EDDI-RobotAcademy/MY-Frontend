
import { defineStore } from "pinia"
import { createAxiosInstances } from '../../utility/axiosInstance'
import { AxiosResponse } from "axios"

export const useGoogleAuthenticationStore = defineStore('GoogleAuthStore', {
    actions: {
        async requestGoogleOauthRedirectionToDjango(): Promise<void> {
            const { djangoAxiosInst } = createAxiosInstances()
      
            return djangoAxiosInst.get('/google_oauth/google').then((res) => {
                
                window.location.href = res.data.url
            })
        },
        async requestAccessTokenToDjangoRedirection(payload: { code: string }): Promise<string> {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
        
                const { code } = payload
                const response = await djangoAxiosInst.post(
                    'google_oauth/google/access-token', { code })
                
                return response.data.accessToken.access_token
            } catch (error) {
                
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

                
                return userInfoResponse.data.user_info;
            } catch (error) {
                alert('사용자 정보 가져오기 실패!');
                throw error;
            }
        }
    }
})