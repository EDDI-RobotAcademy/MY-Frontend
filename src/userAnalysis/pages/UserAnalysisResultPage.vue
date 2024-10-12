<template>
  <LoadingContent v-if="!Summary" />
  <div v-else>
    <SummaryContent :data="Summary" />
    <MBTIContent :strengths="parsedStrengths" :weaknesses="parsedWeaknesses" :mbtiType="mbtiType"
      :strategyText="strategyText" />
    <StrategyContent :rawStrategies="contentStrategyText" :rawSubtitle="contentStrategySubtitle" />
    <FinalSummaryContent />
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
      contentStrategyText: '',
      contentStrategySubtitle: '',
    };
  },
  created() {
    this.surveyData = history.state.surveyData;
    console.log("Received surveyData:", this.surveyData);

    const storedData = localStorage.getItem('userAnalysisData');
    if (storedData) {
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

      const contentStrategyMatch = data.generatedStrategy.match(/4\. 콘텐츠 전략:([\s\S]*?)5\./);
      if (contentStrategyMatch) {
        const contentStrategyText = contentStrategyMatch[1].trim();
        const lines = contentStrategyText.split('\n').filter(line => line.trim() !== '');
        this.contentStrategySubtitle = lines[0].trim();
        this.contentStrategyText = lines.slice(1).join('\n');
      }

      console.log("Content Strategy Subtitle:", this.contentStrategySubtitle);
      console.log("Content Strategy Text:", this.contentStrategyText);
    },
    extractMBTITypeAndTraits(data) {
      let mbtiMatch = data.match(/\*\*(\w{4})의 장점:/);
      console.log("mbtiMatch", mbtiMatch);

      this.mbtiType = mbtiMatch ? mbtiMatch[1] : '';

      if (this.mbtiType) {
        const strengthsRegex = new RegExp(`${this.mbtiType}의 장점:[\\s\\S]*?(?=${this.mbtiType}의 단점:|$)`);
        const weaknessesRegex = new RegExp(`${this.mbtiType}의 단점:[\\s\\S]*?(?=전략:|$)`);

        const strengths = data.match(strengthsRegex);
        const weaknesses = data.match(weaknessesRegex);
        console.log("strengths 출력", strengths);
        console.log("weaknesses 출력", weaknesses);

        const extractContent = (text) => {
          return text.split('\n')
            .slice(1)  // 첫 번째 줄(제목) 제거
            .map(line => line.trim())
            .filter(line => line.length > 0 && !line.includes('장점:') && !line.includes('단점:'))
            .join('\n');
        };

        const extractedStrengths = strengths ? extractContent(strengths[0]) : '';
        const extractedWeaknesses = weaknesses ? extractContent(weaknesses[0]) : '';

        console.log("추출된 장점:", extractedStrengths);
        console.log("추출된 단점:", extractedWeaknesses);

        this.parsedStrengths = this.parseTraits(extractedStrengths);
        this.parsedWeaknesses = this.parseTraits(extractedWeaknesses);

        console.log("파싱된 장점:", this.parsedStrengths);
        console.log("파싱된 단점:", this.parsedWeaknesses);
      } else {
        console.error("MBTI 타입을 찾을 수 없습니다.");
        this.parsedStrengths = [];
        this.parsedWeaknesses = [];
      }
    },
    parseTraits(traitsString) {
      const traitLines = traitsString.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('⛔'));

      const traits = traitLines.map(line => {
        line = line.replace(/^[-*\s]+/, '').replace(/\*/g, '').trim();

        const emojiRegex = /^(\p{Emoji}(\u200D\p{Emoji})*)/u;
        const emojiMatch = line.match(emojiRegex);
        const emoji = emojiMatch ? emojiMatch[1] : '';
        let remainingText = emojiMatch ? line.slice(emojiMatch[0].length).trim() : line;

        let title = '';
        let description = '';
        const titleMatch = remainingText.match(/^(.+?):\s*(.+)$/);
        if (titleMatch) {
          title = titleMatch[1].trim();
          description = titleMatch[2].trim();
        } else {
          title = remainingText;
        }

        return {
          emoji,
          title,
          description
        };
      }).filter(trait => trait.emoji || trait.title || trait.description);

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