import { ActionContext } from "vuex"
import axiosInst from "@/utility/axiosInstance"

export type AccountActions = {
    requestEmailDuplicationCheckToDjango(context: ActionContext<any, any>, email: string): Promise<boolean>
}

const actions: AccountActions = {
    async requestEmailDuplicationCheckToDjango(context: ActionContext<any, any>, email: string): Promise<boolean> {
        const response = await axiosInst.djangoAxiosInst.post(
            '/account/email-duplication-check', { email })
        return response.data.isDuplicate
    },
}

export default actions