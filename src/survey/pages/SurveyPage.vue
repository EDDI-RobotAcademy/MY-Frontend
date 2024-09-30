<template>
    <div class="survey-container">
      <h1>당신이 어떤 성향인지 알고싶어요.<br>다음 질문들에 답변해주세요!</h1>
      <div v-for="(question, index) in questions" :key="index" :ref="'question-' + index" :class="{ 'answered': question.answered }">
        <h2>{{ question.text }}</h2>
        <div class="options">
          <label v-for="(option, optionIndex) in 5" :key="optionIndex">
            <input
              type="radio"
              :name="'question-' + index"
              :value="option"
              v-model="question.answer"
              @change="answerQuestion(index)"
            >
            <span class="radio-button"></span>
          </label>
        </div>
        <div class="labels">
        <span>그렇다</span>
        <span>그렇지 않다</span>
      </div>
    </div>
    <div class="submit-button-container">
      <button @click="submitSurvey" :disabled="!allQuestionsAnswered" class="submit-button">제출하기</button>
    </div>
  </div>
</template>
  
  <script>
  export default {
    data() {
      return {
        questions: [
          { text: "주기적으로 새로운 친구를 사귄다.", answer: null, answered: false },
          { text: "단순하고 직관적인 아이디어보다는 복잡하고 참신한 아이디어에 흥미를 느낀다.", answer: null, answered: false },
          { text: "주기적으로 새로운 친구를 사귄다.", answer: null, answered: false },
          { text: "단순하고 직관적인 아이디어보다는 복잡하고 참신한 아이디어에 흥미를 느낀다.", answer: null, answered: false },
          { text: "주기적으로 새로운 친구를 사귄다.", answer: null, answered: false },
          { text: "단순하고 직관적인 아이디어보다는 복잡하고 참신한 아이디어에 흥미를 느낀다.", answer: null, answered: false },
          { text: "주기적으로 새로운 친구를 사귄다.", answer: null, answered: false },
          { text: "단순하고 직관적인 아이디어보다는 복잡하고 참신한 아이디어에 흥미를 느낀다.", answer: null, answered: false },
          { text: "주기적으로 새로운 친구를 사귄다.", answer: null, answered: false },
          { text: "단순하고 직관적인 아이디어보다는 복잡하고 참신한 아이디어에 흥미를 느낀다.", answer: null, answered: false },
          { text: "주기적으로 새로운 친구를 사귄다.", answer: null, answered: false },
          { text: "단순하고 직관적인 아이디어보다는 복잡하고 참신한 아이디어에 흥미를 느낀다.", answer: null, answered: false },
        ],
        showWarning: false
      };
    },
    computed: {
        allQuestionsAnswered() {
            return this.questions.every(q => q.answered);
        }
    },
    methods: {
        answerQuestion(index) {
            this.questions[index].answered = true;
        },
        submitSurvey() {
            console.log("Survey submitted:", this.questions);
            // API 호출 등을 통해 서버에 데이터를 전송하는 로직 구현 예정
        }
    }
  }

  </script>
  
  <style scoped>
  .survey-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px;
  }
  
  h1 {
    text-align: center;
    font-size: 2.5rem;
    color: #333;
    margin-top: 40px;
    margin-bottom: 60px;
  }
  
  .answered {
    opacity: 0.5;
  }
  
  .options {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
  }

  .option-label {
    display: inline-block;
    position: relative;
    cursor: pointer;
}
  
  .labels {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #666;
    margin-bottom: 50px;
  }
  
  input[type="radio"] {
    display: none;
  }
  
  .radio-button {
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 2px solid #ccc;
    border-radius: 50%;
    position: relative;
    transition: all 0.3s ease;
}

.radio-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #ff9033;
  transition: all 0.3s ease;
}

input[type="radio"]:checked + .radio-button {
  border-color: #ff9033;
}

input[type="radio"]:checked + .radio-button::after {
  transform: translate(-50%, -50%) scale(1);
}

  .submit-button-container {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    margin-bottom: 30px;
    }   

  .submit-button {
    background-color: #ff9033;
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    cursor: pointer;
    transition: background-color 0.3s ease, opacity 2s ease;
    margin-top: 30px;
    border-radius: 30px;
    font-weight: bold;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>