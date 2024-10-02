<template>
    <div></div>
</template>
<script>
import router from '@/router'
import { mapActions } from 'vuex'

const kakaoAuthenticationModule = 'kakaoAuthenticationModule'
const accountModule = 'accountModule'
const redisModule = 'redisModule'

export default {
    data() {
        return {
            accessToken: null,
        }
    },
    methods: {
        ...mapActions(kakaoAuthenticationModule, ['requestAccessTokenToDjangoRedirection','requestAccessTokenToDjangoRedirection', 'requestKakaoUserInfoToDjango']),
        ...mapActions(accountModule, ['requestEmailDuplicationCheckToDjango', 'requestCreateNewAccountToDjango']),
        ...mapActions(redisModule, ['requestAddRedisAccessTokenToDjango']),
        async setRedirectData() {
            const code = this.$route.query.code
            const response = await this.requestAccessTokenToDjangoRedirection({ code })
            if (response) {
                this.accessToken = response;
                this.checkUserExists(this.accessToken)
            }
        },
        async checkUserExists(accessToken) {
            const userInfo = await this.requestKakaoUserInfoToDjango({ accessToken })
            if (userInfo.kakao_account.email) {
                const response = await this.requestEmailDuplicationCheckToDjango(userInfo.kakao_account.email)
                if (!response) {
                    this.registerNewAccount(userInfo.kakao_account.email, userInfo.kakao_account.profile.nickname);
                    router.push('/survey')
                } else {
                    this.registerUserToken(userInfo.kakao_account.email, this.accessToken);
                    router.push('/')
                }
            }
        },
        async registerNewAccount(email, nickname) {
            const accountInfo = {
                loginType: 'KAKAO',
                email: email,
                nickname: nickname,
            }
            await this.requestCreateNewAccountToDjango(accountInfo)
            this.registerUserToken(email, this.accessToken)
        },
        async registerUserToken(email, accessToken) {
            await this.requestAddRedisAccessTokenToDjango(email, accessToken);
        },
    },
    async created() {
        await this.setRedirectData();
    }
}
</script>