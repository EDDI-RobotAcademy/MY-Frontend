<template>
    <div></div>    
</template>

<script>
import { mapActions } from 'vuex';
const authenticationModule = 'naverAuthenticationModule'

export default {
    methods: {
        ...mapActions(authenticationModule, [
            'requestAccessTokenToDjangoRedirection',
        ]),
        async setRedirectData () {
            const code = this.$route.query.code
            await this.requestAccessTokenToDjangoRedirection({ code })
        },
    },
    async created () {
            await this.setRedirectData()
        }
}
</script>