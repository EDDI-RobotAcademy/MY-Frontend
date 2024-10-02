import { ActionContext } from "vuex"
import axiosInst from "@/utility/axiosInstance"

export type AuthenticationActions = {
    requestAddRedisAccessTokenToDjango(
        context: ActionContext<any, any>,email: string
    ): Promise<any>
}

const actions: AuthenticationActions = {
    async requestAddRedisAccessTokenToDjango(
        { commit }: ActionContext<any, any>,email: string
    ): Promise<any> {
        try {
            const response = await axiosInst.djangoAxiosInst.post(
                '/redis_token/redis-access-token', { email })

            console.log('userToken:', response.data.userToken)

            localStorage.setItem("userToken", response.data.userToken)
            commit('REQUEST_IS_AUTHENTICATED_TO_DJANGO', true);
            return response.data;
        } catch (error) {
            console.error('Error adding redis access token:', error);
            throw error;
        }
    },
}

export default actions;