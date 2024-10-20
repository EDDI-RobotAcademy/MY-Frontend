<template>
    <div class="influencer-analysis-page">
      <searchInfluencer @searchResult="handleSearchResult" v-if="!showResults" />
      <influencerAnalysisResultPage 
        v-if="showResults" 
        :influencerData="influencerData"
        @backToSearch="resetSearch"
      />
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import searchInfluencer from '../ui/searchInfluencer.vue';
  import influencerAnalysisResultPage from '../ui/InfluencerAnalysisResultPage.vue';
  
  export default {
    name: 'InfluencerAnalysisPage',
    components: {
      searchInfluencer,
      influencerAnalysisResultPage,
    },
    setup() {
      const showResults = ref(false);
      const influencerData = ref(null);
  
      function handleSearchResult(data) {
        if (data) {
          influencerData.value = data;
          showResults.value = true;
        } else {
          alert('인플루언서를 찾을 수 없습니다. 다시 시도해주세요.');
        }
      }
  
      function resetSearch() {
        showResults.value = false;
        influencerData.value = null;
      }
  
      return {
        showResults,
        influencerData,
        handleSearchResult,
        resetSearch,
      };
    },
  };
  </script>
  
  <style scoped>
  .influencer-analysis-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  </style>