import { useStore } from "../stores/bearStore";

export const BearBox = () => {
  /* --------------------- 1.返回单个状态元素 --------------------- */
  // const bears = useStore((state) => state.bears);
  // const increasePopulation = useStore((state) => state.increasePopulation);
  // const removeAllBears = useStore((state) => state.removeAllBears);

  /* --------------------- 2.返回全部状态元素 --------------------- */
  const { bears, increasePopulation, removeAllBears } = useStore();

  return (
    <div className="box">
      <h1>BearBox</h1>
      <h2>bears : {bears}</h2>
      <button onClick={increasePopulation}>add bear</button>
      <button onClick={removeAllBears}>remove All Bears</button>
    </div>
  );
};
