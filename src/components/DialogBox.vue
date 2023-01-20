<template>
  <div class="dialog-box">
    {{ dialog }}
  </div>
</template>

<script>
import useStore from '@/store';
import { mapState } from 'pinia';

export default {
  computed: {
    ...mapState(useStore, ['activeNPC']),
    interactionStep() {
      return this.activeNPC.interactionStep;
    },
    dialog() {
      return this.activeNPC.interactions.dialog[this.interactionStep];
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-box {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 96%;
  height: 180px;
  background-color: white;
  border-radius: $border-radius;
  padding: 20px;
  line-height: 32px;
}
</style>
