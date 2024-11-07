import { defineStore } from 'pinia';
import { ref } from 'vue';
import { createAxiosInstances } from '../../utility/axiosInstance'

interface DataLabRequest {
  startDate: string;
  endDate: string;
  timeUnit: 'date' | 'week' | 'month';
  keywords: string[];
  includeDemographic?: boolean;
  includeTimeAnalysis?: boolean;
}

interface DemographicData {
  gender: {
    male: number;
    female: number;
  };
  age: {
    '10s': number;
    '20s': number;
    '30s': number;
    '40s': number;
    '50s': number;
    '60s': number;
  };
}

interface DeviceAnalysis {
  pc: number;
  mobile: number;
}

interface TimeAnalysis {
  weekday: number;
  weekend: number;
  peakHours: string[];
  lowHours: string[];
}

interface TrendData {
  period: string;
  ratio: number;
}

interface DataLabResult {
  title: string;
  data: TrendData[];
}

interface DataLabResponse {
  startDate: string;
  endDate: string;
  timeUnit: string;
  results: DataLabResult[];
  demographic?: DemographicData;
  deviceAnalysis?: DeviceAnalysis;
  timeAnalysis?: TimeAnalysis;
  relatedKeywords?: Array<{
    keyword: string;
    score: number;
  }>;
}

export const useKeywordAnalysisStore = defineStore('account', () => {
  const datalabError = ref<string | null>(null);

  async function requestDatalabTrendDataToDjango(formData: DataLabRequest): Promise<DataLabResponse> {
    const { djangoAxiosInst } = createAxiosInstances();
    try {
      const response = await djangoAxiosInst.post('/keyword_search/datalab', formData, {
        timeout: 100000
      });
      datalabError.value = null;
      return response.data;
    } catch (error) {
      console.error('데이터랩 API 요청 실패:', error);
      datalabError.value = '데이터 요청 중 오류가 발생했습니다.';
      throw error;
    }
  }
  
  async function requestTrendKeywordToDjango() {
    const { djangoAxiosInst } = createAxiosInstances();
    try {
      const response = await djangoAxiosInst.get('/keyword_search/get-hot-topic')
      return response.data;
    } catch (error) {
      console.error('requestTrendKeywordToDjango 요청 실패:', error);
      throw error;
    }
  }
  return {
    datalabError,
    requestDatalabTrendDataToDjango,
    requestTrendKeywordToDjango
  };
});

export type {
  DataLabRequest,
  DataLabResponse,
  DemographicData,
  DeviceAnalysis,
  TimeAnalysis,
  TrendData,
  DataLabResult
};