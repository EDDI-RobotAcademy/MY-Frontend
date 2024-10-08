<template>
  <LoadingContent v-if="!Summury" />
  <div v-else>
    <SummaryContent :data="Summury" />
    <MBTIContent :strengths="parsedStrengths" :weaknesses="parsedWeaknesses" :mbtiType="mbtiType" />
  </div>
</template>

<script>
import SummaryContent from '../ui/SummaryContent.vue'
import MBTIContent from '../ui/MBTIContent.vue'
import LoadingContent from '../ui/LoadingContent.vue';

export default {
  components: {
    SummaryContent,
    MBTIContent,
    LoadingContent
  },
  data() {
    return {
      Summury: null,
      parsedStrengths: [],
      parsedWeaknesses: [],
      mbtiType: '',
    };
  },
  created() {
    this.surveyData = history.state.surveyData;
    console.log("Received surveyData:", this.surveyData);
    this.sendSurveyToFastAPI();
  },
  methods: {
    async sendSurveyToFastAPI() {
      try {
        const response = await this.$store.dispatch('userAnalysisInputModule/sendUserAnalysisToFastAPI', this.surveyData);
        console.log("응답 데이터", response.generatedStrategy);

        const inputSummary = response.generatedStrategy.match(/\*\*1\. 입력 요약:\*\*\s*([\s\S]*?)(?=\*\*2\. 성향 분석:\*\*)/);
        this.Summury = inputSummary ? inputSummary[1].trim() : '';

        this.extractMBTITypeAndTraits(response.generatedStrategy);

        console.log("MBTI Type:", this.mbtiType);
        console.log("Strengths:", this.parsedStrengths);
        console.log("Weaknesses:", this.parsedWeaknesses);
      } catch (error) {
        console.error("FastAPI 요청 오류:", error);
      }
    },
    extractMBTITypeAndTraits(data) {
      const mbtiMatch = data.match(/✨ \*\*([A-Z]{4})의 장점:\*\*/);
      this.mbtiType = mbtiMatch ? mbtiMatch[1] : '';

      const strengths = data.match(new RegExp(`✨ \\*\\*${this.mbtiType}의 장점:\\*\\*\\s*([\\s\\S]*?)(?=⛔ \\*\\*${this.mbtiType}의 단점:\\*\\*)`));
      const weaknesses = data.match(new RegExp(`⛔ \\*\\*${this.mbtiType}의 단점:\\*\\*\\s*([\\s\\S]*?)(?=\\*\\*전략:\\*\\*)`));

      this.parsedStrengths = this.parseTraits(strengths ? strengths[1] : '');
      this.parsedWeaknesses = this.parseTraits(weaknesses ? weaknesses[1] : '');
    },
    parseTraits(traitsString) {
      const traits = traitsString.split('\n')
        .filter(line => line.trim().startsWith('*'))
        .map(line => {
          const match = line.match(/\* (.*?) \*\*(.*?):\*\* (.*)/);
          if (match) {
            return {
              emoji: match[1],
              title: match[2],
              description: match[3]
            };
          }
          return null;
        })
        .filter(trait => trait !== null)
        .slice(0, 3);

      return traits;
    }
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');

* {
  font-family: 'Noto Sans KR', sans-serif;
}
</style>