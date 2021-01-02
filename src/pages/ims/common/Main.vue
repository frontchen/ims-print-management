<template>
  <div class="app-default-layout">
    <template v-if="loading">
      <rotate-square2></rotate-square2>
    </template>
    <template v-else>
      <!-- App Header -->
      <app-header></app-header>
      <!-- App Main Content -->
      <v-content>
        <!-- App Router -->
        <transition name="router-anim" :enter-active-class="`animated`">
          <router-view></router-view>
        </transition>
      </v-content>
      <!-- app customizer -->
      <!-- <app-customizer></app-customizer> -->
    </template>
  </div>
</template>

<script>
import MainHeader from './MainHeader'

export default {
  components: {
    appHeader: MainHeader
  },
  data() {
    return {
      loading: true
    }
  },
  mounted() {
    this.loading = false
  },
  methods: {}
}
</script>

<style lang="" scoped></style>
