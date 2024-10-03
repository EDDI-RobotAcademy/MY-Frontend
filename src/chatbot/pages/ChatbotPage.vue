<template>
  <div class="chatbot-container">
    <video ref="videoPlayer" class="fullscreen-video" :src="videoSource" autoplay muted loop playsinline
          @error="handleError"></video>
    <div class="content-overlay">
      <header class="chatbot-header">
        <h1>제공해주신 답변을 기반으로<br>당신의 성향에 대해 분석해봤어요!</h1>
      </header>
      <main class="chatbot-main">
        <div class="message-container" ref="messageContainer">
          <div v-for="(message, index) in messages" :key="index" 
               :class="['message-row', message.isUser ? 'user-message' : 'bot-message']">
            <img :src="message.isUser ? require('@/assets/images/fixed/chatbot/user_avatar.png') : require('@/assets/images/fixed/chatbot/ai_avatar.jpg')"
                 :alt="message.isUser ? 'User avatar' : 'Bot avatar'" 
                 class="message-avatar">
            <div v-if="message.isUser" class="message-bubble">
              {{ message.text }}
            </div>
            <div v-else class="message-bubble" v-html="formatMessage(message.text)">
            </div>
          </div>
        </div>
        <send-message/>
      </main>
    </div>
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
      videoSource: '/videos/survey-background.mp4',
      videoPlayer: null,
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
    handleError(event) {
      console.error('Video playback error:', event);
    },
    async sendSurveyToFastAPI() {
      try {
        const waitingMessageIndex = this.messages.push({ text: `성향 분석 중.. `, isUser: false }) - 1;
        const strategy = await this.$store.dispatch('surveyInputModule/sendSurveyToFastAPI', this.surveyData);
        console.log("Strategy:", strategy);
        this.fullResponse = strategy.generatedStrategy;

        this.messages.splice(waitingMessageIndex, 1);

        this.messages.push({ text: `📢 당신을 위한 맟춤형 인플루언서 성장 전략을 제공해드릴게요! \n\n${strategy.generatedStrategy}`, isUser: false });
      } catch (error) {
        console.error("FastAPI 요청 오류:", error);
      }
    },
    formatMessage(message) {
      return message.replace(/\n/g, '<br>');
    },
    // scrollToBottom() {
    //   const container = this.$refs.messageContainer;
    //   container.scrollTop = container.scrollHeight;
    // }

  }
}
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');

* {
  font-family: 'Noto Sans KR', sans-serif;
}

.chatbot-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.chatbot-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-top: 100px;
  max-width: 800px;
  width: 100%;
}

.chatbot-main {
  display: flex;
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
  background-color: #ff9033;
  color: white;
  border-bottom-right-radius: 0;
}

.bot-message .message-bubble {
  background-color: #f1f1f1;
  color: black;
  border-bottom-left-radius: 0;
}

.fullscreen-video {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.6);
}

</style>