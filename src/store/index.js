import { defineStore } from 'pinia';

export default defineStore('store', {
  state: () => ({
    activeNPC: {
      interactions: {
        dialog: ['** You have an urge to go visit the lab **']
      },
      activeInteraction: 'dialog',
      interactionStep: 0
    }
  })
});
