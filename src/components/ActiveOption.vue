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

      <ul class="active-option__list">
        <li
          v-for="technology in activeOption?.technologyUsed"
          :key="technology"
          class="active-option__item"
        >
          {{ technology }}
        </li>
      </ul>

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
  background-color: white;
  padding: 24px;
  border-radius: $border-radius;
}
</style>
