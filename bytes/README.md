# Bytes

> See <https://github.com/visionmedia/bytes.js/blob/3.1.2/index.js>

```js
bytes(1024);
// output: '1KB'

bytes('1KB');
// output: 1024
```

1. << 运算符的用法 ??

```js
var map = {
  b:  1,
  kb: 1 << 10,
  mb: 1 << 20,
  gb: 1 << 30,
  tb: Math.pow(1024, 4),
  pb: Math.pow(1024, 5),
};
```

2. 匹配数字字符串的正则表达式

```js
var parseRegExp = /^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i;
```

- `(-|+)?` -> `(-|\+)?`
- `(\d+(.\d+)?)` -> `(\d+(\.\d+)?)` -> `(\d+(?:\.\d+)?)`
- ` *`
- `(kb|mb|gb|tb|pb)`
- `//i`

3. RE.exec() 的用法

[RegExp.prototype.exec(str)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec)

- 匹配失败返回 null，将 re.lastIndex 重置为 0
- 匹配成功返回一个数组，并更新 re.lastIndex
  - 数组的第一项是完整匹配的文本
  - 数组从第二项开始是捕获组匹配的文本
  - 另外，还有一些属性
    - .index：完整匹配文本的起始索引
    - .input：匹配的原始字符串
    - .groups：命名捕获组的内容
    - .indices：设置 `/d` 标志位时存在，是一个数组，标识匹配到的子串边界

```js
// Match "quick brown" followed by "jumps", ignoring characters in between
// Remember "brown" and "jumps"
// Ignore case
const re = /quick\s(?<color>brown).+?(jumps)/dgi;
const result = re.exec("The Quick Brown Fox Jumps Over The Lazy Dog");

/*
[
  0: "Quick Brown Fox Jumps",
  1: "Brown",
  2: "Jumps"
  groups: { color: "Brown" },
  index: 4,
  input: "The Quick Brown Fox Jumps Over The Lazy Dog",
  length: 3,
  indices: [
    [4, 25],
    [10, 15],
    [20, 25].
    groups: {
      color: [10, 15]
    }
  ]
]
*/

// 另外，由于正则表达式是全局的（global），re.lastIndex 会被设置为 25。
```

跟 [String.prototype.match(regexp)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/match) 的区别？

