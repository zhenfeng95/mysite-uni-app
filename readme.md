# vue2版本！！！
vue3版本请前往：[https://ext.dcloud.net.cn/plugin?id=13307](https://ext.dcloud.net.cn/plugin?id=13307)

## uniapp markdown渲染解析.md语法及代码高亮
> **组件名：uaMarkdown**
> 代码块： `<ua-markdown>`


uaMarkdown组件是基于`uniapp+vue2`自定义解析markdown语法插件、支持代码块高亮，编译兼容H5+小程序端+App端。


### 引入方式

本组件符合[easycom](https://uniapp.dcloud.io/collocation/pages?id=easycom)规范，只需将本组件`ua-markdown`放在components目录，在页面`template`中即可直接使用。


### 基本用法 

**示例**

- 基础用法

```html
const mdvalue = '### uniapp markdwon'
<ua-markdown :source="mdvalue" />
```

- 去掉代码块行号

```html
<ua-markdown :source="xxx" :showLine="false" />
```

- source测试值
```js
mdValue: "使用 JavaScript 编写的冒泡排序算法：\n\n```js\nfunction bubbleSort(arr) {\n  var len = arr.length;\n  for (var i = 0; i < len - 1; i++) {\n    for (var j = 0; j < len - 1 - i; j++) {\n      if (arr[j] > arr[j + 1]) {\n        var temp = arr[j];\n        arr[j] = arr[j + 1];\n        arr[j + 1] = temp;\n      }\n    }\n  }\n  return arr;\n}\n\n// 示例\nvar arr = [5, 3, 8, 4, 2];\nconsole.log(bubbleSort(arr)); // [2, 3, 4, 5, 8]\n```\n\n该算法的基本思路是依次比较相邻的两个元素，如果它们的顺序不正确则交换它们的位置。每一轮比较都会找到当前待排序序列中的最大值，所以需要进行 `n-1` 轮比较。在每一轮比较中，需要比较 `n-i-1` 对元素。"

mdValue: "列出30个常见的Emoji表情字符：\n\n1. 😃\n2. 😁\n3. 😂\n4. 🤣\n5. 😄\n6. 😅\n7. 😆\n8. 😉\n9. 😊\n10. 😋\n11. 😎\n12. 😍\n13. 😘\n14. 😗\n15. 😙\n16. 😚\n17. ☺️\n18. 🙂\n19. 🙃\n20. 😇\n21. 😌\n22. 😔\n23. 😖\n24. 😞\n25. 😟\n26. 😢\n27. 😭\n28. 😩\n29. 😫\n30. 😶\n\n请注意，这些Emoji字符串可能在某些设备上显示效果不同，因为它们的渲染和实现可能因平台和操作系统而异。"

mdValue: "| name | code |\n| --- | --- |\n| Uniapp markdown| 1 |\n```js\nconst name = 'Uniapp markdown'\nconst code = 1\n```\n****\n# level1\n## level2\n### level3\n#### level4\n##### level5\n###### level6\n****\n**BOLD**\n~~DELETE~~\n_ITALIC_\n<u>UNDERLINE<u>"

mdValue: "## Links\n\n[link text](http://dev.nodeca.com)\n\n[link with title](http://nodeca.github.io/pica/demo/ \"title text!\")\n\n\n## Plugins\n\nThe killer feature of `markdown-it` is very effective support of\n[syntax plugins](https://www.npmjs.org/browse/keyword/markdown-it-plugin)\n\n\n## Images\n\n![Minion](https://octodex.github.com/images/minion.png)\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg \"The Stormtroopocat\")\n\nLike links, Images also have a footnote style syntax\n\n![Alt text][id]\n\nWith a reference later in the document defining the URL location:\n\n[id]: https://octodex.github.com/images/dojocat.jpg  \"The Dojocat\""
```


### API

### uaMarkdown Props 

|属性名|类型|默认值|说明|
|:-:|:-:|:-:|:-:|
|source|String|-| 渲染解析内容 |
|showLine|Boolean|true| 是否显示代码块行号 |


### 💝最后

开发不易，希望各位小伙伴们多多支持下哈~~ ☕️☕️
