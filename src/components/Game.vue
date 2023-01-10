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
import foregroundObjectsAsset from '@/assets/imgs/foreground-objects.png';
import playerDownImageAsset from '@/assets/sprites/player/red-down.png';
import playerLeftImageAsset from '@/assets/sprites/player/red-left.png';
import playerRightImageAsset from '@/assets/sprites/player/red-right.png';
import playerUpImageAsset from '@/assets/sprites/player/red-up.png';
import Sprite from '@/classes/Sprite';
import Boundary from '@/classes/Boundary';
import boundariesData from '@/data/boundariesData';

export let context;
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

const mapOffset = {
  x: -300,
  y: -450
};

const SPEED = 3;

export default {
  data() {
    return {
      gameCanvas: null,
      map: null,
      foregroundObjects: null,
      player: null,
      boundaries: []
    };
  },
  computed: {
    movables() {
      return [this.map, this.foregroundObjects, ...this.boundaries];
    }
  },
  mounted() {
    this.gameCanvas = document.querySelector('#gameCanvas');
    context = this.gameCanvas.getContext('2d');

    this.gameCanvas.width = 840;
    this.gameCanvas.height = 800;

    const boundariesMap = [];
    for (let i = 0; i < boundariesData.length; i += 30) {
      boundariesMap.push(boundariesData.slice(i, i + 30));
    }

    boundariesMap.forEach((row, i) => {
      row.forEach((boundary, j) => {
        if (boundary !== 1049) {
          return;
        }

        this.boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width + mapOffset.x,
              y: i * Boundary.height + mapOffset.y
            }
          })
        );
      });
    });

    const mapImage = new Image();
    mapImage.src = mapImageAsset;

    this.map = new Sprite({
      context,
      image: mapImage,
      position: {
        x: mapOffset.x,
        y: mapOffset.y
      }
    });

    const foregroundObjects = new Image();
    foregroundObjects.src = foregroundObjectsAsset;

    this.foregroundObjects = new Sprite({
      context,
      image: foregroundObjects,
      position: {
        x: mapOffset.x,
        y: mapOffset.y
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

      this.boundaries.forEach((boundary) => {
        boundary.draw();
      });

      this.player.draw();
      this.foregroundObjects.draw();

      this.player.moving = false;

      if (keys.w.pressed && lastKeyPressed === 'w') {
        // stop movement if running into a boundary
        for (let i = 0; i < this.boundaries.length; i++) {
          const boundary = this.boundaries[i];
          if (
            this.rectangularCollision(this.player, {
              ...boundary,
              position: {
                x: boundary.position.x,
                y: boundary.position.y + SPEED
              }
            })
          ) {
            return;
          }
        }

        this.player.moving = true;
        this.player.image = this.player.sprites.up;

        this.movables.forEach((movable) => (movable.position.y += SPEED));
      }

      if (keys.a.pressed && lastKeyPressed === 'a') {
        // stop movement if running into a boundary
        for (let i = 0; i < this.boundaries.length; i++) {
          const boundary = this.boundaries[i];
          if (
            this.rectangularCollision(this.player, {
              ...boundary,
              position: {
                x: boundary.position.x + SPEED,
                y: boundary.position.y
              }
            })
          ) {
            return;
          }
        }

        this.player.moving = true;
        this.player.image = this.player.sprites.left;

        this.movables.forEach((movable) => (movable.position.x += SPEED));
      }

      if (keys.s.pressed && lastKeyPressed === 's') {
        // stop movement if running into a boundary
        for (let i = 0; i < this.boundaries.length; i++) {
          const boundary = this.boundaries[i];
          if (
            this.rectangularCollision(this.player, {
              ...boundary,
              position: {
                x: boundary.position.x,
                y: boundary.position.y - SPEED
              }
            })
          ) {
            return;
          }
        }

        this.player.moving = true;
        this.player.image = this.player.sprites.down;

        this.movables.forEach((movable) => (movable.position.y -= SPEED));
      }

      if (keys.d.pressed && lastKeyPressed === 'd') {
        // stop movement if running into a boundary
        for (let i = 0; i < this.boundaries.length; i++) {
          const boundary = this.boundaries[i];
          if (
            this.rectangularCollision(this.player, {
              ...boundary,
              position: {
                x: boundary.position.x - SPEED,
                y: boundary.position.y
              }
            })
          ) {
            return;
          }
        }

        this.player.moving = true;
        this.player.image = this.player.sprites.right;

        this.movables.forEach((movable) => (movable.position.x -= SPEED));
      }
    },
    rectangularCollision(rectangle1, rectangle2) {
      return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
      );
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
