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
import playerDownImageAsset from '@/assets/sprites/player/red-down.png';
import playerLeftImageAsset from '@/assets/sprites/player/red-left.png';
import playerRightImageAsset from '@/assets/sprites/player/red-right.png';
import playerUpImageAsset from '@/assets/sprites/player/red-up.png';
import Sprite from '@/classes/Sprite';

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
      map: null,
      player: null
    };
  },
  mounted() {
    this.gameCanvas = document.querySelector('#gameCanvas');
    context = this.gameCanvas.getContext('2d');

    this.gameCanvas.width = 840;
    this.gameCanvas.height = 800;

    const mapImage = new Image();
    mapImage.src = mapImageAsset;

    this.map = new Sprite({
      context,
      image: mapImage,
      position: {
        x: 0,
        y: -100
      }
    });

    const playerDownImage = new Image();
    playerDownImage.src = playerDownImageAsset;

    const playerUpImage = new Image();
    playerUpImage.src = playerUpImageAsset;

    const playerLeftImage = new Image();
    playerLeftImage.src = playerLeftImageAsset;

    const playerRightImage = new Image();
    playerRightImage.src = playerRightImageAsset;

    this.player = new Sprite({
      context,
      image: playerDownImage,
      sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage
      },
      position: {
        x: this.gameCanvas.width / 2 - playerDownImage.width / 4 / 2,
        y: this.gameCanvas.height / 2
      },
      frames: {
        max: 4
      }
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
      this.map.draw();
      this.player.draw();

      this.player.moving = false;

      if (keys.w.pressed && lastKeyPressed === 'w') {
        this.player.moving = true;
        this.player.image = this.player.sprites.up;

        this.map.position.y += 3;
      }

      if (keys.a.pressed && lastKeyPressed === 'a') {
        this.player.moving = true;
        this.player.image = this.player.sprites.left;

        this.map.position.x += 3;
      }

      if (keys.s.pressed && lastKeyPressed === 's') {
        this.player.moving = true;
        this.player.image = this.player.sprites.down;

        this.map.position.y -= 3;
      }

      if (keys.d.pressed && lastKeyPressed === 'd') {
        this.player.moving = true;
        this.player.image = this.player.sprites.right;

        this.map.position.x -= 3;
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
