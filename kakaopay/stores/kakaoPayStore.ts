import { createAxiosInstances } from '~/utility/axiosInstance'

export const actions = {
    async requestReadyKakaoPayRedirection(
        readyInfo: { amount: string; }
    ): Promise<any> {
        const { djangoAxiosInst } = createAxiosInstances()
        try {
            const response = await djangoAxiosInst.post(
                "/kakao_pay/readyKakaoPay",
                readyInfo
            );
            return response;
        } catch (error) {
            console.error("requestReadyKakaoPayRedirection() 오류 발생", error);
            throw error;
        }
    },
}