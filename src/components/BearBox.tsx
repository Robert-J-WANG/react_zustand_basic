import { useStore } from "../stores/bearStore";

export const BearBox = () => {
  const { bears, increasePopulation, removeAllBears, resetState } = useStore();
  return (
    <div className="box">
      <h1>BearBox</h1>
      <h2>bears : {bears}</h2>
      <button onClick={increasePopulation}>add bear</button>
      <button onClick={removeAllBears}>remove All Bears</button>
      {/* 清除本地存储 */}
      <button onClick={resetState}>reset state</button>
    </div>
  );
};
