<template>
  <div class="chat-button-container">
    <button @click="toggleChat" class="chat-button" :class="{ 'active': isOpen }">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chat-icon">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </button>

    <Transition name="slide">
      <div v-if="isOpen" class="chat-panel">
        <ChatComponent :nickname="nickname"/>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatComponent from '../BoardListPage/BoardChatForm.vue'

const props = defineProps({
  nickname: {
    type: String,
    required: true
  }
})

const isOpen = ref(false)

const toggleChat = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.chat-button-container {
  position: fixed;
  right: 0;
  bottom: 20px;
  z-index: 1000;
}

.chat-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #0084ff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1001;
}

.chat-button:hover {
  transform: scale(1.05);
  background-color: #0073e6;
}

.chat-button.active {
  background-color: #0073e6;
}

.chat-panel {
  position: fixed;
  bottom: 100px;
  right: 24px;
  width: 380px;
  height: 600px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.7);
  overflow: hidden;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.chat-icon {
  color: white;
  width: 24px;
  height: 24px;
}
</style>