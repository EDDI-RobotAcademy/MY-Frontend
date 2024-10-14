<template>
  <div class="strategy-container" ref="container">
    <h1 class="main-title" ref="mainTitle">콘텐츠 전략</h1>
    <p class="subtitle" ref="subtitle">{{ contentStrategySubtitle }}</p>
    <div class="content">
      <div v-for="(strategy, index) in filteredStrategies" :key="index" class="strategy-item"
        :ref="el => { if (el) strategyRefs[index] = el }">
        <div class="emoji-container">
          <span class="emoji">{{ strategy.emoji }}</span>
        </div>
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
  props: {
    rawStrategies: {
      type: String,
      required: true
    }
  },
  computed: {
    filteredStrategies() {
      return this.parsedStrategies.slice(1, -1);
    },
    contentStrategySubtitle() {
      const firstStrategy = this.parsedStrategies[0];
      return firstStrategy ? `${firstStrategy.emoji} ${firstStrategy.title}` : '';
    }
  },
  data() {
    return {
      parsedStrategies: [],
      strategyRefs: []
    }
  },
  mounted() {
    this.parseContentStrategy();
    this.setupIntersectionObserver();
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    parseContentStrategy() {
      const lines = this.rawStrategies.split('\n').filter(line => line.trim() !== '');

      this.parsedStrategies = lines.map(line => {
        line = line.replace(/^[*-]\s*/, '').trim();

        const emojiRegex = /^(\p{Emoji}(\u200D\p{Emoji})*)/u;
        const emojiMatch = line.match(emojiRegex);
        const emoji = emojiMatch ? emojiMatch[1] : '';
        let remainingText = emojiMatch ? line.slice(emojiMatch[0].length).trim() : line;

        remainingText = remainingText.replace(/\*/g, '').trim();

        const titleMatch = remainingText.match(/^(.+?):\s*(.+)$/);
        let title = '';
        let description = '';
        if (titleMatch) {
          title = titleMatch[1].trim();
          description = titleMatch[2].trim();
        } else {
          title = remainingText;
        }

        return { emoji, title, description };
      });
    },
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
      const timeline = anime.timeline({
        easing: 'easeOutExpo'
      });

      timeline.add({
        targets: this.$refs.mainTitle,
        opacity: [0, 1],
        translateY: ['-30px', '0px'],
        duration: 800
      }).add({
        targets: this.$refs.subtitle,
        opacity: [0, 1],
        translateY: ['-20px', '0px'],
        duration: 800
      }, '-=400');

      this.strategyRefs.forEach((el, index) => {
        timeline.add({
          targets: el,
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
  background-color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.main-title {
  text-align: center;
  font-size: 2.5em;
  margin-bottom: 20px;
  color: #000;
}

.subtitle {
  text-align: center;
  font-size: 1.2em;
  margin-bottom: 40px;
  color: #000;
}

.content {
  display: flex;
  justify-content: center;
  gap: 20px;
  max-width: 100%;
  overflow-x: auto;
  padding: 20px 0;
}

.strategy-item {
  width: 245px;
  height: 245px;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: #2a2a2a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  font-size: 24px;
}

.emoji-container {
  position: absolute;
  left: 0;
  right: 0;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.emoji {
  margin-bottom: 20px;
  font-size: 2em;
}

.strategy-text {
  margin-top: 40px;
  padding: 0 5px;
}

h3 {
  margin: 0 0 5px 0;
  color: #ffffff;
  font-size: 0.9em;
}

p {
  margin: 0;
  color: #cccccc;
  font-size: 0.7em;
  line-height: 1.3;
}

@media (max-width: 1024px) {
  .content {
    flex-wrap: nowrap;
    justify-content: flex-start;
  }

  .strategy-item {
    width: 150px;
    height: 150px;
  }

  .strategy-text {
    margin-top: 35px;
  }

  h3 {
    font-size: 0.8em;
  }

  p {
    font-size: 0.6em;
  }
}
</style>