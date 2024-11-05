<template>
    <div class="chat-container">
        <div v-if="!nickname" class="login-form">
            <button @click="goToLoginPage" class="login-button">로그인</button>
        </div>
        <div v-else class="chat-box">
            <div class="messages" ref="messageContainer">
                <div v-for="message in messages" :key="message.id" class="message"
                    :class="{ 'own-message': message.nickname === nickname }">
                    <div class="message-content">
                        <span class="sender" @click="goToUserPage(message.nickname)" style="cursor: pointer;">
                            {{ message.nickname }}
                        </span>
                        <p>{{ message.text }}</p>
                        <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
                    </div>
                </div>
            </div>
            <div class="input-area">
                <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="메시지를 입력하세요..." class="input" />
                <button @click="sendMessage" class="button">전송</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { initializeApp } from 'firebase/app';
import {
    getDatabase,
    ref as dbRef,
    push,
    onChildAdded,
    set,
    onValue,
    query,
    orderByChild,
    limitToLast
} from 'firebase/database';

const router = useRouter();
const emit = defineEmits(['update-unread-count']);

const props = defineProps({
    nickname: {
        type: String,
        default: ''
    },
    isOpen: {
        type: Boolean,
        default: false
    }
});

const config = useRuntimeConfig();
const firebaseConfig = {
    apiKey: config.public.FIREBASE_API_KEY,
    authDomain: config.public.FIREBASE_AUTH_DOMAIN,
    databaseURL: config.public.FIREBASE_DATABASE_URL,
    projectId: config.public.FIREBASE_PROJECT_ID,
    storageBucket: config.public.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.public.FIREBASE_MESSAGING_SENDER_ID,
    appId: config.public.FIREBASE_APP_ID
};

const messages = ref([]);
const newMessage = ref('');
const messageContainer = ref(null);
const lastReadTimestamp = ref(Date.now());
const unreadCount = ref(0);
const isScrolledToBottom = ref(true);

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = dbRef(db, 'messages');
const lastReadRef = dbRef(db, `lastRead/${props.nickname}`);

const goToUserPage = (userNickname: string) => {
    router.push(`/growth-blog/my-page/${userNickname}`);
};

const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;

    const date = new Date(timestamp);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
};

const goToLoginPage = () => router.push("/login");

const checkScrollPosition = () => {
    const container = messageContainer.value;
    if (container) {
        const { scrollHeight, scrollTop, clientHeight } = container;
        isScrolledToBottom.value = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
    }
};

const scrollToBottom = () => {
    nextTick(() => {
        if (messageContainer.value && isScrolledToBottom.value) {
            messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
        }
    });
};

const updateLastRead = () => {
    if (props.nickname) {
        const now = Date.now();
        set(lastReadRef, now);
        lastReadTimestamp.value = now;
        unreadCount.value = 0;
        emit('update-unread-count', 0);
    }
};

const sendMessage = () => {
    if (newMessage.value.trim() && props.nickname) {
        push(messagesRef, {
            nickname: props.nickname,
            text: newMessage.value.trim(),
            timestamp: Date.now()
        });
        newMessage.value = '';
        isScrolledToBottom.value = true;
    }
};

watch(() => props.isOpen, (newValue) => {
    if (newValue) {
        updateLastRead();
        emit('update-unread-count', 0);
        nextTick(() => {
            scrollToBottom();
        });
    }
});

onMounted(() => {
    if (messageContainer.value) {
        messageContainer.value.addEventListener('scroll', checkScrollPosition);
    }

    onValue(lastReadRef, (snapshot) => {
        lastReadTimestamp.value = snapshot.val() || Date.now();
    });

    const messagesQuery = query(
        messagesRef,
        orderByChild('timestamp'),
        limitToLast(50)
    );

    const messageListener = onChildAdded(messagesQuery, (snapshot) => {
        const message = snapshot.val();
        message.id = snapshot.key;
        messages.value.push(message);

        scrollToBottom();

        if (!props.isOpen && message.nickname !== props.nickname && message.timestamp > lastReadTimestamp.value) {
            unreadCount.value++;
            emit('update-unread-count', unreadCount.value);
        }
    });

    onUnmounted(() => {
        if (messageListener) {
            messageListener();
        }
        if (messageContainer.value) {
            messageContainer.value.removeEventListener('scroll', checkScrollPosition);
        }
    });
});
</script>

<style scoped>
.chat-container {
    display: flex;
    flex-direction: column;
    height: 600px;
    max-height: 90vh;
    width: 100%;
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
    width: 100%;
}

.login-form {
    justify-content: center;
    align-items: center;
    max-height: 91vh;
}

.login-button {
    background-color: #ff9033;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 15px 40px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.login-button:hover {
    background-color: #e67f2c;
}

.chat-box {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.messages {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    display: flex;
    flex-direction: column;
}

.message-content {
    background-color: #F1F1F1;
    border-radius: 18px;
    padding: 10px 12px;
    margin-top: 14px;
    display: inline-block;
    font-size: 13px;
    color: black;
}

.own-message {
    align-self: flex-end;
}

.own-message .message-content {
    background-color: #ff9033;
    color: white;
}

.sender {
    font-weight: bold;
    font-size: 0.8em;
    margin-bottom: 5px;
    display: block;
}

.timestamp {
    font-size: 0.7em;
    color: #666;
    margin-top: 4px;
    display: block;
}

.own-message .timestamp {
    color: rgba(255, 255, 255, 0.8);
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

.button {
    background-color: #ff9033;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    margin-left: 10px;
    cursor: pointer;
    font-size: 12px;
}

.button:hover {
    background-color: #ffb04c;
}
</style>