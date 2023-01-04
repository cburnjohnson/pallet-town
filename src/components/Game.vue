<template>
  <div class="game">
    <canvas id="gameCanvas" />
  </div>
</template>

<script>
import mapImage from '@/assets/imgs/game-portfolio-map.png';

export default {
  data() {
    return {
      gameCanvas: null,
      context: null
    };
  },
  mounted() {
    this.gameCanvas = document.querySelector('#gameCanvas');
    this.context = this.gameCanvas.getContext('2d');

    this.gameCanvas.width = 1024;
    this.gameCanvas.height = 576;

    const image = new Image();
    image.src = mapImage;

    image.onload = () => {
      this.context.drawImage(image, -100, -250);
    };
  }
};
</script>

<style lang="scss" scoped>
.game {
  display: flex;
  justify-content: center;
}
</style>
