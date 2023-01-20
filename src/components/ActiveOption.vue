<template>
  <div class="active-option">
    <header class="active-option__header">
      <h1 class="active-option__name">
        {{ activeOption?.name }}
      </h1>
    </header>

    <div class="active-option__body">
      <p class="active-option__description">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta quos
        doloremque, minus sed atque quaerat est rem. Temporibus, inventore
        perspiciatis.
      </p>

      <ul class="active-option__technologies">
        <li class="active-option__technology">
          tech 1
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
