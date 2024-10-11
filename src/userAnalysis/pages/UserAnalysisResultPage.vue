<template>
  <LoadingContent v-if="!Summary" />
  <div v-else>
    <SummaryContent :data="Summary" />
    <MBTIContent :strengths="parsedStrengths" :weaknesses="parsedWeaknesses" :mbtiType="mbtiType"
      :strategyText="strategyText" />
    <StrategyContent :strategies="parsedStrategies" :subtitle="contentStrategySubtitle" />
    <FinalSummaryContent/>
  </div>
</template>

<script>
import SummaryContent from '../ui/SummaryContent.vue'
import MBTIContent from '../ui/MBTIContent.vue'
import LoadingContent from '../ui/LoadingContent.vue';
import StrategyContent from '../ui/StrategyContent.vue';
import FinalSummaryContent from '../ui/FinalSummaryContent.vue'

export default {
  components: {
    SummaryContent,
    MBTIContent,
    LoadingContent,
    StrategyContent,
    FinalSummaryContent,
  },
  data() {
    return {
      Summary: null,
      parsedStrengths: [],
      parsedWeaknesses: [],
      mbtiType: '',
      strategyText: '',
      surveyData: null,
      parsedStrategies: [],
      contentStrategySubtitle: '',
    };
  },
  created() {
    this.surveyData = history.state.surveyData;
    console.log("Received surveyData:", this.surveyData);

    const storedData = localStorage.getItem('userAnalysisData');
    if (storedData) {
      console.log("storedData", storedData)
      const parsedData = JSON.parse(storedData);
      this.processAnalysisData(parsedData);
    } else if (this.surveyData) {
      this.sendSurveyToFastAPI();
    }
  },
  methods: {
    async sendSurveyToFastAPI() {
      try {
        const response = await this.$store.dispatch('userAnalysisInputModule/sendUserAnalysisToFastAPI', this.surveyData);
        console.log("응답 데이터", response.generatedStrategy);

        this.processAnalysisData(response);

        localStorage.setItem('userAnalysisData', JSON.stringify(response));
      } catch (error) {
        console.error("FastAPI 요청 오류:", error);
      }
    },
    processAnalysisData(data) {
      const inputSummary = data.generatedStrategy.match(/\*\*1\. 입력 요약:\*\*\s*([\s\S]*?)(?=\*\*2\. 성향 분석:\*\*)/);
      this.Summary = inputSummary ? inputSummary[1].trim() : '';

      this.extractMBTITypeAndTraits(data.generatedStrategy);

      const strategyMatch = data.generatedStrategy.match(/전략:\s*\*?\*?\s*(.*?)(?:\n|$)/);
      this.strategyText = strategyMatch ? strategyMatch[1].trim() : '';

      const contentStrategyMatch = data.generatedStrategy.match(/4\. 콘텐츠 전략:[\s\S]*?5\./);
      if (contentStrategyMatch) {
        const contentStrategyText = contentStrategyMatch[0].replace(/4\. 콘텐츠 전략:/, '').replace(/5\..*$/, '').trim();
        const parsedContent = this.parseContentStrategy(contentStrategyText);
        this.contentStrategySubtitle = parsedContent.subtitle;
        this.parsedStrategies = parsedContent.strategies;
      }

      console.log("Content Strategy Subtitle:", this.contentStrategySubtitle);
      console.log("Parsed Strategies:", this.parsedStrategies);
    },
    parseContentStrategy(text) {
      text = text.replace(/\*\*|\*/g, '');

      const lines = text.split('\n').filter(line => line.trim() !== '');

      const subtitle = lines[1].trim();

      const strategies = [];
      const regex = /^(.*?)\s+(.*?):\s*(.*)$/;

      lines.slice(2).forEach(line => {
        const match = line.match(regex);
        if (match) {
          strategies.push({
            emoji: match[1].trim(),
            title: match[2].trim(),
            description: match[3].trim()
          });
        }
      });

      return {
        subtitle: subtitle,
        strategies: strategies
      };
    },
    extractMBTITypeAndTraits(data) {
      const mbtiMatch = data.match(/\*\*([A-Z]{4})의 장점:\*\*/);
      this.mbtiType = mbtiMatch ? mbtiMatch[1] : '';

      if (this.mbtiType) {
        const strengthsRegex = new RegExp(`\\*\\*${this.mbtiType}의 장점:\\*\\*\\s*([\\s\\S]*?)(?=\\*\\*${this.mbtiType}의 단점:\\*\\*)`);
        const strengths = data.match(strengthsRegex);

        const weaknessesRegex = new RegExp(`\\*\\*${this.mbtiType}의 단점:\\*\\*\\s*([\\s\\S]*?)(?=\\*\\*전략:\\*\\*)`);
        const weaknesses = data.match(weaknessesRegex);

        this.parsedStrengths = this.parseTraits(strengths ? strengths[1] : '');
        this.parsedWeaknesses = this.parseTraits(weaknesses ? weaknesses[1] : '');
      } else {
        console.error("MBTI 타입을 찾을 수 없습니다.");
        this.parsedStrengths = [];
        this.parsedWeaknesses = [];
      }
    },
    parseTraits(traitsString) {
      const traits = traitsString.split('\n')
        .filter(line => line.trim().startsWith('*'))
        .map(line => {
          const match = line.match(/\* (.*?) \*\*(.*?):\*\* (.*)/);
          if (match) {
            return {
              emoji: match[1].trim(),
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
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');

* {
  font-family: 'Noto Sans KR', sans-serif;
}
</style>