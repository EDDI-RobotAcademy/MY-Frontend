<template>
    <div></div>    
</template>

<script>
import { mapActions } from 'vuex';
const authenticationModule = 'naverAuthenticationModule'

export default {
    methods: {
        ...mapActions(authenticationModule, [
            'requestAccessTokenToDjangoRedirection', 'requestNaverUserInfoToDjango'
        ]),
        async setRedirectData () {
            const code = this.$route.query.code
            await this.requestAccessTokenToDjangoRedirection({ code })

            const userInfo = await this.requestNaverUserInfoToDjango()
            const email = userInfo.response.email
            console.log('userInfo: ', userInfo)
            console.log('email: ', email)
        },
    },
    async created () {
            await this.setRedirectData()
        }
}
</script>