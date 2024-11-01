<template>
    <div class="influencer-content" ref="container">
      <div class="content-wrapper">
        <h2 class="main-title" ref="mainTitle">
          3. 인플루언서 분석<br><br>
        </h2>
        <div class="influencer-analysis" ref="analysis">
          <div v-for="(point, index) in data" 
               :key="index"
               class="analysis-point"
               :style="{ animationDelay: `${index * 0.1}s` }">
            {{ point }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import anime from 'animejs';
  
  export default {
    name: 'InfluencerAnalysisContent',
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
          targets: this.$refs.analysis,
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
  .influencer-content {
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
  
  .influencer-analysis {
    opacity: 0;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 40px;
  }
  
  .analysis-point {
    font-size: 20px;
    color: #ffffff;
    line-height: 1.8;
    margin-bottom: 20px;
    padding-left: 20px;
    opacity: 0;
    animation: fadeIn 0.5s ease-out forwards;
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
  
    .analysis-point {
      font-size: 18px;
    }
  
    .influencer-analysis {
      padding: 20px;
    }
  }
  </style>