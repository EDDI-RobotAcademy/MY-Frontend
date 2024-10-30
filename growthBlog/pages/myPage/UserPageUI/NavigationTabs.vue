<template>
    <nav class="navigation-tabs">
      <a 
        v-for="tab in tabs" 
        :key="tab.id"
        :href="tab.href" 
        :class="['tab', { active: tab.isActive }]"
      >
        {{ tab.label }}
      </a>
    </nav>
  </template>
  
  <script setup>
  defineProps({
    tabs: {
      type: Array,
      default: () => [
        { id: 1, label: '글', href: '#', isActive: true },
        { id: 2, label: '시리즈', href: '#', isActive: false },
        { id: 3, label: '소개', href: '#', isActive: false }
      ]
    }
  });
  </script>
  
  <style scoped>
  .navigation-tabs {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-bottom: 40px;
    border-bottom: 1px solid #eee;
  }
  
  .tab {
    text-decoration: none;
    color: #666;
    padding: 12px 0;
    position: relative;
  }
  
  .tab.active {
    color: #12b886;
  }
  
  .tab.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: #12b886;
  }
  </style>