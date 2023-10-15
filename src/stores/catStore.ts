import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "../utils/createSelectors";
import { devtools, persist } from "zustand/middleware";

type TcatStoreState = {
  cats: {
    bigCats: number;
    smallCats: number;
  };
  addBigCats: () => void;
  addSmallCats: () => void;
  summary: () => void;
};

// 使用createSelectors包裹，来使用selector
export const useCatStore = createSelectors(
  create<TcatStoreState>()(
    immer(
      devtools(
        persist(
          (set, get) => ({
            cats: {
              bigCats: 0,
              smallCats: 0,
            },

            addBigCats: () =>
              set((state) => ({
                // 未使用immer中间件的写法，不可更新原状态，需要重新赋值
                cats: {
                  ...state.cats,
                  bigCats: state.cats.bigCats + 1,
                },
              })),

            addSmallCats: () =>
              set((state) => {
                // 使用immer中间件的写法。可直接更新原状态
                state.cats.smallCats++;
              }),

            // 使用get()方法，从外部获取state
            summary: () => {
              const total = get().cats.bigCats + get().cats.smallCats;
              alert(`there are ${total} cats in total`);
            },
          }),
          {
            name: "cat-store",
          }
        ),
        { enabled: true, name: "cat store" }
      )
    )
  )
);
