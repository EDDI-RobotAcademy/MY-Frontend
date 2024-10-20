<template>
  <BoardAddCategoryButton>
  </BoardAddCategoryButton>
  <BoardCategoryListPage v-model="selectedCategoryId" ref="categoryList">
  </BoardCategoryListPage>
  <BoardWriteButton :selectedCategoryId="selectedCategoryId">
  </BoardWriteButton>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BoardAddCategoryButton from '../../ui/BoardAddCategoryButton.vue'
import BoardCategoryListPage from '../../ui/BoardCategoryListPage.vue'
import BoardWriteButton from '../../ui/BoardWriteButton.vue'

const selectedCategoryId = ref<number | null>(null)
const categoryList = ref<InstanceType<typeof BoardCategoryListPage> | null>(null)
</script>