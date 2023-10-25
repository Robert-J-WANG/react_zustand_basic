## Zustand

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









