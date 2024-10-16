import MagicString from "magic-string";

const checkboxTransform = (magicString: MagicString, code: string, isBuild: boolean) => {
  let CheckMarkKey = "CheckMark";
  let LineMarkKey = "LineMark";
  if (!isBuild) {
    CheckMarkKey = "CheckMark_default";
    LineMarkKey = "LineMark_default";
    magicString.replace(/(CheckMark|LineMark)_default =/g, (_, $1) => `_${$1}_default =`);
  } else {
    magicString.replace(/import\s?(CheckMark|LineMark)\s?from/g, (_, $1) => `import _${$1} from`);
  }
  const componentMatch =
    /defineComponent\s*\(\s*{[^}]*name:\s*['"]Checkbox['"][\w\W]*render\(\)\s*{/.exec(code);
  if (componentMatch) {
    const startIdx = componentMatch.index;
    const renderMatch = /render\s*\(\)\s*{/.exec(code.slice(startIdx));

    if (renderMatch) {
      // 定位到 render 函数的起始位置
      const renderStartIdx = startIdx + renderMatch.index + renderMatch[0].length;

      magicString.appendLeft(
        renderStartIdx,
        `\n  const ${CheckMarkKey} = deepCloneVnode(_${CheckMarkKey});
             const ${LineMarkKey} = deepCloneVnode(_${LineMarkKey});`
      );
    }
  }
};

const backTopTransform = (magicString: MagicString, code: string, isBuild: boolean) => {
  let BackTopKey = "BackTopIcon";
  if (!isBuild) {
    BackTopKey = "BackTopIcon_default";
    magicString.replace("BackTopIcon_default =", "_BackTopIcon_default =");
  } else {
    magicString.replace(/import\s?(BackTopIcon)\s?from/g, (_, $1) => `import _${$1} from`);
  }
  const componentMatch =
    /defineComponent\s*\(\s*{[^}]*name:\s*['"]BackTop['"][\w\W]*render\(\)\s*{/.exec(code);
  if (componentMatch) {
    const startIdx = componentMatch.index;
    const renderMatch = /render\s*\([^)]*\)\s*{/.exec(code.slice(startIdx));

    if (renderMatch) {
      // 定位到 render 函数的起始位置
      const renderStartIdx = startIdx + renderMatch.index + renderMatch[0].length;

      magicString.appendLeft(
        renderStartIdx,
        `\n  const ${BackTopKey} = deepCloneVnode(_${BackTopKey});`
      );
    }
  }
};

const rateTransform = (magicString: MagicString, code: string, isBuild: boolean) => {
  let StarIconKey = "StarIcon";
  if (!isBuild) {
    StarIconKey = "StarIcon_default";
    magicString.replace("StarIcon_default =", "_StarIcon_default =");
  } else {
    magicString.replace(/import\s?(StarIcon)\s?from/g, (_, $1) => `import _${$1} from`);
  }
  const componentMatch =
    /defineComponent\s*\(\s*{[^}]*name:\s*['"]Rate['"][\w\W]*render\(\)\s*{/.exec(code);
  if (componentMatch) {
    const startIdx = componentMatch.index;
    const renderMatch = /render\s*\([^)]*\)\s*{/.exec(code.slice(startIdx));

    if (renderMatch) {
      // 定位到 render 函数的起始位置
      const renderStartIdx = startIdx + renderMatch.index + renderMatch[0].length;

      magicString.appendLeft(
        renderStartIdx,
        `\n  const ${StarIconKey} = deepCloneVnode(_${StarIconKey});`
      );
    }
  }
};

const resultTransform = (magicString: MagicString) => {
  magicString.replace(
    /(403|404|418|500):\s*\(\)\s*=>\s*((\w)+),/g,
    (_, $1, $2) => `${$1}: () => deepCloneVnode(${$2}),`
  );
};

export const transformDev = (magicString: MagicString, code: string) => {
  checkboxTransform(magicString, code, false);
  backTopTransform(magicString, code, false);
  rateTransform(magicString, code, false);
  resultTransform(magicString);
};

export const transformMap = {
  checkbox: checkboxTransform,
  backTop: backTopTransform,
  rate: rateTransform,
  result: resultTransform,
};
