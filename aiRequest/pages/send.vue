<script setup>
import {useAiRequestStore} from "../stores/aiRequestStore";

const aiRequestStore = useAiRequestStore()
const handleAiRequest = async () => {
  await aiRequestStore.aiRequestToDjango()
  
}
</script>

<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh;">
    <v-btn
        color="primary"
        class="mx-2"
        @click="handleAiRequest"
    >
      AI Request
    </v-btn>
  </v-container>
</template>