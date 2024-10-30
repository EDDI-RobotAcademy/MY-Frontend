<template>
    <div class="search-bar">
      <input 
        type="text" 
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      >
    </div>
  </template>
  
  <script setup>
  defineProps({
    modelValue: String,
    placeholder: {
      type: String,
      default: '검색어를 입력하세요'
    }
  });
  </script>
  
  <style scoped>
  .search-bar {
    margin-bottom: 40px;
  }
  
  .search-bar input {
    width: 100%;
    padding: 12px;
    border: 1px solid #eee;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .search-bar input::placeholder {
    color: #aaa;
  }
  </style>