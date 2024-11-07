<template>
    <div class="reply-form">
      <textarea
        v-model="replyText"
        placeholder="답글을 작성해주세요"
        class="reply-input"
        :rows="2"
      ></textarea>
      <div class="reply-buttons">
        <button @click="submitReply" class="submit-btn">답글 작성</button>
        <button @click="$emit('cancel')" class="cancel-btn">취소</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const emit = defineEmits<{
    (e: 'submit', value: string): void
    (e: 'cancel'): void
  }>()
  
  const replyText = ref('')
  
  const submitReply = () => {
    if (!replyText.value.trim()) return
    emit('submit', replyText.value)
    replyText.value = ''
  }
  </script>
  
  <style scoped>
  .reply-form {
    margin: 10px 0 10px 40px;
  }
  
  .reply-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
    margin-bottom: 10px;
  }
  
  .reply-buttons {
    display: flex;
    gap: 10px;
  }
  
  .submit-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #ff9033;
    color: white;
  }
  
  .cancel-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #6c757d;
    color: white;
  }
  </style>