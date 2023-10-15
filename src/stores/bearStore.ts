import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
type TBearStoreState = {
  bears: number;
  color: string;
  size: string;
  increasePopulation: () => void;
  decreasePopulation: () => void;
  removeAllBears: () => void;
  resetBear: () => void;
};

export const useBearStore = create<TBearStoreState>()(
  // 设置开发者工具的中间件
  devtools(
    // 设置保存到本地的中间件
    persist(
      (set) => ({
        bears: 0,
        color: "red",
        size: "big",
        increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
        decreasePopulation: () => set((state) => ({ bears: state.bears - 1 })),
        removeAllBears: () => set({ bears: 0 }),
        resetBear: () => set({ bears: 0, color: "red", size: "big" }),
      }),
      {
        name: "bear-store", //保存本地的key名称
        // storage: createJSONStorage(() => sessionStorage), // 设置保存到本地的那个storage, 默认是localStorage
        /* --------------- partialize 设置部分状态属性的存储 --------------- */
        // 1. 只保存指定的状态：
        partialize: (state) => ({ bears: state.bears, color: state.color }),
        // 2. 过滤不需要保存到本地的状态(过滤掉color，size)
        // partialize: (state: TBearStoreState) =>
        //   Object.fromEntries(
        //     Object.entries(state).filter(
        //       ([key]) => !["color", "size"].includes(key)
        //     )
        //   ),
      }
    ),
    {
      enabled: true, // 是否开启开发者工具
      name: "bear store", // 设置开发者工具中的名称
    }
  )
);
