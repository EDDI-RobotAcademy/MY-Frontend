<template>
    <div class="analysis-content" ref="container">
        <div class="content-wrapper">
            <h2 class="main-title" ref="mainTitle">
                2. 입력 분석<br><br>
            </h2>
            <div class="analysis-sections" ref="analysis">
                <div class="analysis-section">
                    <h3 class="section-title">장점</h3>
                    <div v-for="(point, index) in data.strengths" :key="`strength-${index}`" class="analysis-point">
                        • {{ point }}
                    </div>
                </div>

                <div class="analysis-section">
                    <h3 class="section-title">단점</h3>
                    <div v-for="(point, index) in data.weaknesses" :key="`weakness-${index}`" class="analysis-point">
                        • {{ point }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import anime from 'animejs';

export default {
    name: 'AnalysisContent',
    props: {
        data: {
            type: Object,
            required: true,
            default: () => ({
                strengths: [],
                weaknesses: []
            })
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
.analysis-content {
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

.analysis-sections {
    opacity: 0;
    display: flex;
    flex-direction: column;
    gap: 40px;
}

.analysis-section {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 30px;
    margin-bottom: 20px;
}

.section-title {
    font-size: 28px;
    color: #ffffff;
    margin-bottom: 20px;
    text-align: center;
}

.analysis-point {
    font-size: 20px;
    color: #ffffff;
    line-height: 1.6;
    margin-bottom: 15px;
    padding-left: 20px;
}

@media (max-width: 768px) {
    .main-title {
        font-size: 28px;
    }

    .section-title {
        font-size: 24px;
    }

    .analysis-point {
        font-size: 18px;
    }

    .analysis-section {
        padding: 20px;
    }
}
</style>