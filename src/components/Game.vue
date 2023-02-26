<template>
  <div class="game">
    <img
      src="@/assets/gameboyBg.svg"
      alt=""
      class="game__background"
    >

    <div class="game__container">
      <GameCanvas />
      <GameControls />

      <DialogBox v-if="activeNPC" />
      <Options v-if="showOptions" />
    </div>
  </div>
</template>

<script>
import GameCanvas from '@/components/GameCanvas.vue';
import DialogBox from '@/components/DialogBox.vue';
import Options from '@/components/Options.vue';
import GameControls from '@/components/GameControls.vue';
import useStore from '@/store';
import { mapState } from 'pinia';

export default {
  components: {
    GameCanvas,
    DialogBox,
    Options,
    GameControls
  },
  computed: {
    ...mapState(useStore, ['activeNPC']),
    showOptions() {
      return this.activeNPC?.interactions.option?.show;
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
  max-width: 1366px;
  min-width: 1366px;

  &__container {
    position: absolute;
    top: calc(50% - 45px);
    left: calc(50% - 5px);
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
