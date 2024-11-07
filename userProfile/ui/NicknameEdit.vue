<template>
    <div class="info-row">
        <div class="info-label">닉네임</div>
        <div class="info-value-group">
            <input 
                v-if="isEditing"
                v-model="newNickname"
                type="text"
                class="nickname-input"
                :class="{ 'error': hasError }"
            />
            <div v-else class="info-value">
                {{ currentNickname }}
            </div>
            <button 
                v-if="isEditing"
                @click="handleSubmit"
                class="action-button submit"
                :disabled="!isValidNickname"
            >
                변경
            </button>
            <button 
                v-else
                @click="startEditing"
                class="action-button edit"
            >
                변경
            </button>
        </div>
    </div>
    <p v-if="hasError" class="error-message">{{ errorMessage }}</p>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    currentNickname: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['updateNickname'])

const isEditing = ref(false)
const newNickname = ref('')
const hasError = ref(false)
const errorMessage = ref('')

const isValidNickname = computed(() => {
    return newNickname.value.length >= 2 && newNickname.value.length <= 20
})

const startEditing = () => {
    newNickname.value = props.currentNickname
    isEditing.value = true
    hasError.value = false
}

const handleSubmit = async () => {
    if (!isValidNickname.value) {
        hasError.value = true
        errorMessage.value = '닉네임은 2-20자 사이여야 합니다.'
        return
    }

    if (newNickname.value === props.currentNickname) {
        hasError.value = true
        errorMessage.value = '현재 사용 중인 닉네임과 동일한 닉네임입니다.'
        return
    }

    try {
        emit('updateNickname', newNickname.value)
        isEditing.value = false
        hasError.value = false
    } catch (error) {
        console.error('닉네임 업데이트 실패:', error)
        hasError.value = true
        if (error.response && error.response.data.error) {
            errorMessage.value = '이미 사용 중인 닉네임입니다.'
        } else {
            errorMessage.value = '닉네임 변경 중 오류가 발생했습니다.'
        }
    }
}
</script>

<style scoped>
.info-row {
    display: flex;
    padding: 24px 0;
    border-bottom: 1px solid #e9ecef;
}

.info-label {
    width: 120px;
    color: #495057;
    font-weight: 500;
}

.info-value-group {
    flex: 1;
    display: flex;
    gap: 12px;
    align-items: center;
}

.info-value {
    flex: 1;
    color: #495057;
}

.nickname-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.nickname-input:focus {
    outline: none;
    border-color: #ff9033;
}

.nickname-input.error {
    border-color: #ff6b6b;
}

.action-button {
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
}

.action-button.edit {
    background-color: white;
    border: 1px solid #ddd;
    color: #495057;
}

.action-button.submit {
    background-color: #ff9033;
    border: none;
    color: white;
}

.action-button.submit:disabled {
    background-color: #adb5bd;
    cursor: not-allowed;
}

.error-message {
    color: #ff6b6b;
    font-size: 14px;
    margin-top: 8px;
    padding-left: 120px;
}

@media (max-width: 768px) {
    .info-row {
        flex-direction: column;
        gap: 8px;
    }

    .info-label {
        width: 100%;
    }

    .error-message {
        padding-left: 0;
    }
}
</style>