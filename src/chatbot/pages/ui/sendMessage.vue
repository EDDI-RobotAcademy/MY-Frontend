<template>
    <div class="input-wrapper">
      <input v-model="input"
             @keyup.enter="sendMessage"
             placeholder="메시지를 입력하세요."
             class="message-input" />
      <button @click="sendMessage" class="send-button">
        <i class="mdi mdi-send"></i>
      </button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        input: ''
      };
    },
    methods: {
        sendMessage() {
      if (this.input.trim()) {
        this.messages.push({ text: this.input, isUser: true });
        this.input = '';
        this.$nextTick(() => {
          this.scrollToBottom();
        });
        // 봇 응답 
        setTimeout(() => {
          this.messages.push({ text: "안녕하세요! 무엇을 도와드릴까요?", isUser: false });
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        }, 1000);
      }
    }
    }
  };
  </script>
  
  <style scoped>
  .input-wrapper {
    display: flex;
    align-items: center;
    width: 80%;
    max-width: 600px;
    margin: 0 auto;
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
    margin-left: 10px;
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
    background-color: #ff9033;
  }
  </style>
  