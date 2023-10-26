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







