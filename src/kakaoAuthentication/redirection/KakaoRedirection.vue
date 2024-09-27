<template>
    <div></div>
</template>
<script>
export default {
    methods: {
        async setRedirectData () {
            const code = this.$route.query.code
            console.log('code:', code)
        }
    },
    async created () {
        await this.setRedirectData()
    }
}
</script>