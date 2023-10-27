import {
  foodStore,
  addOneFish,
  removeOneFish,
  removeAllFish,
} from "../stores/foodStore";

export const FoodBox = () => {
  const fish = foodStore((state) => state.fish);
  /* -------------- 使用setState方法，在store外面更新状态 ------------- */
  const add5Fish = () => {
    foodStore.setState((state) => ({
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
      <button onClick={add5Fish}>add 5 Fish</button>
    </div>
  );
};
