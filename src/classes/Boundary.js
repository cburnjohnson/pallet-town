import { context } from '@/components/Game.vue';

export default class Boundary {
  static width = 64;
  static height = 64;

  constructor({ position }) {
    this.position = position;
    this.width = 64;
    this.height = 64;
  }

  draw() {
    context.fillStyle = 'red';
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}