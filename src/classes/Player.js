import Sprite from './Sprite';

export default class Player extends Sprite {
  constructor({
    context,
    position,
    image,
    sprites,
    frames = { max: 1, hold: 10 }
  }) {
    super({ context, position, image, sprites, frames });
  }
}
