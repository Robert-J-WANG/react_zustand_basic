import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";

/* 
type TfoodStoreState = {
  fish: number;
  addOneFish: () => void;
  removeOneFish: () => void;
  removeAllFish: () => void;
};

export const useFoodStore = create<TfoodStoreState>()(
  // 开发者工具
  devtools(
    // 选择器订阅
    subscribeWithSelector(
      // 本地存储
      persist(
        (set) => ({
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
        }),
        { name: "food-store" }
      )
    ),
    {
      name: "food store",
    }
  )
); 
*/

/* ------------------- 可以使用getState方法， ------------------ */
/* --------------- 将state里的action函数抽离到外面， --------------- */
/* --------------------- 让state结果更简洁 -------------------- */
const initialState = {
  fish: 0,
  color: "golden",
};
export const useFoodStore = create<typeof initialState>()(
  // 开发者工具
  devtools(
    // 选择器订阅
    subscribeWithSelector(
      // 本地存储
      persist(() => initialState, { name: "food-store" })
    ),
    {
      name: "food store",
    }
  )
);

export const addOneFish = () =>
  useFoodStore.setState((state) => ({
    fish: state.fish + 1,
  }));
export const removeOneFish = () =>
  useFoodStore.setState((state) => ({
    fish: state.fish - 1,
  }));
export const removeAllFish = () =>
  useFoodStore.setState({
    fish: 0,
  });
