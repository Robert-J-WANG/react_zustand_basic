import { useEffect, useState } from "react";
import { useBearStore } from "../stores/bearStore";
import { useFoodStore } from "../stores/foodStore";
import { shallow } from "zustand/shallow";
export const BearBox = () => {
  // const bears = useBearStore((state) => state.bears);
  // const increasePopulation = useBearStore((state) => state.increasePopulation);
  // const decreasePopulation = useBearStore((state) => state.decreasePopulation);
  // const removeAllBears = useBearStore((state) => state.removeAllBears);

  const { bears, increasePopulation, removeAllBears, resetBear } =
    useBearStore();

  // 获取foodStore中fish的数量，来设置背景颜色
  // const fish = useFoodStore((state) => state.fish);

  const [bgColor, setbgColor] = useState<
    "lightskyblue" | "lightpink" | undefined
  >(undefined);

  useEffect(() => {
    /* ---------- 没有使用到subscribeWithSelector中间件的情况 ---------- */
    // const unsub = useFoodStore.subscribe((state, prevStat) => {
    //   console.log(state, prevStat);
    //   if (prevStat.fish <= 5 && state.fish > 5) {
    //
    //   } else if (prevStat.fish > 5 && state.fish <= 5) {
    //     setbgColor("lightskyblue");
    //   }
    // });
    /* ----------- 使用了subscribeWithSelector中间件的情况 ----------- */

    const unsub = useFoodStore.subscribe(
      (state) => state.fish, //   选择器
      (prevFish, fish) => {
        // 初次渲染的时候prevFish===fish
        if (prevFish === fish) {
          if (fish <= 5) {
            setbgColor("lightpink");
          } else {
            setbgColor("lightskyblue");
          }
        }

        if (prevFish <= 5 && fish > 5) {
          setbgColor("lightpink");
        } else if (prevFish > 5 && fish <= 5) {
          setbgColor("lightskyblue");
        }
      }, // 监听器
      {
        equalityFn: shallow, // 判断是否相等
        fireImmediately: true, // 是否立即执行
        // fireImmediately: false, // 不立即执行
      }
    );

    return unsub;
  }, []);

  return (
    <div
      className="box"
      // 直接使用fish,每次fish数量的改变，都会引发页面的重新染，
      // 使用subscribe可与解决重选然的问题
      // style={{ backgroundColor: fish > 5 ? "lightskyblue" : "lightpink" }}
      style={{ backgroundColor: bgColor }}
    >
      <h1>BearBox</h1>
      <h2>Bears : {bears}</h2>
      <h2>{Math.random()}</h2>
      <button onClick={increasePopulation}>increase Bear</button>
      <button onClick={removeAllBears}>remove Bear</button>
      {/* 注意：使用persist.clearStorage方法，只能清除localstorage里的数据，但无法清除memory的数据 */}
      {/* <button onClick={useBearStore.persist.clearStorage}>
        clear localstorage
      </button> */}
      {/* 所以需要重写一个方法来重置状态值 */}
      <button onClick={resetBear}>clear localstorage</button>
    </div>
  );
};
