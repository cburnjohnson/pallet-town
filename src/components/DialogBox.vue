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
    ...mapState(useStore, ['interaction']),
    dialog() {
      return this.interaction.npc.interactions.dialog;
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-box {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 300px;
  background-color: white;
}
</style>
