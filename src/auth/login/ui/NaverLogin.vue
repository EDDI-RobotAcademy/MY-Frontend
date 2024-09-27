<template>
    <button class="naver-login-btn" @click="naverLoginClick"></button>
</template>

<script>
export default {
    methods: {
        naverLoginClick() {
            console.log("네이버 로그인 클릭");
        },
    }
}
</script>

<style scoped>
.naver-login-btn {
    margin: 10px 0;
    background-image: url("@/assets/images/fixed/login/naverLogin.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    height: 50px;
    width: 200px;
}
</style>