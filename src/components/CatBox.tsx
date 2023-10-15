import { useCatStore } from "../stores/catStore";

export const CatBox = () => {
  const bigCats = useCatStore((state) => state.cats.bigCats);
  const smallCats = useCatStore((state) => state.cats.smallCats);
  const addBigCats = useCatStore((state) => state.addBigCats);
  const addSmallCats = useCatStore((state) => state.addSmallCats);
  const summary = useCatStore((state) => state.summary);
  return (
    <div className="box">
      <h1>CatBox</h1>
      <h2>big cats : {bigCats}</h2>
      <h2>small cats : {smallCats}</h2>
      <button onClick={addBigCats}>add big cats</button>
      <button onClick={addSmallCats}>add small cats</button>
      <button onClick={summary}>summary</button>
    </div>
  );
};
