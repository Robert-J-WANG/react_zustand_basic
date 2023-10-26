import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type TcatStoreState = {
  cats: {
    bigCats: number;
    smallCats: number;
  };
  increaseBigCats: () => void;
  increaseSmallCats: () => void;
  // 定义一个summary方法
  summary: () => void;
};

export const catStore = create<TcatStoreState>()(
  immer((set, get) => ({
    cats: {
      bigCats: 0,
      smallCats: 0,
    },
    increaseBigCats: () =>
      set((state) => {
        state.cats.bigCats++;
      }),
    increaseSmallCats: () =>
      set((state) => {
        state.cats.smallCats++;
      }),
    /* ------------------- 使用get()访问state ------------------- */
    summary: () => {
      const totalCats = get().cats.smallCats + get().cats.bigCats;
      alert("total cats is " + totalCats);
    },
  }))
);
