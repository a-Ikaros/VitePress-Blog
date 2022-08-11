---
title: React的一些总结
description: 自用，初学React防遗忘
date: 2022-08-10
tags:
  - react
---

### Context

可以脱离 props 传递数据

```jsx
const UserNameContext = React.createContext('')

function App() {
  const username = '张三'
  return <UserNameContext.Provider value={username}>
    <Layout>
    <div>Hello</div>
  </UserNameContext.Provider>
}

function Layout() {
  return <User />
}

function User() {
  return <UserNameContext.Consumer>
    {username => <h1>{username}</h1>}
  </UserNameContext.Consumer>v
}
```

### 默认 props

```jsx
function MyComponent(props) {
  return <div>hello {props.name}</div>;
}

MyComponent.defaultProps = {
  name: "张三",
};
```

### 组件优化(React.PureComponent 和 memo)

可以避免组件内 props 和 state 没有变化时进行的无意义渲染

```jsx
class MyComponent extends React.PureComponent {
  render() {
    return <div>I'm Pure Component</div>;
  }
}
function MyComponent() {
  return <div>I'm Pure Component</div>;
}

const PureComponent = React.memo(MyComponent);
```

### 子组件触发事件给父组件

```jsx
function App() {
  const submit = (data) => fetch('/api',  { data })
  return <Form onSubmit={submit} />
}

function Form({ onSubmit}) {
  const [data,  setData] = useState()
  return <div>
      <!-->表单元素<-->
      <button onClick={() => onSubmit(data)}>提交</button>
    </div>
}
```

### 高阶组件

高阶组件（HOC）是一种复用组件逻辑的技巧。组件是将 props 转换为 UI, 高阶组件是将组件转换为另一个组件。
使用 HOC 可以解决关注点的问题, 让需要被解决的问题集中到 HOC 组件中。
它不是某个 API, 而是一种编程模式。它的原理是接受一个组件作为参数, 并返回一个生成新组件的函数。下面是一个处理 Loading 的高阶组件。

```jsx
function MyComponent (props) {
  return <div>hello { props.name }</div>
}

function Loading () {
  return <div>loading...</div>
}

function withLoading ({ children }) => {
  return ({ isLoading }) => {
    if(isLoading) return <Loading />
    return children
  }
}

const WithLoging = withLoading(MyComponent)
```

### Portal 组件

有时我们需要将子组件渲染到父组件之外, 比如开发全局提示或全局对话框。这时就需要使用 createPortal 方法来实现。

```jsx
function Modal({ children }) {
  return React.createPortal(children, document.getElement("root"));
}
```

### 渲染和卸载组件

```jsx
//ReactDOM渲染方法
const container = document.getElementById("container");
ReactDOM.render(<Component />, container, () => {
  console.log("挂载成功！");
});
//老的卸载组件方法
unmountComponentAtNode(container);

//React 18最新渲染API
const root = ReactDOM.createRoot(container);
root.render(<Component />);
//React 18最新卸载方法
root.unmont();
```

### Hooks

如今, 我们应避免再使用 Class 组件, 全面使用 Hooks 组件
Hooks 的几个规则：
· Hooks 以 use 前缀开头
· 只能在 React 函数组件中使用
· 只能在 React 函数组件的顶层使用
· 不能根据条件使用

### useState

state 就是响应式的数据

```jsx
//function useState<S>(initialState: S | (() => S)): [S,  Dispatch<SetStateAction<S>>];
const [stateValue, setStateValue] = useState(initialValue);
```

### useEffect

useEffect 顾名思义, 就是执行副作用, 副作用指的是存在于我们的程序之外并且没有可以预测结果的操作。
useEffect 需要两个参数, 第一个是副作用函数, 第二个是依赖项数组。每当依赖项数组发生变化时, 副作用函数会重新执行。

```jsx
function useEffect(effect: EffectCallback, deps?: DependencyList): void;
```

useEffect(func, [])：空数组类似 componentDidMount 的生命周期, 在第一次渲染的时候执行 func

useEffect(func): 传空, 类似于 componentDidMount 和 componentDidUpdate 一起的生命周期, 在组件的每次 render 执行的时候, func 都会执行

### useRef

useRef 的主要用途之一是访问元素。
使用 useRef 的方法很简单, 调用它, 返回一个值, 然后将这个值通过 props 传递给 React 元素。
一旦将 ref 设置到元素上, 就可以通过 ref.current 访问到元素。
需要注意的是, 必须等待组件渲染结束后 ref 才有值, 否则 ref 是 undefined。

```jsx
function MyComponent() {
  const ref = React.useRef();
  console.log(ref); // undefined

  useEffect(() => {
    console.log(ref.current); // 现在才可以获取到元素
  }, []);

  return <div ref={ref} />;
}
```

### useContext

作用同 Context, 语法更加简单

```typescript
const UserNameContext = React.createContext('')

function App() {
  const username = '张三'
  return <UserNameContext.Provider value={username}>
    <Layout>
    <div>Hello</div>
  </UserNameContext.Provider>
}

function Layout() {
  return <User />
}

function User() {
  const username = React.useContext(UserNameContext)
  return <h1>{username}</h1>
}
```

### useCallback

useCallback 的作用是为了提高性能。如果我们在函数组件中创建了一些函数，那么当这个组件每次重新渲染时都会重新创建这些函数，这可能会影响程序的性能。
useCallback 接收两个参数，第一个是要被缓存的函数，第二个是一个依赖项数组。当依赖项数组中的任意一个值发生变化时，useCallback 就会重新创建这个函数。
另外，如果将这些函数作为参数传递给了子组件，那么还会导致子组件被重新渲染。我们可以使用 memo 结合 useCallback 来减少子组件的渲染。

```jsx
function Button({ onClick }) {
  console.log("button render");
  return <button onClick={onClick}>count++</button>;
}

const MemoButton = React.memo(Button);

function Counter() {
  const [count, setCount] = React.useState(0);

  const onClick = React.useCallback(() => {
    setCount((count) => count + 1);
  }, []);

  return (
    <>
      <p>count:{count}</p>
      <MemoButton onClick={onClick} />
    </>
  );
}

ReactDOM.render(<Counter />, document.getElementById("app"));
```

### useMemo

useMemo 和 useCallback 的作用类似，也是用来提高性能的。不同的是，useCallback 是缓存函数，而 useMemo 是缓存值。
有些渲染时需要用到的变量需要进行计算，而计算的过程可能会很消耗性能，所以当组件重新渲染而计算所需要的 state 没有发生变化时，可以避免再次计算。
和 useEffect、useCallback 类似，每当 useMemo 的依赖项发生变化时，它都会重新计算值。
下面是根据 useCallback 中的例子进行改造的例子。新增了 UserInfo 组件，当 Counter 组件中的 count 发生改变时，不会连带 UserInfo 一起更新。

```jsx
function Button({ onClick }) {
  console.log("button render");
  return <button onClick={onClick}>count++</button>;
}

const MemoButton = React.memo(Button);

function UserInfo({ userInfo: { name, age } }) {
  console.log("UserInfo render");
  return (
    <div>
      <p>{name}</p>
      <p>{age}</p>
    </div>
  );
}

const MemoUserInfo = React.memo(UserInfo);

function Counter() {
  const [count, setCount] = React.useState(0);
  const [name, setUsername] = React.useState("章三");

  const onClick = React.useCallback(() => {
    setCount((count) => count + 1);
  }, []);

  const userInfo = React.useMemo(() => {
    return {
      name,
      age: 15,
    };
  }, [name]);

  return (
    <>
      <MemoUserInfo userInfo={userInfo} />
      <p>count:{count}</p>
      <MemoButton onClick={onClick} />
    </>
  );
}

ReactDOM.render(<Counter />, document.getElementById("app"));
```

### useReducer

useReducer 是用来替代 useState 的 Hook，它用来处理复杂的状态逻辑。
它接收两个参数，第一个是 reducer，第二个是初始状态。
返回包含两个元素的数组，第一个元素是当前状态，第二个元素是改变状态的 dispatch 函数。这和 useState 很相似。
reducer 是一个函数，它接收两个参数，当前状态 state 和用来改变状态的 action，并返回新的状态。

```typescript
/**
 * An alternative to `useState`.
 *
 * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
 * multiple sub-values. It also lets you optimize performance for components that trigger deep
 * updates because you can pass `dispatch` down instead of callbacks.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#usereducer
 */
// overload where dispatch could accept 0 arguments.
function useReducer<R extends ReducerWithoutAction<any>, I>(
  reducer: R,
  initializerArg: I,
  initializer: (arg: I) => ReducerStateWithoutAction<R>
): [ReducerStateWithoutAction<R>, DispatchWithoutAction];
```

**以下是示例**

```jsx
const initialState = 0;

const reducer = (state, action) => {
  switch (action) {
    case "increment":
      return state + 1;
    case "decrement":
      return state - 1;
    case "reset":
      return initialState;
    default:
      return state;
  }
};

function Counter() {
  const [count, dispatch] = React.useReducer(reducer, initialState);
  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={() => dispatch("increment")}>增加</button>
      <button onClick={() => dispatch("decrement")}>减少</button>
      <button onClick={() => dispatch("reset")}>重置</button>
    </div>
  );
}

ReactDOM.render(<Counter />, document.getElementById("app"));
```

### useLayoutEffect

useLayoutEffect 和 useEffect 很相似，唯一的区别是执行时机不同，useLayoutEffect 是在浏览器进行 paint 和 layout 之后执行，所以利用 useLayoutEffect 可以防止页面闪烁。
最常见的一种情况是更新了一次状态，同时触发 effect 的回调函数，再次更新这个状态，导致短时间内连续更新两次状态。可以通过下面的活动截止倒计时程序来理解：

```jsx
function useInterval(callback, delay) {
  const savedCallback = React.useRef();

  React.useEffect(() => {
    savedCallback.current = callback;
  });

  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function Draw() {
  const [countdown, setCountdown] = React.useState(3);

  useInterval(() => setCountdown(countdown - 1), 1000);

  React.useLayoutEffect(() => {
    if (countdown <= 0) {
      setCountdown(3);
    }
  }, [countdown]);
  return (
    <div>
      <div>活动剩余截止时间：{countdown} 秒</div>
    </div>
  );
}

ReactDOM.render(<Draw />, document.getElementById("app"));
```

活动倒计时每秒会减 1 秒，当被减到 0 秒时，再重置为 3 秒。如果使用 useEffect，当倒计时被设置为 0 时，会重新渲染页面，并且马上再次将倒计时设置为 3，导致很短的时间页面渲染两次。
useLayoutEffect 的使用场景不多，它会阻塞渲染。通常可以通过逻辑进行避免。

### 自定义 Hook

我们可以根据自己的需求自定义 Hook，Hook 的作用是逻辑复用。自定义 Hook 有以下几个点需要注意：
·Hook 是以 use 开头的函数
·函数内部可以调用其他 Hook

useLayoutEffect 中的例子就用到了自定义 Hook useInterval。

```jsx
function useInterval(callback, delay) {
  const savedCallback = React.useRef();

  // 保存新回调
  React.useEffect(() => {
    savedCallback.current = callback;
  });

  // 建立 interval
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
```
