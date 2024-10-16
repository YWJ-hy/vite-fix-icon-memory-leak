import type { Plugin } from "vite";
import ViteFixViconsHoist from "./vite-fix-vicons-hoist";
import ViteFixNaiveuiIcon from "./vite-fix-naiveui-icon";

const ViteFixIconMemoryLeak = (): Plugin[] => {
  return [ViteFixViconsHoist(), ...ViteFixNaiveuiIcon()];
};

export default ViteFixIconMemoryLeak;
