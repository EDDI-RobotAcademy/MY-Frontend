import * as axiosUtility from "../../utility/axiosInstance"

export const aiRequestActions = {
    async aiRequestToDjango() {
        const { djangoAxiosInst } = axiosUtility.createAxiosInstances()
        const userToken = localStorage.getItem("userToken")

        const payload = {
            userToken: userToken,
            command: 1,
            data: ["test data"]
        }

        try {
            const response = await djangoAxiosInst.post('/ai-request/send', payload)
            this.isRequestSuccessful = response.data
        } catch (error) {
            console.error('aiRequestToDjango 도중 에러 발생:', error)
            this.isRequestSuccessful = false
        }
    }
}