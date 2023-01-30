<template>
  <div class="game">
    <img
      src="@/assets/gameboyBg.svg"
      alt=""
      class="game__background"
    >

    <div class="game__container">
      <GameCanvas />

      <DialogBox v-if="activeNPC" />
      <Options v-if="showOptions" />
    </div>
  </div>
</template>

<script>
import GameCanvas from '@/components/GameCanvas.vue';
import DialogBox from '@/components/DialogBox.vue';
import Options from '@/components/Options.vue';
import useStore from '@/store';
import { mapState } from 'pinia';
// 1512
export default {
  components: {
    GameCanvas,
    DialogBox,
    Options
  },
  computed: {
    ...mapState(useStore, ['activeNPC']),
    showOptions() {
      return this.activeNPC?.interactions.option.show;
    }
  }
};
</script>

<style lang="scss" scoped>
.game {
  margin: 0 auto;
  position: relative;
  height: 100%;
  width: 100%;
  max-width: 1512px;

  &__container {
    position: absolute;
    top: calc(50% - 3vw);
    left: calc(50% - 0.5vw);
    transform: translate(-50%, -50%);
  }

  &__background {
    width: 100%;
    position: absolute;
    top: calc(50%);
    left: calc(50%);
    transform: translate(-50%, -50%);
  }
}
</style>
