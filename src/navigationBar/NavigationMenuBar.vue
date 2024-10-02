<template>
  <div class="NavigationMenuBar">
    <div class="background">
      <v-row cols="12">
        <v-col cols="6">
          <button @click="goToHomePage" class="logo">
            COOING
          </button>
        </v-col>
        <v-col cols="6">
          <button v-if="!isAuthenticated" @click="goToLoginPage" class="login">
            로그인
          </button>
          <button v-if="isAuthenticated" @click="logOut" class="logout">
            로그아웃
          </button>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import router from "@/router";
import { mapState } from "vuex";
const authenticationModule = "authenticationModule";

export default {
  computed: {
    ...mapState(authenticationModule, ["isAuthenticated"]),
  },
  methods: {
    goToHomePage() {
      router.push("/");
    },
    goToLoginPage() {
      router.push("/login");
    },
  },
  mounted() {
    console.log("navigation bar mounted()");
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      console.log("You already has a userToken!");
      this.$store.state.authenticationModule.isAuthenticated = true;
    }
  },
}
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');

* {
  font-family: 'Noto Sans KR', sans-serif;
}

.NavigationMenuBar {
  position: fixed;
  width: 100%;
  height: 50px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.background {
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
  background-color: rgba(0, 0, 0, 0.6);
}

.logo {
  color: #fff;
  padding-left: 3%;
  padding-top: 1.5%;
}

.login {
  color: #fff;
  padding-left: 90%;
  padding-top: 1.5%;
}

.logout {
  color: #fff;
  padding-left: 88%;
  padding-top: 1.5%;
}
</style>