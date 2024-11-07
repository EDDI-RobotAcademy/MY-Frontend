<template>
  <form @submit.prevent>
    <div>
      <label for="category">카테고리</label>
      <select id="category" v-model="selectedCategoryName" @change="handleCategoryChange" required class="form-input">
        <option value="">선택</option>
        <option v-for="category in filteredCategories" :key="category.categoryId" :value="category.name">
          {{ category.name }}
        </option>
      </select>
    </div>
    <div>
      <label for="title">제목</label>
      <input id="title" v-model="formData.title" required class="form-input">
    </div>
    <div>
      <label for="content">내용</label>
      <textarea id="content" v-model="formData.content" required class="form-input content-textarea"></textarea>
    </div>
    <div v-if="isAdmin">
      <label>
        <input type="checkbox" v-model="formData.is_notice" />
        공지글로 등록
      </label>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFreeCommunityStore } from '../../stores/freeCommunityStore'
import { useAuthenticationStore } from '@/authentication/stores/authenticationStore'

const props = defineProps<{
  formData: {
    title: string;
    content: string;
    category_id: number | null;
    is_notice: boolean;
  }
}>()

const emit = defineEmits<{
  (e: 'update:formData', data: any): void
}>()

const route = useRoute()
const freeCommunityStore = useFreeCommunityStore()
const localFormData = ref({ ...props.formData })
const categories = ref<any[]>([])
const selectedCategoryName = ref('')
const authenticationStore = useAuthenticationStore();
const isAdmin = computed(() => authenticationStore.isAdmin);

// 관리자가 아니면 공지 카테고리를 제외한 목록만 표시
const filteredCategories = computed(() => {
  return categories.value.filter(category => isAdmin.value || category.name !== '공지');
});

const handleCategoryChange = () => {
  const selectedCategory = categories.value.find(
    category => category.name === selectedCategoryName.value
  )
  if (selectedCategory) {
    localFormData.value.category_id = selectedCategory.categoryId
    emit('update:formData', localFormData.value)
  }
}

onMounted(async () => {
  try {
    const rawCategories = await freeCommunityStore.getCategories()
    
    categories.value = rawCategories.map(category => ({
      categoryId: category.categoryId,
      name: category.name
    }))

    const categoryId = route.query.category
    if (categoryId && categoryId !== 'null') {
      localFormData.value.category_id = parseInt(categoryId as string)
      const category = categories.value.find(
        c => c.categoryId === localFormData.value.category_id
      )
      if (category) {
        selectedCategoryName.value = category.name
      }
    } else {
      selectedCategoryName.value = ''
      localFormData.value.category_id = null
    }

    emit('update:formData', localFormData.value)
  } catch (error) {
    console.error('카테고리 데이터 로딩 중 에러:', error)
  }
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

select.form-input {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 8L2 4h8z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 30px;
}

select.form-input:focus {
  border-color: #ff8f33a3;
  border-width: 2px;
}
</style>
