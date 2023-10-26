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

    



