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

    this.gameCanvas.width = 980;
    this.gameCanvas.height = 800;

    const image = new Image();
    image.src = mapImage;

    const playerImage = new Image();
    playerImage.src = playerSpriteImage;

    image.onload = () => {
      this.context.drawImage(image, 0, -100);
      this.context.drawImage(
        playerImage,
        0,
        0,
        playerImage.width / 4,
        playerImage.height,
        this.gameCanvas.width / 2 - playerImage.width / 2,
        this.gameCanvas.height / 2,
        playerImage.width / 4,
        playerImage.height
      );
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
