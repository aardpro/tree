import "./style.css";
import { useCascaderAreaData } from "@vant/area-data";
import { walk, tree, flatten } from "./package-entry";
window.onload = async () => {
  // 生成一批树形记录
  const rawEl = document.getElementById("raw") as HTMLTextAreaElement;
  const walkEl = document.getElementById("walk") as HTMLDivElement;
  const flatEl = document.getElementById("flat") as HTMLTextAreaElement;
  const treeEl = document.getElementById("tree") as HTMLTextAreaElement;
  if (!rawEl) {
    return;
  }
  const data = JSON.stringify(useCascaderAreaData(), null, 2);
  rawEl.value = data;

  document.getElementById("btn-walk")?.addEventListener("click", () => {
    walk(useCascaderAreaData(), "children", (level, node) => {
      const div = document.createElement("div");
      div.innerHTML = JSON.stringify(
        { level, value: node.value, text: node.text },
        null,
        level * 2
      );
      walkEl.appendChild(div);
    });
  });

  document.getElementById("btn-flatten")?.addEventListener("click", async () => {
    const flat = await flatten(useCascaderAreaData(), "value", "pid", "children");
    flatEl.value = JSON.stringify(flat, null, 2);
  });

  document.getElementById("btn-tree")?.addEventListener("click", async () => {
    const flat = await flatten(useCascaderAreaData(), "value", "pid", "children");
    flat.forEach(item => {
      item.id = item.value;
      delete item.value
    })
    const res = tree(flat, "id", "pid", "children");
    treeEl.value = JSON.stringify(res, null, 2);
  })
};
