<template>
    <div class="chat-container">
        <div v-if="!nickname" class="login-form">
            <h2>채팅</h2>
            <input v-model="inputNickname" placeholder="닉네임을 입력하세요." class="inputNickname" @keyup.enter="setNickname" />
            <button @click="setNickname" class="button">입장</button>
        </div>
        <div v-else class="chat-box">
            <div class="messages" ref="messageContainer">
                <div v-for="message in messages" :key="message.id" class="message"
                    :class="{ 'own-message': message.nickname === nickname }">
                    <div class="message-content">
                        <span class="sender">{{ message.nickname }}</span>
                        <p>{{ message.text }}</p>
                    </div>
                </div>
            </div>
            <div class="input-area">
                <input v-model="newMessage" @keyup.enter="sendMessage" class="input" />
                <button @click="sendMessage" class="button">전송</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref as dbRef, push, onChildAdded } from 'firebase/database';


export default {
    setup() {
        const config = useRuntimeConfig();
        const API_KEY = config.public.FIREBASE_API_KEY;
        const AUTH_DOMAIN = config.public.FIREBASE_AUTH_DOMAIN;
        const DATABASE_URL = config.public.FIREBASE_DATABASE_URL;
        const PROJECT_ID = config.public.FIREBASE_PROJECT_ID;
        const STORAGE_BUCKET = config.public.FIREBASE_STORAGE_BUCKET;
        const MESSAGING_SENDER_ID = config.public.FIREBASE_MESSAGING_SENDER_ID;
        const APP_ID = config.public.FIREBASE_APP_ID;

        const firebaseConfig = {
            apiKey: API_KEY,
            authDomain: AUTH_DOMAIN,
            databaseURL: DATABASE_URL,
            projectId: PROJECT_ID,
            storageBucket: STORAGE_BUCKET,
            messagingSenderId: MESSAGING_SENDER_ID,
            appId: APP_ID
        };
        const nickname = ref('');
        const inputNickname = ref('');
        const messages = ref([]);
        const newMessage = ref('');
        const messageContainer = ref(null);

        const app = initializeApp(firebaseConfig);
        const db = getDatabase(app);
        const messagesRef = dbRef(db, 'messages');

        const setNickname = () => {
            if (inputNickname.value.trim()) {
                nickname.value = inputNickname.value.trim();
            }
        };

        const sendMessage = () => {
            if (newMessage.value.trim() && nickname.value) {
                push(messagesRef, {
                    nickname: nickname.value,
                    text: newMessage.value.trim(),
                    timestamp: Date.now()
                });
                newMessage.value = '';
            }
        };

        const scrollToBottom = () => {
            nextTick(() => {
                if (messageContainer.value) {
                    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
                }
            });
        };

        onMounted(() => {
            const unsubscribe = onChildAdded(messagesRef, (snapshot) => {
                const message = snapshot.val();
                message.id = snapshot.key;
                messages.value.push(message);
                scrollToBottom();
            });

            onUnmounted(unsubscribe);
        });

        return {
            nickname,
            inputNickname,
            setNickname,
            messages,
            newMessage,
            sendMessage,
            messageContainer
        };
    }
};
</script>

<style scoped>
.chat-container {
    display: flex;
    flex-direction: column;
    height: 90%;
}

.login-form,
.chat-box {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.login-form {
    justify-content: center;
    align-items: center;
}

.login-form h2 {
    margin-bottom: 20px;
    color: #333;
}

.chat-box {
    flex: 1;
}

.messages {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    display: flex;
    flex-direction: column;
}

.message {
    margin-bottom: 10px;
    max-width: 70%;
}

.message-content {
    background-color: #000;
    border-radius: 18px;
    padding: 10px 15px;
    display: inline-block;
}

.own-message {
    align-self: flex-end;
}

.own-message .message-content {
    background-color: #0084ff;
    color: white;
}

.sender {
    font-weight: bold;
    font-size: 0.8em;
    margin-bottom: 5px;
    display: block;
}

.input-area {
    display: flex;
    margin-top: 10px;
}

.input {
    flex: 1;
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 10px;
    font-size: 16px;
}

.inputNickname {
    max-width: 150px;
    max-height: 50px;
    flex: 1;
    border: 1px solid #ccc;
    border-radius: 20px;
    margin-bottom: 20px;
    text-align: center;
    font-size: small;
}

.button {
    background-color: #0084ff;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    margin-left: 10px;
    cursor: pointer;
    font-size: 16px;
}

.button:hover {
    background-color: #0073e6;
}
</style>