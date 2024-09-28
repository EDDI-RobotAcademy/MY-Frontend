<template>
  <div></div>
</template>
<script>
import { mapActions } from 'vuex'
const googleAuthenticationModule = 'googleAuthenticationModule'
export default {
  methods: {
    ...mapActions(googleAuthenticationModule, [
      'requestAccessTokenToDjangoRedirection',
    ]),
    async setRedirectData () {
        const code = this.$route.query.code
        console.log('code:', code)
        
        await this.requestAccessTokenToDjangoRedirection({ code })
    }
  },
  async created () {
      await this.setRedirectData()
  }
}
</script>