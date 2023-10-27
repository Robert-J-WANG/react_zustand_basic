import { StateCreator, create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "../utils/createSelectors";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";

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

const catSlice: StateCreator<
  TcatStoreState,
  [
    ["zustand/immer", never],
    ["zustand/devtools", unknown],
    ["zustand/subscribeWithSelector", never],
    ["zustand/persist", unknown]
  ]
> = (set, get) => ({
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
});
export const catStore = createSelectors(
  create<TcatStoreState>()(
    // 直接更改状态
    immer(
      // 开发者工具
      devtools(
        // 订阅部分所选状态
        subscribeWithSelector(
          // 存取本地数据
          persist(
            catSlice,
            /* ----------------- 本地存储插件persist的配置对象 ----------------- */
            { name: "cat store" }
          )
        ),
        /* -------------------- 开发者工具插件的配置对象 -------------------- */
        {
          enabled: true,
          name: "cat store", // 设置开发者工具中的名称
        }
      )
    )
  )
);
