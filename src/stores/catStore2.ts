import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "../utils/createSelectors";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";

const initState = {
  cats: {
    bigCats: 0,
    smallCats: 0,
  },
};

export const catStore = createSelectors(
  create<typeof initState>()(
    // 直接更改状态
    immer(
      // 开发者工具
      devtools(
        // 订阅部分所选状态
        subscribeWithSelector(
          // 存取本地数据
          persist(
            () => initState,
            /* ----------------- 本地存储插件persist的配置对象 ----------------- */
            {
              name: "cat store",
            }
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
export const increaseBigCats = () =>
  catStore.setState((state) => {
    state.cats.bigCats++;
  });
export const increaseSmallCats = () =>
  catStore.setState((state) => {
    state.cats.smallCats++;
  });
export const summary = () => {
  const totalCats =
    catStore.getState().cats.smallCats + catStore.getState().cats.bigCats;
  alert("total cats is " + totalCats);
};
