<template>
  <div class="game-controls">
    <header class="game-controls__header">
      Game Controls
    </header>

    <div class="game-controls__group">
      <div class="game-controls__text-group">
        <p class="game-controls__text">
          W:Up S:Down
        </p>
        <p class="game-controls__text">
          A:Left D:Right
        </p>
        <p class="game-controls__text">
          E:Interact
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.game-controls {
  position: absolute;
  bottom: -90px;
  left: -75px;
  color: white;
  text-align: center;

  &__group {
    display: flex;
    justify-content: center;
    gap: 16px;
    font-size: 10px;
    margin-top: 8px;
  }

  &__text-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
}
</style>
