<template>
  <div class="options">
    <div class="options__list-container">
      <ul class="options__list options__list--option-categories">
        <li
          v-for="optionCategory in optionCategories"
          :key="optionCategory"
          :class="[
            'options__item',
            { 'options__item--active': isOptionCategoryActive(optionCategory) }
          ]"
        >
          <button
            class="options__button"
            @click="setActiveOptionCategory(optionCategory)"
          >
            {{ optionCategory }}
          </button>
        </li>
      </ul>

      <button
        class="options__button options__button--mt"
        @click="exitOptions"
      >
        Exit
      </button>
    </div>

    <div
      v-if="activeNPCOptions.length > 0"
      class="options__list-container"
    >
      <ul class="options__list options__list--options">
        <li
          v-for="option in activeNPCOptions"
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
    </div>

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
  data() {
    return {
      activeOptionCategory: null
    };
  },
  computed: {
    ...mapWritableState(useStore, ['activeNPC']),
    npcOptions() {
      return this.activeNPC.interactions.option.list;
    },
    activeOption() {
      return this.activeNPC.interactions.option.active;
    },
    optionCategories() {
      return new Set(this.npcOptions.map((npcOption) => npcOption.category));
    },
    activeNPCOptions() {
      return this.npcOptions.filter(
        (npcOption) => npcOption.category === this.activeOptionCategory
      );
    }
  },
  methods: {
    setActiveOption(option) {
      this.activeNPC.interactions.option.active = option;
    },
    isOptionActive(optionName) {
      return this.activeOption?.name === optionName;
    },
    isOptionCategoryActive(optionCategory) {
      return this.activeOptionCategory === optionCategory;
    },
    exitOptions() {
      this.activeNPC.interactions.option.show = false;
      this.activeNPC.activeInteraction = 'endDialog';
    },
    setActiveOptionCategory(optionCategory) {
      this.activeOptionCategory = optionCategory;
      this.activeNPC.interactions.option.active = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.options {
  position: absolute;
  top: 0px;
  display: grid;
  grid-template-areas:
    'optionCategories options .'
    'activeOption activeOption activeOption';
  gap: 16px;
  max-width: 100%;
  max-height: 100%;
  overflow: auto;
  padding: 16px;

  &__list-container {
    align-self: flex-start;
    background-color: white;
    padding: 24px;
    border-radius: 4px;
    border: 4px solid black;
    min-width: 270px;

    &--option-categories {
      grid-area: optionCategories;
    }

    &--options {
      grid-area: options;
    }
  }

  &__list {
    list-style: none;
    max-height: 80px;
    overflow-y: auto;
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

  &__button {
    &--mt {
      margin-top: 16px;
    }
  }
}
</style>
