<template>
    <div>
      <h1>글 등록</h1>
      <p>선택된 카테고리 ID: {{ categoryId }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const categoryId = ref<string | null>(null)
  
  onMounted(() => {
    categoryId.value = route.query.categoryId as string
    console.log(`선택된 카테고리 ID: ${categoryId.value}`)
  })
  </script>