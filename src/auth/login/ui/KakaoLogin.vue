<template>
    <button class="kakao-login-btn" @click="kakaoLoginClick"></button>
</template>

<script>
export default {
    methods: {
        kakaoLoginClick() {
            console.log("카카오 로그인 클릭");
        },
    }
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