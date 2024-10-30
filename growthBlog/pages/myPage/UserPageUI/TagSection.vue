<template>
    <div class="tags-section">
      <h2>{{ title }}</h2>
      <div class="tag-list">
        <a 
          v-for="tag in tags" 
          :key="tag.id"
          :href="tag.href" 
          class="tag"
        >
          {{ tag.name }} <span>({{ tag.count }})</span>
        </a>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    title: {
      type: String,
      default: 'SNS 목록'
    },
    tags: {
      type: Array,
      default: () => []
    }
  });
  </script>
  
  <style scoped>
  .tags-section {
    flex: 0 0 200px;
    padding: 20px 0;
  }
  
  .tags-section h2 {
    font-size: 16px;
    margin-bottom: 20px;
    font-weight: 500;
    padding-bottom: 20px;
    border-bottom: 1px solid #e9ecef;
  }
  
  .tag-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 20px;
  }
  
  .tag {
    text-decoration: none;
    color: #666;
    font-size: 14px;
  }
  
  .tag span {
    color: #888;
  }
  </style>