import { useCatStore } from "../stores/catStore";

export const CatBox2 = () => {
  const bigCats = useCatStore((state) => state.cats.bigCats);

  /* ----------------- 当只使用到bigCats时，如果解构赋值获取 ---------------- */
  // const {
  //   cats: { bigCats },
  // } = useCatStore();
  /* --------------------- 会引起页面的多次渲染 --------------------- */
  /* ------------------- 如何判断页面的多次渲染？？？？ ------------------ */
  /* -------------- 页面中添加一个随机数，每次渲染都会生产新的随机数 -------------- */
  /* ------------- 当点击组件CatBox的addsmallcat按钮时， ------------ */
  /* ------------------ 组件CatBox2的页面重新渲染了 ----------------- */

  /* ---------------- 如果状态不是通过结构赋值获取的，就不会渲染 --------------- */
  // const bigCats = useCatStore((state) => state.cats.bigCats);

  /* ----------- 如何不通过结构赋值获取全部状态，而是一次获取多个状态值呢？？ ----------- */
  /* --------------------- 使用selector --------------------- */
  return (
    <div className="box">
      <h1>CatBox2</h1>
      <h2>big cats : {bigCats}</h2>
      {/* 添加随机数，来验证页面的渲染 */}
      <h3>{Math.random()}</h3>
    </div>
  );
};
