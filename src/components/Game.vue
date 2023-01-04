<template>
  <canvas id="gameCanvas" />
</template>

<script>
export default {
  data() {
    return {
      gameCanvas: null
    };
  },
  mounted() {
    this.gameCanvas = document.querySelector('#gameCanvas');
  }
};
</script>

<style lang="scss" scoped></style>
