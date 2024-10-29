<template>
    <div class="modify-page-container">
        <div class="content-container">
            <FreeCommunityModifyContent />
        </div>
    </div>
</template>

<script setup lang="ts">
import FreeCommunityModifyContent from '../../ui/FreeCommunityModifyPage/FreeCommunityModifyContent.vue';
</script>

<style scoped>
.modify-page-container {
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