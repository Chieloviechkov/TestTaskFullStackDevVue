<template>
  <div class="app-container">
    <ScalingAnimation />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ScalingAnimation from './components/ScalingAnimation.vue'

export default defineComponent({
  name: 'App',
  components: {
    ScalingAnimation
  }
})
</script>

<style scoped>
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
