<template>
    <div></div>
  </template>
  <script>
  import { mapActions } from 'vuex'
  const GoogleAuthenticationModule = 'GoogleAuthenticationModule'
  export default {
    methods: {
      ...mapActions(GoogleAuthenticationModule, [
        'requestAccessTokenToDjangoRedirection',
      ]),
      async setRedirectData () {
          const code = this.$route.query.code
          await this.requestAccessTokenToDjangoRedirection({ code })
      }
    },
    async created () {
        await this.setRedirectData()
    }
  }
  </script>