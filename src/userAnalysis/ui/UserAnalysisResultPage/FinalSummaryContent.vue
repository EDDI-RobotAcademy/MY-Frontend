<template>
  <div class="about-page-wrapper">
    <div class="about-page">
      <h1 class="about-title">총정리</h1>
      <div class="image-container">
        <img :src="require(`@/assets/images/fixed/FinalSummaryContent/${imageName}`)" alt="Summary Image"
          class="centered-image">
      </div>
      <div class="content" ref="content">
        <div v-for="(card, index) in cards" :key="index" class="card-container" :ref="`cardContainer-${index}`"
          @mouseenter="onMouseEnter($event, index)" @mouseleave="onMouseLeave($event, index)">
          <div class="card" :ref="`card-${index}`">
            <div class="card-content">
              <h3>{{ card.title }}</h3>
              <p class="period" v-if="card.period">{{ card.period }}</p>
              <div class="description-container">
                <p class="description">{{ card.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import anime from 'animejs/lib/anime.es.js';

export default {
  name: 'FinalSummaryContent',
  props: {
    surveyData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      observer: null,
      animationCompleted: false
    };
  },
  computed: {
    imageName() {
      const inputSummary = this.surveyData.generatedStrategy.match(/1\. 입력 요약:[\s\S]*?(?=\n\n)/);
      const totalSummary = this.surveyData.generatedStrategy.match(/5\. 총정리:[\s\S]*?$/);

      let gender = '남자'; // Default to male
      if (inputSummary && inputSummary[0].includes('여성')) {
        gender = '여자';
      }

      const keywords = ['여행', '음악', '운동', '음식'];
      let matchedKeyword = '';

      if (totalSummary) {
        for (const keyword of keywords) {
          if (totalSummary[0].includes(keyword)) {
            matchedKeyword = keyword;
            break;
          }
        }
      }

      return matchedKeyword ? `${gender}_${matchedKeyword}.webp` : `${gender}.webp`;
    },
    cards() {
      const generatedStrategy = this.surveyData.generatedStrategy;
      const summarySection = generatedStrategy.match(/5\. 총정리:[\s\S]*?$/);

      if (!summarySection) return [];

      const items = summarySection[0].match(/\d️.*?(?=\d️|$)/gs) || [];

      return items.map(item => {
        const [titleWithEmoji, content] = item.split(':');
        const [title, period] = titleWithEmoji.split(/\s*\(([^)]+)\)\s*$/);
        return {
          title: title.replace(/^\d️\s*/, '').trim().replace(/\*\*/g, ''),
          period: period ? period.trim() : '',
          content: content ? content.trim().replace(/\*\*/g, '') : ''
        };
      });
    }
  },
  mounted() {
    this.setupIntersectionObserver();
    this.initializeCardPositions();
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    setupIntersectionObserver() {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };

      this.observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !this.animationCompleted) {
          this.animateCards();
          this.animationCompleted = true;
        }
      }, options);

      this.observer.observe(this.$refs.content);
    },
    initializeCardPositions() {
      this.$nextTick(() => {
        this.cards.forEach((_, index) => {
          if (this.$refs[`card-${index}`] && this.$refs[`card-${index}`][0]) {
            const card = this.$refs[`card-${index}`][0];
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
          }
        });
      });
    },
    animateCards() {
      const timeline = anime.timeline({
        easing: 'easeOutQuad',
        duration: 250
      });

      this.cards.forEach((_, index) => {
        if (this.$refs[`card-${index}`] && this.$refs[`card-${index}`][0]) {
          timeline.add({
            targets: this.$refs[`card-${index}`][0],
            translateY: [50, 0],
            opacity: [0, 1],
            delay: index * 100
          });
        }
      });
    },
    onMouseEnter(event, index) {
      if (this.$refs[`card-${index}`] && this.$refs[`card-${index}`][0]) {
        anime({
          targets: this.$refs[`card-${index}`][0],
          scale: 1.1,
          translateY: -10,
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
          duration: 150,
          easing: 'easeOutQuad'
        });
      }
    },
    onMouseLeave(event, index) {
      if (this.$refs[`card-${index}`] && this.$refs[`card-${index}`][0]) {
        anime({
          targets: this.$refs[`card-${index}`][0],
          scale: 1,
          translateY: 0,
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          duration: 300,
          easing: 'easeOutQuad'
        });
      }
    }
  }
}
</script>

<style scoped>
.about-page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #000;
}

.about-page {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  width: 100%;
  padding-top: 80px;
}

.about-title {
  color: #fff;
  text-align: center;
  font-size: 2.5em;
  margin-bottom: 30px;
  margin-top: 50px;
}

.image-container {
  text-align: center;
  margin-bottom: 30px;
}

.centered-image {
  max-width: 20%;
  border-radius: 50%;
  height: auto;
}

.content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.card-container {
  width: calc(20% - 16px);
  min-height: 300px;
}

.card {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  min-height: 170px;
}

.card-content {
  display: flex;
  flex-direction: column;
}

h3 {
  color: #34495e;
  font-size: 1em;
  text-align: center;
  margin-bottom: 5px;
  flex-shrink: 0;
}

.period {
  color: rgba(102, 102, 102, 0.7);
  font-size: 0.7em;
  text-align: center;
  margin-bottom: 15px;
  flex-shrink: 0;
}

.description-container {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.description {
  color: #666;
  line-height: 1.3;
  font-size: 0.9em;
  text-align: center;
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

@media (max-width: 1200px) {
  .card-container {
    width: calc(33.33% - 13.33px);
  }
}

@media (max-width: 768px) {
  .card-container {
    width: calc(50% - 10px);
  }

  .centered-image {
    max-width: 70%;
  }
}

@media (max-width: 480px) {
  .card-container {
    width: 100%;
  }

  .centered-image {
    max-width: 90%;
  }
}
</style>