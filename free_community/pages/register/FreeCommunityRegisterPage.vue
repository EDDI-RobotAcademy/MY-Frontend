<template>
  <div class="free_community-register">
    <FreeCommunityForm :formData="postData" @update:formData="updatePostData" />
    <RegisterButton :postData="postData" @registerSuccess="handleRegisterSuccess"
      @registerError="handleRegisterError" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import RegisterButton from '../../ui/FreeCommunityRegisterPage/FreeCommunityWriteButton.vue'
import FreeCommunityForm from '../../ui/FreeCommunityRegisterPage/FreeCommunityRegisterForm.vue'

const router = useRouter()

const postData = ref({
  writer: '',
  title: '',
  content: '',
  category_id: null as number | null
})

const updatePostData = (newData) => {
  postData.value = { ...newData }
}

const handleRegisterSuccess = (result) => {
  console.log('글 등록 성공:', result)
  // 성공 후 처리 (예: 목록 페이지로 이동)
}

const handleRegisterError = (error) => {
  console.error('글 등록 실패:', error)
  alert('글 등록에 실패했습니다.')
}
</script>

<style scoped>
.free_community-register {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
</style>