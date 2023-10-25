import { useCatStore } from "../stores/catStore";

export const CatBox = () => {
  // const bigCats = useCatStore((state) => state.cats.bigCats);
  // const smallCats = useCatStore((state) => state.cats.smallCats);
  // const addBigCats = useCatStore((state) => state.addBigCats);
  // const addSmallCats = useCatStore((state) => state.addSmallCats);
  // const summary = useCatStore((state) => state.summary);

  /* ----------------- 当使用到全部状态值时，可以解构赋值获取 ---------------- */
  const {
    cats: { bigCats, smallCats },
    addBigCats,
    addSmallCats,
    summary,
  } = useCatStore();
  /* ------------------- 但是如果只是有到部分状态值时， ------------------ */
  /* ------------- 如果也是通过结构赋值的方式获取，会引起页面的多次渲染 ------------- */
  /* ----------------- 多次渲染的例子详见组件CatBox2 ----------------- */
  return (
    <div className="box">
      <h1>CatBox</h1>
      <h2>big cats : {bigCats}</h2>
      {/* 添加随机数，来验证页面的渲染 */}
      <h3>{Math.random()}</h3>
      {/* 添加随机数，来验证页面的渲染 */}
      <h2>small cats : {smallCats}</h2>
      <button onClick={addBigCats}>add big cats</button>
      <button onClick={addSmallCats}>add small cats</button>
      <button onClick={summary}>summary</button>
    </div>
  );
};
