import { context } from '@/components/Game.vue';

export default class Boundary {
  static width = 64;
  static height = 64;

  constructor({ position, color = 'rgba(255, 255, 255, .5)', symbolNumber }) {
    this.position = position;
    this.width = 40;
    this.height = 40;
    this.color = color;
    this.symbolNumber = symbolNumber;
  }

  draw() {
    context.fillStyle = this.color;
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
