import { useBearStore } from "../stores/bearStore";
export const BearBox = () => {
  // const bears = useBearStore((state) => state.bears);
  // const increasePopulation = useBearStore((state) => state.increasePopulation);
  // const decreasePopulation = useBearStore((state) => state.decreasePopulation);
  // const removeAllBears = useBearStore((state) => state.removeAllBears);

  const { bears, increasePopulation, decreasePopulation, removeAllBears } =
    useBearStore();
  return (
    <div className="box">
      <h1>BearBox</h1>
      <h2>Bears : {bears}</h2>
      <button onClick={increasePopulation}>increase Bear</button>
      <button onClick={decreasePopulation}>decrease Bear</button>
      <button onClick={removeAllBears}>remove Bear</button>
    </div>
  );
};
