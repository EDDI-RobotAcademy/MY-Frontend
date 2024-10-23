<template>
    <div class="read-page-container">
        <div class="content-container">
            <FreeCommunityReadContent />
        </div>
    </div>
</template>

<script setup lang="ts">
import FreeCommunityReadContent from '../../ui/FreeCommunityReadPage/FreeCommunityReadContent.vue';
</script>

<style scoped>
.read-page-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 100px);
}

.content-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}
</style>