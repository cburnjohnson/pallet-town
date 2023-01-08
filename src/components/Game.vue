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
import playerImageAsset from '@/assets/sprites/player/player-2.png';
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

    const playerImage = new Image();
    playerImage.src = playerImageAsset;

    this.player = new Sprite({
      context,
      image: playerImage,
      position: {
        x: this.gameCanvas.width / 2 - playerImage.width / 1 / 2,
        y: this.gameCanvas.height / 2
      },
      frames: {
        max: 10
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

      if (keys.w.pressed && lastKeyPressed === 'w') {
        this.map.position.y += 3;
      }

      if (keys.a.pressed && lastKeyPressed === 'a') {
        this.map.position.x += 3;
      }

      if (keys.s.pressed && lastKeyPressed === 's') {
        this.map.position.y -= 3;
      }

      if (keys.d.pressed && lastKeyPressed === 'd') {
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
