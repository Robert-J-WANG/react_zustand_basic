import {
  addOneFish,
  removeAllFish,
  removeOneFish,
  useFoodStore,
} from "../stores/foodStore";

export const FoodBox = () => {
  const fish = useFoodStore((state) => state.fish);
  // const addOneFish=useFoodStore((state) => state.addOneFish);
  // const removeOneFish=useFoodStore((state) => state.removeOneFish);
  // const removeAllFish=useFoodStore((state) => state.removeAllFish);

  /* --------- 可以在store外部使用getState()和 setState() --------- */
  const add5fish = () => {
    useFoodStore.setState((state) => ({
      fish: state.fish + 5,
    }));
  };
  return (
    <div className="box">
      <h1>FoodBox</h1>
      <h2>Fish:{fish} </h2>
      <button onClick={addOneFish}>add 1 fish</button>
      <button onClick={removeOneFish}>remove 1 fish</button>
      <button onClick={removeAllFish}>remove all fish</button>
      {/* 在store外部使用setState方法设置state值 */}
      <button onClick={add5fish}>add 5 fish</button>
    </div>
  );
};
