<template>
  <div class="third-content">
    <div class="content-wrapper">
      <h2 class="subtitle">Key Point # 2</h2>
      <h1 class="title">사용자에게 어울리는 콘텐츠 카테고리,<br>활동 플랫폼, 롤모델을 찾아드려요.</h1>
      <div class="features">
        <div class="feature-list">
          <div class="feature-item">
            <h4>콘텐츠 카테고리</h4>
            <p>운동, 뷰티, 음악, 여행, 게임, 요리 등<br>다양한 콘텐츠 카테고리를 제공해요.</p>
          </div>
          <div class="feature-item">
            <h4>활동 플랫폼</h4>
            <p>유튜브, 틱톡, 인스타그램 등<br>사용자에게 적합한 플랫폼을 추천해요.</p>
          </div>
          <div class="feature-item">
            <h4>롤모델</h4>
            <p>타 인플루언서들의 활동을 보고<br>자신만의 롤모델을 찾아볼 수 있어요.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThirdContent'
}
</script>

<style scoped>
.third-content {
  background-color: #f5f5f5;
  height: 100vh; /* Set the height to 100% of the viewport height */
  display: flex;
  align-items: center; /* Center the content vertically */
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%; /* Ensure the wrapper takes full width */
}

.subtitle {
  font-size: 32px;
  color: #333;
  margin-bottom: 20px;
}

.title {
  font-size: 48px;
  font-weight: bold;
  color: #000;
  margin-bottom: 40px;
  line-height: 1.2;
}

.features {
  display: flex;
  justify-content: space-between;
}

.feature-text {
  flex: 0 0 40%;
}

.feature-text h3 {
  font-size: 24px;
  font-weight: normal;
  line-height: 1.4;
}

.feature-list {
  flex: 0 0 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.feature-item {
  flex: 0 0 33%;
  margin-bottom: 30px;
}

.feature-item h4 {
  font-size: 20px;
  margin-bottom: 10px;
}

.feature-item p {
  font-size: 16px;
  color: #666;
}

@media (max-height: 800px) {
  .third-content {
    height: auto;
    min-height: 100vh;
    padding: 80px 0;
  }
}
</style>
