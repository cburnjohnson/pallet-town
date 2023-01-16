<template>
  <div class="game">
    <canvas
      id="gameCanvas"
      class="game__canvas"
    />
  </div>
</template>

<script>
import mapImageAsset from '@/assets/imgs/worldMap.png';
import homeMapImageAsset from '@/assets/imgs/homeMap.png';
import labMapImageAsset from '@/assets/imgs/labMap.png';
import foregroundObjectsAsset from '@/assets/imgs/worldForegroundObjects.png';
import playerDownImageAsset from '@/assets/sprites/player/red-down.png';
import playerLeftImageAsset from '@/assets/sprites/player/red-left.png';
import playerRightImageAsset from '@/assets/sprites/player/red-right.png';
import playerUpImageAsset from '@/assets/sprites/player/red-up.png';
import Sprite from '@/classes/Sprite';
import Boundary from '@/classes/Boundary';
import MapData from '@/classes/MapData';
import boundariesData from '@/data/boundariesData';
import labBoundariesData from '@/data/labBoundariesData';
import entrancesData from '@/data/entrancesData';
import homeExitData from '@/data/homeExitData';
import labExitData from '@/data/labExitData';
import homeBoundariesData from '@/data/homeBoundariesData';

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

const WORLD_MAP = {
  OFFSET: {
    x: -300,
    y: -450
  },
  TILE_WIDTH: 30,
  ZOOM_LEVEL: 400
};

const HOME_MAP = {
  OFFSET: {
    x: -300,
    y: -320
  },
  TILE_WIDTH: 34,
  ZOOM_LEVEL: 225
};

const LAB_MAP = {
  OFFSET: {
    x: -160,
    y: -410
  },
  TILE_WIDTH: 34,
  ZOOM_LEVEL: 225
};

const SPEED = 3;

const SYMBOL_NUMBER_TO_MAP = {
  1050: 'HOME_MAP',
  1051: 'LAB_MAP'
};

export default {
  data() {
    return {
      gameCanvas: null,
      player: null,
      mapAnimationFrame: null,
      activeMapData: null,
      worldMapData: null,
      homeMapData: null
    };
  },
  mounted() {
    this.gameCanvas = document.querySelector('#gameCanvas');
    context = this.gameCanvas.getContext('2d');

    this.gameCanvas.width = 840;
    this.gameCanvas.height = 800;

    const worldBoundaries = this.createBoundaries(
      boundariesData,
      WORLD_MAP.OFFSET,
      WORLD_MAP.TILE_WIDTH,
      64,
      [1049]
    );
    const entrances = this.createBoundaries(
      entrancesData,
      WORLD_MAP.OFFSET,
      WORLD_MAP.TILE_WIDTH,
      64,
      [1050, 1051]
    );
    const homeExits = this.createBoundaries(
      homeExitData,
      HOME_MAP.OFFSET,
      HOME_MAP.TILE_WIDTH,
      36,
      [8034]
    );
    const labExits = this.createBoundaries(
      labExitData,
      LAB_MAP.OFFSET,
      LAB_MAP.TILE_WIDTH,
      36,
      [8033]
    );
    const homeBoundaries = this.createBoundaries(
      homeBoundariesData,
      HOME_MAP.OFFSET,
      HOME_MAP.TILE_WIDTH,
      36,
      [8033]
    );
    const labBoundaries = this.createBoundaries(
      labBoundariesData,
      LAB_MAP.OFFSET,
      LAB_MAP.TILE_WIDTH,
      36,
      [8034]
    );

    const mapImage = new Image();
    mapImage.src = mapImageAsset;

    const worldMap = new Sprite({
      context,
      image: mapImage,
      position: {
        x: WORLD_MAP.OFFSET.x,
        y: WORLD_MAP.OFFSET.y
      }
    });

    const worldForegroundObjectsImage = new Image();
    worldForegroundObjectsImage.src = foregroundObjectsAsset;

    const worldForegroundObjects = new Sprite({
      context,
      image: worldForegroundObjectsImage,
      position: {
        x: WORLD_MAP.OFFSET.x,
        y: WORLD_MAP.OFFSET.y
      }
    });

    const homeMapImage = new Image();
    homeMapImage.src = homeMapImageAsset;

    const homeMap = new Sprite({
      context,
      image: homeMapImage,
      position: {
        x: HOME_MAP.OFFSET.x,
        y: HOME_MAP.OFFSET.y
      }
    });

    const labMapImage = new Image();
    labMapImage.src = labMapImageAsset;

    const labMap = new Sprite({
      context,
      image: labMapImage,
      position: {
        x: LAB_MAP.OFFSET.x,
        y: LAB_MAP.OFFSET.y
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

    this.worldMapData = new MapData({
      map: worldMap,
      boundaries: worldBoundaries,
      foregroundObjects: worldForegroundObjects,
      entrances: entrances,
      movables: [
        worldMap,
        worldForegroundObjects,
        ...worldBoundaries,
        ...entrances
      ]
    });

    this.homeMapData = new MapData({
      map: homeMap,
      boundaries: homeBoundaries,
      foregroundObjects: worldForegroundObjects,
      exits: homeExits,
      movables: [homeMap, ...homeBoundaries, ...homeExits]
    });

    this.labMapData = new MapData({
      map: labMap,
      boundaries: labBoundaries,
      foregroundObjects: worldForegroundObjects,
      exits: labExits,
      movables: [labMap, ...labBoundaries, ...labExits]
    });

    this.activeMapData = this.worldMapData;

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

      const { map, boundaries, entrances, exits, foregroundObjects, movables } =
        this.activeMapData;

      map.draw();

      boundaries.forEach((boundary) => {
        boundary.draw();
      });

      entrances.forEach((entrance) => {
        entrance.draw();
      });

      exits.forEach((exit) => {
        exit.draw();
      });

      this.player.draw();
      foregroundObjects.draw();

      this.player.moving = false;

      if (keys.w.pressed && lastKeyPressed === 'w') {
        // stop movement if running into a boundary
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
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
        for (let i = 0; i < entrances.length; i++) {
          const entrance = entrances[i];
          if (
            this.rectangularCollision(this.player, {
              ...entrance,
              position: {
                x: entrance.position.x,
                y: entrance.position.y + SPEED
              }
            })
          ) {
            const newMapName = SYMBOL_NUMBER_TO_MAP[entrance.symbolNumber];
            let newMapData;

            switch (newMapName) {
              case 'HOME_MAP':
                newMapData = this.homeMapData;

                break;

              case 'LAB_MAP':
                newMapData = this.labMapData;

                break;

              default:
                break;
            }

            this.setActiveMapData(newMapData);
            return;
          }
        }

        this.player.moving = true;
        this.player.image = this.player.sprites.up;

        movables.forEach((movable) => (movable.position.y += SPEED));
      }

      if (keys.a.pressed && lastKeyPressed === 'a') {
        // stop movement if running into a boundary
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
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

        movables.forEach((movable) => (movable.position.x += SPEED));
      }

      if (keys.s.pressed && lastKeyPressed === 's') {
        // stop movement if running into a boundary
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
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

        // check if player is going into an exit
        for (let i = 0; i < exits.length; i++) {
          const exit = exits[i];
          if (
            this.rectangularCollision(this.player, {
              ...exit,
              position: {
                x: exit.position.x,
                y: exit.position.y - SPEED
              }
            })
          ) {
            this.setActiveMapData(this.worldMapData);
            return;
          }
        }

        this.player.moving = true;
        this.player.image = this.player.sprites.down;

        movables.forEach((movable) => (movable.position.y -= SPEED));
      }

      if (keys.d.pressed && lastKeyPressed === 'd') {
        // stop movement if running into a boundary
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
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

        movables.forEach((movable) => (movable.position.x -= SPEED));
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
    setActiveMapData(mapData) {
      this.activeMapData = mapData;
    },
    createBoundaries(data, mapOffset, mapTileWidth, bw, symbolNumbers) {
      const boundariesMap = [];
      for (let i = 0; i < data.length; i += mapTileWidth) {
        boundariesMap.push(data.slice(i, i + mapTileWidth));
      }

      const boundaries = [];
      boundariesMap.forEach((row, i) => {
        row.forEach((boundary, j) => {
          const symbolNumber = symbolNumbers.find(
            (symbolNumber) => symbolNumber === boundary
          );
          if (!symbolNumber) {
            return;
          }

          boundaries.push(
            new Boundary({
              position: {
                x: j * bw + mapOffset.x,
                y: i * bw + mapOffset.y
              },
              symbolNumber
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
