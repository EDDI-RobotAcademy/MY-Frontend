<template>
    <div class="app-container">
        <div class="content-wrapper">
            <div class="header">
                <h1>키워드 분석</h1>
            </div>
            <trendkeywordAnalysisPage @keyword-selected="handleKeywordSelect"></trendkeywordAnalysisPage>
            <div class="main-content">
                <div class="search-form">
                    <div class="form-group">
                        <DateRangeSelector v-model:startDate="formData.startDate" v-model:endDate="formData.endDate"
                            v-model:timeUnit="formData.timeUnit" />
                    </div>
                    <div class="keyword-section">
                        <KeywordInput v-model:keywords="formData.keywords" />
                        <button @click="fetchTrendData" class="btn-search" :disabled="loading">
                            <span v-if="loading" class="loading-spinner">⌛</span>
                            <span>{{ loading ? '검색 중...' : '검색' }}</span>
                        </button>
                    </div>
                </div>
            </div>
            <YoutubeResults :searchQuery="currentKeyword" />
            <ErrorMessage v-if="error" :message="error" />
            <div v-if="trendData && !loading" class="results-section">
                <TrendChart title="검색 트렌드" :results="trendData.results" />
                <div class="analysis-grid">
                    <AnalysisCard title="성별 검색 분포" chartType="pie" :chartData="genderData" :chartOptions="pieOptions" />
                    <AnalysisCard title="연령대별 검색 분포" chartType="bar" :chartData="ageData" :chartOptions="barOptions" />
                    <AnalysisCard title="디바이스별 검색 비율" chartType="pie" :chartData="deviceData"
                        :chartOptions="pieOptions" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import DateRangeSelector from '../ui/DateRangeSelector.vue';
import KeywordInput from '../ui/KeywordInput.vue';
import TrendChart from '../ui/TrendChart.vue';
import AnalysisCard from '../ui/AnalysisCard.vue';
import ErrorMessage from '../ui/ErrorMessage.vue';
import trendkeywordAnalysisPage from '../ui/trendkeyword.vue';
import YoutubeResults from '../ui/YoutubeResults.vue';
const router = useRouter()
import {
    useKeywordAnalysisStore,
    type DataLabResponse,
    type DeviceAnalysis,
    type DemographicData
} from '../stores/keywordAnalysisStore';
const trendData = ref<DataLabResponse | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const keywordAnalysisStore = useKeywordAnalysisStore();
const today = new Date();
const thirtyDaysAgo = new Date(today);
const currentKeyword = ref('');
import { useAuthenticationStore } from '@/authentication/stores/authenticationStore'
const authStore = useAuthenticationStore();
thirtyDaysAgo.setDate(today.getDate() - 30);
const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};
const handleKeywordSelect = (keyword: string) => {
    formData.value.keywords = [keyword];
    currentKeyword.value = keyword;
    fetchTrendData();
};
const formData = ref({
    startDate: formatDate(thirtyDaysAgo),
    endDate: formatDate(today),
    timeUnit: 'date' as 'date' | 'week' | 'month',
    keywords: ['']
});
const demographic = computed(() => {
    return trendData.value?.demographic;
});
const deviceAnalysis = computed<DeviceAnalysis>(() => {
    return trendData.value?.deviceAnalysis || { pc: 0, mobile: 0 };
});

const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom' as const,
            labels: {
                padding: 20
            }
        },
        tooltip: {
            callbacks: {
                label: function (context: any) {
                    return `${context.label}: ${context.raw}%`;
                }
            }
        }
    }
};
const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            callbacks: {
                label: function (context: any) {
                    return `${context.label}: ${context.raw}%`;
                }
            }
        }
    },
    scales: {
        x: {
            type: 'category' as const,
            ticks: {
                autoSkip: true,
                maxRotation: 45
            }
        },
        y: {
            type: 'linear' as const,
            beginAtZero: true,
            max: 100,
            ticks: {
                callback: function (value: any) {
                    return value + '%';
                }
            }
        }
    }
};
const genderData = computed(() => ({
    labels: ['남성', '여성'],
    datasets: [{
        data: [
            demographic.value?.gender?.male || 0,
            demographic.value?.gender?.female || 0
        ],
        backgroundColor: ['#3B82F6', '#EC4899'],
        borderWidth: 1
    }]
}));
const ageData = computed(() => ({
    labels: ['10대', '20대', '30대', '40대', '50대', '60대 이상'],
    datasets: [{
        label: '연령대별 검색 비율',
        data: Object.values(demographic.value?.age || {}),
        backgroundColor: '#60A5FA',
        borderWidth: 1,
        borderColor: '#2563EB'
    }]
}));
const deviceData = computed(() => ({
    labels: ['PC', 'Mobile'],
    datasets: [{
        data: [
            deviceAnalysis.value.pc || 0,
            deviceAnalysis.value.mobile || 0
        ],
        backgroundColor: ['#3B82F6', '#10B981'],
        borderWidth: 1
    }]
}));
const validateForm = (): boolean => {
    if (!formData.value.keywords.length) {
        error.value = '최소 하나의 키워드가 필요합니다';
        return false;
    }
    const isValid = formData.value.keywords.every(keyword => keyword.trim() !== '');
    if (!isValid) {
        error.value = '모든 키워드를 입력해주세요';
        return false;
    }
    const startDate = new Date(formData.value.startDate);
    const endDate = new Date(formData.value.endDate);
    if (startDate > endDate) {
        error.value = '시작일이 종료일보다 늦을 수 없습니다';
        return false;
    }
    return true;
};
const fetchTrendData = async () => {
    if (!validateForm()) return;
    loading.value = true;
    error.value = null;
    try {
        const result = await keywordAnalysisStore.requestDatalabTrendDataToDjango({
            ...formData.value,
            includeDemographic: true,
            includeTimeAnalysis: true
        });
        trendData.value = result;
    } catch (e) {
        console.error('Error occurred:', e);
        error.value = keywordAnalysisStore.datalabError || '데이터 로딩 중 오류가 발생했습니다';
    } finally {
        loading.value = false;
    }
};
onMounted(() => {
    if (!localStorage.getItem("userToken")) {
        authStore.requestGuestTokenToDjango()
            .catch(error => console.error("Error initializing guest token:", error))
    }
    if (!authStore.isAuthenticated) {
        router.push("/login")
    }
})
</script>
<style scoped>
.app-container {
    min-height: 100vh;
    background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
    padding: 48px 0;
}

.content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}

.header {
    margin-top: 48px;
    text-align: center;
    margin-bottom: 48px;
}

.header h1 {
    display: inline-block;
    font-size: 32px;
    font-weight: bold;
    color: #333;
    padding: 16px 32px;
    position: relative;
}

.header h1::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 4px;
    background-color: #2DB400;
    border-radius: 2px;
}

.main-content {
    max-width: 1000px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin: 0 auto;
}

.search-form {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
}

.form-group {
    margin: 0;
    display: flex;
    align-items: center;
}

.date-selector {
    display: flex;
    align-items: center;
    gap: 16px;
}

.date-input {
    padding: 8px 12px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
}

.time-unit-select {
    padding: 8px 12px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: white;
}

.keyword-section {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
}

.keyword-input {
    flex: 1;
    padding: 8px 12px;
    background-color: black;
    color: white;
    border: none;
    border-radius: 8px;
}

.btn-search {
    color: white;
    height: 35px;
    padding: 0 16px;
    background-color: #ff9033;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.btn-search:hover {
    background-color: #ffbc86;
}

.btn-search:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.loading-spinner {
    animation: spin 1s linear infinite;
    display: inline-block;
}

.youtube-section {
    margin: 20px 0;
    max-width: 1000px;
    margin: 20px auto;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.results-section {
    margin-top: 32px;
}

.analysis-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-top: 32px;
}

/* 반응형 스타일 */
@media (max-width: 1024px) {
    .search-form {
        flex-direction: column;
    }

    .form-group,
    .keyword-section {
        width: 100%;
    }

    .btn-search {
        width: 100%;
    }
}

@media (max-width: 768px) {
    .analysis-grid {
        grid-template-columns: 1fr;
    }

    .btn-search {
        width: 20%;
    }
}

@media (max-width: 480px) {
    .header h1 {
        font-size: 24px;
        padding: 12px 24px;
    }

    .content-wrapper {
        padding: 0 16px;
    }

    .main-content {
        padding: 16px;
    }
}
</style>