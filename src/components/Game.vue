<template>
  <div class="game">
    <canvas
      id="gameCanvas"
      class="game__canvas"
    />
  </div>
</template>

<script>
import mapImageAsset from '@/assets/imgs/game-portfolio-map.png';
import playerImageAsset from '@/assets/sprites/player/playerDown.png';

class Sprite {
  constructor({ position, image }) {
    this.position = position;
    this.image = image;
  }

  draw() {
    context.drawImage(this.image, this.position.x, this.position.y);
  }
}

let context;
let lastKeyPressed;
const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
};

export default {
  data() {
    return {
      gameCanvas: null,
      mapImage: null,
      playerImage: null,
      playerSprite: null
    };
  },
  mounted() {
    this.gameCanvas = document.querySelector('#gameCanvas');
    context = this.gameCanvas.getContext('2d');

    this.gameCanvas.width = 840;
    this.gameCanvas.height = 800;

    this.mapImage = new Image();
    this.mapImage.src = mapImageAsset;

    this.playerImage = new Image();
    this.playerImage.src = playerImageAsset;

    this.mapSprite = new Sprite({
      position: {
        x: 0,
        y: -100
      },
      image: this.mapImage
    });

    this.animate();

    this.addEventListeners();
  },
  methods: {
    addEventListeners() {
      window.addEventListener('keydown', (event) => {
        switch (event.key) {
          case 'w':
            keys.w.pressed = true;
            lastKeyPressed = 'w';

            break;

          case 'a':
            keys.a.pressed = true;
            lastKeyPressed = 'a';

            break;

          case 's':
            keys.s.pressed = true;
            lastKeyPressed = 's';

            break;

          case 'd':
            keys.d.pressed = true;
            lastKeyPressed = 'd';

            break;

          default:
            break;
        }
      });

      window.addEventListener('keyup', (event) => {
        switch (event.key) {
          case 'w':
            keys.w.pressed = false;

            break;

          case 'a':
            keys.a.pressed = false;

            break;

          case 's':
            keys.s.pressed = false;

            break;

          case 'd':
            keys.d.pressed = false;

            break;

          default:
            break;
        }
      });
    },
    animate() {
      window.requestAnimationFrame(this.animate);
      this.mapSprite.draw();

      context.drawImage(
        this.playerImage,
        0,
        0,
        this.playerImage.width / 4,
        this.playerImage.height,
        this.gameCanvas.width / 2 - this.playerImage.width / 4 / 2,
        this.gameCanvas.height / 2,
        this.playerImage.width / 4,
        this.playerImage.height
      );

      if (keys.w.pressed && lastKeyPressed === 'w') {
        this.mapSprite.position.y += 3;
      }

      if (keys.a.pressed && lastKeyPressed === 'a') {
        this.mapSprite.position.x += 3;
      }

      if (keys.s.pressed && lastKeyPressed === 's') {
        this.mapSprite.position.y -= 3;
      }

      if (keys.d.pressed && lastKeyPressed === 'd') {
        this.mapSprite.position.x -= 3;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.game {
  display: flex;
  justify-content: center;
}
</style>
