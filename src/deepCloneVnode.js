import { cloneVNode } from "vue";

export default function deepCloneVnode(vnode) {
  const cloned = cloneVNode(vnode);
  if (Array.isArray(vnode.children)) {
    cloned.children = vnode.children.map(child => deepCloneVnode(child));
  }
  return cloned;
}
