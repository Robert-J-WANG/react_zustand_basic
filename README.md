## Zustand学习笔记

#### 介绍：Zustand是一个新兴状态管理库，比传统的redux库要小巧且简单。甚至不需要使用provider包裹组件，也不需要thunder插件来实现异步操作

#### 1. 基本用法：

1. 准备好项目及需要的样式文件（过程省略.....）

```tsx
function App() {
  return (
    <>
      <div className="container">
        <h1>Zustand Tutorial</h1>
      </div>
    </>
  );
}
export default App;
```

2. 安装zustand库

```bash
yarn add zustand
```

3. 使用zustand的create方创建第一个store 钩子: src -> stores -> BearStore.ts 

```tsx
import { create } from "zustand";
const useStore = create((set) => ({
   //...state,  // zustand自动合并第一次状态
  bears: 0,
  increasePopulation: () =>set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));
```

##### 其中：create方法的参数是一个回调函数，这个回调函数输入set这个宝器，可以用来在状态对象中更新状态的数据；这个回调函数返回的就是状态对象（包含数据和方法）。 注意Zustand也遵循状态的不可变性，并且会自动合并第一层的状态值（即更新第一次状态的值，比如bears时，不需要...state展开原状态，而是直接更新），如果是多次状态的话，第二次，第三次等需要使用...手动展开，再更新，后面仔细讲解

4. 设置bearStore的状态的类型,  添加到create方法中， 并暴露这个store

```tsx
import { create } from "zustand";

type TBearStoreState = {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
};

 // 注意create<TBearStoreState>之后要添加一个括号（）
export const useStore = create<TBearStoreState>()((set) => ({ 
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));
```

5. 如何在组件中访问这个store？？

创建组件Components -> BearBox.tsx， App.tsx中引入组件

```tsx
import { BearBox } from "./components/BearBox";

function App() {
  return (
    <div className="container">
      <h1>Zustand Tutorial</h1>
      <div>
        <BearBox />
      </div>
    </div>
  );
}
export default App;
```

```tsx
export const BearBox = () => {
  return (
    <div className="box">
      <h1>BearBox</h1>
      <button>add bear</button>
      <button>removeAllBears</button>
    </div>
  );
};
```

useStore其实是一个hook， 不需要包裹一个provider传送门，直接引入钩子使用即可

```tsx
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
```

##### 注意：

##### 1. useStore钩子传入的是一个回调函数，这个回调的参数是state状态对象, 返回的是state状态对象的元素。使用useStore钩子就可以获取state里的任何元素了

##### 2. 如果使用返回全部状态元素的方法，解构获得的元素使用时，会有页面重渲染的问题，后面会讲到





#### 2. Get( ) 和set( )方法的使用，及使用插件immer的优化

Set( )方法是创建store时这create方法在中传入的。使用set方法可以更新状态数据

1. 新建一个新的store：src -> stores -> catStore.ts, 并暴露出去

```tsx
import { create } from "zustand";

type TcatStoreState = {
  cats: {
    bigCats: number;
    smallCats: number;
  };
  increaseBigCats: () => void;
  increaseSmallCats: () => void;
};

export const catStore = create<TcatStoreState>()((set) => ({
  cats: {
    bigCats: 0,
    smallCats: 0,
  },
  increaseBigCats: () =>
    set((state) => ({
      cats: {
        ...state.cats, // 要更新第2层的 bigCats，所以需要手动展开cats
        bigCats: state.cats.bigCats + 1,
      },
    })),
  increaseSmallCats: () =>
    set((state) => ({
      cats: {
        ...state.cats, // 要更新第2层的 smallCats，所以需要手动展开cats
        smallCats: state.cats.smallCats + 1,
      },
    })),
}));
```

2. 创建catbox组件，引入到APP中

```tsx
import { BearBox } from "./components/BearBox";
import { CatBox } from "./components/CatBox";

function App() {
  return (
    <div className="container">
      <h1>Zustand Tutorial</h1>
      <div>
        <BearBox />
      </div>
      <div>
        <CatBox />
      </div>
    </div>
  );
}
export default App;

```

```tsx
export const CatBox = () => {
  return (
    <div className="box">
      <h1>CatBox</h1>
      <h2>big cats : </h2>
      <h2>small cats : </h2>
      <div>
        <button>add big cats</button>
        <button>add small cats</button>
      </div>
    </div>
  );
};
```

3. CatBox组件中使用catStore

```tsx
import { catStore } from "../stores/catStore";

export const CatBox = () => {
  /* --------------------- 1.返回单个状态元素 --------------------- */
  /*
  const bigCats = catStore((state) => state.cats.bigCats);
  const smallCats = catStore((state) => state.cats.smallCats);
  const increaseBigCats = catStore((state) => state.increaseBigCats);
  const increaseSmallCats = catStore((state) => state.increaseSmallCats); 
  */
  /* -------------------- 2.批量返回全部状态元素 -------------------- */
  const { cats:{bigCats, smallCats}, increaseBigCats, increaseSmallCats } = catStore();
  return (
    <div className="box">
      <h1>CatBox</h1>
      <h2>big cats : {bigCats}</h2>
      <h2>small cats : {smallCats}</h2>
      <div>
        <button onClick={increaseBigCats}>add big cats</button>
        <button onClick={increaseSmallCats}>add small cats</button>
      </div>
    </div>
  );
};
```

4. 如何使用插件immer? 解决状态不可变性的问题，因为需要更新多层嵌套的状态元素时，都要先...手动展开其上层状态属性，才能更新，很繁琐。使用插件immer，就可以直接更新多级状态里的元素了

+ 安装immer 插件

```bash
yarn add immer
```

+ 引入immer，在catStore.ts中使用：用immer包裹create方法的内容 (全选的方法：光标定位到所选部分的开头，按下ctr+shift, 再连续按右箭头)

```tsx
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type TcatStoreState = {
  cats: {
    bigCats: number;
    smallCats: number;
  };
  increaseBigCats: () => void;
  increaseSmallCats: () => void;
};

export const catStore = create<TcatStoreState>()(
  // 使用immer包裹
  immer((set) => ({
    cats: { bigCats: 0,  smallCats: 0 },
    increaseBigCats: () =>
      set((state) => ({
        cats: {
          ...state.cats, // 要更新第2层的 bigCats，所以需要手动展开cats
          bigCats: state.cats.bigCats + 1,
        },
      })),
    increaseSmallCats: () =>
      set((state) => ({
        cats: {
          ...state.cats, // 要更新第2层的 smallCats，所以需要手动展开cats
          smallCats: state.cats.smallCats + 1,
        },
      })),
  }))
);

```

+ 重新修改set方法

```tsx
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type TcatStoreState = {
  cats: {
    bigCats: number;
    smallCats: number;
  };
  increaseBigCats: () => void;
  increaseSmallCats: () => void;
};

export const catStore = create<TcatStoreState>()(
  // 使用immer包裹
  immer((set) => ({
    cats: { bigCats: 0, smallCats: 0 },
    /* --------------------- 重新修改后的set方法 -------------------- */
    increaseBigCats: () => set((state) => {state.cats.bigCats++}),
    increaseSmallCats: () => set((state) => {state.cats.smallCats++}),
  }))
);
```

5. Get( )方法的使用

    在create函数中，我们可以通过set方法访问状态，并且更新状态，那么，如果要在set方法外面，如何访问state? 

    其实在reate函数中，还有一个get（）方法，可以读取state，但是不能更新

    在上面的catStore中新增一个方法summary，用来计算猫的总数：

    + TcatStoreState中添加summary方法的类型
    + create函数中添加get参数
    + 使用get方法获取状态，并定义summary方法

```tsx
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

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

export const catStore = create<TcatStoreState>()(
  immer((set, get) => ({
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
  }))
);
```

+ CatBox组件中使用summary方法

```tsx
import { catStore } from "../stores/catStore";

export const CatBox = () => {
  /* --------------------- 1.返回单个状态元素 --------------------- */
  /*  
 const bigCats = catStore((state) => state.cats.bigCats);
  const smallCats = catStore((state) => state.cats.smallCats);
  const increaseBigCats = catStore((state) => state.increaseBigCats);
  const increaseSmallCats = catStore((state) => state.increaseSmallCats);
  // 新增summary方法
  const summary = catStore((state) => state.summary); 
  */

  /* -------------------- 2.批量返回所以状态元素 -------------------- */
  const {
    cats: { bigCats, smallCats },
    increaseBigCats,
    increaseSmallCats,
    // 新增summary方法
    summary,
  } = catStore();
  return (
    <div className="box">
      <h1>CatBox</h1>
      <h2>big cats : {bigCats}</h2>
      <h2>small cats : {smallCats}</h2>
      <div>
        <button onClick={increaseBigCats}>add big cats</button>
        <button onClick={increaseSmallCats}>add small cats</button>
        {/* 使用summary方法 */}
        <button onClick={summary}>summary</button>
      </div>
    </div>
  );
};

```



3. #### 使用selector和自动selector简化代码

为什么要使用selector？

+ 存在的问题：
    + 上面CatBox组件中使用catStore钩子获取状态元素的时，如果一次性批量返回所以状态元素，但是只使用其中的部分元素时，会引发页面不必要 重渲染问题；
    + 如果分批获取单个状态元素时，要一遍一遍重写书写，太麻烦
+ 解决方案：使用selector( 就是CatBox组件中返回单个状态元素 的方式，selector是一个回调函数：(state) => state.cats.smallCats )

如何验证页面重绘的问题？

+ 创建新的组件 components -> CatBox2.tsx,  并添加到APP组件中

```tsx

export const CatBox2 = () => {
  return (
    <div className="box">
      <h1>CatBox2</h1>
      <h2>big cats : </h2>
    </div>
  );
};

```

```tsx
import { BearBox } from "./components/BearBox";
import { CatBox } from "./components/CatBox";
import { CatBox2 } from "./components/CatBox2";

function App() {
  return (
    <div className="container">
      <h1>Zustand Tutorial</h1>
      <div>
        <BearBox />
      </div>
      <div>
        <CatBox />
        <CatBox2 />
      </div>
    </div>
  );
}
export default App;
```

+ CatBox2组件中调用catStore钩子，获取state ( 一次性批量返回所以状态元素的方式，但只使用smallCats元素), 并使用

```tsx
import { catStore } from "../stores/catStore";

export const CatBox2 = () => {
  const { cats: { smallCats }} = catStore();
  return (
    <div className="box">
      <h1>CatBox2</h1>
      <h2>big cats :{smallCats} </h2>
    </div>
  );
};
```

+ CatBox2中添加随机数验证页面重绘：

```tsx
import { catStore } from "../stores/catStore";

export const CatBox2 = () => {
  const { cats: { smallCats }} = catStore();
  return (
    <div className="box">
      <h1>CatBox2</h1>
      <h2>big cats :{smallCats} </h2>
      <h2>{Math.random()}</h2>
    </div>
  );
};
```

+ CatBox组件中也添加随机数

```tsx
import { catStore } from "../stores/catStore";

export const CatBox = () => {
  /* --------------------- 1.返回单个状态元素 --------------------- */
  /*  
 const bigCats = catStore((state) => state.cats.bigCats);
  const smallCats = catStore((state) => state.cats.smallCats);
  const increaseBigCats = catStore((state) => state.increaseBigCats);
  const increaseSmallCats = catStore((state) => state.increaseSmallCats);
  // 新增summary方法
  const summary = catStore((state) => state.summary); 
  */

  /* -------------------- 2.批量返回所以状态元素 -------------------- */
  const {
    cats: { bigCats, smallCats },
    increaseBigCats,
    increaseSmallCats,
    // 新增summary方法
    summary,
  } = catStore();
  return (
    <div className="box">
      <h1>CatBox</h1>
      <h2>big cats : {bigCats}</h2>
      <h2>small cats : {smallCats}</h2>
      <h2>{Math.random()}</h2>
      <div>
        <button onClick={increaseBigCats}>add big cats</button>
        <button onClick={increaseSmallCats}>add small cats</button>
        {/* 使用summary方法 */}
        <button onClick={summary}>summary</button>
      </div>
    </div>
  );
};
```

+ 验证：
    + 当点击CatBox组件的add small cats按钮时，CatBox组件和CatBox2组件中的随机数发生了变化，因为2个组件都是用了smallCats属性；
    + 当点击CatBox组件的add big cats按钮时，CatBox组件和CatBox2组件中的随机数发生了变化，虽然组件CatBox2并没有使用到bigCats元素，显然，组件CatBox2发生了页面的重绘问题

使用selector

+ CatBox2组件中使用第一种方式，获取单个元素，并使用。 页面没有重绘

    ```tsx
    import { catStore } from "../stores/catStore";
    
    export const CatBox2 = () => {
      // const {
      //   cats: { smallCats },
      // } = catStore();
      /* -------------------- 使用selector获取 -------------------- */
      const smallCats = catStore((state) => state.cats.smallCats);
      return (
        <div className="box">
          <h1>CatBox2</h1>
          <h2>big cats :{smallCats} </h2>
          <h2>{Math.random()}</h2>
        </div>
      );
    };
    ```

如何使用自动的selector？

+ 使用selector时，每次只能获取单个元素，如果需要使用大量的元素的话，显然很麻烦

+ 使用使用Zustand提供的封装的Auto Generating Selectors

    + 创建一个新的组件CatController： component -> CatController.tsx， 并引入进APP

        ```tsx
        export const CatController = () => {
          return (
            <div className="box">
              <h1>CatController</h1>
              {/* 添加随机数，来验证页面的渲染 */}
              <h3>{Math.random()}</h3>
              <button>add big cats</button>
              <button>add small cats</button>
            </div>
          );
        };
        ```

        ```tsx
        import { BearBox } from "./components/BearBox";
        import { CatBox } from "./components/CatBox";
        import { CatBox2 } from "./components/CatBox2";
        import { CatController } from "./components/CatController";
        
        function App() {
          return (
            <div className="container">
              <h1>Zustand Tutorial</h1>
              <div>
                <BearBox />
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

    + 创建新的文件来存储提供的封装的Auto Generating Selectors， src -> utils ->createSelectors.ts

        ```ts
        import { StoreApi, UseBoundStore } from "zustand";
        
        type WithSelectors<S> = S extends { getState: () => infer T }
          ? S & { use: { [K in keyof T]: () => T[K] } }
          : never;
        
        export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
          _store: S
        ) => {
          const store = _store as WithSelectors<typeof _store>;
          store.use = {};
          for (const k of Object.keys(store.getState())) {
            (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
          }
        
          return store;
        };
        ```

    + 使用step1： 用createSelectors包裹catStore的create方法

        ```tsx
        import { create } from "zustand";
        import { immer } from "zustand/middleware/immer";
        import { createSelectors } from "../utils/createSelectors";
        
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
            immer((set, get) => ({
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
            }))
          )
        );
        ```

    + 使用step2： 组件CatController中使用catStore.use钩子

        ```tsx
        import { catStore } from "../stores/catStore";
        
        export const CatController = () => {
          /* --------------------- 会引发此组件的页面重绘 -------------------- */
          // const { increaseBigCats, increaseSmallCats } = catStore();
        
          /* -------------------- 不会引发此组件的页面重绘 -------------------- */
          const increaseBigCats = catStore.use.increaseBigCats();
          const increaseSmallCats = catStore.use.increaseSmallCats();
          return (
            <div className="box">
              <h1>CatController</h1>
              {/* 添加随机数，来验证页面的渲染 */}
              <h3>{Math.random()}</h3>
              <button onClick={increaseBigCats}>add big cats</button>
              <button onClick={increaseSmallCats}>add small cats</button>
            </div>
          );
        };
        ```

    + 验证：点击组件CatController中的按钮，就不会引起CatController中随机数的变化，因为此组件没有使用到 bigCats和 smallCats

注意点：使用提供的封装的Auto Generating Selectors，只能回去state下面第一层的元素，比如cats，无法获取其他层级的元素，比如 bigCats和 smallCats



4. #### 使用shallow，一次获取多个状态

+ 上面的CatController中，我们使用Zustand提供的封装的代码auto selector可以获取第一次的状态值，并且不会引发页面的重绘为题，但是一次只能获取一个状态。

+ 能否一次多去多个状态呢？

+ 使用shallow可以实现multi selector

在上面的CatController中，修改代码如下

```tsx
import { shallow } from "zustand/shallow";
import { catStore } from "../stores/catStore";

export const CatController = () => {
  /* --------------------- 会引发此组件的页面重绘 -------------------- */
  // const { increaseBigCats, increaseSmallCats } = catStore();

  /* ------------- auto selector: 不会引发此组件的页面重绘 ------------ */
  // const increaseBigCats = catStore.use.increaseBigCats();
  // const increaseSmallCats = catStore.use.increaseSmallCats();

  /* ------------------- multi-selector: ------------------ */
  const { increaseBigCats, increaseSmallCats } = catStore(
    (state) => ({
      increaseBigCats: state.increaseBigCats,
      increaseSmallCats: state.increaseSmallCats,
    }),
    shallow
  );
  return (
    <div className="box">
      <h1>CatController</h1>
      {/* 添加随机数，来验证页面的渲染 */}
      <h3>{Math.random()}</h3>
      <button onClick={increaseBigCats}>add big cats</button>
      <button onClick={increaseSmallCats}>add small cats</button>
    </div>
  );
};
```



