<template>
  <div class="options">
    <ul class="options__list">
      <li
        v-for="option in npcOptions"
        :key="option.name"
        :class="[
          'options__item',
          { 'options__item--active': isOptionActive(option.name) }
        ]"
        @click="setActiveOption(option)"
      >
        <button class="option__button">
          {{ option.name }}
        </button>
      </li>
    </ul>

    <ActiveOption
      v-if="activeOption"
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
    },
    isOptionActive(optionName) {
      return this.activeOption?.name === optionName;
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
    align-self: flex-start;
    list-style: none;
    background-color: white;
    padding: 24px;
    border-radius: 4px;
    border: 4px solid black;
    min-width: 270px;
  }

  &__item {
    position: relative;
    margin-top: 12px;

    &:first-child {
      margin-top: 0px;
    }

    &--active {
      &::before {
        content: '';
        position: absolute;
        border-style: solid;
        border-width: 8px 12px 8px 12px;
        border-color: transparent transparent transparent black;
        position: absolute;
        left: -16px;
      }
    }
  }
}
</style>
