<template>
    <LoadingContent v-if="!summary" />
    <div v-else>
      <SummaryContent :data="summary" />
      <MBTIContent :strengths="parsedStrengths" :weaknesses="parsedWeaknesses" :mbtiType="mbtiType"
        :strategyText="strategyText" />
      <StrategyContent :rawStrategies="contentStrategyText" :rawSubtitle="contentStrategySubtitle" />
      <FinalSummaryContent :surveyData="surveyData" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useUserAnalysisStore } from '../../userAnalysis/stores/userAnalysisStore'
  
  import SummaryContent from '../ui/SummaryContent.vue'
  import MBTIContent from '../ui/MBTIContent.vue'
  import LoadingContent from '../ui/LoadingContent.vue'
  import StrategyContent from '../ui/StrategyContent.vue'
  import FinalSummaryContent from '../ui/FinalSummaryContent.vue'
  
  const route = useRoute()
  const userAnalysisStore = useUserAnalysisStore()
  
  const summary = ref(null)
  const parsedStrengths = ref([])
  const parsedWeaknesses = ref([])
  const mbtiType = ref('')
  const strategyText = ref('')
  const surveyData = ref(null)
  const userAnalysisRequest = ref(route.query.userAnalysisRequest)
  const contentStrategyText = ref('')
  const contentStrategySubtitle = ref('')
  
  onMounted(() => {
    
    if (userAnalysisRequest) {
        try {
          const result = sendSurveyToFastAPI(); // 수정: 결과를 변수에 저장

          if (result === true) {
            getUserAnalysisResultFromFastAPI(); // 결과가 true이면 실행
          }
        } catch (error) {
          console.error("Failed to parse surveyData:", error);
        }
      } else {
        console.error("No surveyData received");
      }
    }
  )
  
  const sendSurveyToFastAPI = async () => {
    try {
      const response = await userAnalysisStore.sendUserAnalysisRequestToFastapiByDjango(userAnalysisRequest.value)
      
  
      processAnalysisData(response)
  
      localStorage.setItem('userAnalysisData', JSON.stringify(response))
    } catch (error) {
      console.error("FastAPI 요청 오류:", error)
    }
  }
  
  const processAnalysisData = (data) => {
    surveyData.value = data
  
    const generatedStrategy = data.generatedStrategy
  
    const inputSummary = generatedStrategy.match(/\*\*1\. 입력 요약:\*\*\s*([\s\S]*?)(?=\*\*2\. 성향 분석:\*\*)/)
    summary.value = inputSummary ? inputSummary[1].trim() : ''
  
    extractMBTITypeAndTraits(generatedStrategy)
  
    const strategyMatch = generatedStrategy.match(/전략:\s*\*?\*?\s*(.*?)(?:\n|$)/)
    strategyText.value = strategyMatch ? strategyMatch[1].trim() : ''
  
    const contentStrategyMatch = generatedStrategy.match(/4\. 콘텐츠 전략:([\s\S]*?)5\./)
    if (contentStrategyMatch) {
      const contentStrategyTextValue = contentStrategyMatch[1].trim()
      const lines = contentStrategyTextValue.split('\n').filter(line => line.trim() !== '')
      contentStrategySubtitle.value = lines[0].trim()
      contentStrategyText.value = lines.slice(1).join('\n')
    }
  
    
    
  }
  
  const extractMBTITypeAndTraits = (data) => {
    let mbtiMatch = data.match(/\*\*(\w{4})의 장점:/)
    
  
    mbtiType.value = mbtiMatch ? mbtiMatch[1] : ''
  
    if (mbtiType.value) {
      const strengthsRegex = new RegExp(`${mbtiType.value}의 장점:[\\s\\S]*?(?=${mbtiType.value}의 단점:|$)`)
      const weaknessesRegex = new RegExp(`${mbtiType.value}의 단점:[\\s\\S]*?(?=전략:|$)`)
  
      const strengths = data.match(strengthsRegex)
      const weaknesses = data.match(weaknessesRegex)
      
      
  
      const extractContent = (text) => {
        return text.split('\n')
          .slice(1)  // 첫 번째 줄(제목) 제거
          .map(line => line.trim())
          .filter(line => line.length > 0 && !line.includes('장점:') && !line.includes('단점:'))
          .join('\n')
      }
  
      const extractedStrengths = strengths ? extractContent(strengths[0]) : ''
      const extractedWeaknesses = weaknesses ? extractContent(weaknesses[0]) : ''
  
      
      
  
      parsedStrengths.value = parseTraits(extractedStrengths)
      parsedWeaknesses.value = parseTraits(extractedWeaknesses)
  
      
      
    } else {
      console.error("MBTI 타입을 찾을 수 없습니다.")
      parsedStrengths.value = []
      parsedWeaknesses.value = []
    }
  }
  
  const parseTraits = (traitsString) => {
    const traitLines = traitsString.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('⛔'))
  
    const traits = traitLines.map(line => {
      line = line.replace(/^[-*\s]+/, '').replace(/\*/g, '').trim()
  
      const emojiRegex = /^(\p{Emoji}(\u200D\p{Emoji})*)/u
      const emojiMatch = line.match(emojiRegex)
      const emoji = emojiMatch ? emojiMatch[1] : ''
      let remainingText = emojiMatch ? line.slice(emojiMatch[0].length).trim() : line
  
      let title = ''
      let description = ''
      const titleMatch = remainingText.match(/^(.+?):\s*(.+)$/)
      if (titleMatch) {
        title = titleMatch[1].trim()
        description = titleMatch[2].trim()
      } else {
        title = remainingText
      }
  
      return {
        emoji,
        title,
        description
      }
    }).filter(trait => trait.emoji || trait.title || trait.description)
  
    return traits
  }
  </script>
  
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');
  
  * {
    font-family: 'Noto Sans KR', sans-serif;
  }
  </style>