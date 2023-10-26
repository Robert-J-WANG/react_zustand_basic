import { shallow } from "zustand/shallow";
import { catStore } from "../stores/catStore";

export const CatController = () => {
  /* --------------------- 会引发此组件的页面重绘 -------------------- */
  // const { increaseBigCats, increaseSmallCats } = catStore();

  /* ------------- auto selector: 不会引发此组件的页面重绘 ------------ */
  // const increaseBigCats = catStore.use.increaseBigCats();
  // const increaseSmallCats = catStore.use.increaseSmallCats();

  /* ------------------- multi-selector: ------------------ */
  const { increaseBigCats, increaseSmallCats } = catStore(
    (state) => ({
      increaseBigCats: state.increaseBigCats,
      increaseSmallCats: state.increaseSmallCats,
    }),
    shallow
  );
  return (
    <div className="box">
      <h1>CatController</h1>
      {/* 添加随机数，来验证页面的渲染 */}
      <h3>{Math.random()}</h3>
      <button onClick={increaseBigCats}>add big cats</button>
      <button onClick={increaseSmallCats}>add small cats</button>
    </div>
  );
};
