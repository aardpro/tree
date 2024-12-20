import cloneDeep from "lodash/cloneDeep";

interface TreeNode {
  [key: string]: TreeNode[] | string | null;
}
type TreeNodes = TreeNode[];

type WalkTreeCallback = (
  level: number,
  node: TreeNode,
  controller: AbortController
) => void;

interface PointerNode {
  [key: string]: TreeNode[] | string | null;
}
type PointerNodes = PointerNode[];

// 生成随机字符串作为id
const tmpId = () => `id${Math.random().toString(36).slice(2)}`;

export async function walk(
  nodes: TreeNodes = [],
  childProperty: string = "children",
  callback: WalkTreeCallback
) {
  if (!(nodes instanceof Array)) {
    return;
  }
  const controller = new AbortController();
  const queue = nodes.slice();
  let level = 0;
  const trueFlag = true;
  while (trueFlag) {
    level++;
    let count = queue.length;
    if (count === 0) {
      break;
    }
    while (count--) {
      const node = queue.shift();
      if (!node) {
        continue;
      }
      if (typeof callback === "function") {
        await callback(level, node, controller);
      }
      if (controller.signal.aborted) {
        return;
      }
      if (
        node[childProperty] instanceof Array &&
        node[childProperty].length > 0
      ) {
        for (let i = 0; i < node[childProperty].length; i++) {
          queue.push(node[childProperty][i] as TreeNode);
        }
      }
    }
  }
}

export async function flatten(
  treeArr1: TreeNodes = [],
  id: string = "id",
  pid: string = "pid",
  childProperty: string = "children"
) {
  const treeArr = cloneDeep(treeArr1);
  const arr = cloneDeep(treeArr);
  const res: PointerNodes = [];
  await walk(arr, childProperty, (_, node) => {
    if (!node[id]) {
      node[id] = tmpId();
    }
    if (!node[pid]) {
      node[pid] = null
    }
    if (node[childProperty] instanceof Array) {
      node[childProperty].forEach((child) => {
        if (!child[pid]) {
          child[pid] = node[id];
        }
      });
    }
    res.push(node);
  });
  res.forEach((item) => {
    delete item[childProperty];
  });
  return res;
}

export function tree(
  flatArr1: PointerNodes = [],
  id = "id",
  pid = "pid",
  childProperty = "children"
): TreeNodes {
  if (flatArr1.length === 0) {
    return [];
  }
  if (!flatArr1.find((item) => !item[pid])) {
    throw new Error("no root element found");
  }
  const flatArr = cloneDeep(flatArr1);
  const rootItems: TreeNodes = [];
  const lookup = new Map()
  // 首先，将所有项存储在查找表中，以便快速访问
  flatArr.forEach((item) => {
    lookup.set(item[id],{ ...item, [childProperty]: [] });
  });

  // 遍历所有项，将它们添加到它们的父项的children数组中
  flatArr.forEach((item) => {
    if (!item[pid]) {
      // 如果pid为null，则这是一个根节点
      rootItems.push(lookup.get(item[id]));
    } else if (lookup.has(item[pid])) {
      // 如果pid不为null，则将其添加到父节点的children数组中
      lookup.get(item[pid])[childProperty].push(lookup.get(item[id]));
    }
  });

  return rootItems;
}

export default {
  walk,
  flatten,
  tree,
};
