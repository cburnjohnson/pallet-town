<template>
  <canvas
    id="gameCanvas"
    class="game-canvas"
  />
</template>

<script>
import mapImageAsset from '@/assets/imgs/worldMap.png';
import homeMapImageAsset from '@/assets/imgs/homeMap.png';
import labMapImageAsset from '@/assets/imgs/labMap.png';
import foregroundObjectsAsset from '@/assets/imgs/worldForegroundObjects.png';
import homeForegroundObjectsImageAsset from '@/assets/imgs/homeForegroundObjects.png';
import labForegroundObjectsImageAsset from '@/assets/imgs/labForegroundObjects.png';
import playerDownImageAsset from '@/assets/sprites/player/red-down.png';
import playerLeftImageAsset from '@/assets/sprites/player/red-left.png';
import playerRightImageAsset from '@/assets/sprites/player/red-right.png';
import playerUpImageAsset from '@/assets/sprites/player/red-up.png';
import coleDownImageAsset from '@/assets/sprites/npcs/cole-down.png';
import Sprite from '@/classes/Sprite';
import NPC from '@/classes/NPC';
import Player from '@/classes/Player';
import Boundary from '@/classes/Boundary';
import MapData from '@/classes/MapData';
import boundariesData from '@/data/boundariesData';
import labBoundariesData from '@/data/labBoundariesData';
import entrancesData from '@/data/entrancesData';
import homeExitData from '@/data/homeExitData';
import labExitData from '@/data/labExitData';
import homeBoundariesData from '@/data/homeBoundariesData';
import useStore from '@/store';
import { mapWritableState } from 'pinia';
import projects from '@/library/projects';

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
    x: -310,
    y: -570
  },
  TILE_WIDTH: 30,
  ZOOM_LEVEL: 400
};

const HOME_MAP = {
  OFFSET: {
    x: -369,
    y: -509
  },
  TILE_WIDTH: 34,
  ZOOM_LEVEL: 225
};

const LAB_MAP = {
  OFFSET: {
    x: -187,
    y: -542
  },
  TILE_WIDTH: 34,
  ZOOM_LEVEL: 225
};

const SPEED = 3;

const SYMBOL_NUMBER_TO_MAP = {
  1050: 'HOME_MAP',
  1051: 'LAB_MAP'
};

// Screen size 1366 x 768

export default {
  data() {
    return {
      gameCanvas: null,
      player: null,
      mapAnimationFrame: null,
      activeMapData: null,
      worldMapData: null,
      homeMapData: null,
      canvasLoaded: false
    };
  },
  mounted() {
    this.gameCanvas = document.querySelector('#gameCanvas');
    context = this.gameCanvas.getContext('2d');

    this.gameCanvas.width = 788;
    this.gameCanvas.height = 530;

    this.canvasLoaded = true;
  },
  computed: {
    ...mapWritableState(useStore, ['activeNPC'])
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

          case 'e':
            this.interact();

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

      const {
        map,
        boundaries,
        entrances,
        exits,
        foregroundObjects,
        movables,
        npcs
      } = this.activeMapData;

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

      npcs?.forEach((npc) => npc.draw());
      this.player.draw();

      foregroundObjects.draw();

      this.player.moving = false;

      if (this.activeNPC) {
        return;
      }

      if (keys.w.pressed && lastKeyPressed === 'w') {
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
    interact() {
      if (this.activeNPC) {
        if (
          this.activeNPC.interactionStep <
          this.activeNPC.interactions.dialog.length - 1
        ) {
          this.activeNPC.interactionStep++;

          return;
        }

        if (
          this.activeNPC.interactionStep ===
            this.activeNPC.interactions.dialog.length - 1 &&
          this.activeNPC.interactions.option?.list.length > 0 &&
          this.activeNPC.activeInteraction !== 'endDialog'
        ) {
          this.activeNPC.interactions.option.show = true;

          return;
        }

        this.endInteraction();
        return;
      }

      const npc = this.activeMapData.npcs.find((npc) => {
        let npcPositionYDiff = 0;
        let npcPositionXDiff = 0;

        switch (lastKeyPressed) {
          case 'w':
            npcPositionYDiff = SPEED;

            break;

          case 's':
            npcPositionYDiff = -SPEED;

            break;

          case 'a':
            npcPositionXDiff = SPEED;

            break;

          case 'd':
            npcPositionXDiff = -SPEED;

            break;
        }

        return this.rectangularCollision(this.player, {
          ...npc,
          position: {
            x: npc.position.x + npcPositionXDiff,
            y: npc.position.y + npcPositionYDiff
          }
        });
      });

      if (npc) {
        this.startInteraction(npc);
      }
    },
    async startInteraction(npc) {
      this.activeNPC = npc;
    },
    endInteraction() {
      this.resetActiveNPCInteractions();
      this.activeNPC = null;
    },
    resetActiveNPCInteractions() {
      this.activeNPC.interactionStep = 0;
      this.activeNPC.activeInteraction = 'dialog';
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
    createBoundaries(
      data,
      mapOffset,
      mapTileWidth,
      bw,
      symbolNumbers,
      boundaryColor
    ) {
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
              symbolNumber,
              color: boundaryColor
            })
          );
        });
      });

      return boundaries;
    },
    loadAssets() {
      // Player Creation
      const playerDownImage = new Image();
      playerDownImage.src = playerDownImageAsset;

      const playerUpImage = new Image();
      playerUpImage.src = playerUpImageAsset;

      const playerLeftImage = new Image();
      playerLeftImage.src = playerLeftImageAsset;

      const playerRightImage = new Image();
      playerRightImage.src = playerRightImageAsset;

      this.player = new Player({
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

      // NPC Creation
      const coleDownImage = new Image();
      coleDownImage.src = coleDownImageAsset;

      const coleNPC = new NPC({
        context,
        image: coleDownImage,
        sprites: {
          down: coleDownImage
        },
        position: {
          x: 446,
          y: -200
        },
        frames: {
          max: 1
        },
        interactions: {
          dialog: [
            'Hello, I\'m Cole Johnson, a JavaScript specialist in Software Development, delighted to meet you.',
            'Allow me to share with you my portfolio of accomplished projects.'
          ],
          option: {
            show: false,
            active: null,
            list: projects
          },
          endDialog: 'Thanks for looking!'
        },
        activeInteraction: 'dialog',
        interactionStep: 0
      });

      // World Map Creation
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

      const worldNPCs = [];

      this.worldMapData = new MapData({
        map: worldMap,
        boundaries: [...worldBoundaries, ...worldNPCs],
        foregroundObjects: worldForegroundObjects,
        entrances: entrances,
        npcs: worldNPCs,
        movables: [
          worldMap,
          worldForegroundObjects,
          ...worldBoundaries,
          ...entrances,
          ...worldNPCs
        ]
      });

      // Home Map Creation
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

      const homeForegroundObjectsImage = new Image();
      homeForegroundObjectsImage.src = homeForegroundObjectsImageAsset;

      const homeForegroundObjects = new Sprite({
        context,
        image: homeForegroundObjectsImage,
        position: {
          x: HOME_MAP.OFFSET.x,
          y: HOME_MAP.OFFSET.y
        }
      });

      const homeExits = this.createBoundaries(
        homeExitData,
        HOME_MAP.OFFSET,
        HOME_MAP.TILE_WIDTH,
        36,
        [8034]
      );
      const homeBoundaries = this.createBoundaries(
        homeBoundariesData,
        HOME_MAP.OFFSET,
        HOME_MAP.TILE_WIDTH,
        36,
        [8033]
      );

      this.homeMapData = new MapData({
        map: homeMap,
        boundaries: homeBoundaries,
        foregroundObjects: homeForegroundObjects,
        exits: homeExits,
        movables: [
          homeMap,
          ...homeBoundaries,
          ...homeExits,
          homeForegroundObjects
        ]
      });

      // Lab Map Creation
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

      const labForegroundObjectsImage = new Image();
      labForegroundObjectsImage.src = labForegroundObjectsImageAsset;

      const labForegroundObjects = new Sprite({
        context,
        image: labForegroundObjectsImage,
        position: {
          x: LAB_MAP.OFFSET.x,
          y: LAB_MAP.OFFSET.y
        }
      });

      const labBoundaries = this.createBoundaries(
        labBoundariesData,
        LAB_MAP.OFFSET,
        LAB_MAP.TILE_WIDTH,
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

      const labNPCs = [coleNPC];

      this.labMapData = new MapData({
        map: labMap,
        boundaries: [...labBoundaries, ...labNPCs],
        foregroundObjects: labForegroundObjects,
        exits: labExits,
        npcs: labNPCs,
        movables: [
          labMap,
          ...labBoundaries,
          ...labExits,
          labForegroundObjects,
          ...labNPCs
        ]
      });

      // Setting initial map
      this.activeMapData = this.worldMapData;

      this.animate();
      this.addEventListeners();
    }
  },
  watch: {
    canvasLoaded() {
      this.loadAssets();
    }
  }
};
</script>

<style lang="scss" scoped>
.game-canvas {
  display: block;
  border-radius: 6px;
  max-width: 880px;
}
</style>
