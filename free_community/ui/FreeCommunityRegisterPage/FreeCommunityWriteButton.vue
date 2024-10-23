<template>
  <button @click="register" :disabled="!isValid">글 등록</button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFreeCommunityStore } from '../../stores/free_communityStore'

const free_communityStore = useFreeCommunityStore()

const props = defineProps<{
  postData: {
    writer: string;
    title: string;
    content: string;
    category_id: number | null;
  }
}>()

const emit = defineEmits<{
  (e: 'registerSuccess', data: any): void;
  (e: 'registerError', error: any): void;
}>()

const isValid = computed(() => {
  const { writer, title, content, category_id } = props.postData
  return writer && title && content && category_id !== null
})

const register = async () => {
  if (isValid.value) {
    const userToken = localStorage.getItem("userToken")
    if (!userToken) {
      emit('registerError', new Error('사용자 인증 정보가 없습니다.'))
      return
    }

    try {
      const postDataWithToken = {
        ...props.postData,
        userToken
      }
      const result = await free_communityStore.registerPost(postDataWithToken)
      emit('registerSuccess', result)
    } catch (error) {
      emit('registerError', error)
    }
  }
}
</script>

<style scoped>
button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>