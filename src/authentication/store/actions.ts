import { ActionContext } from "vuex"
import { AuthenticationState } from "./states"
import axiosInst from "@/utility/axiosInstance"
import { REQUEST_IS_ADMIN_TO_DJANGO, REQUEST_IS_AUTHENTICATED_TO_DJANGO } from "./mutation-types"

export type AuthenticationActions = {
    requestAddRedisAccessTokenToDjango(
        context: ActionContext<AuthenticationState, any>, email: string
    ): Promise<any>
    requestLogoutToDjango(
        context: ActionContext<AuthenticationState, any>
    ): Promise<void>
    checkAndSetAuthStatus(
        context: ActionContext<AuthenticationState, any>
    ): void
}

const actions: AuthenticationActions = {
    async requestAddRedisAccessTokenToDjango(
        { commit , dispatch}: ActionContext<AuthenticationState, any>, email: string
    ): Promise<any> {
        try {
            const response = await axiosInst.djangoAxiosInst.post(
                '/redis_token/redis-access-token', { email })

            console.log('userToken:', response.data.userToken)

            localStorage.setItem("userToken", response.data.userToken)
            commit(REQUEST_IS_AUTHENTICATED_TO_DJANGO, true)

            await dispatch('checkAndSetAuthStatus');
            return response.data;
        } catch (error) {
            console.error('Error adding redis access token:', error);
            throw error;
        }
    },
    async requestLogoutToDjango(
        { commit, dispatch }: ActionContext<AuthenticationState, any>
    ): Promise<void> {
        try {
            const userToken = localStorage.getItem("userToken")

            const res = await axiosInst.djangoAxiosInst.post('/redis_token/logout', {
                userToken: userToken
            })

            console.log('res:', res.data.isSuccess)
            if (res.data.isSuccess === true) {
                commit(REQUEST_IS_AUTHENTICATED_TO_DJANGO, false)
                localStorage.removeItem("userToken")

                await dispatch('checkAndSetAuthStatus');
            }
        } catch (error) {
            console.error('requestLogoutToDjango() 중 에러 발생:', error)
            throw error
        }
    },
    async checkAndSetAuthStatus({ commit }: ActionContext<AuthenticationState, any>
    ): Promise<void>{
        const userToken = localStorage.getItem("userToken")
        
        if (userToken) {
            console.log("User token found in localStorage")
            console.log("userToken: ", userToken)
            commit(REQUEST_IS_AUTHENTICATED_TO_DJANGO, true)

            try{
                const res = await axiosInst.djangoAxiosInst.post('/account/roletype-check', {
                    userToken
                })
                if (res.data === "ADMIN"){
                    console.log("관리자 계정입니다.")
                    commit(REQUEST_IS_ADMIN_TO_DJANGO, true)
                }
                else {
                    console.log("관리자 계정이 아닙니다.")
                    commit(REQUEST_IS_ADMIN_TO_DJANGO, false)
                }
            } catch (error){
                console.error("관리자 확인 중 오류 발생: ", error);
                commit(REQUEST_IS_ADMIN_TO_DJANGO, false);
            }
            
        } else {
            commit(REQUEST_IS_AUTHENTICATED_TO_DJANGO, false)
            commit(REQUEST_IS_ADMIN_TO_DJANGO, false)

        }
    }
}

export default actions;