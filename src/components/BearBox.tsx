import { useEffect, useState } from "react";
import { bearStore } from "../stores/bearStore";
import { foodStore } from "../stores/foodStore";
import { shallow } from "zustand/shallow";
import { catStore } from "../stores/catStore";

export const BearBox = () => {
  const { bears, increasePopulation, removeAllBears, resetState } = bearStore();
  /* -------------------- 创建本地状态，存储背景颜色 ------------------- */
  const [bgColor, setBgColor] = useState("lightPink");
  /* -------------------- 创建本地状态，存储字体颜色 ------------------- */
  const [fontColor, setFontColor] = useState("black");

  /* -----------------1. 直接从store获取fish状态属性 ----------------- */
  /* ----------------------- 会引起页面重绘 ---------------------- */
  // const fish = foodStore((state) => state.fish);

  /* ------------ 2. 使用subscribe获取fish，不会引起页面重绘 ----------- */
  /* -------------- 要在useEffect钩子内部使用，还可以取消订阅 ------------- */
  useEffect(() => {
    // const unsb = foodStore.subscribe((state, prevState) => {
    //   console.log(state, prevState);
    //   /* ----------- 订阅foodStore的fish值，更新本地状态bgColor ---------- */
    //   if (prevState.fish <= 5 && state.fish > 5) setBgColor("lightGreen");
    //   else if (prevState.fish > 5 && state.fish <= 5) setBgColor("lightPink");
    // });

    /* -------------------- 订阅foodStore状态 ------------------- */
    const unsb = foodStore.subscribe(
      (state) => state.fish, // 只关心fish属性
      (fish, prevFish) => {
        if (prevFish <= 5 && fish > 5) setBgColor("lightGreen");
        else if (prevFish > 5 && fish <= 5) setBgColor("lightPink");
      },
      /* ------------------------ 可选参数对象 ------------------------ */
      {
        equalityFn: shallow, // 判断是否相同
        fireImmediately: true, //是否立即执行， 默认是false
      }
    );
    /* ------------------------ 取消订阅 ------------------------ */
    return unsb;
  }, []);

  /* -------------------- 订阅catStore状态 -------------------- */
  useEffect(() => {
    const unsbCat = catStore.subscribe(
      (state) => state.cats.bigCats,
      (bigCats, prevBigCats) => {
        if (prevBigCats <= 5 && bigCats > 5) {
          setFontColor("purple");
        } else if (prevBigCats > 5 && bigCats <= 5) {
          setBgColor("black");
        }
      }
    );
    /* ------------------------ 取消订阅 ------------------------ */
    return unsbCat;
  }, []);

  return (
    <div
      className="box"
      /* ----------------设置背景颜色，设置字体颜色 ----------------- */
      style={{ background: bgColor, color: fontColor }}
    >
      <h1>BearBox</h1>
      <h2>bears : {bears}</h2>
      {/* ------------------- 添加随机数，验证页面重绘问题 ------------------- */}
      <h2>{Math.random()}</h2>
      <button onClick={increasePopulation}>add bear</button>
      <button onClick={removeAllBears}>remove All Bears</button>
      <button onClick={resetState}>reset state</button>
    </div>
  );
};
