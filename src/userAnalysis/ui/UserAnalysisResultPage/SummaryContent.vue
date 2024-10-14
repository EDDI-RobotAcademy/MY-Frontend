<template>
  <div class="summary-content">
    <div class="content-wrapper">
      <div class="profile-info">
        <img src="https://github.com/identicons/jasonlong.png" alt="Profile" class="profile-image" />
        <div class="info-container">
          <div class="name-and-button">
            <h1 class="profile-name">사용자</h1>
            <button :class="['subscribe-button', { 'subscribed': isSubscribed }]" @click="handleSubscribe">
              {{ isSubscribed ? '구독 중' : '구독' }}
            </button>
          </div>
          <p class="profile-stats">rmsdldy12@gmail.com · 구독자 123 · 동영상 123</p>
          <p class="channel-info">{{ summary }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SummaryContent',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      observer: null,
      isSubscribed: false,
      summary: this.data,
    }
  },
  methods: {
    handleSubscribe() {
      this.isSubscribed = !this.isSubscribed;
    }
  }
}
</script>

<style scoped>
.summary-content {
  background-color: #000000;
  padding: 20px;
  color: #ffffff;
  height: 100vh;
  display: flex;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 20%;
}

.profile-info {
  display: flex;
  align-items: center;
  width: 100%;
}

.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-right: 20px;
}

.info-container {
  flex-grow: 1;
}

.name-and-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.profile-name {
  font-size: 34px;
  font-weight: bold;
  margin: 0;
}

.profile-stats {
  font-size: 14px;
  color: #aaaaaa;
  margin-bottom: 8px;
}

.channel-info {
  font-size: 14px;
  margin-bottom: 4px;
}

.subscribe-button {
  background-color: #ffffff;
  color: #000000;
  padding: 8px 16px;
  border-radius: 9999px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.subscribe-button.subscribed {
  background-color: #333333;
  color: #ffffff;
}
</style>