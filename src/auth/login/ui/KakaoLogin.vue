<template>
    <button class="kakao-login-btn" @click="kakaoLoginClick"></button>
</template>

<script>
import env from "@/env";
export default {
    data(){
        return {
            KAKAO_JAVASCRIPT_KEY: env.api.KAKAO_JAVASCRIPT_KEY,
        }
    },
    methods: {
        kakaoLoginClick() {
            window.Kakao.init(this.KAKAO_JAVASCRIPT_KEY);
            window.Kakao.Auth.login({
                scope: 'profile_nickname, account_email',
                success: this.getKakaoAccount,
            });
        },
        getKakaoAccount() {
            window.Kakao.API.request({
                url: '/v2/user/me',
                success: res => {
                    const kakao_account = res.kakao_account;
                    const nickname = kakao_account.profile.nickname;
                    const email = kakao_account.email;
                    console.log('nickname', nickname);
                    console.log('email', email);
                },
                fail: error => {
                    console.log(error);
                }
            });
        },
    },
}
</script>

<style scoped>
.kakao-login-btn {
    margin: 10px 0;
    background-image: url("@/assets/images/fixed/login/kakaoLogin.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    height: 50px;
    width: 200px;
}
</style>