<template>
    <v-card class="stats-card">
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text>
            <v-list>
                <v-list-item v-for="(item, index) in items" :key="index">
                    <template v-slot:prepend>
                        <v-icon>{{ item.icon }}</v-icon>
                    </template>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.value }}</v-list-item-subtitle>
                </v-list-item>
            </v-list>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
defineProps<{
    title: string
    items: Array<{
        icon: string
        title: string
        value: string
    }>
}>()
</script>