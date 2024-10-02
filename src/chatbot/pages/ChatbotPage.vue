<template>
  <div class="chatbot-container">
    <header class="chatbot-header">
      <h1>Chatbot</h1>
    </header>
    <main class="chatbot-main">
      <div class="message-container" ref="messageContainer">
        <div v-for="(message, index) in messages" :key="index" 
             :class="['message-row', message.isUser ? 'user-message' : 'bot-message']">
          <img :src="message.isUser ? require('@/assets/images/fixed/chatbot/user_avatar.png') : require('@/assets/images/fixed/chatbot/ai_avatar.jpg')"
               :alt="message.isUser ? 'User avatar' : 'Bot avatar'" 
               class="message-avatar">
          <div class="message-bubble">
            {{ message.text }}
          </div>
        </div>
      </div>
     
        <div class="input-wrapper">
          <input v-model="input" 
                 @keyup.enter="sendMessage"
                 placeholder="메시지를 입력하세요."
                 class="message-input" />
          <button @click="sendMessage" class="send-button">
            <i class="mdi mdi-send"></i>
          </button>
        </div>
 
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [],
      input: '',
      surveyData: null  // Add this to store survey data
    };
  },
  created() {
    // Access the surveyData from the router's state
      this.surveyData = history.state.surveyData;
      console.log("Received surveyData:", this.surveyData);
      
      // Dispatch the action to send the data to FastAPI
      const strategy = this.sendSurveyToFastAPI();
      console.log("Strategy:", strategy);
  },
  methods: {
    sendSurveyToFastAPI() {
      // Use the survey data to send to the API
      this.$store.dispatch('surveyInputModule/sendSurveyToFastAPI', this.surveyData);
    }
  }
}
</script>

<style scoped>
.chatbot-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: Arial, sans-serif;
}

.chatbot-header {
  background-color: white;
  color: #ff6033;
  padding: 1rem;
  text-align: center;
}

.chatbot-main {
  display: flex;
  background-color: white;
  flex-direction: column;
  flex-grow: 1;
  padding: 1rem;
}

.message-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  width: 100%;
  max-width: 1000px;
  max-height: 500px;
  margin: 0 auto;
  background-color: white;
  border-radius: 10px;
}

.message-container::-webkit-scrollbar {
  display: none;
}

.message-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.user-message {
  flex-direction: row-reverse;
  align-self: flex-end;
}

.bot-message {
  flex-direction: row;
  align-self: flex-start;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 10px;
  border: 2px solid transparent;
}

.message-bubble {
  padding: 0.75rem 1rem;
  border-radius: 20px;
  max-width: 70%;
  word-wrap: break-word;
}

.user-message .message-bubble {
  background-color: #ff6033;
  color: white;
  border-bottom-right-radius: 0;
}

.bot-message .message-bubble {
  background-color: #f1f1f1;
  color: black;
  border-bottom-left-radius: 0;
}

/* .input-container {
  display: flex;
  justify-content: center;
  width: 80%;
  max-width: 600px;
  margin: 0 auto;
  margin-top: auto;
} */

.input-wrapper {
  display: flex;
  align-items: center; /* 수직 정렬 */
  width: 80%;
  max-width: 600px;
  margin: 0 auto; /* 가운데 정렬 */
  border-radius: 20px; 
  padding: 0.5rem; 
}

.message-input {
  flex-grow: 1;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 20px;
  background-color: white;
}

.send-button {
  padding: 0.5rem 1rem;
  background-color: #414141;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.send-button:hover {
  background-color: #414141;
}

.message-input:focus + .send-button {
  background-color: #ff3700; /* 포커스 시 버튼 색상 */
}

</style>