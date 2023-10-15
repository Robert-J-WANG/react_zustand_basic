import { useCatStore } from "../stores/catStore";

export const CatController = () => {
  /* ----------------- 当只使用到bigCats时，如果解构赋值获取 ---------------- */
  // const { addBigCats, addSmallCats } = useCatStore();
  /* --------------------- 会引起页面的多次渲染 --------------------- */

  // const addBigCats = useCatStore((state) => state.addBigCats);
  // const addSmallCats = useCatStore((state) => state.addSmallCats);

  const addBigCats = useCatStore.use.addBigCats();
  const addSmallCats = useCatStore.use.addSmallCats();

  return (
    <div className="box">
      <h1>CatController</h1>
      {/* 添加随机数，来验证页面的渲染 */}
      <h3>{Math.random()}</h3>
      <button onClick={addBigCats}>add big cats</button>
      <button onClick={addSmallCats}>add small cats</button>
    </div>
  );
};
