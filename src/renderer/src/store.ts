import type TSor from "src/models/sor";
import { defineStore } from "pinia";

export const useStore = defineStore("store", {
  state: (): {
    view: "home" | "library",
    sor: TSor | null,
  } => ({
    view: "home",
    sor: null,
  }),
  actions: {
    navigate(view: "home" | "library") {
      this.view = view;
    },
  },
});
