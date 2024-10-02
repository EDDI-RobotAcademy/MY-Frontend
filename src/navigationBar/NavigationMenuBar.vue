<template>
  <div class="NavigationMenuBar" @click="gotoContactPage">
    <div class="background">
      <v-row cols="12">
        <v-col cols="6" class="logo">
          COOING
        </v-col>
        <v-col cols="6">
          <button class="login">
            로그인
          </button>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>

export default {
  name: 'NavigationMenuBar',
}
</script>

<style scoped>
.NavigationMenuBar {
  position: fixed;
  width: 100%;
  height: 70px;
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
  padding-top: 2%;
}

.login {
  color: #fff;
  padding-left: 80%;
  padding-top: 3%;
}
</style>