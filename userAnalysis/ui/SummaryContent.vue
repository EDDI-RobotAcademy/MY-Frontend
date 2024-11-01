<template>
  <div class="summary-content" ref="container">
    <div class="content-wrapper">
      <h2 class="main-title" ref="mainTitle">
        {{ title }}<br><br>
      </h2>
      <div class="summary" ref="summary">
        <div v-for="(item, index) in formattedSummary" 
             :key="index" 
             class="summary-item">
          {{ item.key }}: {{ item.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import anime from 'animejs';

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
      title: '1. 입력 요약',
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
      const timeline = anime.timeline({
        easing: 'easeOutExpo',
      })

      timeline
        .add({
          targets: this.$refs.mainTitle,
          opacity: [0, 1],
          translateY: ['-30px', '0px'],
          duration: 500,
        })
        .add({
          targets: this.$refs.summary,
          opacity: [0, 1],
          translateY: ['-20px', '0px'],
          duration: 1000,
          delay: 0
        })
    },
  }
}
</script>

<style scoped>
.summary-content {
  background-color: #000000;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 80px 0;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.main-title {
  font-size: 32px;
  color: #ffffff;
  margin-bottom: 20px;
  text-align: center;
  opacity: 0;
}

.summary {
  opacity: 0;
}

.summary-item {
  font-size: 34px;
  font-weight: 400;
  color: #ffffff;
  margin-bottom: 30px;
  line-height: 1.4;
  text-align: center;
}

@media (max-height: 800px) {
  .summary-content {
    height: auto;
    min-height: 100vh;
    padding: 80px 0;
  }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 28px;
  }

  .summary-item {
    font-size: 24px;
    margin-bottom: 20px;
  }
}
</style>