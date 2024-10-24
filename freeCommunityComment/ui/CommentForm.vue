<template>
  <div class="comment-form">
    <textarea
      v-model="commentText"
      :placeholder="placeholder"
      class="comment-input"
      :rows="3"
    ></textarea>
    <button @click="submitComment" class="submit-btn">{{ submitButtonText }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  submitButtonText?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'submit', value: string): void
}>()

const commentText = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  commentText.value = newValue
})

const submitComment = () => {
  if (!commentText.value.trim()) return
  emit('submit', commentText.value)
  commentText.value = ''
}
</script>

<style scoped>
.comment-form {
  margin-bottom: 20px;
}

.comment-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  margin-bottom: 10px;
}

.submit-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #ff9033;
  color: white;
}
</style>
