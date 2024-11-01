<template>
    <div class="strategy-content" ref="container">
      <div class="content-wrapper">
        <h2 class="main-title" ref="mainTitle">
          4. 콘텐츠 전략<br><br>
        </h2>
        <div class="strategy-list" ref="strategyList">
          <div v-for="(strategy, index) in data" 
               :key="index"
               class="strategy-item"
               :style="{ animationDelay: `${index * 0.2}s` }">
            <div class="strategy-number">{{ index + 1 }}</div>
            <div class="strategy-details">
              <h3 class="strategy-title">{{ strategy.title }}</h3>
              <p class="strategy-description">{{ strategy.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import anime from 'animejs';
  
  export default {
    name: 'ContentStrategyContent',
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
          targets: this.$refs.strategyList,
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
  .strategy-content {
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
    margin-bottom: 40px;
    text-align: center;
    opacity: 0;
  }
  
  .strategy-list {
    opacity: 0;
  }
  
  .strategy-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 30px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 30px;
    opacity: 0;
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  .strategy-number {
    background: #ffffff;
    color: #000000;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
    margin-right: 20px;
    flex-shrink: 0;
  }
  
  .strategy-details {
    flex-grow: 1;
  }
  
  .strategy-title {
    color: #ffffff;
    font-size: 24px;
    margin-bottom: 10px;
    font-weight: 500;
  }
  
  .strategy-description {
    color: #ffffff;
    font-size: 18px;
    line-height: 1.6;
    opacity: 0.9;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    .main-title {
      font-size: 28px;
    }
  
    .strategy-item {
      padding: 20px;
    }
  
    .strategy-number {
      width: 32px;
      height: 32px;
      font-size: 16px;
      margin-right: 15px;
    }
  
    .strategy-title {
      font-size: 20px;
    }
  
    .strategy-description {
      font-size: 16px;
    }
  }
  </style>