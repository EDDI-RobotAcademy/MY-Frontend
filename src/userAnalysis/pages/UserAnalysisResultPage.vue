<template>
  <SummaryContent>
  </SummaryContent>
  <MBTIContent>
  </MBTIContent>
</template>

<script>
import SummaryContent from '../ui/SummaryContent.vue'
import MBTIContent from '../ui/MBTIContent.vue'
export default {
  components: {
    SummaryContent,
    MBTIContent
  },
  created() {
    this.surveyData = history.state.surveyData;
    console.log("Received surveyData:", this.surveyData);
    this.sendSurveyToFastAPI();
  },
  methods: {
    async sendSurveyToFastAPI() {
      try {
        console.log("waitingMessageIndex")
        const strategy = await this.$store.dispatch('userAnalysisInputModule/sendUserAnalysisToFastAPI', this.surveyData);
        console.log("Strategy:", strategy);
        this.fullResponse = strategy.generatedStrategy;
        this.messages.push({ text: `📢 당신을 위한 맟춤형 인플루언서 성장 전략을 제공해드릴게요! \n\n${strategy.generatedStrategy}`, isUser: false });
      } catch (error) {
        console.error("FastAPI 요청 오류:", error);
      }
    },
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');

* {
  font-family: 'Noto Sans KR', sans-serif;
}
</style>