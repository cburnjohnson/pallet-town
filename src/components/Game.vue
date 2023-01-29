<template>
  <div class="game">
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
  background-image: url('@/assets/gameboyBg.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;

  &__container {
    position: absolute;
    top: calc(50% - 10px);
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
