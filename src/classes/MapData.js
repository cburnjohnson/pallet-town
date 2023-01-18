export default class MapData {
  constructor({
    map,
    boundaries,
    foregroundObjects,
    entrances = [],
    exits = [],
    movables,
    npcs
  }) {
    this.map = map;
    this.boundaries = boundaries;
    this.foregroundObjects = foregroundObjects;
    this.entrances = entrances;
    this.exits = exits;
    this.movables = movables;
    this.npcs = npcs;
  }
}
