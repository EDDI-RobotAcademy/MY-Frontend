<template>
    <loading-content v-if="!summary || !analysis || !influencerAnalysis" />
    <div v-else class="analysis-results-container">
      <SummaryContent :data="summary" />
      <InputAnalysisContent :data="analysis" />
      <InfluencerAnalysisContent :data="influencerAnalysis" />
      <ContentStrategyContent :data="contentStrategy" />
      <EquipmentRecommendationContent :data="equipmentRecommendation" />
      <GrowthRoadmapContent :data="growthRoadmap" />
      <SupportMessageContent :message="supportMessage" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useUserAnalysisStore } from '../../userAnalysis/stores/userAnalysisStore';
  import SummaryContent from '../ui/SummaryContent.vue';
  import InputAnalysisContent from '../ui/InputAnalysisContent.vue';
  import InfluencerAnalysisContent from '../ui/InfluencerAnalysisContent.vue';
  import LoadingContent from '../ui/LoadingContent.vue';
  import ContentStrategyContent from '../ui/ContentStrategyContent.vue';
  import EquipmentRecommendationContent from '../ui/EquipmentRecommendationContent.vue';
  import GrowthRoadmapContent from '../ui/GrowthRoadmapContent.vue';
  import SupportMessageContent from '../ui/SupportMessageContent.vue';
  
  const route = useRoute();
  const userAnalysisStore = useUserAnalysisStore();
  const summary = ref(null);
  const analysis = ref(null);
  const influencerAnalysis = ref(null);
  const contentStrategy = ref(null);
  const equipmentRecommendation = ref(null);
  const growthRoadmap = ref(null);
  const supportMessage = ref(null);
  const requestId = ref(route.params.id); // 요청 ID 가져오기
  
  onMounted(async () => {
    await loadStoredAnalysisData();
  });

  const removeMarkdown = (text) => {
  return text
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/#{1,6}\s/g, '')
}
  
  // 저장된 분석 데이터를 불러오는 함수
  const loadStoredAnalysisData = async () => {
    try {
      const storedData = await userAnalysisStore.getCustomStrategyFromDjango(requestId.value);
      if (storedData) {
        processAnalysisData(storedData);
      }
    } catch (error) {
      console.error("Failed to load stored analysis data:", error);
    }
  };
  
  const extractSection = (text, startMarker, endMarker) => {
  if (!text) return null
  try {
    const startPattern = `### ${startMarker}`
    const startIndex = text.indexOf(startPattern)
    if (startIndex === -1) return null

    let endIndex
    if (endMarker) {
      endIndex = text.indexOf(`### ${endMarker}`, startIndex)
      if (endIndex === -1) {
        endIndex = text.length
      }
    } else {
      endIndex = text.length
    }

    let sectionText = text.slice(startIndex + startPattern.length, endIndex).trim()
    return sectionText.replace(/^:\s*/, '')
  } catch (error) {
    console.error(`Error extracting section ${startMarker}:`, error)
    return null
  }
}

const processContentStrategy = (strategySection) => {
  try {
    if (!strategySection) return [];

    const strategies = [];

    // 줄 단위로 분리하고 빈 줄 제거
    const lines = strategySection.split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    let currentStrategy = null;

    lines.forEach(line => {
      // 숫자로 시작하면서 제목이 있는 새로운 전략 항목 확인
      const titleMatch = line.match(/^(\d+)\.\s*(.+)$/);

      if (titleMatch) {
        if (currentStrategy) {
          strategies.push(currentStrategy);
        }

        // 제목에서 ** 및 : 제거하고 앞뒤 공백 정리
        const rawTitle = titleMatch[2];
        const cleanTitle = rawTitle
          .replace(/\*\*/g, '')  // ** 제거
          .replace(/:/g, '')     // : 제거
          .trim();               // 앞뒤 공백 제거

        // 새로운 전략 객체 생성
        currentStrategy = {
          number: parseInt(titleMatch[1]),
          title: cleanTitle,
          description: '',
          examples: []
        };
      }
      // 현재 전략에 대한 추가 설명이나 예시인 경우
      else if (currentStrategy) {
        const examples = line.match(/"([^"]+)"/g);
        if (examples) {
          currentStrategy.examples.push(
            ...examples.map(ex => ex.replace(/"/g, '').trim())
          );
          // 예시를 제외한 나머지 텍스트는 설명에 추가
          const additionalDescription = line
            .replace(/"[^"]+"/g, '')
            .replace(/예:/g, '')
            .trim();
          if (additionalDescription) {
            currentStrategy.description += ' ' + additionalDescription;
          }
        } else {
          // 예시가 없는 경우 전체 라인을 설명에 추가
          currentStrategy.description += ' ' + line;
        }
        currentStrategy.description = currentStrategy.description.trim();
      }
    });

    // 마지막 전략 추가
    if (currentStrategy) {
      strategies.push(currentStrategy);
    }

    return strategies;
  } catch (error) {
    console.error('Error processing content strategy:', error);
    return [];
  }
};

const processEquipmentSection = (generatedText) => {
  try {
    // 장비 섹션 텍스트 추출
    const equipmentSection = extractSection(generatedText, '예산별 장비 및 툴 추천', '총정리: 성장 로드맵')
    if (!equipmentSection) return null

    // 마크다운 제거하고 텍스트 정리
    const cleanedSection = removeMarkdown(equipmentSection)

    // 각 장비 항목 추출
    const equipmentItems = cleanedSection
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-'))
      .map(line => {
        // 하이픈 제거 및 양쪽 공백 제거
        line = line.substring(1).trim()

        // 장비명과 가격 분리
        const [equipment, price] = line.split(':').map(s => s.trim())

        // 유효한 항목만 반환
        if (equipment && price) {
          return {
            equipment: equipment,
            price: price,
            details: ''
          }
        }
        return null
      })
      .filter(Boolean) // null 항목 제거

    return equipmentItems.length > 0 ? equipmentItems : null
  } catch (error) {
    console.error("Error processing equipment section:", error)
    return null
  }
}

const processAnalysisData = (data) => {
  try {
    const generatedText = data.strategy_result;
    if (!generatedText) {
      console.error("No generated text found in data")
      return
    }

    // 입력 요약 처리
    const summarySection = extractSection(generatedText, '입력 요약', '입력 분석')
    if (summarySection) {
      const summaryLines = removeMarkdown(summarySection)
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-'))
        .map(line => {
          let [key, value] = line.substring(2).split(':').map(s => s.trim())
          return { key, value }
        })
        .filter(item => item.key && item.value)
      summary.value = summaryLines
    }

    // 입력 분석 처리
    const analysisSection = extractSection(generatedText, '입력 분석', '인플루언서 분석')
    if (analysisSection) {
      const cleanedSection = removeMarkdown(analysisSection)
      const strengthsMatch = cleanedSection.match(/장점:([\s\S]*?)(?=단점:)/)
      const weaknessesMatch = cleanedSection.match(/단점:([\s\S]*?)(?=###|$)/)

      analysis.value = {
        strengths: strengthsMatch ?
          strengthsMatch[1].trim().split('\n')
            .map(point => point.trim())
            .filter(point => point.startsWith('-'))
            .map(point => point.substring(1).trim()) : [],
        weaknesses: weaknessesMatch ?
          weaknessesMatch[1].trim().split('\n')
            .map(point => point.trim())
            .filter(point => point.startsWith('-'))
            .map(point => point.substring(1).trim()) : []
      }
    }

    // 인플루언서 분석 처리
    const influencerSection = extractSection(generatedText, '인플루언서 분석', '콘텐츠 전략')
    if (influencerSection) {
      const cleanedSection = removeMarkdown(influencerSection)
      const [analysisText, strategyText] = cleanedSection.split('적용 전략')

      const basicPoints = analysisText.split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-'))
        .map(line => line.substring(1).trim())

      const strategyPoints = strategyText ?
        strategyText.split('\n')
          .map(line => line.trim())
          .filter(line => line.startsWith('-'))
          .map(line => line.substring(1).trim()) : []

      influencerAnalysis.value = {
        analysis: basicPoints,
        strategy: strategyPoints
      }
    }

    // 콘텐츠 전략 처리
    const strategySection = extractSection(generatedText, '콘텐츠 전략', '예산별 장비 및 툴 추천')
    if (strategySection) {
      contentStrategy.value = processContentStrategy(strategySection)
    }

    // 장비 추천 처리
    equipmentRecommendation.value = processEquipmentSection(generatedText)

    // 성장 로드맵 처리
    const roadmapSection = extractSection(generatedText, '총정리: 성장 로드맵', '응원 메시지')
    if (roadmapSection) {
      const cleanedSection = removeMarkdown(roadmapSection)
      const roadmapItems = cleanedSection
        .split(/\d+\.\s+/)
        .slice(1)
        .map(item => {
          const [period, description] = item.split(':').map(s => s.trim())
          if (period && description) {
            return { period, description }
          }
          return null
        })
        .filter(Boolean)

      growthRoadmap.value = roadmapItems
    }

    // 응원 메시지 처리
    const messageSection = extractSection(generatedText, '응원 메시지', null)
    if (messageSection) {
      supportMessage.value = removeMarkdown(messageSection).trim()
    }
  } catch (error) {
    console.error("Error processing analysis data:", error)
  }
}
</script>
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');

* {
  font-family: 'Noto Sans KR', sans-serif;
}

.analysis-results-container {
  padding-top: 40px;
  background-color: #000000;
}

.summary-section,
.analysis-section,
.influencer-section,
.content-strategy-section,
.equipment-section,
.roadmap-section,
.support-message-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-radius: 0.75rem;
  background-color: #1a1a1a;
}

h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
}

h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: white;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
  color: #e0e0e0;
}

.summary-item {
  display: flex;
  margin-bottom: 0.5rem;
  color: #e0e0e0;
}

.key {
  font-weight: 600;
  margin-right: 0.5rem;
  min-width: 100px;
}

.strategy-item,
.equipment-item,
.roadmap-item {
  margin-bottom: 1.5rem;
  background-color: #2a2a2a;
  padding: 1rem;
  border-radius: 0.5rem;
}

.equipment-price {
  color: #a0aec0;
  margin-left: 0.5rem;
}

.equipment-details {
  display: block;
  margin-top: 0.25rem;
  color: #e0e0e0;
}

.message {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #e0e0e0;
  padding: 1rem;
  background-color: #2a2a2a;
  border-radius: 0.375rem;
}


@media (max-width: 768px) {
  .summary-item {
    flex-direction: column;
  }

  .key {
    margin-bottom: 0.25rem;
  }
}
</style>
  