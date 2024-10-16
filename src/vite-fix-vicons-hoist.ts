import type { Plugin } from 'vite'
import MagicString from 'magic-string'
import { createFilter } from 'vite'

const ViteFixViconsHoist = (): Plugin => {
  let viconFilter: (id: string | unknown) => boolean
  return {
    name: 'vite-fix-vicons-hoist',
    config(_, { command }) {
      if (command === 'build') {
        viconFilter = createFilter(/\/@vicons\//)
      }
      else {
        viconFilter = createFilter(/\/\.vite\/deps\/@vicons_/)
      }
    },
    transform(code, id) {
      if (!viconFilter(id))
        return
      const reg = /(createElementBlock\)?\(["']svg["'], _hoisted_\d+, )(_hoisted_\d+)/g
      const magicString = new MagicString(code)
      magicString.replace(reg, (_match, $1, $2) => {
        return `${$1}[...${$2}]`
      })
      return {
        code: magicString.toString(),
        map: magicString.generateMap({ source: id, hires: true }),
      }
    },
  }
}

export default ViteFixViconsHoist
