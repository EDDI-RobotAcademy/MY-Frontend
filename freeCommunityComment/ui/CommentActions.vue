<template>
    <div class="comment-actions">
      <template v-if="isOwner">
        <button @click="$emit('edit')" class="action-btn">수정</button>
        <button @click="$emit('delete')" class="action-btn delete">삭제</button>
      </template>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    isOwner: boolean
  }>()
  
  defineEmits<{
    (e: 'edit'): void
    (e: 'delete'): void
  }>()
  </script>
  
  <style scoped>
  .comment-actions {
    display: flex;
    gap: 8px;
  }
  
  .action-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #f8f9fa;
    color: #212529;
  }
  
  .action-btn.delete {
    color: #dc3545;
  }
  </style>