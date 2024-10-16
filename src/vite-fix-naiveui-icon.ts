import type { Plugin } from 'vite'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import MagicString from 'magic-string'
import { createFilter } from 'vite'
import { transformDev, transformMap } from './transformMap'

const ViteFixNaiveuiIcon = (): Plugin[] => {
  let isBuild = false
  let fixReplaceableFilter: (id: string | unknown) => boolean
  let fixExportDefaultFilter: (id: string | unknown) => boolean
  return [
    {
      name: 'vite-fix-naiveui-icon:pre',
      enforce: 'pre',
      config(_, { command }) {
        if (command === 'build') {
          isBuild = true
          fixReplaceableFilter = createFilter(/\/naive-ui\/es\/_internal\/icons\/replaceable/)
          fixExportDefaultFilter = createFilter([
            /\/naive-ui\/es\/checkbox\/src\/Checkbox\.mjs/,
            /\/naive-ui\/es\/back-top\/src\/BackTop\.mjs/,
            /\/naive-ui\/es\/rate\/src\/Rate\.mjs/,
            /\/naive-ui\/es\/result\/src\/Result\.mjs/,
          ])
        }
        else {
          isBuild = false
          fixReplaceableFilter = createFilter(/\/\.vite\/deps\/naive-ui\.js/)
          fixExportDefaultFilter = createFilter(/\/\.vite\/deps\/naive-ui\.js/)
        }
      },
      resolveId(id) {
        if (id === 'virtual:vue-deepCloneVnode') {
          return id
        }
        return null
      },
      load(id) {
        if (id === 'virtual:vue-deepCloneVnode') {
          const filePath = path.resolve(__dirname, 'deepCloneVnode.js')
          const fileContent = readFileSync(filePath, 'utf-8')

          return fileContent
        }
      },
      transform(code, id) {
        if (!fixReplaceableFilter(id) && !fixExportDefaultFilter(id))
          return
        const magicString = new MagicString(code)
        magicString.prepend(`import deepCloneVnode from 'virtual:vue-deepCloneVnode';\n`)
        return {
          code: magicString.toString(),
          map: magicString.generateMap({ source: id, hires: true }),
        }
      },
    },
    {
      // 修复replaceable导致的内存泄漏
      name: 'vite-fix-naiveui-icon-replaceable',
      enforce: 'post',
      transform(code, id) {
        if (!fixReplaceableFilter(id))
          return
        const magicString = new MagicString(code)
        magicString.replace(
          'function replaceable(name, icon)',
          'function replaceable(name, _icon_)',
        )
        // 匹配 replaceable 方法的定义范围
        const replaceableMatch = /function replaceable\s*\(([^,]+),\s*icon\)\s*\{/.exec(code)

        if (replaceableMatch) {
          const [fullMatch] = replaceableMatch
          const startIdx = replaceableMatch.index
          const endIdx = startIdx + fullMatch.length

          let braceCount = 1
          let funcEndIdx = endIdx

          while (braceCount > 0 && funcEndIdx < code.length) {
            const char = code[funcEndIdx]
            if (char === '{')
              braceCount++
            if (char === '}')
              braceCount--
            funcEndIdx++
          }

          const replaceableCode = code.slice(endIdx, funcEndIdx)
          const setupMatch = /setup\s*\(\)\s*\{/.exec(replaceableCode)
          if (setupMatch) {
            const setupStartIdx = endIdx + setupMatch.index + setupMatch[0].length

            magicString.appendLeft(setupStartIdx, `\n  const icon = deepCloneVnode(_icon_);`)
          }
        }
        return {
          code: magicString.toString(),
          map: magicString.generateMap({ source: id, hires: true }),
        }
      },
    },
    {
      // 修复 naive-ui内置icon 导出直接引用导致 内存泄漏
      name: 'vite-fix-naiveui-icon-export-default',
      enforce: 'post',
      transform(code, id) {
        if (!fixExportDefaultFilter(id))
          return
        const magicString = new MagicString(code)
        if (!isBuild) {
          transformDev(magicString, code)
        }
        else {
          switch (true) {
            case id.includes('checkbox'):
              transformMap.checkbox(magicString, code, true)
              break
            case id.includes('back-top'):
              transformMap.backTop(magicString, code, true)
              break
            case id.includes('rate'):
              transformMap.rate(magicString, code, true)
              break
            case id.includes('result'):
              transformMap.result(magicString)
              break
          }
        }
        return {
          code: magicString.toString(),
          map: magicString.generateMap({ source: id, hires: true }),
        }
      },
    },
  ]
}

export default ViteFixNaiveuiIcon
