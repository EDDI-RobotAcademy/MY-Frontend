<template>
  <router-link :to="{ name: 'FreeCommunityListPage' }">
    <button class="btn btn-back">취소</button>
    </router-link>
</template>

<style scoped>
button {
  margin-right: 10px;
  background-color: #c9c9c9;
  border-radius: 4px;
  color: white;
  padding: 8px 20px 10px 20px;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #a4a4a4;
}
</style>
