<template>
  <div class="strategy-container" ref="container">
    <h1 class="main-title" ref="mainTitle">콘텐츠 전략</h1>
    <p class="subtitle" ref="subtitle">여행을 주제로 한 다양한 콘텐츠를 제작하세요!</p>
    <div class="content">
      <div v-for="(strategy, index) in strategies" :key="strategy.title" class="strategy-item" :ref="`strategy${index}`">
        <span class="emoji">{{ strategy.emoji }}</span>
        <div class="strategy-text">
          <h3>{{ strategy.title }}</h3>
          <p>{{ strategy.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import anime from 'animejs/lib/anime.es.js';

export default {
  name: 'StrategyContent',
  data() {
    return {
      strategies: [
        {
          emoji: '🌎',
          title: '여행 브이로그',
          description: '실제 여행 중의 모습과 경험을 자연스럽게 담아내며, 실용적인 팁과 정보를 제공합니다.'
        },
        {
          emoji: '✈️',
          title: '여행 팁 영상',
          description: '여행 준비물, 경비 절약 방법, 추천 여행지 등 실용적이고 유용한 정보를 나누어 구독자들에게 가치를 제공합니다.'
        },
        {
          emoji: '📷',
          title: '사진 편집 튜토리얼',
          description: '여행 중 찍은 사진을 활용하여 사진 편집 방법을 공유하며, 창의적인 콘텐츠로 팬들의 관심을 끌 수 있습니다.'
        },
        {
          emoji: '💬',
          title: 'Q&A 세션',
          description: '팬들과 소통하기 위해 여행 관련 질문을 받아 답변하는 라이브 방송을 진행하여 팬들과 친밀감을 높입니다.'
        },
        {
          emoji: '🏞️',
          title: '도전 영상',
          description: '새로운 여행지에서의 도전이나 미션을 설정하여 재미를 더하는 콘텐츠를 제작합니다.'
        }
      ]
    }
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
        easing: 'easeOutExpo'
      });

      timeline.add({
        targets: this.$refs.mainTitle,
        opacity: [0, 1],
        translateY: ['-30px', '0px'],
        duration: 500
      });

      timeline.add({
        targets: this.$refs.subtitle,
        opacity: [0, 1],
        translateY: ['-20px', '0px'],
        duration: 500
      }, '-=200');

      this.strategies.forEach((_, index) => {
        timeline.add({
          targets: this.$refs[`strategy${index}`],
          opacity: [0, 1],
          translateX: ['-30px', '0px'],
          duration: 600
        }, '-=400');
      });
    }
  }
}
</script>

<style scoped>
.strategy-container {
  background-color: black;
  padding: 20px;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 50px;
  align-items: center;
}

.main-title {
  text-align: center;
  font-size: 2em;
  margin-top: 50px;
  margin-bottom: 10px;
  color: white;
}

.subtitle {
  text-align: center;
  font-size: 1.2em;
  margin-bottom: 30px;
  color: white;
}

.content {
  display: flex;
  flex-direction: column;
  margin-top: 50px;
  margin-bottom: 50px;
  margin-left: 300px;
}

.strategy-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  color: white;
}

.emoji {
  font-size: 2em;
  margin-right: 10px;
  width: 40px;
  text-align: center;
}

.strategy-text {
  flex: 1;
}

h3 {
  margin: 0 0 5px 0;
}

p {
  margin: 0;
  font-size: 0.9em;
}
</style>
