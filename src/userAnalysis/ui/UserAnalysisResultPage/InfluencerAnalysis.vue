<template>
    <div class="fullscreen-background">
        <div class="influencer-container" ref="container">
            <h1 class="main-title" ref="mainTitle">인플루언서 분석</h1>
            <h1 class="influencer-title" ref="title">{{ influencerName }}</h1>
            <div class="content">
                <div class="description">
                    <h2 class="section-title" ref="descriptionTitle">인플루언서 소개</h2>
                    <p ref="descriptionContent">{{ influencerDescription }}</p>
                </div>
                <div class="strategy">
                    <h2 class="section-title" ref="strategyTitle">추천 전략</h2>
                    <p ref="strategyContent">{{ recommendedStrategy }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import anime from 'animejs/lib/anime.es.js';

export default {
    name: 'InfluencerProfileContent',
    props: {
        surveyData: {
            type: Object,
            required: true
        }
    },
    computed: {
        influencerInfo() {
            if (this.surveyData && this.surveyData.generatedStrategy) {
                const strategy = this.surveyData.generatedStrategy;
                const sectionRegex = /\*\*3\. 인플루언서 분석:\*\*\s*([\s\S]*?)(?=\*\*4\.|$)/;
                const sectionMatch = strategy.match(sectionRegex);

                if (sectionMatch) {
                    const section = sectionMatch[1].trim();
                    const infoRegex = /🌟 \*\*(.+?):\*\* ([\s\S]*?)(?=\* \*\*추천 전략:|$)/;
                    const strategyRegex = /\* \*\*추천 전략:\*\* ([\s\S]*?)$/;

                    const infoMatch = section.match(infoRegex);
                    const strategyMatch = section.match(strategyRegex);

                    if (infoMatch && strategyMatch) {
                        return {
                            name: infoMatch[1],
                            description: infoMatch[2].trim(),
                            strategy: strategyMatch[1].trim()
                        };
                    }
                }
            }
            return null;
        },
        influencerName() {
            return this.influencerInfo ? this.influencerInfo.name : '';
        },
        influencerDescription() {
            return this.influencerInfo ? this.influencerInfo.description : '';
        },
        recommendedStrategy() {
            return this.influencerInfo ? this.influencerInfo.strategy : '';
        }
    },
    mounted() {
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
            const timeline = anime.timeline({
                easing: 'easeOutExpo'
            });

            timeline
                .add({
                    targets: this.$refs.mainTitle,
                    opacity: [0, 1],
                    translateY: ['-30px', '0px'],
                    duration: 500
                })
                .add({
                    targets: this.$refs.title,
                    opacity: [0, 1],
                    translateY: ['-30px', '0px'],
                    duration: 1000
                })
                .add({
                    targets: this.$refs.descriptionTitle,
                    opacity: [0, 1],
                    translateY: ['-20px', '0px'],
                    duration: 800
                }, '-=500')
                .add({
                    targets: this.$refs.descriptionContent,
                    opacity: [0, 1],
                    translateX: ['-30px', '0px'],
                    duration: 600
                }, '-=400')
                .add({
                    targets: this.$refs.strategyTitle,
                    opacity: [0, 1],
                    translateY: ['-20px', '0px'],
                    duration: 800
                }, '+=200')
                .add({
                    targets: this.$refs.strategyContent,
                    opacity: [0, 1],
                    translateX: ['30px', '0px'],
                    duration: 600
                }, '-=400')
                .add({
                    targets: this.$refs.footer,
                    opacity: [0, 1],
                    translateY: ['20px', '0px'],
                    duration: 800
                }, '+=200');
        }
    }
}
</script>

<style scoped>
.fullscreen-background {
    background-color: #000;
    min-height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.influencer-container {
    width: 100%;
    max-width: 800px;
    padding: 20px;
    color: #fff;
}

.main-title {
    text-align: center;
    font-size: 2em;
    margin-bottom: 30px;
}

.influencer-title {
    text-align: center;
    font-size: 2.5em;
    margin-bottom: 30px;
}

.content {
    display: flex;
    flex-direction: column;
}

.description,
.strategy {
    width: 100%;
    margin-bottom: 40px;
}

.section-title {
    font-size: 1.5em;
    border-bottom: 2px solid #333;
    padding-bottom: 20px;
    margin-bottom: 20px;
}

p {
    margin: 0;
    font-size: 0.9em;
    line-height: 1.6;
}

.footer {
    margin-top: 50px;
    font-style: italic;
    text-align: center;
    font-size: 14px;
    opacity: 0;
}
</style>