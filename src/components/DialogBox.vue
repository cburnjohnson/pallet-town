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
    dialog() {
      switch (this.activeNPC.activeInteraction) {
        case 'dialog':
          return this.activeNPC.interactions.dialog[
            this.activeNPC.interactionStep
          ];

        case 'endDialog':
          return this.activeNPC.interactions.endDialog;

        default:
          return null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-box {
  @include dialog-border;

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
