<template>
  <div class="chat-button-container">
    <button @click="toggleChat" class="chat-button" :class="{ 'active': isOpen }">
      <div class="chat-button-content">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chat-icon">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <div v-if="unreadCount > 0" class="notification-badge">
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </div>
      </div>
    </button>

    <Transition name="slide">
      <div v-if="isOpen" class="chat-panel">
        <FreeCommunityChatForm :nickname="nickname" :isOpen="isOpen" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref as dbRef,
  onChildAdded,
  onValue,
  query,
  orderByChild,
  limitToLast,
  set
} from 'firebase/database';
import FreeCommunityChatForm from './FreeCommunityChatForm.vue';

const props = defineProps({
  nickname: {
    type: String,
    required: true
  }
});

const isOpen = ref(false);
const unreadCount = ref(0);
const lastReadTimestamp = ref(Date.now());

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = dbRef(db, 'messages');
const lastReadRef = dbRef(db, `lastRead/${props.nickname}`);

// 마지막 읽은 시간 업데이트
const updateLastRead = () => {
  if (props.nickname) {
    const now = Date.now();
    set(lastReadRef, now);
    lastReadTimestamp.value = now;
    unreadCount.value = 0;
  }
};

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    updateLastRead();
  }
};

const handleClickOutside = (event: MouseEvent) => {
  const chatPanel = document.querySelector('.chat-panel');
  const chatButton = document.querySelector('.chat-button');

  if (isOpen.value && chatPanel && chatButton) {
    if (!chatPanel.contains(event.target as Node) && !chatButton.contains(event.target as Node)) {
      isOpen.value = false;
    }
  }
};

onMounted(() => {
  // Firebase 관련 설정
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

    if (!isOpen.value &&
      message.nickname !== props.nickname &&
      message.timestamp > lastReadTimestamp.value) {
      unreadCount.value++;
    }
  });

  // 클릭 이벤트 리스너 등록
  document.addEventListener('click', handleClickOutside);

  // 컴포넌트가 언마운트될 때 이벤트 리스너와 Firebase 리스너 제거
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    if (messageListener) {
      messageListener();
    }
  });
});
</script>

<style scoped>
.chat-button-container {
  position: fixed;
  right: 0;
  bottom: 20px;
  z-index: 1000;
}

.chat-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #ff9033;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1001;
}

.chat-button:hover {
  transform: scale(1.05);
  background-color: #ffb04c;
}

.chat-button.active {
  background-color: #ffb04c;
}

.chat-button-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-badge {
  position: absolute;
  top: -16px;
  right: -12px;
  background-color: #ff4444;
  color: white;
  border-radius: 12px;
  padding: 0 6px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1002;
}

.chat-panel {
  position: fixed;
  bottom: 100px;
  right: 24px;
  width: 380px;
  height: 600px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.chat-icon {
  color: white;
  width: 24px;
  height: 24px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>