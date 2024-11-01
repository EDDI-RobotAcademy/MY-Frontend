<!-- SupportMessageContent.vue -->
<template>
    <div v-if="message" class="support-wrapper">
      <div class="support-card">
        <div class="message-content">
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    message: {
      type: String,
      required: true
    }
  })
  </script>
  
  <style scoped>
  .support-wrapper {
    padding: 24px;
    background-color: #000000;
  }
  
  .support-card {
    background-color: #121212;
    border-radius: 8px;
    border: 1px solid #333;
    overflow: hidden;
  }
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px;
  }
  
  .emoji {
    font-size: 20px;
  }
  
  .title {
    color: #ffffff;
    font-size: 18px;
    font-weight: 500;
    margin: 0;
  }
  
  .divider {
    height: 1px;
    background-color: #333;
  }
  
  .message-content {
    padding: 16px;
  }
  
  .message-content p {
    color: #e0e0e0;
    font-size: 16px;
    line-height: 1.6;
    margin: 0;
  }
  
  /* 호버 효과 */
  .support-card {
    transition: transform 0.2s ease;
  }
  
  .support-card:hover {
    transform: translateY(-2px);
  }
  </style>