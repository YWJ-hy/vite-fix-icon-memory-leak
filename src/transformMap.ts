import type MagicString from 'magic-string'

const checkboxTransform = (magicString: MagicString, code: string, isBuild: boolean) => {
  let CheckMarkKey = 'CheckMark'
  let LineMarkKey = 'LineMark'
  if (!isBuild) {
    CheckMarkKey = 'CheckMark_default'
    LineMarkKey = 'LineMark_default'
    magicString.replace(/(CheckMark|LineMark)_default =/g, (_, $1) => `_${$1}_default =`)
  }
  else {
    magicString.replace(/import\s?(CheckMark|LineMark)\s?from/g, (_, $1) => `import _${$1} from`)
  }
  const componentMatch
    = /defineComponent\s*\(\s*\{[^}]*name:\s*['"]Checkbox['"][\s\S]*render\(\)\s*\{/.exec(code)
  if (componentMatch) {
    const startIdx = componentMatch.index
    const renderMatch = /render\s*\(\)\s*\{/.exec(code.slice(startIdx))

    if (renderMatch) {
      // 定位到 render 函数的起始位置
      const renderStartIdx = startIdx + renderMatch.index + renderMatch[0].length

      magicString.appendLeft(
        renderStartIdx,
        `\n  const ${CheckMarkKey} = fixNaiveuiIconCloneVnode(_${CheckMarkKey});
             const ${LineMarkKey} = fixNaiveuiIconCloneVnode(_${LineMarkKey});`,
      )
    }
  }
}

const backTopTransform = (magicString: MagicString, code: string, isBuild: boolean) => {
  let BackTopKey = 'BackTopIcon'
  if (!isBuild) {
    BackTopKey = 'BackTopIcon_default'
    magicString.replace('BackTopIcon_default =', '_BackTopIcon_default =')
  }
  else {
    magicString.replace(/import\s?(BackTopIcon)\s?from/g, (_, $1) => `import _${$1} from`)
  }
  const componentMatch
    = /defineComponent\s*\(\s*\{[^}]*name:\s*['"]BackTop['"][\s\S]*render\(\)\s*\{/.exec(code)
  if (componentMatch) {
    const startIdx = componentMatch.index
    const renderMatch = /render\s*\([^)]*\)\s*\{/.exec(code.slice(startIdx))

    if (renderMatch) {
      // 定位到 render 函数的起始位置
      const renderStartIdx = startIdx + renderMatch.index + renderMatch[0].length

      magicString.appendLeft(
        renderStartIdx,
        `\n  const ${BackTopKey} = fixNaiveuiIconCloneVnode(_${BackTopKey});`,
      )
    }
  }
}

const rateTransform = (magicString: MagicString, code: string, isBuild: boolean) => {
  let StarIconKey = 'StarIcon'
  if (!isBuild) {
    StarIconKey = 'StarIcon_default'
    magicString.replace('StarIcon_default =', '_StarIcon_default =')
  }
  else {
    magicString.replace(/import\s?(StarIcon)\s?from/g, (_, $1) => `import _${$1} from`)
  }
  const componentMatch
    = /defineComponent\s*\(\s*\{[^}]*name:\s*['"]Rate['"][\s\S]*render\(\)\s*\{/.exec(code)
  if (componentMatch) {
    const startIdx = componentMatch.index
    const renderMatch = /render\s*\([^)]*\)\s*\{/.exec(code.slice(startIdx))

    if (renderMatch) {
      // 定位到 render 函数的起始位置
      const renderStartIdx = startIdx + renderMatch.index + renderMatch[0].length

      magicString.appendLeft(
        renderStartIdx,
        `\n  const ${StarIconKey} = fixNaiveuiIconCloneVnode(_${StarIconKey});`,
      )
    }
  }
}

const resultTransform = (magicString: MagicString) => {
  magicString.replace(
    /(403|404|418|500):\s*\(\)\s*=>\s*((\w)+),/g,
    (_, $1, $2) => `${$1}: () => fixNaiveuiIconCloneVnode(${$2}),`,
  )
}

export const transformDev = (magicString: MagicString, code: string) => {
  checkboxTransform(magicString, code, false)
  backTopTransform(magicString, code, false)
  rateTransform(magicString, code, false)
  resultTransform(magicString)
}

export const transformMap = {
  checkbox: checkboxTransform,
  backTop: backTopTransform,
  rate: rateTransform,
  result: resultTransform,
}
