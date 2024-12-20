# aardpro-tree

<div>处理树形数据的函数，包括<span style="color:red">打平</span>，<span style="color:red">做树</span>，<span style="color:red">遍历</span>等方法</div>
<div>tree-shaped array helpers, including <span style="color:red">flattening</span>, <span style="color:red">making trees</span>, <span style="color:red">traversing</span></div>

# 安装 Installation

## pnpm

> pnpm i aardpro-tree

## npm

> npm i aardpro-tree

## yarn

> yarn add aardpro-tree

# 使用 Usage

## walk 遍历函数

```ts
declare function walk<T extends object>(
  treeArr: T[],
  childProperty: string,
  callback: WalkTreeCallback<T>
): Promise<void>;
```

```js
import { walk } from "aardpro-tree";

const rawData = [
  {
    id: 99,
    name: "root",
    children: [
      {
        id: 88,
        name: "child1",
        children: [
          {
            id: 77,
            name: "child2",
            children: [
              {
                id: 3,
                name: "child3",
              },
            ],
          },
        ],
      },
    ],
  },
];

// 使用同步回调
walk(rawData, "children", (level, node, ctrl) => {
  if (node.id === 3) {
    console.log("we found it:", node);
    ctrl.abort();
  }
});

// 使用异步回调, 等待遍历结果
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log("start walk --------------");
  await walk(rawData, "children", async (level, node, ctrl) => {
    if (node.id === 77) {
      await sleep(1000);
      console.log("we found it: ", node);
      ctrl.abort();
    }
  });
  console.log("-------------- walk end");
}
```

## flatten 扁平化函数

```ts
declare function flatten<T extends PointerNodes>(
  treeArr1: T[],
  id?: string,
  pid?: string,
  childProperty?: string
): Promise<T[]>;
```

```js
import { flatten } from "aardpro-tree";

cont flatData = await flatten(rawData, 'id', 'pid', 'children')
```

## tree 做树函数

把带有父指针的平坦数组转化为嵌套数组  
convert a array with all elements including pointer to parent into nesting tree array

```ts
declare function tree<T extends PointerNodes>(
  flatArr1: T[],
  id?: string,
  pid?: string,
  childProperty?: string
): T[];
```

```js
import { tree } from "aardpro-tree";

const flatData = [
  {
    value: 99,
    name: "root",
    parent: null,
  },
  {
    value: 88,
    name: "child1",
    parent: 99,
  },
  {
    value: 77,
    name: "child2",
    parent: 88,
  },
  {
    value: 3,
    name: "child3",
    parent: 77,
  },
];

const treeData = tree(flatData, "value", "parent", "children");
```
