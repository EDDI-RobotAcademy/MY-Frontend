<template>
    <div 
      class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6 
             transition-all duration-300 ease-in-out"
      role="alert"
    >
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg 
            class="h-5 w-5 text-red-500" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">
            {{ message }}
          </p>
          <slot name="details"></slot>
        </div>
        <div class="ml-auto pl-3">
          <div class="-mx-1.5 -my-1.5">
            <button
              v-if="dismissible"
              @click="$emit('dismiss')"
              class="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100
                     focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2
                     transition-all duration-200"
            >
              <span class="sr-only">닫기</span>
              <svg 
                class="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Props {
    message: string;
    dismissible?: boolean;
  }
  
  defineProps<Props>();
  defineEmits<{
    (e: 'dismiss'): void;
  }>();
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    @apply transition-all duration-300;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    @apply opacity-0 transform translate-y-2;
  }
  
  /* 애니메이션 효과 */
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
  
  /* 에러 메시지가 처음 나타날 때 shake 애니메이션 적용 */
  div[role="alert"] {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  }
  </style>