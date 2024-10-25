import * as axiosUtility from "../../utility/axiosInstance"

export const aiRequestActions = {
    async aiRequestToDjango() {
        const { djangoAxiosInst } = axiosUtility.createAxiosInstances()

        const payload = {
            userToken: "test",
            command: 1,
            data: ["테스트용 데이터입니다."]
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