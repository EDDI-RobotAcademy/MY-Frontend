<template>
    <div class="main-container">
        <div class="title">
          <h2>쿠잉 서비스 사용 경험 피드백</h2><br>
          <h4>쿠잉 서비스 사용 경험에 대해 피드백을 남겨주시면<br>더 좋은 서비스를 만드는데에 사용하겠습니다.</h4>
        </div>
    </div>
  </template>
  
  <script>
  
  export default {
    name: "SurveyPage",
  }
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');
  
  * {
    font-family: 'Noto Sans KR', sans-serif;
  }

  .main-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.title {
    margin-top: 100px;
  font-size: 32px;
  font-weight: bold;
  color: #000;
  margin-bottom: 40px;
  line-height: 1.2;
  text-align: center;
}
  </style>