<template>
    <v-btn color="red" @click="onClick" :loading="isLoading" class="youtube-login-btn">
        <v-icon left>mdi-youtube</v-icon>
        YouTube {{ isLoggedIn ? '로그아웃' : '로그인' }}
    </v-btn>
</template>

<script setup lang="ts">
const props = defineProps<{
    isLoading: boolean
    isLoggedIn: boolean
}>()

const emit = defineEmits<{
    (e: 'login'): void
    (e: 'logout'): void
}>()

const onClick = () => {
    if (props.isLoggedIn) {
        emit('logout')
    } else {
        emit('login')
    }
}
</script>

<style scoped>
.youtube-login-btn {
    background-color: #ff0000 !important;
    color: white !important;
}

.youtube-login-btn:hover {
    background-color: #cc0000 !important;
}
</style>