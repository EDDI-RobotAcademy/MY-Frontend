<template>
    <div class="mypage-container">
        <div class="profile-section">
            <div class="tab-navigation">
                <button 
                    class="tab-button active"
                >
                    회원 정보
                </button>
                <button class="tab-button">
                    이용 내역
                </button>
                <button class="tab-button">
                    구독 관리
                </button>
            </div>
            
            <div class="profile-content">
                <div class="info-row">
                    <div class="info-label">이메일</div>
                    <div class="login-type-image">
                        <img :src="defaultProfile"/>
                    </div>
                    <div class="info-value disabled">
                        {{ userInfo.email }}
                    </div>
                </div>
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
                            {{ userInfo.nickname }}
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

                <div class="info-row">
                    <div class="info-label">회원 등급</div>
                    <div class="info-value">
                        {{ userInfo.membership }}
                    </div>
                </div>

                <div class="info-row">
                    <div class="info-label">이용 기간</div>
                    <div class="info-value">
                        {{ userInfo.usagePeriod || '-' }}
                    </div>
                </div>

                <div class="info-row">
                    <div class="info-label">이메일 알림</div>
                    <div class="info-value">
                        <div class="toggle-wrapper">
                            <input 
                                type="checkbox" 
                                id="emailNotification"
                                v-model="emailNotification"
                                class="toggle-input" 
                            />
                            <label for="emailNotification" class="toggle-label">
                                <span class="toggle-button"></span>
                            </label>
                        </div>
                        <span class="notification-description">공지사항 및 마케팅 정보 알림</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAccountStore } from '@/account/stores/accountStore'
import { useAuthenticationStore } from '@/authentication/stores/authenticationStore'
import cooingProfile from '~/assets/fixed/login/cooing_logo.png'
import kakaoProfile from '~/assets/fixed/login/kakao_login_round.png'
import googleProfile from '~/assets/fixed/login/google_login_round.png'


const accountStore = useAccountStore()
const authenticationStore = useAuthenticationStore()
const userInfo = ref({
    nickname: '',
    email: '',
    membership: '',
    usagePeriod: ''
})

const isEditing = ref(false)
const newNickname = ref('')
const hasError = ref(false)
const errorMessage = ref('')
const emailNotification = ref(false)
const defaultProfile = ref(cooingProfile);

const getLoginType = async () => {
    const response = await authenticationStore.requestAccountLoginType();
    
    if (response === 'GOOGLE') {
        defaultProfile.value = googleProfile;
    } else if (response === 'KAKAO') {
        defaultProfile.value = kakaoProfile;
    }
};

const isValidNickname = computed(() => {
    return newNickname.value.length >= 2 && newNickname.value.length <= 20
})

const getNickname = async () => {
    const response = await accountStore.requestGetUserProfileByUserTokenToDjango()
    userInfo.value = {
        nickname: response.nickname || 'None',
        email: response.email || 'None',
        membership: response.membership || 'None',
        usagePeriod: response.usagePeriod || '-'
    }
}

const startEditing = () => {
    newNickname.value = userInfo.value.nickname
    isEditing.value = true
    hasError.value = false
}

const handleSubmit = async () => {
    if (!isValidNickname.value) {
        hasError.value = true
        errorMessage.value = '닉네임은 2-20자 사이여야 합니다.'
        return
    }

    if (newNickname.value === userInfo.value.nickname) {
        hasError.value = true
        errorMessage.value = '현재 사용 중인 닉네임과 동일한 닉네임입니다.'
        return
    }

    try {
        const userToken = localStorage.getItem('userToken')
        await accountStore.requestchangeNicknameToDjango(newNickname.value, userToken)
        userInfo.value.nickname = newNickname.value
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

onMounted(() => {
    if (!authenticationStore.isAuthenticated) {
        router.push("/login")
    }
    getNickname(),
    getLoginType()
})
</script>

<style scoped>
.mypage-container {
    max-width: 1200px;
    margin:  100px auto;
    padding: 40px 20px;
    min-height: 100vh;
    background-color: #fff;
}

.profile-section {
    background: white;
    border-radius: 8px;
    width: 100%;
}

.tab-navigation {
    display: flex;
    border-bottom: 1px solid #e9ecef;
    margin-bottom: 40px;
}

.tab-button {
    padding: 16px 24px;
    font-size: 16px;
    color: #868e96;
    background: none;
    border: none;
    cursor: pointer;
    position: relative;
}

.tab-button.active {
    color: #ff9033;
    font-weight: 600;
}

.tab-button.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #ff9033;
}

.profile-content {
    max-width: 600px;
    margin: 0 auto;
}

.login-type-image {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 5px;
}

.login-type-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

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

.info-value.disabled {
    color: #adb5bd;
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

.toggle-wrapper {
    display: inline-block;
    vertical-align: middle;
}

.toggle-input {
    display: none;
}

.toggle-label {
    display: inline-block;
    width: 48px;
    height: 24px;
    background-color: #e9ecef;
    border-radius: 12px;
    position: relative;
    cursor: pointer;
    transition: background-color 0.2s;
}

.toggle-input:checked + .toggle-label {
    background-color: #ff9033;
}

.toggle-button {
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: transform 0.2s;
}

.toggle-input:checked + .toggle-label .toggle-button {
    transform: translateX(24px);
}

.notification-description {
    margin-left: 12px;
    color: #495057;
    font-size: 14px;
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