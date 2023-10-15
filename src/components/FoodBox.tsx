import { useFoodStore } from "../stores/foodStore";

export const FoodBox = () => {
  const { fish, addOneFish, removeOneFish, removeAllFish } = useFoodStore();
  return (
    <div className="box">
      <h1>FoodBox</h1>
      <h2>Fish: {fish}</h2>
      <button onClick={addOneFish}>add 1 fish</button>
      <button onClick={removeOneFish}>remove 1 fish</button>
      <button onClick={removeAllFish}>remove all fish</button>
    </div>
  );
};
