<template>
  <loading-content v-if="!summary || !analysis || !influencerAnalysis" />
  <div v-else>
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserAnalysisStore } from '../../userAnalysis/stores/userAnalysisStore'
import SummaryContent from '../ui/SummaryContent.vue'
import InputAnalysisContent from '../ui/InputAnalysisContent.vue'
import InfluencerAnalysisContent from '../ui/InfluencerAnalysisContent.vue'
import LoadingContent from '../ui/LoadingContent.vue'
import ContentStrategyContent from '../ui/ContentStrategyContent.vue'
import EquipmentRecommendationContent from '../ui/EquipmentRecommendationContent.vue'
import GrowthRoadmapContent from '../ui/GrowthRoadmapContent.vue'
import SupportMessageContent from '../ui/SupportMessageContent.vue'

const route = useRoute()
const userAnalysisStore = useUserAnalysisStore()
const summary = ref(null)
const analysis = ref(null)
const influencerAnalysis = ref(null)
const contentStrategy = ref(null)
const equipmentRecommendation = ref(null)
const growthRoadmap = ref(null)
const supportMessage = ref(null)
const userAnalysisRequest = ref(route.query.userAnalysisRequest)

onMounted(async () => {
  if (userAnalysisRequest.value) {
    try {
          const result =  await sendSurveyToFastAPI(); // 수정: 결과를 변수에 저장
          console.log("result", result)
          if (result) {
            await userAnalysisStore.getUserAnalysisResultFromFastAPI(); // 결과가 true이면 실행
          }

          const strategy = await userAnalysisStore.getCustomStrategyFromDjango(userAnalysisRequest.value)
          console.log("strategy: ", strategy)
        } catch (error) { 
          console.error("Failed to parse surveyData:", error);
        }
  }
})

const sendSurveyToFastAPI = async () => {
  try {
    return await userAnalysisStore.sendUserAnalysisRequestToFastapiByDjango(userAnalysisRequest.value)
  } catch (error) {
    console.error("FastAPI 요청 오류:", error)
    return null
  }
}

const parseAnalysisPoints = (text) => {
  return text.split('-')
    .map(point => point.trim())
    .filter(point => point.length > 0 && !point.includes('**'))
}

const processAnalysisData = (data) => {
  try {
    const generatedText = data.generatedText
    if (!generatedText) {
      console.error("No generated text found in data")
      return
    }

    // 입력 요약 처리
    const summarySection = extractSection(generatedText, '입력 요약', '입력 분석')
    if (summarySection) {
      const summaryLines = summarySection.split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-'))
        .map(line => {
          const [key, value] = line.substring(2).split(':').map(s => s.trim().replace(/\*\*/g, ''))
          return { key, value }
        })
      summary.value = summaryLines
    }

    // 입력 분석 처리
    const analysisSection = extractSection(generatedText, '입력 분석', '인플루언서 분석')
    if (analysisSection) {
      const analysisData = extractStrengthsWeaknesses(analysisSection)
      analysis.value = {
        strengths: parseAnalysisPoints(analysisData.strengths),
        weaknesses: parseAnalysisPoints(analysisData.weaknesses)
      }
    }

    // 인플루언서 분석 처리
    const influencerSection = extractSection(generatedText, '인플루언서 분석', '콘텐츠 전략')
    if (influencerSection) {
      influencerAnalysis.value = parseInfluencerAnalysis(influencerSection)
    }

    // 콘텐츠 전략 처리
    const strategySection = extractSection(generatedText, '콘텐츠 전략', '예산별 장비 및 툴 추천')
    if (strategySection) {
      console.log('Raw strategy section:', strategySection)
      const strategies = parseContentStrategy(strategySection)
      console.log('Parsed strategies:', strategies)
      contentStrategy.value = strategies
    }

    // 장비 추천 섹션 처리
    const equipmentSection = extractSection(generatedText, '예산별 장비 및 툴 추천', '총정리: 성장 로드맵')
    if (equipmentSection) {
      console.log('Raw equipment section:', equipmentSection)
      const parsedEquipment = parseEquipmentRecommendation(equipmentSection)
      console.log('Parsed equipment:', parsedEquipment)
      equipmentRecommendation.value = parsedEquipment
    }

    const roadmapSection = extractSection(generatedText, '총정리: 성장 로드맵', null)
    if (roadmapSection) {
      console.log('Raw roadmap section:', roadmapSection)
      const parsedRoadmap = parseGrowthRoadmap(roadmapSection)
      console.log('Parsed roadmap:', parsedRoadmap)
      growthRoadmap.value = parsedRoadmap
    }

    const messageSection = extractSection(generatedText, '응원 메시지', null)
    if (messageSection) {
      console.log('Raw support message:', messageSection)
      const parsedMessage = parseSupportMessage(messageSection)
      console.log('Parsed message:', parsedMessage)
      supportMessage.value = parsedMessage
    }
  } catch (error) {
    console.error("Error processing analysis data:", error)
  }
}

const extractSection = (text, startMarker, endMarker) => {
  if (!text) return null
  try {
    const startIndex = text.indexOf(`### ${startMarker}`)
    if (startIndex === -1) return null

    const endIndex = text.indexOf(`### ${endMarker}`)
    if (endIndex === -1) return text.slice(startIndex + startMarker.length + 4).trim()

    return text.slice(startIndex + startMarker.length + 4, endIndex).trim()
  } catch (error) {
    console.error(`Error extracting section ${startMarker}:`, error)
    return null
  }
}

const extractStrengthsWeaknesses = (analysisText) => {
  try {
    const strengthsMatch = analysisText.match(/\*\*장점\*\*:([\s\S]*?)(?=\*\*단점\*\*:)/)
    const weaknessesMatch = analysisText.match(/\*\*단점\*\*:([\s\S]*?)$/)

    return {
      strengths: strengthsMatch ? strengthsMatch[1].trim() : '',
      weaknesses: weaknessesMatch ? weaknessesMatch[1].trim() : ''
    }
  } catch (error) {
    console.error("Error extracting strengths and weaknesses:", error)
    return { strengths: '', weaknesses: '' }
  }
}

const parseInfluencerAnalysis = (text) => {
  return text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.includes('###'))
    .map(line => line.replace(/^-\s*/, ''))
}

const parseContentStrategy = (text) => {
  try {
    const strategyItems = text.split(/\d+\.\s+\*\*/).slice(1)

    return strategyItems.map(item => {
      const titleEndIndex = item.indexOf('**:')
      if (titleEndIndex === -1) return null

      const strategyTitle = item.substring(0, titleEndIndex)
      const strategyDescription = item.substring(titleEndIndex + 3)
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && line.startsWith('-'))
        .map(line => line.substring(1).trim())
        .join('\n')

      return {
        title: strategyTitle.trim(),
        description: strategyDescription || item.substring(titleEndIndex + 3).trim()
      }
    }).filter(Boolean)
  } catch (error) {
    console.error("Error parsing content strategy:", error)
    return []
  }
}

const parseEquipmentRecommendation = (text) => {
  try {
    return text
      .split('-')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // 기본 항목 파싱
        let [equipment, ...restParts] = line.split(':')
        let details = restParts.join(':').trim()

        // 가격 정보 추출
        let price = ''
        const priceMatch = equipment.match(/\((.*?)\)/)
        if (priceMatch) {
          price = priceMatch[1]
          equipment = equipment.replace(/\((.*?)\)/, '').trim()
        }

        return {
          equipment: equipment.replace(/\*\*/g, '').trim(),
          price: price,
          details: details
        }
      })
  } catch (error) {
    console.error("Error parsing equipment recommendations:", error)
    return []
  }
}

// 새로운 파싱 함수 추가
const parseGrowthRoadmap = (text) => {
  try {
    const roadmapItems = text.split(/\d+\.\s+\*\*/).slice(1)

    return roadmapItems.map(item => {
      const match = item.match(/([^*]+)\*\*:\s*(.+)/)
      if (!match) return null

      return {
        period: match[1].trim(),
        description: match[2].trim()
      }
    }).filter(Boolean)
  } catch (error) {
    console.error("Error parsing growth roadmap:", error)
    return []
  }
}

const parseSupportMessage = (text) => {
  try {
    return text.trim()
  } catch (error) {
    console.error("Error parsing support message:", error)
    return ''
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');

* {
  font-family: 'Noto Sans KR', sans-serif;
}
</style>