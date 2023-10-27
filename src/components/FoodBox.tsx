import { foodStore } from "../stores/foodStore";

export const FoodBox = () => {
  const fish = foodStore((state) => state.fish);
  const addOneFish = foodStore((state) => state.addOneFish);
  const removeOneFish = foodStore((state) => state.removeOneFish);
  const removeAllFish = foodStore((state) => state.removeAllFish);

  return (
    <div className="box">
      <h1>FoodBox</h1>
      <h2>Fish:{fish} </h2>
      <button onClick={addOneFish}>add 1 fish</button>
      <button onClick={removeOneFish}>remove 1 fish</button>
      <button onClick={removeAllFish}>remove all fish</button>
    </div>
  );
};
