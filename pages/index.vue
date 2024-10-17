<template>
    <v-app>
        <v-main>
            <nav>
            </nav>
            <HomePage />
        </v-main>
    </v-app>
</template>

<script>
import { defineComponent } from 'vue'
import HomePage from '~/home/pages/HomePage.vue'

export default defineComponent({
    name: 'IndexPage',
    components: {
        HomePage
    }
})
</script>