<template>
  <div class="game">
    <GameCanvas />

    <DialogBox v-if="interaction.active" />
  </div>
</template>

<script>
import GameCanvas from '@/components/GameCanvas.vue';
import DialogBox from '@/components/DialogBox.vue';
import useStore from '@/store';
import { mapState } from 'pinia';

export default {
  components: {
    GameCanvas,
    DialogBox
  },
  computed: {
    ...mapState(useStore, ['interaction'])
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
