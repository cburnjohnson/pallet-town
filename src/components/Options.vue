<template>
  <div class="options">
    <ul class="options__list">
      <li
        v-for="option in npcOptions"
        :key="option.name"
        class="options__item"
      >
        <button class="option__button">
          {{ option.name }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import useStore from '@/store';
import { mapState } from 'pinia';

export default {
  computed: {
    ...mapState(useStore, ['activeNPC']),
    npcOptions() {
      return this.activeNPC.interactions.options;
    }
  }
};
</script>

<style lang="scss" scoped>
.options {
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  padding: 16px;
  border-radius: $border-radius;
}
</style>
