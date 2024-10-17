<template>
  <v-app>
    <NavigationBar/>
    <v-main>
      <NuxtPage/>
    </v-main>
  </v-app>
</template>

<script>
import NavigationBar from '/navigationBar/pages/NavigationMenuBar'

export default {
  components: {
    NavigationBar
  }
}
</script>