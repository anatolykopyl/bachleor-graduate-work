import { defineStore } from "pinia"

export const useStore = defineStore('store', {
  state: () => ({ 
    view: 'home'
  }),
  actions: {
    navigate(view: string) {
      this.view = view
    },
  },
})
