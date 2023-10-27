import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";

const initState = {
  fish: 0,
  // 添加新的状态
  color: "golden",
};
export const foodStore = create<typeof initState>()(
  devtools(
    subscribeWithSelector(
      persist(() => initState, {
        name: "food store",
      })
    ),
    {
      name: "food store",
    }
  )
);

export const addOneFish = () =>
  foodStore.setState((state) => ({ fish: state.fish + 1 }));
export const removeOneFish = () =>
  foodStore.setState((state) => ({ fish: state.fish - 1 }));
export const removeAllFish = () => foodStore.setState(() => ({ fish: 0 }));
