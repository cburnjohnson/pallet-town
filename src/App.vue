<template>
  <div class="app">
    <Game />
  </div>
</template>

<script lang="ts">
import Game from '@/components/Game.vue';

export default {
  components: {
    Game
  }
};
</script>

<style lang="scss">
@import './styles/main.scss';

.app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
