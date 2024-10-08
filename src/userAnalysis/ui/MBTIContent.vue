<template>
    <div class="mbti-container" ref="container">
        <h1 class="main-title" ref="mainTitle">{{ mainTitle }}</h1>
        <h1 class="mbti-title" ref="title">{{ mbti}}</h1>
        <div class="content">
            <div class="strengths">
                <h2 class="section-title" ref="strengthsTitle">장점</h2>
                <div v-for="(strength, index) in strengths" :key="strength.title" class="strength"
                    :ref="`strength${index}`">
                    <span class="emoji">{{ strength.emoji }}</span>
                    <div>
                        <h3>{{ strength.title }}</h3>
                        <p>{{ strength.description }}</p>
                    </div>
                </div>
            </div>
            <div class="weaknesses">
                <h2 class="section-title" ref="weaknessesTitle">단점</h2>
                <div v-for="(weakness, index) in weaknesses" :key="weakness.title" class="weakness"
                    :ref="`weakness${index}`">
                    <span class="emoji">{{ weakness.emoji }}</span>
                    <div>
                        <h3>{{ weakness.title }}</h3>
                        <p>{{ weakness.description }}</p>
                    </div>
                </div>
            </div>
        </div>
        <p class="footer" ref="footer">ENTJ의 장점을 활용하여 체계적이고 교육적인 콘텐츠를 제작하고, 긍정적인 에너지를 통해 팬들과의 관계를 강화하세요. 완벽주의를 줄이고, 실수를
            인정하는 자세가 필요합니다.</p>
    </div>
</template>

<script>
import anime from 'animejs/lib/anime.es.js';

export default {
    name: 'MBTIPersonality',
    data() {
        return {
            mainTitle: '2. 성향 분석',
            mbti: 'ENTJ',
            strengths: [
                { emoji: '🏆', title: '리더십과 조직력', description: '뛰어난 조직력과 계획 능력으로 콘텐츠 제작과 일정 관리에서 강점을 가질 수 있습니다.' },
                { emoji: '🔍', title: '분석적 사고', description: '오리 과정이나 레시피를 체계적으로 정리하고 설명할 수 있어, 교육적인 콘텐츠 제작에 유리합니다.' },
                { emoji: '💪', title: '긍정적인 에너지', description: '긍정적인 태도로 팬들과 소통하며, 유쾌한 분위기를 만들어낼 수 있습니다.' }
            ],
            weaknesses: [
                { emoji: '🏃', title: '완벽주의', description: '모든 것이 완벽해야 한다는 압박감이 있을 수 있어, 콘텐츠 제작에 부담을 느낄 수 있습니다.' }
            ],
            observer: null
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
                targets: this.$refs.title,
                opacity: [0, 1],
                translateY: ['-30px', '0px'],
                duration: 1000
            });

            timeline.add({
                targets: this.$refs.strengthsTitle,
                opacity: [0, 1],
                translateY: ['-20px', '0px'],
                duration: 800
            }, '-=500');

            this.strengths.forEach((_, index) => {
                timeline.add({
                    targets: this.$refs[`strength${index}`],
                    opacity: [0, 1],
                    translateX: ['-30px', '0px'],
                    duration: 600
                }, '-=400');
            });

            timeline.add({
                targets: this.$refs.weaknessesTitle,
                opacity: [0, 1],
                translateY: ['-20px', '0px'],
                duration: 800
            }, '+=200');

            this.weaknesses.forEach((_, index) => {
                timeline.add({
                    targets: this.$refs[`weakness${index}`],
                    opacity: [0, 1],
                    translateX: ['30px', '0px'],
                    duration: 600
                }, '-=400');
            });

            timeline.add({
                targets: this.$refs.footer,
                opacity: [0, 1],
                translateY: ['20px', '0px'],
                duration: 800
            }, '-=200');
        }
    }
}
</script>

<style scoped>
.mbti-container {
    max-width: 800px;
    padding: 20px;
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 50px;
}

.main-title {
    text-align: center;
    font-size: 2em;
    margin-bottom: 30px;
}

.mbti-title {
    text-align: center;
    font-size: 2.5em;
    margin-bottom: 30px;
}

.content {
    display: flex;
    justify-content: space-between;
}

.strengths,
.weaknesses {
    width: 48%;
}

.section-title {
    font-size: 1.5em;
    border-bottom: 2px solid #333;
    padding-bottom: 20px;
    margin-bottom: 20px;
}

.strength,
.weakness {
    display: flex;
    align-items: flex-start;
    margin-top: 20px;
    margin-bottom: 20px;
}

.emoji {
    font-size: 2em;
    margin-right: 10px;
}

h3 {
    margin: 0 0 5px 0;
}

p {
    margin: 0;
    font-size: 0.9em;
}

.footer {
    margin-top: 20px;
    font-style: italic;
    text-align: center;
    font-size: 20px;
}
</style>