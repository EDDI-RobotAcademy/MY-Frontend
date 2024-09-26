<template>
    <button v-if="!visibleGoogleButton" class="google-login-btn" @click="googleLoginClick"></button>
    <div id="G_OAuth_btn"></div>
</template>

<script>
import { mapActions } from 'vuex'

const googleAuthenticationModule = 'googleAuthenticationModule'

export default {
    ...mapActions(googleAuthenticationModule, ['requestGoogleOauthRedirectionToDjango']),

    components: {},
    data() {
        return {
            googleUser: {},
            visibleGoogleButton: false,
        };
    },
    methods: {
        googleLoginClick() {
            let google = window.google;
            google.accounts.id.initialize({
                client_id:
                    "415674556897-38o9fmeedntbld8hj0m6jq9b6ibgsqg8.apps.googleusercontent.com",
                callback: this.googleCallback,
            });
            google.accounts.id.renderButton(document.getElementById("G_OAuth_btn"), {
                theme: "outline",
                size: "large",
            });
            this.visibleGoogleButton = true
        },
        googleCallback(res) {
            console.log("res: ", res);

            try {
                const decodedCredential = atob(res.credential.split('.')[1]);
                const jsonCredential = JSON.parse(decodedCredential);

                jsonCredential.name = decodeURIComponent(escape(jsonCredential.name));

                this.googleUser = jsonCredential;
                console.log(this.googleUser);
            } catch (error) {
                console.error("JWT Decode Error: ", error);
            }
        },
    },
};
</script>

<style scoped>
.google-login-btn {
    margin: 10px 0;
    background-image: url("@/assets/images/fixed/login/googleLogin.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    height: 50px;
    width: 200px;
}
</style>