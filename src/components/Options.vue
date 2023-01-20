<template>
  <div class="options">
    <ul class="options__list">
      <li
        v-for="option in npcOptions"
        :key="option.id"
        class="options__item"
        @click="setActiveOption(option)"
      >
        <button class="option__button">
          {{ option.name }}
        </button>
      </li>
    </ul>

    <ActiveOption
      v-if="true"
      :active-option="activeOption"
    />
  </div>
</template>

<script>
import useStore from '@/store';
import { mapWritableState } from 'pinia';
import ActiveOption from '@/components/ActiveOption.vue';

export default {
  components: {
    ActiveOption
  },
  computed: {
    ...mapWritableState(useStore, ['activeNPC']),
    npcOptions() {
      return this.activeNPC.interactions.option.list;
    },
    activeOption() {
      return this.activeNPC.interactions.option.active;
    }
  },
  methods: {
    setActiveOption(option) {
      this.activeNPC.interactions.option.active = option;
    }
  }
};
</script>

<style lang="scss" scoped>
.options {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  gap: 16px;

  &__list {
    list-style: none;
    background-color: white;
    padding: 24px;
    border-radius: $border-radius;
  }
}
</style>
