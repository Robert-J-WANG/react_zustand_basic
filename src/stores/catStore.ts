import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "../utils/createSelectors";
import { devtools, persist } from "zustand/middleware";

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

export const catStore = createSelectors(
  create<TcatStoreState>()(
    immer(
      devtools(
        persist(
          (set, get) => ({
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
          }),
          /* ----------------- 本地存储插件persist的配置对象 ----------------- */
          {
            name: "cat store",
          }
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
