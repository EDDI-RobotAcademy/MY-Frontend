<template>
    <div class="modify-page-container">
        <div class="content-container">
            <BoardModifyContent />
        </div>
    </div>
</template>

<script setup lang="ts">
import BoardModifyContent from '../../ui/BoardModifyPage/BoardModifyContent.vue';
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