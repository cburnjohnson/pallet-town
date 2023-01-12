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
import homeMapImageAsset from '@/assets/imgs/homeMap.png';
import foregroundObjectsAsset from '@/assets/imgs/foreground-objects.png';
import playerDownImageAsset from '@/assets/sprites/player/red-down.png';
import playerLeftImageAsset from '@/assets/sprites/player/red-left.png';
import playerRightImageAsset from '@/assets/sprites/player/red-right.png';
import playerUpImageAsset from '@/assets/sprites/player/red-up.png';
import Sprite from '@/classes/Sprite';
import Boundary from '@/classes/Boundary';
import boundariesData from '@/data/boundariesData';
import homeData from '@/data/homeData';
import homeExitData from '@/data/homeExitData';

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
const TOTAL_AMOUNT_OF_TILES_WIDE = 30;

export default {
  data() {
    return {
      gameCanvas: null,
      map: null,
      homeMap: null,
      foregroundObjects: null,
      player: null,
      boundaries: [],
      entrances: [],
      homeExits: [],
      mapAnimationFrame: null,
      homeAnimationFrame: null
    };
  },
  computed: {
    worldMovables() {
      return [
        this.map,
        this.foregroundObjects,
        ...this.boundaries,
        ...this.entrances
      ];
    },
    buildingMovables() {
      return [this.homeMap, ...this.homeExits];
    }
  },
  mounted() {
    this.gameCanvas = document.querySelector('#gameCanvas');
    context = this.gameCanvas.getContext('2d');

    this.gameCanvas.width = 840;
    this.gameCanvas.height = 800;

    this.boundaries = this.createBoundaries(boundariesData, 1049);
    this.entrances = this.createBoundaries(homeData, 1050);
    this.homeExits = this.createBoundaries(homeExitData, 8034);

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

    const homeMap = new Image();
    homeMap.src = homeMapImageAsset;

    this.homeMap = new Sprite({
      context,
      image: homeMap,
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
      this.mapAnimationFrame = window.requestAnimationFrame(this.animate);
      this.map.draw();

      this.boundaries.forEach((boundary) => {
        boundary.draw();
      });

      this.entrances.forEach((entrance) => {
        entrance.draw();
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

        // check if player is going into an entrance
        for (let i = 0; i < this.entrances.length; i++) {
          const entrance = this.entrances[i];
          if (
            this.rectangularCollision(this.player, {
              ...entrance,
              position: {
                x: entrance.position.x,
                y: entrance.position.y + SPEED
              }
            })
          ) {
            this.enterBuilding();
            return;
          }
        }

        this.player.moving = true;
        this.player.image = this.player.sprites.up;

        this.worldMovables.forEach((movable) => (movable.position.y += SPEED));
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

        this.worldMovables.forEach((movable) => (movable.position.x += SPEED));
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

        this.worldMovables.forEach((movable) => (movable.position.y -= SPEED));
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

        this.worldMovables.forEach((movable) => (movable.position.x -= SPEED));
      }
    },
    animateHome() {
      this.homeAnimationFrame = window.requestAnimationFrame(this.animateHome);

      this.homeMap.draw();

      this.homeExits.forEach((homeExit) => {
        homeExit.draw();
      });

      this.player.draw();

      this.player.moving = false;

      if (keys.w.pressed && lastKeyPressed === 'w') {
        this.player.moving = true;
        this.player.image = this.player.sprites.up;

        this.buildingMovables.forEach(
          (movable) => (movable.position.y += SPEED)
        );
      }

      if (keys.a.pressed && lastKeyPressed === 'a') {
        this.player.moving = true;
        this.player.image = this.player.sprites.left;

        this.buildingMovables.forEach(
          (movable) => (movable.position.x += SPEED)
        );
      }

      if (keys.s.pressed && lastKeyPressed === 's') {
        // check if player is going into an exit
        for (let i = 0; i < this.homeExits.length; i++) {
          const homeExit = this.homeExits[i];
          if (
            this.rectangularCollision(this.player, {
              ...homeExit,
              position: {
                x: homeExit.position.x,
                y: homeExit.position.y - SPEED
              }
            })
          ) {
            this.leaveBuilding();
            return;
          }
        }

        this.player.moving = true;
        this.player.image = this.player.sprites.down;

        this.buildingMovables.forEach(
          (movable) => (movable.position.y -= SPEED)
        );
      }

      if (keys.d.pressed && lastKeyPressed === 'd') {
        this.player.moving = true;
        this.player.image = this.player.sprites.right;

        this.buildingMovables.forEach(
          (movable) => (movable.position.x -= SPEED)
        );
      }
    },
    rectangularCollision(rectangle1, rectangle2) {
      return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
      );
    },
    enterBuilding() {
      cancelAnimationFrame(this.mapAnimationFrame);
      this.animateHome();
    },
    leaveBuilding() {
      cancelAnimationFrame(this.homeAnimationFrame);
      this.animate();
    },
    createBoundaries(data, symbolNumber) {
      const boundariesMap = [];
      for (let i = 0; i < data.length; i += TOTAL_AMOUNT_OF_TILES_WIDE) {
        boundariesMap.push(data.slice(i, i + TOTAL_AMOUNT_OF_TILES_WIDE));
      }

      const boundaries = [];
      boundariesMap.forEach((row, i) => {
        row.forEach((boundary, j) => {
          if (boundary !== symbolNumber) {
            return;
          }

          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width + mapOffset.x,
                y: i * Boundary.height + mapOffset.y
              }
            })
          );
        });
      });

      return boundaries;
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
