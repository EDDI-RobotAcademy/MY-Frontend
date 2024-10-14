<template>
    <div class="dashboard-container">
      <div class="title">
        <h2>사용자 성향조사 응답 분석</h2>
        <p>사용자 성향조사 ID를 입력하여 각 질문의 선택지 비율을 확인할 수 있습니다.</p>
      </div>
  
      <!-- 사용자 성향조사 ID 입력 필터 -->
      <div class="filter-section">
        <label for="userAnalysisId">사용자 성향조사 ID:</label>
        <input type="number" v-model="userAnalysisId" placeholder="사용자 성향조사 ID 입력" />
        <button @click="loadUserAnalysisAnswers" class="request-button">답변 조회</button>
      </div>
  
      <!-- 사용자 성향조사 질문별 답변 그래프 및 서술형 나열 -->
      <div v-if="processedQuestions.length" class="question-section">
        <div v-for="(questionData, index) in processedQuestions" :key="index" class="question-block">
          <div class="chart-info">
            <h3>{{ questionData.question_text }}</h3>
            <p>응답 {{ questionData.totalResponses }}개</p>
          </div>
  
          <!-- 선택형 질문의 경우 -->
          <div v-if="questionData.type === 'multiple_choice'" class="chart-container">
            <canvas :id="'chart-' + index"></canvas> <!-- 고정된 크기 설정 -->
          </div>
  
          <!-- 서술형 질문의 경우 -->
          <div v-if="questionData.type === 'open_ended'" class="open-ended-answers">
            <h4>서술형 답변:</h4>
            <ul class="scrollable-list">
              <li v-for="(answer, idx) in questionData.answers" :key="idx">{{ answer }}</li>
            </ul>
          </div>
        </div>
      </div>
      <p v-else>사용자 성향조사 답변이 없습니다.</p>
    </div>
  </template>
  
  <script>
  import { nextTick } from 'vue';
  import { mapActions } from 'vuex';
  import Chart from 'chart.js/auto';
  
  export default {
    name: 'UserAnalysisVisualizationPage',
    data() {
      return {
        userAnalysisId: null, // 사용자 성향조사 ID
        answers: [], // 필터링된 답변 리스트
        processedQuestions: [], // 처리된 질문 및 답변 데이터
        chartInstances: [] // 생성된 차트를 저장할 배열
      };
    },
    methods: {
      ...mapActions('userAnalysisInputModule', ['requestListUserAnalysisAnswerToDjango']),
  
      async loadUserAnalysisAnswers() {
        if (!this.userAnalysisId) {
          alert('사용자 성향조사 ID를 입력하세요.');
          return;
        }
  
        let payload = {
          filter: 'user_analysis',
          user_analysis_Id: this.userAnalysisId,
        };
  
        try {
          const response = await this.requestListUserAnalysisAnswerToDjango(payload);
          this.answers = response;
          this.processQuestions();
        } catch (error) {
          console.error('사용자 성향조사 답변 로드 중 오류 발생:', error);
        }
      },
  
      processQuestions() {
        this.processedQuestions = [];
  
        // 기존 차트가 있을 경우 모두 제거
        this.chartInstances.forEach(chart => chart.destroy());
        this.chartInstances = [];
  
        this.answers.forEach((answer) => {
          const questionText = answer.question_text;
          let question = this.processedQuestions.find(q => q.question_text === questionText);
  
          if (!question) {
            question = {
              question_text: questionText,
              type: this.getQuestionType(answer), // 질문 유형 결정
              choices: {},
              answers: [],
              totalResponses: 0
            };
            this.processedQuestions.push(question);
          }
  
          if (question.type === 'multiple_choice') {
            const selection = answer.user_analysis_custom_selection_text || answer.user_analysis_fixed_five_score_selection || answer.user_analysis_fixed_boolean_selection;
            if (selection) {
              if (!question.choices[selection]) {
                question.choices[selection] = 0;
              }
              question.choices[selection]++;
              question.totalResponses++;
            }
          } else if (question.type === 'open_ended') {
            question.answers.push(answer.answer_text);
            question.totalResponses++;
          }
        });
  
        // DOM이 업데이트된 후에 차트를 렌더링
        nextTick(() => {
          this.renderCharts();
        });
      },
  
      getQuestionType(answer) {
        // 선택형과 서술형 질문을 구분하는 로직
        if (answer.user_analysis_custom_selection_text || answer.user_analysis_fixed_five_score_selection || answer.user_analysis_fixed_boolean_selection) {
          return 'multiple_choice';
        } else if (answer.answer_text) {
          return 'open_ended';
        }
        return null;
      },
  
      renderCharts() {
        this.processedQuestions.forEach((questionData, index) => {
          if (questionData.type === 'multiple_choice') {
            const ctx = document.getElementById(`chart-${index}`).getContext('2d');
            const labels = Object.keys(questionData.choices);
            const data = Object.values(questionData.choices);
  
            const chartInstance = new Chart(ctx, {
              type: 'pie',
              data: {
                labels: labels,
                datasets: [{
                  label: '응답 비율',
                  data: data,
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                  ],
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true, // 반응형 활성화
                maintainAspectRatio: false, // 비율 유지 비활성화 (캔버스 크기에 맞춤)
                layout: {
                  padding: {
                    top: 20, // 위쪽에 패딩을 추가
                    bottom: 20, // 아래쪽에 패딩을 추가
                    left: 20, // 왼쪽에 패딩을 추가
                    right: 20 // 오른쪽에 패딩을 추가하여 legend가 짤리지 않도록
                  }
                },
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      padding: 20, // legend의 여백을 더 넓게 설정
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(tooltipItem) {
                        const total = tooltipItem.dataset.data.reduce((acc, value) => acc + value, 0);
                        const currentValue = tooltipItem.raw;
                        const percentage = Math.round((currentValue / total) * 100);
                        return `${tooltipItem.label}: ${percentage}% (${currentValue}개)`;
                      }
                    }
                  }
                }
              }
            });
    
              this.chartInstances.push(chartInstance);
            }
          });
        }
      }
    };
  </script>
  
  <style scoped>
  .dashboard-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
  }
  
  .title {
    text-align: center;
    margin-bottom: 20px;
    margin-top: 50px;
  }
  
  .filter-section {
    margin-bottom: 20px;
  }
  
  .question-section {
    margin-top: 20px;
  }
  
  .question-block {
    margin-bottom: 40px;
  }
  
  .chart-container {
    width: 600px;
    height: 400px;
    margin: 0 auto;
  }
  
  .chart-info {
    text-align: center;
    margin-bottom: 10px;
  }
  
  .open-ended-answers {
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 5px;
  }
  
  .open-ended-answers ul {
    list-style: none;
    padding: 0;
    max-height: 300px; /* 최대 높이 설정 */
    overflow-y: auto; /* 스크롤 활성화 */
  }
  
  .open-ended-answers li {
    background-color: white;
    padding: 10px;
    border: 1px solid #ddd;
    margin-bottom: 5px;
    border-radius: 3px;
  }
  
  .request-button {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  .request-button:hover {
    background-color: #5a6268;
  }
  </style>
  