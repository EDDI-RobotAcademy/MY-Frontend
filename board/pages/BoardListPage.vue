<template>
  <BoardAddCategoryButton>
  </BoardAddCategoryButton>
</template>

<script>
import BoardAddCategoryButton from '../ui/BoardAddCategoryButton.vue'

export default {
components: {
  BoardAddCategoryButton,
}
}
</script>

<style scoped>
.addCategory {
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
}

.addCategory__container {
text-align: center;
}

.addCategory__form {
margin-top: 10px;
}

.addCategory__button {
background-color: #4CAF50;
border: none;
color: white;
padding: 10px 20px;
text-align: center;
text-decoration: none;
display: inline-block;
font-size: 16px;
margin: 4px 2px;
cursor: pointer;
border-radius: 4px;
}

.addCategory__input {
padding: 10px;
margin-right: 10px;
font-size: 16px;
border: 1px solid #ddd;
border-radius: 4px;
}
</style>