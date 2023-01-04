<template>
  <div class="game">
    <canvas
      id="gameCanvas"
      class="game__canvas"
    />
  </div>
</template>

<script>
import mapImage from '@/assets/imgs/game-portfolio-map.png';
import playerSpriteImage from '@/assets/sprites/player/playerDown.png';

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
    this.gameCanvas.height = 800;

    const image = new Image();
    image.src = mapImage;

    image.onload = () => {
      this.context.drawImage(image, -100, -250);

      playerImage.onload = () => {
        this.context.drawImage(playerImage, 150, 250);
      };
    };

    const playerImage = new Image();
    playerImage.src = playerSpriteImage;
  }
};
</script>

<style lang="scss" scoped>
.game {
  display: flex;
  justify-content: center;
}
</style>
