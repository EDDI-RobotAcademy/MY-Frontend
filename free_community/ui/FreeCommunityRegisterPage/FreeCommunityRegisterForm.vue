<template>
  <form @submit.prevent>
    <div>
      <label for="writer">작성자:</label>
      <input id="writer" v-model="formData.writer" required>
    </div>
    <div>
      <label for="title">제목:</label>
      <input id="title" v-model="formData.title" required>
    </div>
    <div>
      <label for="content">내용:</label>
      <textarea id="content" v-model="formData.content" required></textarea>
    </div>
    <div>
      <label for="category">카테고리 ID:</label>
      <input id="category" :value="formData.category_id" readonly>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  formData: {
    writer: string;
    title: string;
    content: string;
    category_id: number | null;
  }
}>()

const emit = defineEmits<{
  (e: 'update:formData', data: any): void
}>()

const route = useRoute()
const localFormData = ref({ ...props.formData })

onMounted(() => {
  const categoryId = route.query.categoryId
  if (categoryId) {
    localFormData.value.category_id = parseInt(categoryId as string)
    emit('update:formData', localFormData.value)
  }
})

watch(localFormData, (newValue) => {
  emit('update:formData', newValue)
}, { deep: true })
</script>

<style scoped>
form>div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input,
textarea {
  width: 100%;
  padding: 8px;
}
</style>