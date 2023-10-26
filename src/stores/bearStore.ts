import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TBearStoreState = {
  bears: number;
  color: string;
  size: string;
  increasePopulation: () => void;
  removeAllBears: () => void;
  resetState: () => void;
};

export const useStore = create<TBearStoreState>()(
  persist(
    (set) => ({
      bears: 0,
      color: "red",
      size: "big",
      increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
      removeAllBears: () => set({ bears: 0 }),
      // 重置状态
      resetState: () => {
        console.log(1111);
        set(() => ({ bears: 0, color: "red", size: "big" }));
      },
    }),
    {
      name: "bear store",
      /* ---------------------1. 设置需要保存的状态属性 ------------------ */
      /* 
      partialize: (state) => {
        state.bears; // 返回需要保存的状态属性
      }, 
      */

      /* ----------- 2. 过滤不需要保存到本地的状态(过滤掉color，size) ---------- */
      partialize: (state: TBearStoreState) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !["color", "size"].includes(key)
          )
        ),
    }
  )
);
