import {
  catStore,
  increaseBigCats,
  increaseSmallCats,
  summary,
} from "../stores/catStore";

export const CatBox = () => {
  /* --------------------- 1.返回单个状态元素 --------------------- */
  /*  
 const bigCats = catStore((state) => state.cats.bigCats);
  const smallCats = catStore((state) => state.cats.smallCats);
  const increaseBigCats = catStore((state) => state.increaseBigCats);
  const increaseSmallCats = catStore((state) => state.increaseSmallCats);
  // 新增summary方法
  const summary = catStore((state) => state.summary); 
  */

  /* -------------------- 2.批量返回所以状态元素 -------------------- */
  const {
    cats: { bigCats, smallCats },
  } = catStore();
  return (
    <div className="box">
      <h1>CatBox</h1>
      <h2>big cats : {bigCats}</h2>
      <h2>small cats : {smallCats}</h2>
      <h2>{Math.random()}</h2>
      <div>
        <button onClick={increaseBigCats}>add big cats</button>
        <button onClick={increaseSmallCats}>add small cats</button>
        {/* 使用summary方法 */}
        <button onClick={summary}>summary</button>
      </div>
    </div>
  );
};
