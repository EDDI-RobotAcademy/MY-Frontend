<template>
<button @click="$emit('toggle')" class="reply-toggle-btn">
    답글 {{ repliesCount }}개
</button>
</template>

<script setup lang="ts">
defineProps<{
repliesCount: number
}>()

defineEmits<{
(e: 'toggle'): void
}>()
</script>

<style scoped>
.reply-toggle-btn {
padding: 8px 16px;
border: none;
border-radius: 4px;
cursor: pointer;
background-color: #f8f9fa;
color: #212529;
margin-right: 8px;
}
</style>