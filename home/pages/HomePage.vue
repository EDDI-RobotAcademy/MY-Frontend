<template>
  <FirstContent 
    overlayTitleOne="당신의 숨겨진 재능을 발견하세요,"
    overlayTitleTwo="그리고 인플루언서로 성장하세요."
    overlayDescription="COOING은 AI 컨설팅을 통해 맞춤형 성장 전략을 제시하여 당신의 꿈을 현실로 만들어 드립니다."
    :scrollToY="765"
    :scrollDuration="1500"
  >
  </FirstContent>
  <SecondContent>
  </SecondContent>
  <ThirdContent>
  </ThirdContent>
  <FourthContent>
  </FourthContent>
</template>

<script setup>
import FirstContent from '../ui/FirstContent.vue'
import SecondContent from '../ui/SecondContent.vue';
import ThirdContent from '../ui/ThirdContent.vue';
import FourthContent from '../ui/FourthContent.vue';

useSeoMeta({
  description: '인공지능 기술로 쉽고 경제적으로 시작하는 인플루언서 되는 법을 알려드립니다. 유튜버부터 소셜미디어 인플루언서까지, AI가 도와주는 맞춤형 인플루언서 육성 프로그램을 만나보세요.',
  ogTitle: '인공지능으로 시작하는 인플루언서의 길 | 쿠잉',
  ogDescription: '인공지능 기술로 쉽고 경제적으로 시작하는 인플루언서 되는 법을 알려드립니다. 유튜버부터 소셜미디어 인플루언서까지, AI가 도와주는 맞춤형 인플루언서 육성 프로그램을 만나보세요.',
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');

* {
  font-family: 'Noto Sans KR', sans-serif;
}
</style>