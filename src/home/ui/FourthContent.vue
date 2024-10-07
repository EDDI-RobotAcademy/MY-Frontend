<template>
    <div class="fourth-content">
      <div class="content-wrapper">
        <h2 class="subtitle">Key Point # 3</h2>
        <h1 class="title">당신만을 위한 인플루언서 성장 로드맵을<br>PDF 형식으로 제공해드려요.</h1>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FourthContent'
  }
  </script>
  
  <style scoped>
  .fourth-content {
    background-color: #000000;
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
    color: #ffffff;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .title {
    font-size: 48px;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 40px;
    line-height: 1.2;
    text-align: center;
  }
  
  @media (max-height: 800px) {
    .fourth-content {
      height: auto;
      min-height: 100vh;
      padding: 80px 0;
    }
  }
  </style>
  