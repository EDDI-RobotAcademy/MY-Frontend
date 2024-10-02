import { ActionContext } from "vuex"
import { AuthenticationState } from "./states"
import axiosInst from "@/utility/axiosInstance"

export type AuthenticationActions = {
    requestAddRedisAccessTokenToDjango(
        context: ActionContext<AuthenticationState, any>, email: string
    ): Promise<any>
    requestLogoutToDjango(
        context: ActionContext<AuthenticationState, any>, userToken: string
    ): Promise<void>
}

const actions: AuthenticationActions = {
    async requestAddRedisAccessTokenToDjango(
        { commit }: ActionContext<AuthenticationState, any>,email: string
    ): Promise<any> {
        try {
            const response = await axiosInst.djangoAxiosInst.post(
                '/redis_token/redis-access-token', { email })

            console.log('userToken:', response.data.userToken)

            localStorage.setItem("userToken", response.data.userToken)
            return response.data;
        } catch (error) {
            console.error('Error adding redis access token:', error);
            throw error;
        }
    },
    async requestLogoutToDjango(
        context: ActionContext<AuthenticationState, any>,
        userToken: string
    ): Promise<void> {
        try {
            const userToken = localStorage.getItem("userToken")

            const res =
                await axiosInst.djangoAxiosInst.post('/redis_token/logout', {
                    userToken: userToken
                })

            console.log('res:', res.data.isSuccess)
            if (res.data.isSuccess === true) {
                context.commit('REQUEST_IS_AUTHENTICATED_TO_DJANGO', false)
            }
        } catch (error) {
            console.error('requestPostToFastapi() 중 에러 발생:', error)
            throw error
        }
        localStorage.removeItem("userToken")
    }
}

export default actions;