<template>
    <div class="summary-container" :style="{ textAlign: 'center' }">
      <h1>답변 내역 확인</h1>
      <div class="summary-grid">
        <div v-for="(question, index) in questions" :key="index" class="answer-item">
          <h3>{{ question.question_text }}</h3>
          <p>{{ question.answer }}</p>
        </div>
      </div>
      <div class="button-container">
        <button @click="backToQuestions" class="prev-button">← 이전</button>
        <button @click="submitSurvey" class="submit-button">제출</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SummaryComponent',
    props: {
      questions: {
        type: Array,
        required: true
      }
    },
    methods: {
      backToQuestions() {
        this.$emit('back-to-questions');
      },
      submitSurvey() {
        this.$emit('submit-survey');
      }
    }
  }
  </script>
  
  <style scoped>
  .summary-container {
    background-color: rgba(255, 255, 255, .5);
    padding: 20px;
    border-radius: 10px;
    text-align: center;
  }
  
  .summary-container h1 {
    font-size: 1.8rem;
    color: #000;
    margin-bottom: 10px;
  }
  
  .summary-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .answer-item {
    background-color: rgba(255, 255, 255, 0.8);
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .answer-item h3 {
    font-size: 1rem;
    color: #333;
    margin-bottom: 5px;
  }
  
  .answer-item p {
    font-size: 0.9rem;
    color: #666;
  }
  
  .button-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  
  button {
    margin: 0 20px;
    padding: 10px 20px;
    font-size: 1rem;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s;
  }
  
  button.submit-button {
    background-color: #ff9033;
    color: white;
  }
  
  button.prev-button {
    background-color: rgb(69, 69, 69);
    color: white;
  }
  
  button:hover {
    opacity: 0.8;
  }
  
  @media (max-width: 768px) {
    .summary-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>