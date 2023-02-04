import { context } from '@/components/GameCanvas.vue';

export default class Boundary {
  static width = 64;
  static height = 64;

  constructor({ position, color = 'rgba(255, 255, 255, 0)', symbolNumber }) {
    this.position = position;
    this.width = 64;
    this.height = 64;
    this.color = color;
    this.symbolNumber = symbolNumber;
  }

  draw() {
    context.fillStyle = this.color;
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
