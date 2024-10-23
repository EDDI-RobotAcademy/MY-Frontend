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
  router.push("/free_community/list")
}

const handleRegisterError = (error) => {
  console.error('글 등록 실패:', error)
  alert('글 등록에 실패했습니다.')
}
</script>

<style scoped>
.free_community-register {
  max-width: 600px;
  margin: 200px auto;
  padding: 20px;
}
</style>