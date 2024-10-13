<template>
    <div class="user-analysis-form">
      <h2>사용자 분석 등록</h2>
      <form @submit.prevent="createUserAnalysis">
        <div>
          <label for="userAnalysisTitle">제목:</label>
          <input id="userAnalysisTitle" v-model="UserAnalysisSurvey.title" required />
        </div>
        <div>
          <label for="userAnalysisDescription">설명:</label>
          <textarea id="userAnalysisDescription" v-model="UserAnalysisSurvey.description" required></textarea>
        </div>
        <v-btn type="submit">사용자 성향분석 생성</v-btn>
      </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
  
const userAnalysisInputModule = 'userAnalysisInputModule';
  
export default {
    data() {
      return {
        UserAnalysisSurvey: {
          title: '',
          description: ''
        },
        userAnalysisId: null,
    }},
    methods: {
      ...mapActions(userAnalysisInputModule, ['requestCreateUserAnalysisToDjango']),
      
      async createUserAnalysis() {
        try {
          const response = await this.requestCreateUserAnalysisToDjango(this.UserAnalysisSurvey);
          this.userAnalysisId = response.title;
          console.log('사용자 성향조사 생성 성공!', this.userAnalysisId);
        } catch (error) {
          console.error('사용자 성향조사 생성 중 에러 발생: ', error);
        }
      }
    }
}
</script>

<style>
  .user-analysis-form {
    max-width: 600px;
    margin: 100px 200px;
  }
</style>