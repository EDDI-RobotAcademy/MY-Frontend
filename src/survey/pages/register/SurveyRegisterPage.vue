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
            <textarea id="description" v-model="survey.description" required></textarea>
        </div>
        <v-btn type="submit">설문조사 생성</v-btn>
    </form>
    </div>
    <div v-if="surveyId" class="survey-form">
        <form @submit.prevent="addQuestion">
            <div>
                <label for="question">질문:</label>
                <input id="question" v-model="question.questionText" type="text" required/>
            </div>
            <div>
            <label for="surveyType">질문 타입:</label>
            <select v-model="question.surveyType" id="surveyType" @change="handleSurveyTypeChange">
                <option :value="1">General</option>
                <option :value="2">Five Score</option>
                <option :value="3">Boolean</option>
                <option :value="4">Custom</option>
            </select>
        </div>
        <div v-if="question.surveyType === 4">
            <label for="customSelection">선택형</label>
            <div v-for="(custom, index) in customSelections" :key="index">
                <input v-model="customSelections[index]" type="text" placeholder="선택지 입력" />
            </div>
            <v-btn @click="addSelection">선택지 추가</v-btn>
        </div>
        <div>
        <v-btn type="submit">질문 추가</v-btn>
        </div>
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
            surveyId: null,  
            question: {
                questionText: '',
                surveyType: 1  
            },
            questions: [],
            questionId: null,
            
        }
    },
    computed: {
    },
    methods: {
        ...mapActions(surveyModule, ['requestCreateSurveyToDjango', 'requestCreateSurveyQuestionToDjango']),
        async createSurvey() {
            try {
                const response = await this.requestCreateSurveyToDjango(this.survey)
                console.log("surveyID 응답",response.title)
                this.surveyId = response.title  // 응답에서 받은 id를 surveyId에 저장
                console.log('설문 조사 생성 성공!', this.surveyId)
            } catch (error) {
                console.error('설문 조사 생성 중 에러 발생: ', error)
            }    
        },
        async addQuestion() {
            if (!this.surveyId) {
                console.error('설문조사가 먼저 생성되어야 합니다.')
                return
            }
            try {
                const payload = { 
                    survey: this.surveyId, 
                    question: this.question.questionText, 
                    survey_type: this.question.surveyType 
                }
                const response = await this.requestCreateSurveyQuestionToDjango(payload)
                console.log('질문 등록 성공:', response)
                this.questionId = response.questionId
            } catch (error) {
                console.error('질문 등록 중 에러 발생: ', error)
            }
        }
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