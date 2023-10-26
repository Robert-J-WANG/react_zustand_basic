import { catStore } from "../stores/catStore";

export const CatBox2 = () => {
  // const {
  //   cats: { smallCats },
  // } = catStore();
  /* -------------------- 使用selector获取 -------------------- */
  const smallCats = catStore((state) => state.cats.smallCats);
  return (
    <div className="box">
      <h1>CatBox2</h1>
      <h2>big cats :{smallCats} </h2>
      <h2>{Math.random()}</h2>
    </div>
  );
};
