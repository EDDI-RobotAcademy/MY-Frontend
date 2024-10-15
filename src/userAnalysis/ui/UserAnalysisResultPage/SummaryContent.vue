<template>
  <div class="summary-content" ref="container">
    <div class="content-wrapper">
      <h1 class="summary" ref="summary">
        <span v-for="(sentence, index) in formattedSummary" :key="index" class="sentence">
          {{ sentence }}
        </span>
      </h1>
    </div>
  </div>
</template>

<script>
import anime from 'animejs/lib/anime.es.js';

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
      summary: this.data,
    }
  },
  computed: {
    formattedSummary() {
      return this.summary.split('.').filter(sentence => sentence.trim() !== '').map(sentence => sentence.trim() + '.');
    }
  },
  mounted() {
    console.log("SummaryContent 출력", this.data);
    this.setupIntersectionObserver();
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    setupIntersectionObserver() {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateContent();
            this.observer.disconnect();
          }
        });
      }, { threshold: 0.1 });
      this.observer.observe(this.$refs.container);
    },
    animateContent() {
      anime.timeline({
        easing: 'easeOutExpo',
      })
        .add({
          targets: this.$refs.summary.querySelectorAll('.sentence'),
          opacity: [0, 1],
          translateY: ['-20px', '0px'],
          duration: 1000,
          delay: anime.stagger(350)
        });
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

.summary {
  font-size: 34px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 40px;
  line-height: 1.5;
  text-align: center;
}

.sentence {
  display: block;
  margin-bottom: 10px;
  opacity: 0;
}

@media (max-height: 800px) {
  .summary-content {
    height: auto;
    min-height: 100vh;
    padding: 80px 0;
  }
}
</style>