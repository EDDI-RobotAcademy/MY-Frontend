<template>
    <div class="main-container">
        <div class="main-text">
            Key Point # 1<br><br>
            사용자 개인 성향 조사 데이터 분석을 통해<br>
            인플루언서로 성장할 최적의 솔루션을 제공해요.<br>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SecondContent',
}
</script>

<style scoped>
.main-container {
    background-color: #000;
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

}

.main-text {
    text-align: center;
    font-size: 32px;
    color: #fff;
    font-weight: bold;
    padding: 280px;
}
</style>
