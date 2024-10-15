<template>
    <div class="fullscreen-background">
        <div class="influencer-container" ref="container">
            <h1 class="main-title" ref="mainTitle">인플루언서 분석</h1>
            <h1 class="influencer-title" ref="title">{{ influencerInfo?.name || '이름 없음' }}</h1>
            <div class="content">
                <div class="introduction" v-if="influencerInfo?.introduction">
                    <h2 class="section-title" ref="introductionTitle">인플루언서 소개</h2>
                    <p ref="introductionContent">{{ influencerInfo.introduction }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import anime from 'animejs/lib/anime.es.js';

export default {
    name: 'InfluencerProfileContent',
    props: {
        surveyData: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const container = ref(null);
        const mainTitle = ref(null);
        const title = ref(null);
        const introductionTitle = ref(null);
        const introductionContent = ref(null);
        const strategyTitle = ref(null);
        const strategyContent = ref(null);
        const influencerInfo = ref(null);

        const parseInfluencerInfo = (content) => {
            const influencerAnalysisRegex = /3\.\s*인플루언서\s*분석:[\s\S]*?(?=4\.|$)/i;
            const influencerAnalysisMatch = content.match(influencerAnalysisRegex);

            let name = '이름 없음';
            let introduction = '소개를 찾을 수 없습니다.';

            if (influencerAnalysisMatch) {
                const analysisContent = influencerAnalysisMatch[0];
                const nameRegex = /🌟\s*\*\*([^*]+)\*\*/;
                const nameMatch = analysisContent.match(nameRegex);

                if (nameMatch) {
                    name = nameMatch[1].trim().replace(/:$/, '');
                    const introRegex = new RegExp(`${name}[^.]+\\.\\s*([^.]+\\.)`);
                    const introMatch = analysisContent.match(introRegex);
                    if (introMatch) {
                        introduction = introMatch[0].trim();
                    }
                }
            }

            const strategyRegex = /추천\s*전략:([\s\S]*?)(?=4\.\s*콘텐츠\s*전략|$)/iu;
            const strategyMatch = content.match(strategyRegex);

            const formatText = (text) => {
                return text
                    .replace(/[🌟💡💄📸🎥👀👥💬📚🤝📸👏]/gu, '')
                    .replace(/\*/g, '')
                    .replace(/\\n/g, '\n')
                    .trim();
            };

            return {
                name: name,
                introduction: formatText(introduction),
                strategy: strategyMatch ? formatText(strategyMatch[1]) : '전략을 찾을 수 없습니다.'
            };
        };

        const updateInfluencerInfo = () => {
            if (props.surveyData && props.surveyData.generatedStrategy) {
                try {
                    const rawData = props.surveyData.generatedStrategy;
                    let content;
                    try {
                        const parsedData = JSON.parse(rawData);
                        content = parsedData.Answer || parsedData;
                    } catch (jsonError) {
                        content = rawData;
                    }
                    influencerInfo.value = parseInfluencerInfo(content);
                } catch (error) {
                    influencerInfo.value = null;
                }
            } else {
                influencerInfo.value = null;
            }
        };

        watch(() => props.surveyData, updateInfluencerInfo, { immediate: true, deep: true });

        const animateContent = () => {
            const timeline = anime.timeline({
                easing: 'easeOutExpo'
            });

            timeline
                .add({
                    targets: mainTitle.value,
                    opacity: [0, 1],
                    translateY: ['-30px', '0px'],
                    duration: 500
                })
                .add({
                    targets: title.value,
                    opacity: [0, 1],
                    translateY: ['-30px', '0px'],
                    duration: 1000
                })
                .add({
                    targets: introductionTitle.value,
                    opacity: [0, 1],
                    translateY: ['-20px', '0px'],
                    duration: 800
                }, '-=500')
                .add({
                    targets: introductionContent.value,
                    opacity: [0, 1],
                    translateX: ['-30px', '0px'],
                    duration: 600
                }, '-=400')
                .add({
                    targets: strategyTitle.value,
                    opacity: [0, 1],
                    translateY: ['-20px', '0px'],
                    duration: 800
                }, '-=200')
                .add({
                    targets: strategyContent.value,
                    opacity: [0, 1],
                    translateX: ['-30px', '0px'],
                    duration: 600
                }, '-=400');
        };

        onMounted(() => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateContent();
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.1 });

            if (container.value) {
                observer.observe(container.value);
            }
        });

        return {
            container,
            mainTitle,
            title,
            introductionTitle,
            introductionContent,
            strategyTitle,
            strategyContent,
            influencerInfo
        };
    }
};
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

.introduction,
.strategy {
    margin-bottom: 30px;
}

.section-title {
    font-size: 1.5em;
    border-bottom: 2px solid #333;
    padding-bottom: 20px;
    margin-bottom: 20px;
}
</style>