<template>
  <div class="analysis-content" ref="container">
    <div class="content-wrapper">
      <h2 class="main-title" ref="mainTitle">
        1. 입력 요약
      </h2>
      <div class="summary-container" ref="summary">
        <div v-for="(item, index) in formattedSummary" :key="index" class="summary-item"
          :style="{ animationDelay: `${index * 0.1}s` }">
          <div class="dot"></div>
          <div class="content">
            <div class="label">{{ item.key }}</div>
            <div class="value">{{ item.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import anime from 'animejs'

export default {
  name: 'SummaryContent',
  props: {
    data: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      observer: null,
      formattedSummary: []
    }
  },
  created() {
    this.formattedSummary = this.data.map(item => ({
      key: item.key,
      value: item.value
    }))
  },
  mounted() {
    this.setupIntersectionObserver()
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect()
    }
  },
  methods: {
    setupIntersectionObserver() {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateContent()
            this.observer.disconnect()
          }
        })
      }, { threshold: 0.1 })

      this.observer.observe(this.$refs.container)
    },
    animateContent() {
      anime.timeline({
        easing: 'easeOutExpo',
      })
        .add({
          targets: this.$refs.mainTitle,
          opacity: [0, 1],
          translateY: ['-30px', '0px'],
          duration: 800,
        })
        .add({
          targets: this.$refs.summary,
          opacity: [0, 1],
          duration: 600,
        }, '-=400')
    }
  }
}
</script>

<style scoped>
.analysis-content {
  background-color: #000000;
  padding: 100px 0 40px;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.main-title {
  font-size: 42px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 40px;
  text-align: center;
  opacity: 0;
}

.summary-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  opacity: 0;
}

.summary-item {
  background: rgba(32, 32, 35, 0.6);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
  width: fit-content;
  min-width: 200px;
  max-width: calc(33.333% - 8px);
  flex: 0 1 auto;
}

.dot {
  width: 8px;
  height: 8px;
  background: #4171FF;
  border-radius: 50%;
  margin-top: 8px;
  flex-shrink: 0;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  color: #94a3b8;
  font-size: 14px;
}

.value {
  color: #ffffff;
  font-size: 18px;
  font-weight: 500;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .analysis-content {
    padding: 80px 0 40px;
  }
  
  .main-title {
    font-size: 32px;
    margin-bottom: 30px;
  }
}

@media (max-width: 480px) {
  .summary-item {
    min-width: 100%;
    max-width: 100%;
  }
}
</style>
