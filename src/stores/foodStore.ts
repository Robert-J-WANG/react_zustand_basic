import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type TfoodStoreState = {
  fish: number;
  addOneFish: () => void;
  removeOneFish: () => void;
  removeAllFish: () => void;
};

export const useFoodStore = create<TfoodStoreState>()(
  subscribeWithSelector((set) => ({
    fish: 0,
    addOneFish: () =>
      set((state) => ({
        fish: state.fish + 1,
      })),
    removeOneFish: () =>
      set((state) => ({
        fish: state.fish - 1,
      })),
    removeAllFish: () => set({ fish: 0 }),
  }))
);
