import { defineStore } from 'pinia';

export default defineStore('store', {
  state: () => ({
    interaction: {
      npc: null,
      active: false
    }
  })
});
