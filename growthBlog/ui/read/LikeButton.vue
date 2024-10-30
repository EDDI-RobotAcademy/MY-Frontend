<template>
    <div class="like-button-container">
      <button 
        @click="handleLike"
        class="like-button"
        :class="{ 'liked': isLiked }"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          :fill="isLiked ? 'currentColor' : 'none'"
          stroke="currentColor" 
          class="like-icon"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" 
          />
        </svg>
        <span class="like-count">{{ likeCount }}</span>
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useLikeCountStore } from '@/likeCount/stores/likeCountStore'
  
  const props = defineProps({
    contentId: {
        type: Number,
        required: true
    },
    initialLikeCount: {
        type: Number,
        required: true
    },
    initialLikedState: {
        type: Boolean,
        required: true
    }   
});

  const likeCountStore = useLikeCountStore()
  const isLiked = ref(props.initialLikedState || false)
  const likeCount = ref(props.initialLikeCount || 0)
  
  const handleLike = async () => {
    try {
      const response = await likeCountStore.requestToggleLikeToDjango(props.contentId)
      
      if (response.success) {
        isLiked.value = response.liked

        if (!response.liked && likeCount.value === 0) {
            return
        }
        likeCount.value = isLiked.value ? likeCount.value + 1 : likeCount.value - 1
      } else {
        console.error('좋아요 처리 실패:', response.error)
        // 필요한 경우 사용자에게 에러 메시지 표시
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const fetchLikeCount = async () => {
    try {
        const currentLikeCount = await likeCountStore.requestLikeCountToDjango(props.contentId);
        likeCount.value = currentLikeCount;
    } catch (error) {
        console.error('Error fetching like count:', error);
    }
  }

  onMounted(async () => {
    await fetchLikeCount()
  })
  </script>

<style scoped>
.content-container {
  position: relative;
  max-width: 768px;
  margin: 0 auto;
  padding: 0 1rem;
}

.main-content {
  margin-right: 7rem; /* 좋아요 버튼 공간 확보 */
}

.like-widget {
  position: fixed;
  right: calc(50% - 384px - 6rem); /* 컨텐츠 영역의 오른쪽에 위치 */
  top: 12rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.like-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  border: none;
  background: white;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.like-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.like-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-bottom: 0.25rem;
  color: #12b886;
  transition: all 0.2s ease;
}

.like-count {
  font-size: 0.875rem;
  color: #495057;
  font-weight: 600;
}

.liked {
  .like-icon {
    color: #12b886;
    fill: #12b886;
  }
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .like-widget {
    position: fixed;
    right: 2rem;
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-right: 0;
  }

  .like-widget {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    top: auto;
  }
}
</style>