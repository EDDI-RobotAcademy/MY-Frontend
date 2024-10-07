<template>
    <div class="survey-form">
        <h2>설문조사 등록</h2>
    <form @submit.prevent="createSurvey">
        <div>
            <label for="title">제목:</label>
            <input id="title" v-model="survey.title" required>
        </div>
        <div>
            <label for="description">설명:(ex.안녕하세요. 저희는 팀 'MY'입니다!)</label>
            <textarea id="description" v-model="survey.description"></textarea>
        </div>
        <v-btn type="submit">설문조사 생성</v-btn>
    </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import router from "@/router";

const surveyModule = 'surveyModule'

export default {
    data () {
        return {
            survey: {
                title: '',
                description: ''
            },
        }
    },
    methods: {
        ...mapActions(surveyModule, ['requestCreateSurveyToDjango']),
        async createSurvey() {
            try {
                const response = await this.requestCreateSurveyToDjango(this.survey)
                console.log('설문 조사 생성 성공!')
            } catch (error) {
                console.error('설문 조사 생성 중 에러 발생: ', error)
            }
            
        },
    }
}
</script>

<style>
.survey-form {
  max-width: 600px;
  margin: 100px 200px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}


</style>