<template>
  <div class="game">
    <GameCanvas />

    <DialogBox v-if="activeNPC" />
    <Options v-if="showOptions" />
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
      return this.activeNPC?.showOptions;
    }
  }
};
</script>

<style lang="scss" scoped>
.game {
  margin: 0 auto;
  position: relative;
  max-width: 840px;
}
</style>
