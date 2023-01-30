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
  background-color: white;
  border-radius: $border-radius;
  padding: 26px 20px;
  line-height: 32px;
  max-height: 124px;
  overflow-y: auto;
}
</style>
