<template>
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
</template>

<script>
export default {
    props: {
        messages: {
            type: Array,
            required: true
        },
    },
    methods: {
        formatMessage(message) {
            return message.replace(/\n/g, '<br>');
        }
    }
}
</script>

<style scoped>
.message-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  width: 100%;
  max-width: 800px;
  max-height: 500px;
  margin: 0 auto;
  border-radius: 10px;
  margin-right: 80px;
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

</style>