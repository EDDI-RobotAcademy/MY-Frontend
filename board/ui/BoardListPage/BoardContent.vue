<template>
    <div class="board-content">
      <ul v-if="boardContents.length > 0" class="board-list">
        <li v-for="content in boardContents" :key="content.boardId" class="board-item">
          <div class="board-header">
            <h3>{{ content.title }}</h3>
            <div class="board-meta">
              <span>{{ content.profile_nickname }}</span>
              <span>{{ formatDate(content.regDate) }}</span>
              <span>{{ content.category_name }}</span>
            </div>
          </div>
        </li>
      </ul>
      <p v-else>게시글이 없습니다.</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useBoardStore } from '../../stores/boardStore'
  
  const boardStore = useBoardStore()
  const boardContents = ref([]);
  
  const fetchBoardContents = async () => {
    try {
      const response = await boardStore.getBoardContent()
      console.log("response 출력", response)
      boardContents.value = response.slice(0, 20);
    } catch (error) {
      console.error('게시글을 가져오는 중 오류 발생:', error)
    }
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
  
  onMounted(fetchBoardContents)
  </script>
  
  <style scoped>
  .board-content {
    padding: 20px;
  }
  .board-list {
    list-style-type: none;
    padding: 0;
  }
  .board-item {
    border-bottom: 1px solid #eee;
    padding: 15px 0;
  }
  .board-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .board-header h3 {
    margin: 0;
    color: #333;
    font-size: 1.1em;
  }
  .board-meta {
    display: flex;
    align-items: center;
    font-size: 0.9em;
    color: #666;
  }
  .board-meta span {
    margin-left: 15px;
  }
  .board-meta span:first-child {
    margin-left: 0;
  }
  </style>