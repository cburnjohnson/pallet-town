import { context } from '@/components/Game.vue';

export default class Boundary {
  static width = 64;
  static height = 64;

  constructor({ position }) {
    this.position = position;
    this.width = 60;
    this.height = 40;
  }

  draw() {
    context.fillStyle = 'rgba(255, 255, 255, .5)';
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
