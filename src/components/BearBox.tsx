import { useBearStore } from "../stores/bearStore";
export const BearBox = () => {
  // const bears = useBearStore((state) => state.bears);
  // const increasePopulation = useBearStore((state) => state.increasePopulation);
  // const decreasePopulation = useBearStore((state) => state.decreasePopulation);
  // const removeAllBears = useBearStore((state) => state.removeAllBears);

  const {
    bears,
    increasePopulation,
    decreasePopulation,
    removeAllBears,
    resetBear,
  } = useBearStore();
  return (
    <div className="box">
      <h1>BearBox</h1>
      <h2>Bears : {bears}</h2>
      <button onClick={increasePopulation}>increase Bear</button>
      <button onClick={decreasePopulation}>decrease Bear</button>
      <button onClick={removeAllBears}>remove Bear</button>
      {/* 注意：使用persist.clearStorage方法，只能清除localstorage里的数据，但无法清除memory的数据 */}
      {/* <button onClick={useBearStore.persist.clearStorage}>
        clear localstorage
      </button> */}
      {/* 所以需要重写一个方法来重置状态值 */}
      <button onClick={resetBear}>clear localstorage</button>
    </div>
  );
};
