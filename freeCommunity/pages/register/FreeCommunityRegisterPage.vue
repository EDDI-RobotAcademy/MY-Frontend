<template>

  <div class="free-community-register">
    <FreeCommunityForm :formData="postData" @update:formData="updatePostData" />
    <CancelButton/>
    <RegisterButton :postData="postData" @registerSuccess="handleRegisterSuccess"
      @registerError="handleRegisterError" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import RegisterButton from '../../ui/FreeCommunityRegisterPage/FreeCommunityWriteButton.vue'
import CancelButton from '../../ui/FreeCommunityRegisterPage/FreeCommunityCancelButton.vue'
import FreeCommunityForm from '../../ui/FreeCommunityRegisterPage/FreeCommunityRegisterForm.vue'

const router = useRouter()

const postData = ref({
  title: '',
  content: '',
  category_id: null as number | null
})

const updatePostData = (newData) => {
  postData.value = { ...newData }
}

const handleRegisterSuccess = (result) => {
  
  
  router.push({
    path: "/free-community/list",
    query: { category: postData.value.category_id }
  })
}

const handleRegisterError = (error) => {
  console.error('글 등록 실패:', error)
  alert('글 등록에 실패했습니다.')
}
</script>

<style scoped>
.free-community-register {
  max-width: 600px;
  margin: 100px 100px 100px 400px;
  padding: 40px 60px 40px 60px;
  border-radius: 4px;
  background-color: #f8f8f8
}
</style>
