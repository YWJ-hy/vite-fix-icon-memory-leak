import type { Plugin } from 'vite'
import type { Option } from './types'
import ViteFixNaiveuiIcon from './vite-fix-naiveui-icon'
import ViteFixViconsHoist from './vite-fix-vicons-hoist'

const ViteFixIconMemoryLeak = (opt: Option): Plugin[] => {
  return [ViteFixViconsHoist(opt), ...ViteFixNaiveuiIcon(opt)]
}

export default ViteFixIconMemoryLeak
