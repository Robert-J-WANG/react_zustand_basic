## Zustand  

#### Part-02

#### 5. devTools的使用 ：Redux-devtools

  在Zustand， 通常将store模块化，即根据不同的状态的内容，做成一个个小的store

1. 如何使用？

+ 在每个store中，使用devTools把create函数中的initializer (回调函数)包起来, 以bearStore为例

    ```ts
    import { create } from "zustand";
    import { devtools } from "zustand/middleware";
    
    type TBearStoreState = {
      bears: number;
      increasePopulation: () => void;
      removeAllBears: () => void;
    };
    
    export const useStore = create<TBearStoreState>()(
      devtools((set) => ({
        bears: 0,
        increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
        removeAllBears: () => set({ bears: 0 }),
      }))
    );
    ```

+ 在网页的检查选项中，使用Redux-devtools中可以查看状态的变化了

2. 如何设置devTools开关？

+ devtools添加第二个参数（配置对象），来设置devTools工具的开关

     ```ts
     import { create } from "zustand";
     import { devtools } from "zustand/middleware";
     
     type TBearStoreState = {
       bears: number;
       increasePopulation: () => void;
       removeAllBears: () => void;
     };
     
     export const useStore = create<TBearStoreState>()(
       devtools(
         (set) => ({
           bears: 0,
           increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
           removeAllBears: () => set({ bears: 0 }),
         }),
         {
           enabled: true, // 是否开启开发者工具
         }
       )
     );
     ```

3.  使用多个插件时，devtools添加顺序？

+ devtools在插件immer 后面使用，应为immer会改变状态数据

+ 给catStore添加devtools工具

    ```ts
    import { create } from "zustand";
    import { immer } from "zustand/middleware/immer";
    import { createSelectors } from "../utils/createSelectors";
    import { devtools } from "zustand/middleware";
    
    type TcatStoreState = {
      cats: {
        bigCats: number;
        smallCats: number;
      };
      increaseBigCats: () => void;
      increaseSmallCats: () => void;
      // 定义一个summary方法
      summary: () => void;
    };
    
    export const catStore = createSelectors(
      create<TcatStoreState>()(
        immer(
          devtools(
            (set, get) => ({
              cats: {
                bigCats: 0,
                smallCats: 0,
              },
              increaseBigCats: () =>
                set((state) => {
                  state.cats.bigCats++;
                }),
              increaseSmallCats: () =>
                set((state) => {
                  state.cats.smallCats++;
                }),
              /* ------------------- 使用get()访问state ------------------- */
              summary: () => {
                const totalCats = get().cats.smallCats + get().cats.bigCats;
                alert("total cats is " + totalCats);
              },
            }),
            {
              enabled: true,
            }
          )
        )
      )
    );
    ```

4. 多个store时，如何给不同的instance自定义名称？
    + devtools配置对象中添加name属性即可

+ bearStore添加名称

    ```ts
    import { create } from "zustand";
    import { devtools } from "zustand/middleware";
    
    type TBearStoreState = {
      bears: number;
      increasePopulation: () => void;
      removeAllBears: () => void;
    };
    
    export const useStore = create<TBearStoreState>()(
      devtools(
        (set) => ({
          bears: 0,
          increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
          removeAllBears: () => set({ bears: 0 }),
        }),
        {
          enabled: true, // 是否开启开发者工具
          name: "bear store", // 设置开发者工具中的名称
        }
      )
    );
    ```

+ catStore添加名称

    ```ts
    import { create } from "zustand";
    import { immer } from "zustand/middleware/immer";
    import { createSelectors } from "../utils/createSelectors";
    import { devtools } from "zustand/middleware";
    
    type TcatStoreState = {
      cats: {
        bigCats: number;
        smallCats: number;
      };
      increaseBigCats: () => void;
      increaseSmallCats: () => void;
      // 定义一个summary方法
      summary: () => void;
    };
    
    export const catStore = createSelectors(
      create<TcatStoreState>()(
        immer(
          devtools(
            (set, get) => ({
              cats: {
                bigCats: 0,
                smallCats: 0,
              },
              increaseBigCats: () =>
                set((state) => {
                  state.cats.bigCats++;
                }),
              increaseSmallCats: () =>
                set((state) => {
                  state.cats.smallCats++;
                }),
              /* ------------------- 使用get()访问state ------------------- */
              summary: () => {
                const totalCats = get().cats.smallCats + get().cats.bigCats;
                alert("total cats is " + totalCats);
              },
            }),
            {
              enabled: true,
              name: "cat store", // 设置开发者工具中的名称
            }
          )
        )
      )
    );
    
    ```



#### 6. 保存状态到本地存储插件 persist

1. 通常情况下，实现存取本地数据的功能，需要到每个状态变化的地方编写代码 localStorage.**setItem**("my-state", state)存储，和localStorage.**getItem**("my-state")读取。 这样很不方便，在Zustand中，我们可以使用插件persist来实现本地储数据的存取

+ 以上面的bearStore为例， 为了代码的简洁，先删掉devtools相关的代码

    ```tsx
    import { create } from "zustand";
    
    type TBearStoreState = {
      bears: number;
      increasePopulation: () => void;
      removeAllBears: () => void;
    };
    
    export const useStore = create<TBearStoreState>()((set) => ({
      bears: 0,
      increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
      removeAllBears: () => set({ bears: 0 }),
    }));
    ```

+ 使用插件 persist：persist包裹create函数的初始对象, 并添加配置对象以及设置name属性的值

    ```ts
    import { create } from "zustand";
    import { persist } from "zustand/middleware";
    
    type TBearStoreState = {
      bears: number;
      increasePopulation: () => void;
      removeAllBears: () => void;
    };
    
    export const useStore = create<TBearStoreState>()(
      persist(
        (set) => ({
          bears: 0,
          increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
          removeAllBears: () => set({ bears: 0 }),
        }),
        {
          name: "bear store",
        }
      )
    );
    ```

2. 如何设置将状态保存到sessionStorage?

+ persist默认保存到localStorage

+ 在配置对象中设置storage属性的值，可保存到sessionStorage

    ```ts
    import { create } from "zustand";
    import { createJSONStorage, persist } from "zustand/middleware";
    
    type TBearStoreState = {
      bears: number;
      increasePopulation: () => void;
      removeAllBears: () => void;
    };
    
    export const useStore = create<TBearStoreState>()(
      persist(
        (set) => ({
          bears: 0,
          increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
          removeAllBears: () => set({ bears: 0 }),
        }),
        {
          name: "bear store",
          // storage: createJSONStorage(() => localStorage), // 默认是localStorage
          storage: createJSONStorage(() => sessionStorage), // 保存到sessionStorage
        }
      )
    );
    ```

3. 如何保存一部分状态？

+ 给bearStore新增状态属性，color和size

    ```tsx
    import { create } from "zustand";
    import { createJSONStorage, persist } from "zustand/middleware";
    
    type TBearStoreState = {
      bears: number;
      // 新增属性
      color: string;
      size: string;
    
      increasePopulation: () => void;
      removeAllBears: () => void;
    };
    
    export const useStore = create<TBearStoreState>()(
      persist(
        (set) => ({
          bears: 0,
          color: "red",
          size: "big",
          increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
          removeAllBears: () => set({ bears: 0 }),
        }),
        {
          name: "bear store",
          // storage: createJSONStorage(() => localStorage), // 默认是localStorage
          // storage: createJSONStorage(() => sessionStorage),
        }
      )
    );
    ```

+ 设置partialize属性 (需要保存的那部分属性)

    ```tsx
    import { create } from "zustand";
    import { createJSONStorage, persist } from "zustand/middleware";
    
    type TBearStoreState = {
      bears: number;
      // 新增属性
      color: string;
      size: string;
    
      increasePopulation: () => void;
      removeAllBears: () => void;
    };
    
    export const useStore = create<TBearStoreState>()(
      persist(
        (set) => ({
          bears: 0,
          color: "red",
          size: "big",
          increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
          removeAllBears: () => set({ bears: 0 }),
        }),
        {
          name: "bear store",
          // storage: createJSONStorage(() => localStorage), // 默认是localStorage
          // storage: createJSONStorage(() => sessionStorage),
    
          /* ---------------------1. 设置需要保存的状态属性 ------------------ */
          partialize: (state) => {
            state.bears; // 返回需要保存的状态属性
          }, 
        }
      )
    );
    ```

+ 还可以设置不想被保存的属性

    ```ts
    import { create } from "zustand";
    import { createJSONStorage, persist } from "zustand/middleware";
    
    type TBearStoreState = {
      bears: number;
      // 新增属性
      color: string;
      size: string;
    
      increasePopulation: () => void;
      removeAllBears: () => void;
    };
    
    export const useStore = create<TBearStoreState>()(
      persist(
        (set) => ({
          bears: 0,
          color: "red",
          size: "big",
          increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
          removeAllBears: () => set({ bears: 0 }),
        }),
        {
          name: "bear store",
          /* ----------- 过滤不需要保存到本地的状态(过滤掉color，size) ---------- */
          partialize: (state: TBearStoreState) =>
            Object.fromEntries(
              Object.entries(state).filter(
                ([key]) => !["color", "size"].includes(key)
              )
            ),
        }
      )
    );
    ```

4. 如何清除localStorage？

+ Persist.clearStorage方法能清除本地存储，但无法清除memory。页面中数据还是memory中数据

    ```tsx
    import { useStore } from "../stores/bearStore";
    
    export const BearBox = () => {
      const { bears, increasePopulation, removeAllBears } = useStore();
      return (
        <div className="box">
          <h1>BearBox</h1>
          <h2>bears : {bears}</h2>
          <button onClick={increasePopulation}>add bear</button>
          <button onClick={removeAllBears}>remove All Bears</button>
          {/* 清除本地存储 */}
          <button onClick={useStore.persist.clearStorage}>reset state</button>
        </div>
      );
    };
    ```

+ 想要真正清除本地存储，并且回复到初始状态，可以设置重置状态的方法，将状态设置为初始状态 

    ```ts
    import { create } from "zustand";
    import { createJSONStorage, persist } from "zustand/middleware";
    
    type TBearStoreState = {
      bears: number;
      color: string;
      size: string;
      increasePopulation: () => void;
      removeAllBears: () => void;
      resetState: () => void;
    };
    
    export const useStore = create<TBearStoreState>()(
      persist(
        (set) => ({
          bears: 0,
          color: "red",
          size: "big",
          increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
          removeAllBears: () => set({ bears: 0 }),
          // 重置状态
          resetState: () => {
            console.log(1111);
            set(() => ({ bears: 0, color: "red", size: "big" }));
          },
        }),
        {
          name: "bear store",
          /* ---------------------1. 设置需要保存的状态属性 ------------------ */
          /* 
          partialize: (state) => {
            state.bears; // 返回需要保存的状态属性
          }, 
          */
    
          /* ----------- 2. 过滤不需要保存到本地的状态(过滤掉color，size) ---------- */
          partialize: (state: TBearStoreState) =>
            Object.fromEntries(
              Object.entries(state).filter(
                ([key]) => !["color", "size"].includes(key)
              )
            ),
        }
      )
    );
    ```

    ```tsx
    import { useStore } from "../stores/bearStore";
    
    export const BearBox = () => {
      const { bears, increasePopulation, removeAllBears, resetState } = useStore();
      return (
        <div className="box">
          <h1>BearBox</h1>
          <h2>bears : {bears}</h2>
          <button onClick={increasePopulation}>add bear</button>
          <button onClick={removeAllBears}>remove All Bears</button>
          {/* 重置状态 */}
          <button onClick={resetState}>reset state</button>
        </div>
      );
    };
    ```

    

5. 多个插件的顺序？

+ persist插件放在devtools后面

+ 给catStore配置persist插件，存取本地数据

    ```ts
    import { create } from "zustand";
    import { immer } from "zustand/middleware/immer";
    import { createSelectors } from "../utils/createSelectors";
    import { devtools, persist } from "zustand/middleware";
    
    type TcatStoreState = {
      cats: {
        bigCats: number;
        smallCats: number;
      };
      increaseBigCats: () => void;
      increaseSmallCats: () => void;
      // 定义一个summary方法
      summary: () => void;
    };
    
    export const catStore = createSelectors(
      create<TcatStoreState>()(
        immer(
          devtools(
            persist(
              (set, get) => ({
                cats: {
                  bigCats: 0,
                  smallCats: 0,
                },
                increaseBigCats: () =>
                  set((state) => {
                    state.cats.bigCats++;
                  }),
                increaseSmallCats: () =>
                  set((state) => {
                    state.cats.smallCats++;
                  }),
                /* ------------------- 使用get()访问state ------------------- */
                summary: () => {
                  const totalCats = get().cats.smallCats + get().cats.bigCats;
                  alert("total cats is " + totalCats);
                },
              }),
              /* ----------------- 本地存储插件persist的配置对象 ----------------- */
              {
                name: "cat store",
              }
            ),
            /* -------------------- 开发者工具插件的配置对象 -------------------- */
            {
              enabled: true,
              name: "cat store", // 设置开发者工具中的名称
            }
          )
        )
      )
    );
    ```




#### 7. subscribe功能

1. 介绍：

+ store的subscribe功能用于订阅全局状态（组件之间的订阅），但不重渲染。而从store里叫出来的state是active的，即每一次state改变，都会引起页面重新渲染
+ subscribe只在订阅的状态值满足某个条件时才触发渲染，不必每次状态改变都触发渲染
+ 举例说明：上面的bearStore中，bear吃鱼，设置一个鱼的store，让bear订阅fish，只有当fish<5时，才会引起bear页面的重渲染，而其他fish的变化，不会一起bear页面的重渲染

2. 为何要使用subscribe插件？

+ 创建一个foodStore和FoodBox组件，并将组件引入到app中

    ```ts
    import { create } from "zustand";
    
    type TFishStoreState = {
      fish: number;
      addOneFish: () => void;
      removeOneFish: () => void;
      removeAllFish: () => void;
    };
    
    export const foodStore = create<TFishStoreState>()((set) => ({
      fish: 0,
      addOneFish: () => set((state) => ({ fish: state.fish + 1 })),
      removeOneFish: () => set((state) => ({ fish: state.fish - 1 })),
      removeAllFish: () => set(() => ({ fish: 0 })),
    }));
    
    ```

    ```tsx
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
    
    ```

    ```tsx
    import { BearBox } from "./components/BearBox";
    import { CatBox } from "./components/CatBox";
    import { CatBox2 } from "./components/CatBox2";
    import { CatController } from "./components/CatController";
    import { FoodBox } from "./components/FoodBox";
    
    function App() {
      return (
        <div className="container">
          <h1>Zustand Tutorial</h1>
          <div>
            <BearBox />
            <FoodBox />
          </div>
          <div>
            <CatBox />
            <CatBox2 />
            <CatController />
          </div>
        </div>
      );
    }
    export default App;
    
    ```

+ bearBox组件使用fish状态，并设置背景颜色（fish<5,食物短缺，红色警告；fish>=5时，食物充足，绿色安全）

    ```tsx
    import { bearStore } from "../stores/bearStore";
    import { foodStore } from "../stores/foodStore";
    
    export const BearBox = () => {
      const { bears, increasePopulation, removeAllBears, resetState } = bearStore();
    
      /* --------------------- 获取fish状态属性 --------------------- */
      const fish = foodStore((state) => state.fish);
      return (
        <div
          className="box"
          /* ----------------------- 设置背景颜色 ----------------------- */
          style={{ background: fish < 5 ? "lightPink" : "lightGreen" }}
        >
          <h1>BearBox</h1>
          <h2>bears : {bears}</h2>
          <button onClick={increasePopulation}>add bear</button>
          <button onClick={removeAllBears}>remove All Bears</button>
          <button onClick={resetState}>reset state</button>
        </div>
      );
    };
    ```

+ 问题：虽然能实现逻辑功能，但是bearBox组件有页面重绘的问题，即，每次fish的改变，都会重新加载页面，添加随机数验证

    ```tsx
    import { bearStore } from "../stores/bearStore";
    import { foodStore } from "../stores/foodStore";
    
    export const BearBox = () => {
      const { bears, increasePopulation, removeAllBears, resetState } = bearStore();
    
      /* --------------------- 获取fish状态属性 --------------------- */
      const fish = foodStore((state) => state.fish);
      return (
        <div
          className="box"
          /* ----------------------- 设置背景颜色 ----------------------- */
          style={{ background: fish < 5 ? "lightPink" : "lightGreen" }}
        >
          <h1>BearBox</h1>
          <h2>bears : {bears}</h2>
          {/* ------------------- 添加随机数，验证页面重绘问题 ------------------- */}
          <h2>{Math.random()}</h2>
          <button onClick={increasePopulation}>add bear</button>
          <button onClick={removeAllBears}>remove All Bears</button>
          <button onClick={resetState}>reset state</button>
        </div>
      );
    };
    ```

+ 解决方案：使用subscribe插件

3. 如何使用subscribe插件？

+ 调用store的subscribe方法，并传入一个回调函数，通过回调函数的返回值来获取需要的属性

+ subscribe方法既能用在component外面，也能用在component里面，用在component里面时，尽量在useEffect钩子内部使用，这样subscribe方法只会在组件第一次加载时执行，

+ subscribe方法返回值是一个unsubscribe取消订阅方法，在useEffect钩子return unsubscribe方法取消订阅

+ BearBox中使用foodStore的subscribe

    ```tsx
    import { useEffect } from "react";
    import { bearStore } from "../stores/bearStore";
    import { foodStore } from "../stores/foodStore";
    import { StateCreator } from "zustand";
    
    export const BearBox = () => {
      const { bears, increasePopulation, removeAllBears, resetState } = bearStore();
    
      /* -----------------1. 直接从store获取fish状态属性 ----------------- */
      /* ----------------------- 会引起页面重绘 ---------------------- */
      // const fish = foodStore((state) => state.fish);
    
      /* ------------ 2. 使用subscribe获取fish，不会引起页面重绘 ----------- */
      /* -------------- 要在useEffect钩子内部使用，还可以取消订阅 ------------- */
      useEffect(() => {
        /* ------------ subscribe方法会返回一个unsubscribe方法 ----------- */
        const unsb = foodStore.subscribe((state, prevState) => {
          console.log(state, prevState);
        });
        // console.log(unsb); // () => listeners.delete(listener)
        /* ------------------------ 取消订阅 ------------------------ */
        return unsb;
      }, []);
    
      return (
        <div
          className="box"
          /* ----------------------- 设置背景颜色 ----------------------- */
          // style={{ background: fish < 5 ? "lightPink" : "lightGreen" }}
        >
          <h1>BearBox</h1>
          <h2>bears : {bears}</h2>
          {/* ------------------- 添加随机数，验证页面重绘问题 ------------------- */}
          <h2>{Math.random()}</h2>
          <button onClick={increasePopulation}>add bear</button>
          <button onClick={removeAllBears}>remove All Bears</button>
          <button onClick={resetState}>reset state</button>
        </div>
      );
    };
    ```

+ 如何改变背景色？ 创建一个本地状态bgColor，并在useEffect中更新bgColor，将bgColor添加到style中

    ```tsx
    import { useEffect, useState } from "react";
    import { bearStore } from "../stores/bearStore";
    import { foodStore } from "../stores/foodStore";
    
    export const BearBox = () => {
      const { bears, increasePopulation, removeAllBears, resetState } = bearStore();
      /* -------------------- 创建本地状态，存储背景颜色 ------------------- */
      const [bgColor, setBgColor] = useState("lightPink");
    
      /* -----------------1. 直接从store获取fish状态属性 ----------------- */
      /* ----------------------- 会引起页面重绘 ---------------------- */
      // const fish = foodStore((state) => state.fish);
    
      /* ------------ 2. 使用subscribe获取fish，不会引起页面重绘 ----------- */
      /* -------------- 要在useEffect钩子内部使用，还可以取消订阅 ------------- */
      useEffect(() => {
        /* ------------ subscribe方法会返回一个unsubscribe方法 ----------- */
        const unsb = foodStore.subscribe((state, prevState) => {
          console.log(state, prevState);
          /* ----------- 订阅foodStore的fish值，更新本地状态bgColor ---------- */
          if (prevState.fish <= 5 && state.fish > 5) setBgColor("lightGreen");
          else if (prevState.fish > 5 && state.fish <= 5) setBgColor("lightPink");
        });
        // console.log(unsb); // () => listeners.delete(listener)
        /* ------------------------ 取消订阅 ------------------------ */
        return unsb;
      }, []);
    
      return (
        <div
          className="box"
          /* ----------------------- 设置背景颜色 ----------------------- */
          style={{ background: bgColor }}
        >
          <h1>BearBox</h1>
          <h2>bears : {bears}</h2>
          {/* ------------------- 添加随机数，验证页面重绘问题 ------------------- */}
          <h2>{Math.random()}</h2>
          <button onClick={increasePopulation}>add bear</button>
          <button onClick={removeAllBears}>remove All Bears</button>
          <button onClick={resetState}>reset state</button>
        </div>
      );
    };
    ```



#### 8. subscribeWithSelector插件

1. 什么情况下使用？
    + 当有很多个状态，但只关心其中的某些部分状态时

2. 如何使用？

+ 和其他插件的使用方式类似，包裹create方法里的初始对象

    ```ts
    import { create } from "zustand";
    import { subscribeWithSelector } from "zustand/middleware";
    
    type TFishStoreState = {
      fish: number;
      addOneFish: () => void;
      removeOneFish: () => void;
      removeAllFish: () => void;
    };
    
    export const foodStore = create<TFishStoreState>()(
      subscribeWithSelector((set) => ({
        fish: 0,
        addOneFish: () => set((state) => ({ fish: state.fish + 1 })),
        removeOneFish: () => set((state) => ({ fish: state.fish - 1 })),
        removeAllFish: () => set(() => ({ fish: 0 })),
      }))
    );
    ```

+ bearBox中修改订阅的代码

    ```tsx
    import { useEffect, useState } from "react";
    import { bearStore } from "../stores/bearStore";
    import { foodStore } from "../stores/foodStore";
    import { shallow } from "zustand/shallow";
    
    export const BearBox = () => {
      const { bears, increasePopulation, removeAllBears, resetState } = bearStore();
      /* -------------------- 创建本地状态，存储背景颜色 ------------------- */
      const [bgColor, setBgColor] = useState("lightPink");
    
      /* -----------------1. 直接从store获取fish状态属性 ----------------- */
      /* ----------------------- 会引起页面重绘 ---------------------- */
      // const fish = foodStore((state) => state.fish);
    
      /* ------------ 2. 使用subscribe获取fish，不会引起页面重绘 ----------- */
      /* -------------- 要在useEffect钩子内部使用，还可以取消订阅 ------------- */
      useEffect(() => {
        // const unsb = foodStore.subscribe((state, prevState) => {
        //   console.log(state, prevState);
        //   /* ----------- 订阅foodStore的fish值，更新本地状态bgColor ---------- */
        //   if (prevState.fish <= 5 && state.fish > 5) setBgColor("lightGreen");
        //   else if (prevState.fish > 5 && state.fish <= 5) setBgColor("lightPink");
        // });
    
        const unsb = foodStore.subscribe(
          (state) => state.fish, // 只关心fish属性
          (fish, prevFish) => {
            if (prevFish <= 5 && fish > 5) setBgColor("lightGreen");
            else if (prevFish > 5 && fish <= 5) setBgColor("lightPink");
          },
          /* ------------------------ 可选参数对象 ------------------------ */
          {
            equalityFn: shallow, // 判断是否相同
            fireImmediately: true, //是否立即执行， 默认是false
          }
        );
    
        /* ------------------------ 取消订阅 ------------------------ */
        return unsb;
      }, []);
    
      return (
        <div
          className="box"
          /* ----------------------- 设置背景颜色 ----------------------- */
          style={{ background: bgColor }}
        >
          <h1>BearBox</h1>
          <h2>bears : {bears}</h2>
          {/* ------------------- 添加随机数，验证页面重绘问题 ------------------- */}
          <h2>{Math.random()}</h2>
          <button onClick={increasePopulation}>add bear</button>
          <button onClick={removeAllBears}>remove All Bears</button>
          <button onClick={resetState}>reset state</button>
        </div>
      );
    };
    ```

3. 多个插件的顺序？

+ subscribeWithSelector插件放置在devTools和persist插件的中间

+ 给catStore使用subscribeWithSelector插件

    ```ts
    import { create } from "zustand";
    import { immer } from "zustand/middleware/immer";
    import { createSelectors } from "../utils/createSelectors";
    import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
    
    type TcatStoreState = {
      cats: {
        bigCats: number;
        smallCats: number;
      };
      increaseBigCats: () => void;
      increaseSmallCats: () => void;
      // 定义一个summary方法
      summary: () => void;
    };
    
    export const catStore = createSelectors(
      create<TcatStoreState>()(
        // 直接更改状态
        immer(
          // 开发者工具
          devtools(
            // 订阅部分所选状态
            subscribeWithSelector(
              // 存取本地数据
              persist(
                (set, get) => ({
                  cats: {
                    bigCats: 0,
                    smallCats: 0,
                  },
                  increaseBigCats: () =>
                    set((state) => {
                      state.cats.bigCats++;
                    }),
                  increaseSmallCats: () =>
                    set((state) => {
                      state.cats.smallCats++;
                    }),
                  /* ------------------- 使用get()访问state ------------------- */
                  summary: () => {
                    const totalCats = get().cats.smallCats + get().cats.bigCats;
                    alert("total cats is " + totalCats);
                  },
                }),
                /* ----------------- 本地存储插件persist的配置对象 ----------------- */
                {
                  name: "cat store",
                }
              )
            ),
            /* -------------------- 开发者工具插件的配置对象 -------------------- */
            {
              enabled: true,
              name: "cat store", // 设置开发者工具中的名称
            }
          )
        )
      )
    );
    ```

+ bearBox订阅cat属性

    ```tsx
    import { useEffect, useState } from "react";
    import { bearStore } from "../stores/bearStore";
    import { foodStore } from "../stores/foodStore";
    import { shallow } from "zustand/shallow";
    import { catStore } from "../stores/catStore";
    
    export const BearBox = () => {
      const { bears, increasePopulation, removeAllBears, resetState } = bearStore();
      /* -------------------- 创建本地状态，存储背景颜色 ------------------- */
      const [bgColor, setBgColor] = useState("lightPink");
      /* -------------------- 创建本地状态，存储字体颜色 ------------------- */
      const [fontColor, setFontColor] = useState("black");
      useEffect(() => {
        /* -------------------- 订阅foodStore状态 ------------------- */
        const unsb = foodStore.subscribe(
          (state) => state.fish, // 只关心fish属性
          (fish, prevFish) => {
            if (prevFish <= 5 && fish > 5) setBgColor("lightGreen");
            else if (prevFish > 5 && fish <= 5) setBgColor("lightPink");
          },
          /* ------------------------ 可选参数对象 ------------------------ */
          {
            equalityFn: shallow, // 判断是否相同
            fireImmediately: true, //是否立即执行， 默认是false
          }
        );
        /* ------------------------ 取消订阅 ------------------------ */
        return unsb;
      }, []);
    
      /* -------------------- 订阅catStore状态 -------------------- */
      useEffect(() => {
        const unsbCat = catStore.subscribe(
          (state) => state.cats.bigCats,
          (bigCats, prevBigCats) => {
            if (prevBigCats <= 5 && bigCats > 5) {
              setFontColor("purple");
            } else if (prevBigCats > 5 && bigCats <= 5) {
              setBgColor("black");
            }
          }
        );
        /* ------------------------ 取消订阅 ------------------------ */
        return unsbCat;
      }, []);
    
      return (
        <div
          className="box"
          /* ----------------设置背景颜色，设置字体颜色 ----------------- */
          style={{ background: bgColor, color: fontColor }}
        >
          <h1>BearBox</h1>
          <h2>bears : {bears}</h2>
          {/* ------------------- 添加随机数，验证页面重绘问题 ------------------- */}
          <h2>{Math.random()}</h2>
          <button onClick={increasePopulation}>add bear</button>
          <button onClick={removeAllBears}>remove All Bears</button>
          <button onClick={resetState}>reset state</button>
        </div>
      );
    };
    ```

    

#### 9. 分离action，简化store

1. 说明

+ store提供了2个方法getState( )和setState( )， 可以在store之外获取和设置state，分离action
+ 借用这2个方法，可以在store之外编写业务逻辑代码，简化store

2. 如何使用setState( )？

+ foodstore中添加插件devtools和persist

    ```ts
    import { create } from "zustand";
    import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
    
    type TFishStoreState = {
      fish: number;
      addOneFish: () => void;
      removeOneFish: () => void;
      removeAllFish: () => void;
    };
    
    export const foodStore = create<TFishStoreState>()(
      devtools(
        subscribeWithSelector(
          persist(
            (set) => ({
              fish: 0,
              addOneFish: () => set((state) => ({ fish: state.fish + 1 })),
              removeOneFish: () => set((state) => ({ fish: state.fish - 1 })),
              removeAllFish: () => set(() => ({ fish: 0 })),
            }),
            {
              name: "food store",
            }
          )
        ),
        {
          name: "food store",
        }
      )
    );
    ```

+ 使用setState( )， 在store外面更新状态

    ```
    import { foodStore } from "../stores/foodStore";
    
    export const FoodBox = () => {
      const fish = foodStore((state) => state.fish);
      const addOneFish = foodStore((state) => state.addOneFish);
      const removeOneFish = foodStore((state) => state.removeOneFish);
      const removeAllFish = foodStore((state) => state.removeAllFish);
    
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
    ```

3. 如何使用getState( )？

+ getState( )获取的状态是non-reactive的，即虽然状态值变化了，但不会渲染到页面中
+ getState可用来初始化？？？？？

4. 最重要的用途：将action和state相分离

+ 分离出foodStore中的action方法

    ```ts
    import { create } from "zustand";
    import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
    
    type TFishStoreState = {
      fish: number;
    };
    
    export const foodStore = create<TFishStoreState>()(
      devtools(
        subscribeWithSelector(
          persist(
            () => ({
              fish: 0,
            }),
            {
              name: "food store",
            }
          )
        ),
        {
          name: "food store",
        }
      )
    );
    
    export const addOneFish = () =>
      foodStore.setState((state) => ({ fish: state.fish + 1 }));
    export const removeOneFish = () =>
      foodStore.setState((state) => ({ fish: state.fish - 1 }));
    export const removeAllFish = () => foodStore.setState(() => ({ fish: 0 }));
    ```

+ 进一步简化：添加initState,  删除类型定义，添加类型为**typeof** initState

    ```ts
    import { create } from "zustand";
    import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
    
    const initState = {
      fish: 0,
    };
    export const foodStore = create<typeof initState>()(
      devtools(
        subscribeWithSelector(
          persist(
              () => initState, 
              {name: "food store"}
          )),
        { name: "food store"}
      )
    );
    
    export const addOneFish = () =>
      foodStore.setState((state) => ({ fish: state.fish + 1 }));
    export const removeOneFish = () =>
      foodStore.setState((state) => ({ fish: state.fish - 1 }));
    export const removeAllFish = () => foodStore.setState(() => ({ fish: 0 }));
    
    ```

+ 这样可以随时添加新的状态，而不需另外的类型定义

     ```ts
     import { create } from "zustand";
     import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
     
     const initState = {
       fish: 0,
       // 添加新的状态
       color: "golden",
     };
     export const foodStore = create<typeof initState>()(
       devtools(
         subscribeWithSelector(
           persist(
               () => initState, 
               {name: "food store"}
           )),
         { name: "food store"}
       )
     );
     
     export const addOneFish = () =>
       foodStore.setState((state) => ({ fish: state.fish + 1 }));
     export const removeOneFish = () =>
       foodStore.setState((state) => ({ fish: state.fish - 1 }));
     export const removeAllFish = () => foodStore.setState(() => ({ fish: 0 }));
     
     ```

+ foodBox中引入action，并使用

    ```tsx
    import {foodStore, addOneFish,  removeOneFish, removeAllFish} from "../stores/foodStore";
    
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
    ```

#### 9. 另一种简化store的方法: 抽离create方法中的核心部分

1. 怎么实现？

+ 以catStore为例，选择create方法中的核心部分，右键 -> Refactor ->Extract to constant in enclosing scope -> 命名为“ catSlice” 

    ```ts
    import { create } from "zustand";
    import { immer } from "zustand/middleware/immer";
    import { createSelectors } from "../utils/createSelectors";
    import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
    
    type TcatStoreState = {
      cats: {
        bigCats: number;
        smallCats: number;
      };
      increaseBigCats: () => void;
      increaseSmallCats: () => void;
      // 定义一个summary方法
      summary: () => void;
    };
    
    const catSlice = (set, get) => ({
      cats: {
        bigCats: 0,
        smallCats: 0,
      },
      increaseBigCats: () => set((state) => {
        state.cats.bigCats++;
      }),
      increaseSmallCats: () => set((state) => {
        state.cats.smallCats++;
      }),
      /* ------------------- 使用get()访问state ------------------- */
      summary: () => {
        const totalCats = get().cats.smallCats + get().cats.bigCats;
        alert("total cats is " + totalCats);
      },
    });
    export const catStore = createSelectors(
      create<TcatStoreState>()(
        // 直接更改状态
        immer(
          // 开发者工具
          devtools(
            // 订阅部分所选状态
            subscribeWithSelector(
              // 存取本地数据
              persist(
                catSlice,
                /* ----------------- 本地存储插件persist的配置对象 ----------------- */
                {
                  name: "cat store",
                }
              )
            ),
            /* -------------------- 开发者工具插件的配置对象 -------------------- */
            {
              enabled: true,
              name: "cat store", // 设置开发者工具中的名称
            }
          )
        )
      )
    );
    ```

+ 给抽离的catSlice添加类型

    ```ts
    import { StateCreator, create } from "zustand";
    import { immer } from "zustand/middleware/immer";
    import { createSelectors } from "../utils/createSelectors";
    import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
    
    type TcatStoreState = {
      cats: {
        bigCats: number;
        smallCats: number;
      };
      increaseBigCats: () => void;
      increaseSmallCats: () => void;
      // 定义一个summary方法
      summary: () => void;
    };
    
    const catSlice: StateCreator<
      TcatStoreState,
      [
        ["zustand/immer", never],
        ["zustand/devtools", unknown],
        ["zustand/subscribeWithSelector", never],
        ["zustand/persist", unknown]
      ]
    > = (set, get) => ({
      cats: {
        bigCats: 0,
        smallCats: 0,
      },
      increaseBigCats: () =>
        set((state) => {
          state.cats.bigCats++;
        }),
      increaseSmallCats: () =>
        set((state) => {
          state.cats.smallCats++;
        }),
      /* ------------------- 使用get()访问state ------------------- */
      summary: () => {
        const totalCats = get().cats.smallCats + get().cats.bigCats;
        alert("total cats is " + totalCats);
      },
    });
    export const catStore = createSelectors(
      create<TcatStoreState>()(
        // 直接更改状态
        immer(
          // 开发者工具
          devtools(
            // 订阅部分所选状态
            subscribeWithSelector(
              // 存取本地数据
              persist(
                catSlice,
                /* ----------------- 本地存储插件persist的配置对象 ----------------- */
                {name: "cat store"}
              )
            ),
            /* -------------------- 开发者工具插件的配置对象 -------------------- */
            {
              enabled: true,
              name: "cat store", // 设置开发者工具中的名称
            }
          )
        )
      )
    );
    ```

2. 对比：使用getState和setState方法分离action，简化store

    ```ts
    import { create } from "zustand";
    import { immer } from "zustand/middleware/immer";
    import { createSelectors } from "../utils/createSelectors";
    import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
    
    const initState = {
      cats: {
        bigCats: 0,
        smallCats: 0,
      },
    };
    
    export const catStore = createSelectors(
      create<typeof initState>()(
        // 直接更改状态
        immer(
          // 开发者工具
          devtools(
            // 订阅部分所选状态
            subscribeWithSelector(
              // 存取本地数据
              persist(
                () => initState,
                /* ----------------- 本地存储插件persist的配置对象 ----------------- */
                {
                  name: "cat store",
                }
              )
            ),
            /* -------------------- 开发者工具插件的配置对象 -------------------- */
            {
              name: "cat store", // 设置开发者工具中的名称
            }
          )
        )
      )
    );
    
    export const increaseBigCats = () =>
      catStore.setState((state) => {
        state.cats.bigCats++;
      });
    export const increaseSmallCats = () =>
      catStore.setState((state) => {
        state.cats.smallCats++;
      });
    export const summary = () => {
      const totalCats =
        catStore.getState().cats.smallCats + catStore.getState().cats.bigCats;
      alert("total cats is " + totalCats);
    };
    ```

3. 更推荐使用后一种简化方式

#### 10. 大总结
