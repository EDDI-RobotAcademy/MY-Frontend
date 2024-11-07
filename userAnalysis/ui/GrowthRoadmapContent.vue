<template>
  <div class="roadmap-content" ref="container">
    <div class="content-wrapper">
      <h2 class="main-title" ref="mainTitle">
        6. 성장 로드맵<br><br>
      </h2>
      <div class="timeline" ref="timeline">
        <div v-for="(item, index) in data" 
             :key="index" 
             class="timeline-item"
             :class="{ 'timeline-item-right': index % 2 !== 0 }"
             :style="{ animationDelay: `${index * 0.3}s` }">
          <div class="timeline-content">
            <div class="timeline-period">{{ item.period }}</div>
            <div class="timeline-dot">
              <div class="dot-inner"></div>
            </div>
            <div class="timeline-description">{{ item.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import anime from 'animejs'

export default {
  name: 'RoadmapContent',
  props: {
    data: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  mounted() {
    this.setupIntersectionObserver()
  },
  methods: {
    setupIntersectionObserver() {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.animateContent()
              observer.disconnect()
            }
          })
        },
        { threshold: 0.1 }
      )

      observer.observe(this.$refs.container)
    },
    animateContent() {
      anime.timeline({
        easing: 'easeOutExpo'
      })
      .add({
        targets: this.$refs.mainTitle,
        opacity: [0, 1],
        translateY: ['-30px', '0px'],
        duration: 500
      })
      .add({
        targets: this.$refs.timeline,
        opacity: [0, 1],
        translateY: ['-20px', '0px'],
        duration: 1000,
        delay: 0
      })
    }
  }
}
</script>

<style scoped>
.roadmap-content {
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
  margin-bottom: 60px;
  text-align: center;
  opacity: 0;
}

.timeline {
  position: relative;
  opacity: 0;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  width: 2px;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-50%);
}

.timeline-item {
  margin-bottom: 50px;
  position: relative;
  width: 50%;
  padding-right: 50px;
  opacity: 0;
  animation: fadeInLeft 0.5s ease-out forwards;
}

.timeline-item-right {
  margin-left: 50%;
  padding-right: 0;
  padding-left: 50px;
  animation: fadeInRight 0.5s ease-out forwards;
}

.timeline-content {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 30px;
  position: relative;
}

.timeline-period {
  color: #ffffff;
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.timeline-dot {
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  top: 30px;
  right: -60px;
}

.timeline-item-right .timeline-dot {
  right: auto;
  left: -60px;
}

.dot-inner {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #ffffff;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.timeline-description {
  color: #ffffff;
  font-size: 18px;
  line-height: 1.6;
  opacity: 0.9;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .timeline::before {
    left: 0;
  }

  .timeline-item,
  .timeline-item-right {
    width: 100%;
    margin-left: 0;
    padding-left: 30px;
    padding-right: 0;
  }

  .timeline-dot,
  .timeline-item-right .timeline-dot {
    left: -10px;
    right: auto;
  }

  .main-title {
    font-size: 28px;
  }

  .timeline-period {
    font-size: 20px;
  }

  .timeline-description {
    font-size: 16px;
  }

  .timeline-content {
    padding: 20px;
  }
}
</style>