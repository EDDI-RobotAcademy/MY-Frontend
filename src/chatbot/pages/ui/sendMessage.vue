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
          // Emit the 'sendMessage' event to the parent component
          this.$emit('sendMessage', this.input);
          this.input = '';  // Clear the input field after sending the message
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
    background-color: #ff3700;
  }
  </style>
  