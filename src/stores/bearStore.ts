import { create } from "zustand";
import { devtools } from "zustand/middleware";

type TBearStoreState = {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
};

export const useStore = create<TBearStoreState>()(
  devtools(
    (set) => ({
      bears: 0,
      increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
      removeAllBears: () => set({ bears: 0 }),
    }),
    {
      enabled: true, // 是否开启开发者工具
      name: "bear store", // 设置开发者工具中的名称
    }
  )
);
