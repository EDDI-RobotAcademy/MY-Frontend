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
      <send-message/>
    </main>
  </div>
</template>

<script>
import SendMessage from './ui/sendMessage.vue';
export default {
  components: {
    SendMessage
  },
  data() {
    return {
      messages: [],
      surveyData: null,  // 설문 데이터 저장
    };
  },
  created() {
    // router에서 설문 데이터 받아오기
      this.surveyData = history.state.surveyData;
      console.log("Received surveyData:", this.surveyData);

      this.sendSurveyToFastAPI();
  },
  methods: {
    async sendSurveyToFastAPI() {
      try{
        const strategy = await this.$store.dispatch('surveyInputModule/sendSurveyToFastAPI', this.surveyData);
        console.log("Strategy:", strategy);
        this.fullResponse = strategy.generatedStrategy;

        // 응답 받은 성장 전략을 챗봇 메세지에 출력
        this.messages.push({ text: `성장 전략: ${strategy.generatedStrategy}`, isUser: false });
      } catch (error) {
        console.error("FastAPI 요청 오류:", error);
      }
    },
    // scrollToBottom() {
    //   const container = this.$refs.messageContainer;
    //   container.scrollTop = container.scrollHeight;
    // }

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
  padding: 3rem;
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

</style>