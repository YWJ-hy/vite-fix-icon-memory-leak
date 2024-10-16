import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  rules: {
    'ts/ban-ts-comment': 'off',
    'ts/explicit-function-return-type': 'off',
    'antfu/top-level-function': 'off',
  },
})
