import Sprite from './Sprite';

export default class NPC extends Sprite {
  constructor({
    context,
    position,
    image,
    sprites,
    frames = { max: 1, hold: 10 },
    interactions,
    interactionStep
  }) {
    super({ context, position, image, sprites, frames });

    this.interactions = interactions;
    this.interactionStep = interactionStep;
  }
}
