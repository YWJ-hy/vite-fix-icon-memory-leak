import type { Plugin } from 'vite'
import ViteFixNaiveuiIcon from './vite-fix-naiveui-icon'
import ViteFixViconsHoist from './vite-fix-vicons-hoist'

const ViteFixIconMemoryLeak = (): Plugin[] => {
  return [ViteFixViconsHoist(), ...ViteFixNaiveuiIcon()]
}

export default ViteFixIconMemoryLeak
