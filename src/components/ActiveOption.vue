<template>
  <div class="active-option">
    <header class="active-option__header">
      <h1 class="active-option__name">
        {{ activeOption?.name }}
      </h1>
    </header>

    <div class="active-option__body">
      <p class="active-option__description">
        {{ activeOption?.description }}
      </p>

      <div
        class="active-option__group active-option__group--mt active-option__group--gap"
      >
        <img
          :src="activeOption.thumbnail"
          alt=""
          class="active-option__thumbnail"
        >

        <div
          class="active-option__group active-option__group--col active-option__group--gap"
        >
          <h2 class="active-option__header active-option__header--2">
            Technology Used
          </h2>

          <div class="active-option__group">
            <ul class="active-option__list">
              <li
                v-for="technology in activeOption?.technologyUsed"
                :key="technology"
                class="active-option__item"
              >
                {{ technology }}
              </li>
            </ul>
          </div>

          <ul class="active-option__list">
            <li
              v-for="link in activeOption?.links"
              :key="link"
              class="active-option__item"
            >
              <a
                :href="link.url"
                class="active-option__link"
                target="_blank"
              >
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    activeOption: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.active-option {
  @include dialog-border;

  grid-area: activeOption;
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  text-align: center;
  margin-right: 16px;
  max-height: 30vw;
  max-width: 100%;
  overflow-y: auto;

  &__body {
    margin-top: 12px;
  }

  &__list {
    list-style: none;
    display: flex;
    justify-content: space-around;
    flex-flow: wrap;
    margin-top: 10px;
  }

  &__item {
    min-width: 33.33%;
    margin-top: 8px;
    font-size: 12px;
  }

  &__header {
    &--2 {
      font-size: 1.3rem;
    }
  }

  &__group {
    display: flex;

    &--col {
      flex-direction: column;
    }

    &--space {
      justify-content: space-around;
    }

    &--mt {
      margin-top: 16px;
    }

    &--gap {
      gap: 8px;
    }
  }

  &__thumbnail {
    width: 60%;
  }

  &__link {
    font-size: 16px;
  }
}
</style>
