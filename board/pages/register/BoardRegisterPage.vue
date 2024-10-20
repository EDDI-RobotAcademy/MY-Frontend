<template>
    <div class="board-register">
      <h1>글 등록</h1>
      <BoardForm 
        :initialData="postData"
        @update:formData="updatePostData" 
      />
      <RegisterButton :postData="postData" @register="registerPost" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useBoardStore } from '../../stores/boardStore'
  import RegisterButton from '../../ui/BoardRegisterPage/BoardWriteButton.vue'
  import BoardForm from '../../ui/BoardRegisterPage/BoardRegisterForm.vue'
  
  const router = useRouter()
  const boardStore = useBoardStore()
  
  const postData = ref({
    writer: '',
    title: '',
    content: '',
    category_id: null as number | null
  })
  
  const updatePostData = (newData) => {
    postData.value = { ...newData }
  }
  
  const registerPost = async (data: typeof postData.value) => {
    try {
      const result = await boardStore.registerPost(data)
      console.log('글 등록 성공:', result)
      // 성공 후 처리 (예: 목록 페이지로 이동)
    } catch (error) {
      console.error('글 등록 실패:', error)
      alert('글 등록에 실패했습니다.')
    }
  }
  </script>
  
  <style scoped>
  .board-register {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  </style>