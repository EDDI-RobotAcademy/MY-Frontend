<template>
  <form @submit.prevent>
    <div>
      <label for="title">제목</label>
      <input id="title" v-model="formData.title" required class="form-input">
    </div>
    <div>
      <label for="content">내용</label>
      <textarea id="content" v-model="formData.content" required class="form-input content-textarea"></textarea>
    </div>
    <div>
      <label for="category">카테고리 ID</label>
      <input id="category" :value="formData.category_id" readonly>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  formData: {
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
  }
  
  emit('update:formData', localFormData.value)
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
  font-weight: bold;
  font-size: large;
  display: block;
  margin-bottom: 10px;
}

input,
textarea {
  width: 100%;
  padding: 8px;
}

.form-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  background-color: #f4f4f4;
  outline: none;
}

.form-input:focus {
  border-color: #ff8f33a3;
  border-width: 2px;
  border-radius: 4px;
}

.content-textarea {
  width: 100%;
  height: 200px;
  resize: vertical;
  min-height: 100px;
  border-radius: 4px;
  border: 1px solid #e1e1e1;
  background-color: #f4f4f4;
  outline: none;
}

.content-textarea:focus {
  border-color: #ff8f33a3;
  border-width: 2px;
  border-radius: 4px;
}

.readonly-input {
  background-color: #f0f0f0;
  cursor: default;
}

.readonly-input:focus {
  border-color: #ccc;
  box-shadow: none;
}
</style>
