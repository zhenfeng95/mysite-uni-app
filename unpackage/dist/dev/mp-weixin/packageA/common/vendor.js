(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["packageA/common/vendor"],{

/***/ 504:
/*!***************************************************************************************************************************************!*\
  !*** /Users/zhangzhenfeng/Documents/duyi/project/mysite-uni-app/packageA/uni_modules/zero-markdown-view/components/mp-html/parser.js ***!
  \***************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni, wx) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
/**
 * @fileoverview html 解析器
 */

// 配置
var config = {
  // 信任的标签（保持标签名不变）
  trustTags: makeMap('a,abbr,ad,audio,b,blockquote,br,code,col,colgroup,dd,del,dl,dt,div,em,fieldset,h1,h2,h3,h4,h5,h6,hr,i,img,ins,label,legend,li,ol,p,q,ruby,rt,source,span,strong,sub,sup,table,tbody,td,tfoot,th,thead,tr,title,ul,video'),
  // 块级标签（转为 div，其他的非信任标签转为 span）
  blockTags: makeMap('address,article,aside,body,caption,center,cite,footer,header,html,nav,pre,section'),
  // 要移除的标签
  ignoreTags: makeMap('area,base,canvas,embed,frame,head,iframe,input,link,map,meta,param,rp,script,source,style,textarea,title,track,wbr'),
  // 自闭合的标签
  voidTags: makeMap('area,base,br,col,circle,ellipse,embed,frame,hr,img,input,line,link,meta,param,path,polygon,rect,source,track,use,wbr'),
  // html 实体
  entities: {
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    ensp: "\u2002",
    emsp: "\u2003",
    nbsp: '\xA0',
    semi: ';',
    ndash: '–',
    mdash: '—',
    middot: '·',
    lsquo: '‘',
    rsquo: '’',
    ldquo: '“',
    rdquo: '”',
    bull: '•',
    hellip: '…',
    larr: '←',
    uarr: '↑',
    rarr: '→',
    darr: '↓'
  },
  // 默认的标签样式
  tagStyle: {
    address: 'font-style:italic',
    big: 'display:inline;font-size:1.2em',
    caption: 'display:table-caption;text-align:center',
    center: 'text-align:center',
    cite: 'font-style:italic',
    dd: 'margin-left:40px',
    mark: 'background-color:yellow',
    pre: 'font-family:monospace;white-space:pre',
    s: 'text-decoration:line-through',
    small: 'display:inline;font-size:0.8em',
    strike: 'text-decoration:line-through',
    u: 'text-decoration:underline'
  },
  // svg 大小写对照表
  svgDict: {
    animatetransform: 'animateTransform',
    lineargradient: 'linearGradient',
    viewbox: 'viewBox',
    attributename: 'attributeName',
    repeatcount: 'repeatCount',
    repeatdur: 'repeatDur',
    foreignobject: 'foreignObject'
  }
};
var tagSelector = {};
var windowWidth, system;
if (uni.canIUse('getWindowInfo')) {
  windowWidth = uni.getWindowInfo().windowWidth;
  system = uni.getDeviceInfo().system;
} else {
  var systemInfo = uni.getSystemInfoSync();
  windowWidth = systemInfo.windowWidth;
  system = systemInfo.system;
}
var blankChar = makeMap(' ,\r,\n,\t,\f');
var idIndex = 0;

/**
 * @description 创建 map
 * @param {String} str 逗号分隔
 */
function makeMap(str) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = list.length; i--;) {
    map[list[i]] = true;
  }
  return map;
}

/**
 * @description 解码 html 实体
 * @param {String} str 要解码的字符串
 * @param {Boolean} amp 要不要解码 &amp;
 * @returns {String} 解码后的字符串
 */
function decodeEntity(str, amp) {
  var i = str.indexOf('&');
  while (i !== -1) {
    var j = str.indexOf(';', i + 3);
    var code = void 0;
    if (j === -1) break;
    if (str[i + 1] === '#') {
      // &#123; 形式的实体
      code = parseInt((str[i + 2] === 'x' ? '0' : '') + str.substring(i + 2, j));
      if (!isNaN(code)) {
        str = str.substr(0, i) + String.fromCharCode(code) + str.substr(j + 1);
      }
    } else {
      // &nbsp; 形式的实体
      code = str.substring(i + 1, j);
      if (config.entities[code] || code === 'amp' && amp) {
        str = str.substr(0, i) + (config.entities[code] || '&') + str.substr(j + 1);
      }
    }
    i = str.indexOf('&', i + 1);
  }
  return str;
}

/**
 * @description 合并多个块级标签，加快长内容渲染
 * @param {Array} nodes 要合并的标签数组
 */
function mergeNodes(nodes) {
  var i = nodes.length - 1;
  for (var j = i; j >= -1; j--) {
    if (j === -1 || nodes[j].c || !nodes[j].name || nodes[j].name !== 'div' && nodes[j].name !== 'p' && nodes[j].name[0] !== 'h' || (nodes[j].attrs.style || '').includes('inline')) {
      if (i - j >= 5) {
        nodes.splice(j + 1, i - j, {
          name: 'div',
          attrs: {},
          children: nodes.slice(j + 1, i + 1)
        });
      }
      i = j - 1;
    }
  }
}

/**
 * @description html 解析器
 * @param {Object} vm 组件实例
 */
function Parser(vm) {
  this.options = vm || {};
  this.tagStyle = Object.assign({}, config.tagStyle, this.options.tagStyle);
  this.imgList = vm.imgList || [];
  this.imgList._unloadimgs = 0;
  this.plugins = vm.plugins || [];
  this.attrs = Object.create(null);
  this.stack = [];
  this.nodes = [];
  this.pre = (this.options.containerStyle || '').includes('white-space') && this.options.containerStyle.includes('pre') ? 2 : 0;
}

/**
 * @description 执行解析
 * @param {String} content 要解析的文本
 */
Parser.prototype.parse = function (content) {
  // 插件处理
  for (var i = this.plugins.length; i--;) {
    if (this.plugins[i].onUpdate) {
      content = this.plugins[i].onUpdate(content, config) || content;
    }
  }
  new Lexer(this).parse(content);
  // 出栈未闭合的标签
  while (this.stack.length) {
    this.popNode();
  }
  if (this.nodes.length > 50) {
    mergeNodes(this.nodes);
  }
  return this.nodes;
};

/**
 * @description 将标签暴露出来（不被 rich-text 包含）
 */
Parser.prototype.expose = function () {
  for (var i = this.stack.length; i--;) {
    var item = this.stack[i];
    if (item.c || item.name === 'a' || item.name === 'video' || item.name === 'audio') return;
    item.c = 1;
  }
};

/**
 * @description 处理插件
 * @param {Object} node 要处理的标签
 * @returns {Boolean} 是否要移除此标签
 */
Parser.prototype.hook = function (node) {
  for (var i = this.plugins.length; i--;) {
    if (this.plugins[i].onParse && this.plugins[i].onParse(node, this) === false) {
      return false;
    }
  }
  return true;
};

/**
 * @description 将链接拼接上主域名
 * @param {String} url 需要拼接的链接
 * @returns {String} 拼接后的链接
 */
Parser.prototype.getUrl = function (url) {
  var domain = this.options.domain;
  if (url[0] === '/') {
    if (url[1] === '/') {
      // // 开头的补充协议名
      url = (domain ? domain.split('://')[0] : 'http') + ':' + url;
    } else if (domain) {
      // 否则补充整个域名
      url = domain + url;
    }
  } else if (!url.includes('data:') && !url.includes('://')) {
    if (domain) {
      url = domain + '/' + url;
    }
  }
  return url;
};

/**
 * @description 解析样式表
 * @param {Object} node 标签
 * @returns {Object}
 */
Parser.prototype.parseStyle = function (node) {
  var attrs = node.attrs;
  var list = (this.tagStyle[node.name] || '').split(';').concat((attrs.style || '').split(';'));
  var styleObj = {};
  var tmp = '';
  if (attrs.id && !this.xml) {
    // 暴露锚点
    if (this.options.useAnchor) {
      this.expose();
    } else if (node.name !== 'img' && node.name !== 'a' && node.name !== 'video' && node.name !== 'audio') {
      attrs.id = undefined;
    }
  }

  // 转换 width 和 height 属性
  if (attrs.width) {
    styleObj.width = parseFloat(attrs.width) + (attrs.width.includes('%') ? '%' : 'px');
    attrs.width = undefined;
  }
  if (attrs.height) {
    styleObj.height = parseFloat(attrs.height) + (attrs.height.includes('%') ? '%' : 'px');
    attrs.height = undefined;
  }
  for (var i = 0, len = list.length; i < len; i++) {
    var info = list[i].split(':');
    if (info.length < 2) continue;
    var key = info.shift().trim().toLowerCase();
    var value = info.join(':').trim();
    if (value[0] === '-' && value.lastIndexOf('-') > 0 || value.includes('safe')) {
      // 兼容性的 css 不压缩
      tmp += ";".concat(key, ":").concat(value);
    } else if (!styleObj[key] || value.includes('import') || !styleObj[key].includes('import')) {
      // 重复的样式进行覆盖
      if (value.includes('url')) {
        // 填充链接
        var j = value.indexOf('(') + 1;
        if (j) {
          while (value[j] === '"' || value[j] === "'" || blankChar[value[j]]) {
            j++;
          }
          value = value.substr(0, j) + this.getUrl(value.substr(j));
        }
      } else if (value.includes('rpx')) {
        // 转换 rpx（rich-text 内部不支持 rpx）
        value = value.replace(/[0-9.]+\s*rpx/g, function ($) {
          return parseFloat($) * windowWidth / 750 + 'px';
        });
      }
      styleObj[key] = value;
    }
  }
  node.attrs.style = tmp;
  return styleObj;
};

/**
 * @description 解析到标签名
 * @param {String} name 标签名
 * @private
 */
Parser.prototype.onTagName = function (name) {
  this.tagName = this.xml ? name : name.toLowerCase();
  if (this.tagName === 'svg') {
    this.xml = (this.xml || 0) + 1; // svg 标签内大小写敏感
    config.ignoreTags.style = undefined; // svg 标签内 style 可用
  }
};

/**
 * @description 解析到属性名
 * @param {String} name 属性名
 * @private
 */
Parser.prototype.onAttrName = function (name) {
  name = this.xml ? name : name.toLowerCase();
  if (name.substr(0, 5) === 'data-') {
    if (name === 'data-src' && !this.attrs.src) {
      // data-src 自动转为 src
      this.attrName = 'src';
    } else if (this.tagName === 'img' || this.tagName === 'a') {
      // a 和 img 标签保留 data- 的属性，可以在 imgtap 和 linktap 事件中使用
      this.attrName = name;
    } else {
      // 剩余的移除以减小大小
      this.attrName = undefined;
    }
  } else {
    this.attrName = name;
    this.attrs[name] = 'T'; // boolean 型属性缺省设置
  }
};

/**
 * @description 解析到属性值
 * @param {String} val 属性值
 * @private
 */
Parser.prototype.onAttrVal = function (val) {
  var name = this.attrName || '';
  if (name === 'style' || name === 'href') {
    // 部分属性进行实体解码
    this.attrs[name] = decodeEntity(val, true);
  } else if (name.includes('src')) {
    // 拼接主域名
    this.attrs[name] = this.getUrl(decodeEntity(val, true));
  } else if (name) {
    this.attrs[name] = val;
  }
};

/**
 * @description 解析到标签开始
 * @param {Boolean} selfClose 是否有自闭合标识 />
 * @private
 */
Parser.prototype.onOpenTag = function (selfClose) {
  // 拼装 node
  var node = Object.create(null);
  node.name = this.tagName;
  node.attrs = this.attrs;
  // 避免因为自动 diff 使得 type 被设置为 null 导致部分内容不显示
  if (this.options.nodes.length) {
    node.type = 'node';
  }
  this.attrs = Object.create(null);
  var attrs = node.attrs;
  var parent = this.stack[this.stack.length - 1];
  var siblings = parent ? parent.children : this.nodes;
  var close = this.xml ? selfClose : config.voidTags[node.name];

  // 替换标签名选择器
  if (tagSelector[node.name]) {
    attrs.class = tagSelector[node.name] + (attrs.class ? ' ' + attrs.class : '');
  }

  // 转换 embed 标签
  if (node.name === 'embed') {
    var src = attrs.src || '';
    // 按照后缀名和 type 将 embed 转为 video 或 audio
    if (src.includes('.mp4') || src.includes('.3gp') || src.includes('.m3u8') || (attrs.type || '').includes('video')) {
      node.name = 'video';
    } else if (src.includes('.mp3') || src.includes('.wav') || src.includes('.aac') || src.includes('.m4a') || (attrs.type || '').includes('audio')) {
      node.name = 'audio';
    }
    if (attrs.autostart) {
      attrs.autoplay = 'T';
    }
    attrs.controls = 'T';
  }

  // 处理音视频
  if (node.name === 'video' || node.name === 'audio') {
    // 设置 id 以便获取 context
    if (node.name === 'video' && !attrs.id) {
      attrs.id = 'v' + idIndex++;
    }
    // 没有设置 controls 也没有设置 autoplay 的自动设置 controls
    if (!attrs.controls && !attrs.autoplay) {
      attrs.controls = 'T';
    }
    // 用数组存储所有可用的 source
    node.src = [];
    if (attrs.src) {
      node.src.push(attrs.src);
      attrs.src = undefined;
    }
    this.expose();
  }

  // 处理自闭合标签
  if (close) {
    if (!this.hook(node) || config.ignoreTags[node.name]) {
      // 通过 base 标签设置主域名
      if (node.name === 'base' && !this.options.domain) {
        this.options.domain = attrs.href;
      } else if (node.name === 'source' && parent && (parent.name === 'video' || parent.name === 'audio') && attrs.src) {
        // 设置 source 标签（仅父节点为 video 或 audio 时有效）
        parent.src.push(attrs.src);
      }
      return;
    }

    // 解析 style
    var styleObj = this.parseStyle(node);

    // 处理图片
    if (node.name === 'img') {
      if (attrs.src) {
        // 标记 webp
        if (attrs.src.includes('webp')) {
          node.webp = 'T';
        }
        // data url 图片如果没有设置 original-src 默认为不可预览的小图片
        if (attrs.src.includes('data:') && this.options.previewImg !== 'all' && !attrs['original-src']) {
          attrs.ignore = 'T';
        }
        if (!attrs.ignore || node.webp || attrs.src.includes('cloud://')) {
          for (var i = this.stack.length; i--;) {
            var item = this.stack[i];
            if (item.name === 'a') {
              node.a = item.attrs;
            }
            if (item.name === 'table' && !node.webp && !attrs.src.includes('cloud://')) {
              if (!styleObj.display || styleObj.display.includes('inline')) {
                node.t = 'inline-block';
              } else {
                node.t = styleObj.display;
              }
              styleObj.display = undefined;
            }
            var style = item.attrs.style || '';
            if (style.includes('flex:') && !style.includes('flex:0') && !style.includes('flex: 0') && (!styleObj.width || parseInt(styleObj.width) > 100)) {
              styleObj.width = '100% !important';
              styleObj.height = '';
              for (var j = i + 1; j < this.stack.length; j++) {
                this.stack[j].attrs.style = (this.stack[j].attrs.style || '').replace('inline-', '');
              }
            } else if (style.includes('flex') && styleObj.width === '100%') {
              for (var _j = i + 1; _j < this.stack.length; _j++) {
                var _style = this.stack[_j].attrs.style || '';
                if (!_style.includes(';width') && !_style.includes(' width') && _style.indexOf('width') !== 0) {
                  styleObj.width = '';
                  break;
                }
              }
            } else if (style.includes('inline-block')) {
              if (styleObj.width && styleObj.width[styleObj.width.length - 1] === '%') {
                item.attrs.style += ';max-width:' + styleObj.width;
                styleObj.width = '';
              } else {
                item.attrs.style += ';max-width:100%';
              }
            }
            item.c = 1;
          }
          attrs.i = this.imgList.length.toString();
          var _src = attrs['original-src'] || attrs.src;
          if (this.imgList.includes(_src)) {
            // 如果有重复的链接则对域名进行随机大小写变换避免预览时错位
            var _i = _src.indexOf('://');
            if (_i !== -1) {
              _i += 3;
              var newSrc = _src.substr(0, _i);
              for (; _i < _src.length; _i++) {
                if (_src[_i] === '/') break;
                newSrc += Math.random() > 0.5 ? _src[_i].toUpperCase() : _src[_i];
              }
              newSrc += _src.substr(_i);
              _src = newSrc;
            }
          }
          this.imgList.push(_src);
          if (!node.t) {
            this.imgList._unloadimgs += 1;
          }
        }
      }
      if (styleObj.display === 'inline') {
        styleObj.display = '';
      }
      if (attrs.ignore) {
        styleObj['max-width'] = styleObj['max-width'] || '100%';
        attrs.style += ';-webkit-touch-callout:none';
      }

      // 设置的宽度超出屏幕，为避免变形，高度转为自动
      if (parseInt(styleObj.width) > windowWidth) {
        styleObj.height = undefined;
      }
      // 记录是否设置了宽高
      if (!isNaN(parseInt(styleObj.width))) {
        node.w = 'T';
      }
      if (!isNaN(parseInt(styleObj.height)) && (!styleObj.height.includes('%') || parent && (parent.attrs.style || '').includes('height'))) {
        node.h = 'T';
      }
      if (node.w && node.h && styleObj['object-fit']) {
        if (styleObj['object-fit'] === 'contain') {
          node.m = 'aspectFit';
        } else if (styleObj['object-fit'] === 'cover') {
          node.m = 'aspectFill';
        }
      }
    } else if (node.name === 'svg') {
      siblings.push(node);
      this.stack.push(node);
      this.popNode();
      return;
    }
    for (var key in styleObj) {
      if (styleObj[key]) {
        attrs.style += ";".concat(key, ":").concat(styleObj[key].replace(' !important', ''));
      }
    }
    attrs.style = attrs.style.substr(1) || undefined;
  } else {
    if ((node.name === 'pre' || (attrs.style || '').includes('white-space') && attrs.style.includes('pre')) && this.pre !== 2) {
      this.pre = node.pre = 1;
    }
    node.children = [];
    this.stack.push(node);
  }

  // 加入节点树
  siblings.push(node);
};

/**
 * @description 解析到标签结束
 * @param {String} name 标签名
 * @private
 */
Parser.prototype.onCloseTag = function (name) {
  // 依次出栈到匹配为止
  name = this.xml ? name : name.toLowerCase();
  var i;
  for (i = this.stack.length; i--;) {
    if (this.stack[i].name === name) break;
  }
  if (i !== -1) {
    while (this.stack.length > i) {
      this.popNode();
    }
  } else if (name === 'p' || name === 'br') {
    var siblings = this.stack.length ? this.stack[this.stack.length - 1].children : this.nodes;
    siblings.push({
      name: name,
      attrs: {
        class: tagSelector[name] || '',
        style: this.tagStyle[name] || ''
      }
    });
  }
};

/**
 * @description 处理标签出栈
 * @private
 */
Parser.prototype.popNode = function () {
  var node = this.stack.pop();
  var attrs = node.attrs;
  var children = node.children;
  var parent = this.stack[this.stack.length - 1];
  var siblings = parent ? parent.children : this.nodes;
  if (!this.hook(node) || config.ignoreTags[node.name]) {
    // 获取标题
    if (node.name === 'title' && children.length && children[0].type === 'text' && this.options.setTitle) {
      uni.setNavigationBarTitle({
        title: children[0].text
      });
    }
    siblings.pop();
    return;
  }
  if (node.pre && this.pre !== 2) {
    // 是否合并空白符标识
    this.pre = node.pre = undefined;
    for (var i = this.stack.length; i--;) {
      if (this.stack[i].pre) {
        this.pre = 1;
      }
    }
  }
  var styleObj = {};

  // 转换 svg
  if (node.name === 'svg') {
    if (this.xml > 1) {
      // 多层 svg 嵌套
      this.xml--;
      return;
    }
    var src = '';
    var style = attrs.style;
    attrs.style = '';
    attrs.xmlns = 'http://www.w3.org/2000/svg';
    (function traversal(node) {
      if (node.type === 'text') {
        src += node.text;
        return;
      }
      var name = config.svgDict[node.name] || node.name;
      if (name === 'foreignObject') {
        var _iterator = _createForOfIteratorHelper(node.children || []),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var child = _step.value;
            if (child.attrs && !child.attrs.xmlns) {
              child.attrs.xmlns = 'http://www.w3.org/1999/xhtml';
              break;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      src += '<' + name;
      for (var item in node.attrs) {
        var val = node.attrs[item];
        if (val) {
          src += " ".concat(config.svgDict[item] || item, "=\"").concat(val.replace(/"/g, ''), "\"");
        }
      }
      if (!node.children) {
        src += '/>';
      } else {
        src += '>';
        for (var _i2 = 0; _i2 < node.children.length; _i2++) {
          traversal(node.children[_i2]);
        }
        src += '</' + name + '>';
      }
    })(node);
    node.name = 'img';
    node.attrs = {
      src: 'data:image/svg+xml;utf8,' + src.replace(/#/g, '%23'),
      style: style,
      ignore: 'T'
    };
    node.children = undefined;
    this.xml = false;
    config.ignoreTags.style = true;
    return;
  }

  // 转换 align 属性
  if (attrs.align) {
    if (node.name === 'table') {
      if (attrs.align === 'center') {
        styleObj['margin-inline-start'] = styleObj['margin-inline-end'] = 'auto';
      } else {
        styleObj.float = attrs.align;
      }
    } else {
      styleObj['text-align'] = attrs.align;
    }
    attrs.align = undefined;
  }

  // 转换 dir 属性
  if (attrs.dir) {
    styleObj.direction = attrs.dir;
    attrs.dir = undefined;
  }

  // 转换 font 标签的属性
  if (node.name === 'font') {
    if (attrs.color) {
      styleObj.color = attrs.color;
      attrs.color = undefined;
    }
    if (attrs.face) {
      styleObj['font-family'] = attrs.face;
      attrs.face = undefined;
    }
    if (attrs.size) {
      var size = parseInt(attrs.size);
      if (!isNaN(size)) {
        if (size < 1) {
          size = 1;
        } else if (size > 7) {
          size = 7;
        }
        styleObj['font-size'] = ['x-small', 'small', 'medium', 'large', 'x-large', 'xx-large', 'xxx-large'][size - 1];
      }
      attrs.size = undefined;
    }
  }

  // 一些编辑器的自带 class
  if ((attrs.class || '').includes('align-center')) {
    styleObj['text-align'] = 'center';
  }
  Object.assign(styleObj, this.parseStyle(node));
  if (node.name !== 'table' && parseInt(styleObj.width) > windowWidth) {
    styleObj['max-width'] = '100%';
    styleObj['box-sizing'] = 'border-box';
  }
  if (config.blockTags[node.name]) {
    node.name = 'div';
  } else if (!config.trustTags[node.name] && !this.xml) {
    // 未知标签转为 span，避免无法显示
    node.name = 'span';
  }
  if (node.name === 'a' || node.name === 'ad') {
    this.expose();
  } else if (node.name === 'video') {
    if ((styleObj.height || '').includes('auto')) {
      styleObj.height = undefined;
    }
  } else if ((node.name === 'ul' || node.name === 'ol') && node.c) {
    // 列表处理
    var types = {
      a: 'lower-alpha',
      A: 'upper-alpha',
      i: 'lower-roman',
      I: 'upper-roman'
    };
    if (types[attrs.type]) {
      attrs.style += ';list-style-type:' + types[attrs.type];
      attrs.type = undefined;
    }
    for (var _i3 = children.length; _i3--;) {
      if (children[_i3].name === 'li') {
        children[_i3].c = 1;
      }
    }
  } else if (node.name === 'table') {
    // 表格处理
    // cellpadding、cellspacing、border 这几个常用表格属性需要通过转换实现
    var padding = parseFloat(attrs.cellpadding);
    var spacing = parseFloat(attrs.cellspacing);
    var border = parseFloat(attrs.border);
    var bordercolor = styleObj['border-color'];
    var borderstyle = styleObj['border-style'];
    if (node.c) {
      // padding 和 spacing 默认 2
      if (isNaN(padding)) {
        padding = 2;
      }
      if (isNaN(spacing)) {
        spacing = 2;
      }
    }
    if (border) {
      attrs.style += ";border:".concat(border, "px ").concat(borderstyle || 'solid', " ").concat(bordercolor || 'gray');
    }
    if (node.flag && node.c) {
      // 有 colspan 或 rowspan 且含有链接的表格通过 grid 布局实现
      styleObj.display = 'grid';
      if (styleObj['border-collapse'] === 'collapse') {
        styleObj['border-collapse'] = undefined;
        spacing = 0;
      }
      if (spacing) {
        styleObj['grid-gap'] = spacing + 'px';
        styleObj.padding = spacing + 'px';
      } else if (border) {
        // 无间隔的情况下避免边框重叠
        attrs.style += ';border-left:0;border-top:0';
      }
      var width = []; // 表格的列宽
      var trList = []; // tr 列表
      var cells = []; // 保存新的单元格
      var map = {}; // 被合并单元格占用的格子

      (function traversal(nodes) {
        for (var _i4 = 0; _i4 < nodes.length; _i4++) {
          if (nodes[_i4].name === 'tr') {
            trList.push(nodes[_i4]);
          } else if (nodes[_i4].name === 'colgroup') {
            var colI = 1;
            var _iterator2 = _createForOfIteratorHelper(nodes[_i4].children || []),
              _step2;
            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var col = _step2.value;
                if (col.name === 'col') {
                  var _style2 = col.attrs.style || '';
                  var start = _style2.indexOf('width') ? _style2.indexOf(';width') : 0;
                  // 提取出宽度
                  if (start !== -1) {
                    var end = _style2.indexOf(';', start + 6);
                    if (end === -1) {
                      end = _style2.length;
                    }
                    width[colI] = _style2.substring(start ? start + 7 : 6, end);
                  }
                  colI += 1;
                }
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          } else {
            traversal(nodes[_i4].children || []);
          }
        }
      })(children);
      for (var row = 1; row <= trList.length; row++) {
        var col = 1;
        for (var j = 0; j < trList[row - 1].children.length; j++) {
          var td = trList[row - 1].children[j];
          if (td.name === 'td' || td.name === 'th') {
            // 这个格子被上面的单元格占用，则列号++
            while (map[row + '.' + col]) {
              col++;
            }
            var _style3 = td.attrs.style || '';
            var start = _style3.indexOf('width') ? _style3.indexOf(';width') : 0;
            // 提取出 td 的宽度
            if (start !== -1) {
              var end = _style3.indexOf(';', start + 6);
              if (end === -1) {
                end = _style3.length;
              }
              if (!td.attrs.colspan) {
                width[col] = _style3.substring(start ? start + 7 : 6, end);
              }
              _style3 = _style3.substr(0, start) + _style3.substr(end);
            }
            // 设置竖直对齐
            _style3 += ';display:flex';
            start = _style3.indexOf('vertical-align');
            if (start !== -1) {
              var val = _style3.substr(start + 15, 10);
              if (val.includes('middle')) {
                _style3 += ';align-items:center';
              } else if (val.includes('bottom')) {
                _style3 += ';align-items:flex-end';
              }
            } else {
              _style3 += ';align-items:center';
            }
            // 设置水平对齐
            start = _style3.indexOf('text-align');
            if (start !== -1) {
              var _val = _style3.substr(start + 11, 10);
              if (_val.includes('center')) {
                _style3 += ';justify-content: center';
              } else if (_val.includes('right')) {
                _style3 += ';justify-content: right';
              }
            }
            _style3 = (border ? ";border:".concat(border, "px ").concat(borderstyle || 'solid', " ").concat(bordercolor || 'gray') + (spacing ? '' : ';border-right:0;border-bottom:0') : '') + (padding ? ";padding:".concat(padding, "px") : '') + ';' + _style3;
            // 处理列合并
            if (td.attrs.colspan) {
              _style3 += ";grid-column-start:".concat(col, ";grid-column-end:").concat(col + parseInt(td.attrs.colspan));
              if (!td.attrs.rowspan) {
                _style3 += ";grid-row-start:".concat(row, ";grid-row-end:").concat(row + 1);
              }
              col += parseInt(td.attrs.colspan) - 1;
            }
            // 处理行合并
            if (td.attrs.rowspan) {
              _style3 += ";grid-row-start:".concat(row, ";grid-row-end:").concat(row + parseInt(td.attrs.rowspan));
              if (!td.attrs.colspan) {
                _style3 += ";grid-column-start:".concat(col, ";grid-column-end:").concat(col + 1);
              }
              // 记录下方单元格被占用
              for (var rowspan = 1; rowspan < td.attrs.rowspan; rowspan++) {
                for (var colspan = 0; colspan < (td.attrs.colspan || 1); colspan++) {
                  map[row + rowspan + '.' + (col - colspan)] = 1;
                }
              }
            }
            if (_style3) {
              td.attrs.style = _style3;
            }
            cells.push(td);
            col++;
          }
        }
        if (row === 1) {
          var temp = '';
          for (var _i5 = 1; _i5 < col; _i5++) {
            temp += (width[_i5] ? width[_i5] : 'auto') + ' ';
          }
          styleObj['grid-template-columns'] = temp;
        }
      }
      node.children = cells;
    } else {
      // 没有使用合并单元格的表格通过 table 布局实现
      if (node.c) {
        styleObj.display = 'table';
      }
      if (!isNaN(spacing)) {
        styleObj['border-spacing'] = spacing + 'px';
      }
      if (border || padding) {
        // 遍历
        (function traversal(nodes) {
          for (var _i6 = 0; _i6 < nodes.length; _i6++) {
            var _td = nodes[_i6];
            if (_td.name === 'th' || _td.name === 'td') {
              if (border) {
                _td.attrs.style = "border:".concat(border, "px ").concat(borderstyle || 'solid', " ").concat(bordercolor || 'gray', ";").concat(_td.attrs.style || '');
              }
              if (padding) {
                _td.attrs.style = "padding:".concat(padding, "px;").concat(_td.attrs.style || '');
              }
            } else if (_td.children) {
              traversal(_td.children);
            }
          }
        })(children);
      }
    }
    // 给表格添加一个单独的横向滚动层
    if (this.options.scrollTable && !(attrs.style || '').includes('inline')) {
      var table = Object.assign({}, node);
      node.name = 'div';
      node.attrs = {
        style: 'overflow:auto'
      };
      node.children = [table];
      attrs = table.attrs;
    }
  } else if ((node.name === 'tbody' || node.name === 'tr') && node.flag && node.c) {
    node.flag = undefined;
    (function traversal(nodes) {
      for (var _i7 = 0; _i7 < nodes.length; _i7++) {
        if (nodes[_i7].name === 'td') {
          // 颜色样式设置给单元格避免丢失
          for (var _i8 = 0, _arr = ['color', 'background', 'background-color']; _i8 < _arr.length; _i8++) {
            var _style4 = _arr[_i8];
            if (styleObj[_style4]) {
              nodes[_i7].attrs.style = _style4 + ':' + styleObj[_style4] + ';' + (nodes[_i7].attrs.style || '');
            }
          }
        } else {
          traversal(nodes[_i7].children || []);
        }
      }
    })(children);
  } else if ((node.name === 'td' || node.name === 'th') && (attrs.colspan || attrs.rowspan)) {
    for (var _i9 = this.stack.length; _i9--;) {
      if (this.stack[_i9].name === 'table' || this.stack[_i9].name === 'tbody' || this.stack[_i9].name === 'tr') {
        this.stack[_i9].flag = 1; // 指示含有合并单元格
      }
    }
  } else if (node.name === 'ruby') {
    // 转换 ruby
    node.name = 'span';
    for (var _i10 = 0; _i10 < children.length - 1; _i10++) {
      if (children[_i10].type === 'text' && children[_i10 + 1].name === 'rt') {
        children[_i10] = {
          name: 'div',
          attrs: {
            style: 'display:inline-block;text-align:center'
          },
          children: [{
            name: 'div',
            attrs: {
              style: 'font-size:50%;' + (children[_i10 + 1].attrs.style || '')
            },
            children: children[_i10 + 1].children
          }, children[_i10]]
        };
        children.splice(_i10 + 1, 1);
      }
    }
  } else if (node.c) {
    (function traversal(node) {
      node.c = 2;
      for (var _i11 = node.children.length; _i11--;) {
        var child = node.children[_i11];
        if (!child.c || child.name === 'table') {
          node.c = 1;
        }
      }
    })(node);
  }
  if ((styleObj.display || '').includes('flex') && !node.c) {
    for (var _i12 = children.length; _i12--;) {
      var item = children[_i12];
      if (item.f) {
        item.attrs.style = (item.attrs.style || '') + item.f;
        item.f = undefined;
      }
    }
  }
  // flex 布局时部分样式需要提取到 rich-text 外层
  var flex = parent && ((parent.attrs.style || '').includes('flex') || (parent.attrs.style || '').includes('grid'))

  // 检查基础库版本 virtualHost 是否可用
  && !(node.c && wx.getNFCAdapter); // eslint-disable-line

  if (flex) {
    node.f = ';max-width:100%';
  }
  if (children.length >= 50 && node.c && !(styleObj.display || '').includes('flex')) {
    mergeNodes(children);
  }
  for (var key in styleObj) {
    if (styleObj[key]) {
      var _val2 = ";".concat(key, ":").concat(styleObj[key].replace(' !important', ''));
      if (flex && (key.includes('flex') && key !== 'flex-direction' || key === 'align-self' || key.includes('grid') || styleObj[key][0] === '-' || key.includes('width') && _val2.includes('%'))) {
        node.f += _val2;
        if (key === 'width') {
          attrs.style += ';width:100%';
        }
      } else {
        attrs.style += _val2;
      }
    }
  }
  attrs.style = attrs.style.substr(1) || undefined;
};

/**
 * @description 解析到文本
 * @param {String} text 文本内容
 */
Parser.prototype.onText = function (text) {
  if (!this.pre) {
    // 合并空白符
    var trim = '';
    var flag;
    for (var i = 0, len = text.length; i < len; i++) {
      if (!blankChar[text[i]]) {
        trim += text[i];
      } else {
        if (trim[trim.length - 1] !== ' ') {
          trim += ' ';
        }
        if (text[i] === '\n' && !flag) {
          flag = true;
        }
      }
    }
    // 去除含有换行符的空串
    if (trim === ' ') {
      if (flag) return;
    }
    text = trim;
  }
  var node = Object.create(null);
  node.type = 'text';
  node.text = decodeEntity(text);
  if (this.hook(node)) {
    if (this.options.selectable === 'force' && system.includes('iOS') && !uni.canIUse('rich-text.user-select')) {
      this.expose();
    }
    var siblings = this.stack.length ? this.stack[this.stack.length - 1].children : this.nodes;
    siblings.push(node);
  }
};

/**
 * @description html 词法分析器
 * @param {Object} handler 高层处理器
 */
function Lexer(handler) {
  this.handler = handler;
}

/**
 * @description 执行解析
 * @param {String} content 要解析的文本
 */
Lexer.prototype.parse = function (content) {
  this.content = content || '';
  this.i = 0; // 标记解析位置
  this.start = 0; // 标记一个单词的开始位置
  this.state = this.text; // 当前状态
  for (var len = this.content.length; this.i !== -1 && this.i < len;) {
    this.state();
  }
};

/**
 * @description 检查标签是否闭合
 * @param {String} method 如果闭合要进行的操作
 * @returns {Boolean} 是否闭合
 * @private
 */
Lexer.prototype.checkClose = function (method) {
  var selfClose = this.content[this.i] === '/';
  if (this.content[this.i] === '>' || selfClose && this.content[this.i + 1] === '>') {
    if (method) {
      this.handler[method](this.content.substring(this.start, this.i));
    }
    this.i += selfClose ? 2 : 1;
    this.start = this.i;
    this.handler.onOpenTag(selfClose);
    if (this.handler.tagName === 'script') {
      this.i = this.content.indexOf('</', this.i);
      if (this.i !== -1) {
        this.i += 2;
        this.start = this.i;
      }
      this.state = this.endTag;
    } else {
      this.state = this.text;
    }
    return true;
  }
  return false;
};

/**
 * @description 文本状态
 * @private
 */
Lexer.prototype.text = function () {
  this.i = this.content.indexOf('<', this.i); // 查找最近的标签
  if (this.i === -1) {
    // 没有标签了
    if (this.start < this.content.length) {
      this.handler.onText(this.content.substring(this.start, this.content.length));
    }
    return;
  }
  var c = this.content[this.i + 1];
  if (c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z') {
    // 标签开头
    if (this.start !== this.i) {
      this.handler.onText(this.content.substring(this.start, this.i));
    }
    this.start = ++this.i;
    this.state = this.tagName;
  } else if (c === '/' || c === '!' || c === '?') {
    if (this.start !== this.i) {
      this.handler.onText(this.content.substring(this.start, this.i));
    }
    var next = this.content[this.i + 2];
    if (c === '/' && (next >= 'a' && next <= 'z' || next >= 'A' && next <= 'Z')) {
      // 标签结尾
      this.i += 2;
      this.start = this.i;
      this.state = this.endTag;
      return;
    }
    // 处理注释
    var end = '-->';
    if (c !== '!' || this.content[this.i + 2] !== '-' || this.content[this.i + 3] !== '-') {
      end = '>';
    }
    this.i = this.content.indexOf(end, this.i);
    if (this.i !== -1) {
      this.i += end.length;
      this.start = this.i;
    }
  } else {
    this.i++;
  }
};

/**
 * @description 标签名状态
 * @private
 */
Lexer.prototype.tagName = function () {
  if (blankChar[this.content[this.i]]) {
    // 解析到标签名
    this.handler.onTagName(this.content.substring(this.start, this.i));
    while (blankChar[this.content[++this.i]]) {
      ;
    }
    if (this.i < this.content.length && !this.checkClose()) {
      this.start = this.i;
      this.state = this.attrName;
    }
  } else if (!this.checkClose('onTagName')) {
    this.i++;
  }
};

/**
 * @description 属性名状态
 * @private
 */
Lexer.prototype.attrName = function () {
  var c = this.content[this.i];
  if (blankChar[c] || c === '=') {
    // 解析到属性名
    this.handler.onAttrName(this.content.substring(this.start, this.i));
    var needVal = c === '=';
    var len = this.content.length;
    while (++this.i < len) {
      c = this.content[this.i];
      if (!blankChar[c]) {
        if (this.checkClose()) return;
        if (needVal) {
          // 等号后遇到第一个非空字符
          this.start = this.i;
          this.state = this.attrVal;
          return;
        }
        if (this.content[this.i] === '=') {
          needVal = true;
        } else {
          this.start = this.i;
          this.state = this.attrName;
          return;
        }
      }
    }
  } else if (!this.checkClose('onAttrName')) {
    this.i++;
  }
};

/**
 * @description 属性值状态
 * @private
 */
Lexer.prototype.attrVal = function () {
  var c = this.content[this.i];
  var len = this.content.length;
  if (c === '"' || c === "'") {
    // 有冒号的属性
    this.start = ++this.i;
    this.i = this.content.indexOf(c, this.i);
    if (this.i === -1) return;
    this.handler.onAttrVal(this.content.substring(this.start, this.i));
  } else {
    // 没有冒号的属性
    for (; this.i < len; this.i++) {
      if (blankChar[this.content[this.i]]) {
        this.handler.onAttrVal(this.content.substring(this.start, this.i));
        break;
      } else if (this.checkClose('onAttrVal')) return;
    }
  }
  while (blankChar[this.content[++this.i]]) {
    ;
  }
  if (this.i < len && !this.checkClose()) {
    this.start = this.i;
    this.state = this.attrName;
  }
};

/**
 * @description 结束标签状态
 * @returns {String} 结束的标签名
 * @private
 */
Lexer.prototype.endTag = function () {
  var c = this.content[this.i];
  if (blankChar[c] || c === '>' || c === '/') {
    this.handler.onCloseTag(this.content.substring(this.start, this.i));
    if (c !== '>') {
      this.i = this.content.indexOf('>', this.i);
      if (this.i === -1) return;
    }
    this.start = ++this.i;
    this.state = this.text;
  } else {
    this.i++;
  }
};
var _default = Parser;
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"]))

/***/ }),

/***/ 505:
/*!***********************************************************************************************************************************************!*\
  !*** /Users/zhangzhenfeng/Documents/duyi/project/mysite-uni-app/packageA/uni_modules/zero-markdown-view/components/mp-html/markdown/index.js ***!
  \***********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _marked = _interopRequireDefault(__webpack_require__(/*! ./marked.min */ 506));
/**
 * @fileoverview markdown 插件
 * Include marked (https://github.com/markedjs/marked)
 * Include github-markdown-css (https://github.com/sindresorhus/github-markdown-css)
 */

var index = 0;
function Markdown(vm) {
  this.vm = vm;
  vm._ids = {};
}
Markdown.prototype.onUpdate = function (content) {
  if (this.vm.markdown) {
    return (0, _marked.default)(content);
  }
};
Markdown.prototype.onParse = function (node, vm) {
  if (vm.options.markdown) {
    // 中文 id 需要转换，否则无法跳转
    if (vm.options.useAnchor && node.attrs && /[\u4e00-\u9fa5]/.test(node.attrs.id)) {
      var id = 't' + index++;
      this.vm._ids[node.attrs.id] = id;
      node.attrs.id = id;
    }
    if (node.name === 'p' || node.name === 'table' || node.name === 'tr' || node.name === 'th' || node.name === 'td' || node.name === 'blockquote' || node.name === 'pre' || node.name === 'code') {
      node.attrs.class = "md-".concat(node.name, " ").concat(node.attrs.class || '');
    }
  }
};
var _default = Markdown;
exports.default = _default;

/***/ }),

/***/ 506:
/*!****************************************************************************************************************************************************!*\
  !*** /Users/zhangzhenfeng/Documents/duyi/project/mysite-uni-app/packageA/uni_modules/zero-markdown-view/components/mp-html/markdown/marked.min.js ***!
  \****************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/*!
 * marked - a markdown parser
 * Copyright (c) 2011-2020, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 */
function t() {
  "use strict";

  function i(e, t) {
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
    }
  }
  function s(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var n = 0, r = new Array(t); n < t; n++) {
      r[n] = e[n];
    }
    return r;
  }
  function p(e, t) {
    var n;
    if ("undefined" != typeof Symbol && null != e[Symbol.iterator]) return (n = e[Symbol.iterator]()).next.bind(n);
    if (Array.isArray(e) || (n = function (e, t) {
      if (e) {
        if ("string" == typeof e) return s(e, t);
        var n = Object.prototype.toString.call(e).slice(8, -1);
        return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? s(e, t) : void 0;
      }
    }(e)) || t && e && "number" == typeof e.length) {
      n && (e = n);
      var r = 0;
      return function () {
        return r >= e.length ? {
          done: !0
        } : {
          done: !1,
          value: e[r++]
        };
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function n(e) {
    return c[e];
  }
  var e,
    t = (function (t) {
      function e() {
        return {
          baseUrl: null,
          breaks: !1,
          gfm: !0,
          headerIds: !0,
          headerPrefix: "",
          highlight: null,
          langPrefix: "language-",
          mangle: !0,
          pedantic: !1,
          renderer: null,
          sanitize: !1,
          sanitizer: null,
          silent: !1,
          smartLists: !1,
          smartypants: !1,
          tokenizer: null,
          walkTokens: null,
          xhtml: !1
        };
      }
      t.exports = {
        defaults: e(),
        getDefaults: e,
        changeDefaults: function changeDefaults(e) {
          t.exports.defaults = e;
        }
      };
    }(e = {
      exports: {}
    }), e.exports),
    r = (t.defaults, t.getDefaults, t.changeDefaults, /[&<>"']/),
    l = /[&<>"']/g,
    a = /[<>"']|&(?!#?\w+;)/,
    o = /[<>"']|&(?!#?\w+;)/g,
    c = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
  var u = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;
  function h(e) {
    return e.replace(u, function (e, t) {
      return "colon" === (t = t.toLowerCase()) ? ":" : "#" === t.charAt(0) ? "x" === t.charAt(1) ? String.fromCharCode(parseInt(t.substring(2), 16)) : String.fromCharCode(+t.substring(1)) : "";
    });
  }
  var g = /(^|[^\[])\^/g;
  var f = /[^\w:]/g,
    d = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
  var k = {},
    b = /^[^:]+:\/*[^/]*$/,
    m = /^([^:]+:)[\s\S]*$/,
    x = /^([^:]+:\/*[^/]*)[\s\S]*$/;
  function w(e, t) {
    k[" " + e] || (b.test(e) ? k[" " + e] = e + "/" : k[" " + e] = v(e, "/", !0));
    var n = -1 === (e = k[" " + e]).indexOf(":");
    return "//" === t.substring(0, 2) ? n ? t : e.replace(m, "$1") + t : "/" === t.charAt(0) ? n ? t : e.replace(x, "$1") + t : e + t;
  }
  function v(e, t, n) {
    var r = e.length;
    if (0 === r) return "";
    for (var i = 0; i < r;) {
      var s = e.charAt(r - i - 1);
      if (s !== t || n) {
        if (s === t || !n) break;
        i++;
      } else i++;
    }
    return e.substr(0, r - i);
  }
  var _ = function _(e, t) {
      if (t) {
        if (r.test(e)) return e.replace(l, n);
      } else if (a.test(e)) return e.replace(o, n);
      return e;
    },
    y = h,
    z = function z(n, e) {
      n = n.source || n, e = e || "";
      var r = {
        replace: function replace(e, t) {
          return t = (t = t.source || t).replace(g, "$1"), n = n.replace(e, t), r;
        },
        getRegex: function getRegex() {
          return new RegExp(n, e);
        }
      };
      return r;
    },
    S = function S(e, t, n) {
      if (e) {
        var r;
        try {
          r = decodeURIComponent(h(n)).replace(f, "").toLowerCase();
        } catch (e) {
          return null;
        }
        if (0 === r.indexOf("javascript:") || 0 === r.indexOf("vbscript:") || 0 === r.indexOf("data:")) return null;
      }
      t && !d.test(n) && (n = w(t, n));
      try {
        n = encodeURI(n).replace(/%25/g, "%");
      } catch (e) {
        return null;
      }
      return n;
    },
    $ = {
      exec: function exec() {}
    },
    A = function A(e) {
      for (var t, n, r = 1; r < arguments.length; r++) {
        for (n in t = arguments[r]) {
          Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
        }
      }
      return e;
    },
    R = function R(e, t) {
      var n = e.replace(/\|/g, function (e, t, n) {
          for (var r = !1, i = t; 0 <= --i && "\\" === n[i];) {
            r = !r;
          }
          return r ? "|" : " |";
        }).split(/ \|/),
        r = 0;
      if (n.length > t) n.splice(t);else for (; n.length < t;) {
        n.push("");
      }
      for (; r < n.length; r++) {
        n[r] = n[r].trim().replace(/\\\|/g, "|");
      }
      return n;
    },
    T = function T(e, t) {
      if (-1 === e.indexOf(t[1])) return -1;
      for (var n = e.length, r = 0, i = 0; i < n; i++) {
        if ("\\" === e[i]) i++;else if (e[i] === t[0]) r++;else if (e[i] === t[1] && --r < 0) return i;
      }
      return -1;
    },
    I = function I(e) {
      e && e.sanitize && !e.silent && console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options");
    },
    Z = function Z(e, t) {
      if (t < 1) return "";
      for (var n = ""; 1 < t;) {
        1 & t && (n += e), t >>= 1, e += e;
      }
      return n + e;
    },
    q = t.defaults,
    O = v,
    C = R,
    U = _,
    j = T;
  function E(e, t, n) {
    var r = t.href,
      i = t.title ? U(t.title) : null,
      t = e[1].replace(/\\([\[\]])/g, "$1");
    return "!" !== e[0].charAt(0) ? {
      type: "link",
      raw: n,
      href: r,
      title: i,
      text: t
    } : {
      type: "image",
      raw: n,
      href: r,
      title: i,
      text: U(t)
    };
  }
  var D = function () {
      function e(e) {
        this.options = e || q;
      }
      var t = e.prototype;
      return t.space = function (e) {
        e = this.rules.block.newline.exec(e);
        if (e) return 1 < e[0].length ? {
          type: "space",
          raw: e[0]
        } : {
          raw: "\n"
        };
      }, t.code = function (e, t) {
        e = this.rules.block.code.exec(e);
        if (e) {
          t = t[t.length - 1];
          if (t && "paragraph" === t.type) return {
            raw: e[0],
            text: e[0].trimRight()
          };
          t = e[0].replace(/^ {4}/gm, "");
          return {
            type: "code",
            raw: e[0],
            codeBlockStyle: "indented",
            text: this.options.pedantic ? t : O(t, "\n")
          };
        }
      }, t.fences = function (e) {
        var t = this.rules.block.fences.exec(e);
        if (t) {
          var n = t[0],
            e = function (e, t) {
              if (null === (e = e.match(/^(\s+)(?:```)/))) return t;
              var n = e[1];
              return t.split("\n").map(function (e) {
                var t = e.match(/^\s+/);
                return null !== t && t[0].length >= n.length ? e.slice(n.length) : e;
              }).join("\n");
            }(n, t[3] || "");
          return {
            type: "code",
            raw: n,
            lang: t[2] && t[2].trim(),
            text: e
          };
        }
      }, t.heading = function (e) {
        e = this.rules.block.heading.exec(e);
        if (e) return {
          type: "heading",
          raw: e[0],
          depth: e[1].length,
          text: e[2]
        };
      }, t.nptable = function (e) {
        e = this.rules.block.nptable.exec(e);
        if (e) {
          var t = {
            type: "table",
            header: C(e[1].replace(/^ *| *\| *$/g, "")),
            align: e[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
            cells: e[3] ? e[3].replace(/\n$/, "").split("\n") : [],
            raw: e[0]
          };
          if (t.header.length === t.align.length) {
            for (var n = t.align.length, r = 0; r < n; r++) {
              /^ *-+: *$/.test(t.align[r]) ? t.align[r] = "right" : /^ *:-+: *$/.test(t.align[r]) ? t.align[r] = "center" : /^ *:-+ *$/.test(t.align[r]) ? t.align[r] = "left" : t.align[r] = null;
            }
            for (n = t.cells.length, r = 0; r < n; r++) {
              t.cells[r] = C(t.cells[r], t.header.length);
            }
            return t;
          }
        }
      }, t.hr = function (e) {
        e = this.rules.block.hr.exec(e);
        if (e) return {
          type: "hr",
          raw: e[0]
        };
      }, t.blockquote = function (e) {
        var t = this.rules.block.blockquote.exec(e);
        if (t) {
          e = t[0].replace(/^ *> ?/gm, "");
          return {
            type: "blockquote",
            raw: t[0],
            text: e
          };
        }
      }, t.list = function (e) {
        e = this.rules.block.list.exec(e);
        if (e) {
          for (var t, n, r, i, s, l = e[0], a = e[2], o = 1 < a.length, c = {
              type: "list",
              raw: l,
              ordered: o,
              start: o ? +a.slice(0, -1) : "",
              loose: !1,
              items: []
            }, u = e[0].match(this.rules.block.item), p = !1, h = u.length, g = this.rules.block.listItemStart.exec(u[0]), f = 0; f < h; f++) {
            if (l = t = u[f], f !== h - 1) {
              if ((r = this.rules.block.listItemStart.exec(u[f + 1]))[1].length > g[0].length || 3 < r[1].length) {
                u.splice(f, 2, u[f] + "\n" + u[f + 1]), f--, h--;
                continue;
              }
              (!this.options.pedantic || this.options.smartLists ? r[2][r[2].length - 1] !== a[a.length - 1] : o == (1 === r[2].length)) && (n = u.slice(f + 1).join("\n"), c.raw = c.raw.substring(0, c.raw.length - n.length), f = h - 1), g = r;
            }
            r = t.length, ~(t = t.replace(/^ *([*+-]|\d+[.)]) ?/, "")).indexOf("\n ") && (r -= t.length, t = this.options.pedantic ? t.replace(/^ {1,4}/gm, "") : t.replace(new RegExp("^ {1," + r + "}", "gm"), "")), r = p || /\n\n(?!\s*$)/.test(t), f !== h - 1 && (p = "\n" === t.charAt(t.length - 1), r = r || p), r && (c.loose = !0), this.options.gfm && (s = void 0, (i = /^\[[ xX]\] /.test(t)) && (s = " " !== t[1], t = t.replace(/^\[[ xX]\] +/, ""))), c.items.push({
              type: "list_item",
              raw: l,
              task: i,
              checked: s,
              loose: r,
              text: t
            });
          }
          return c;
        }
      }, t.html = function (e) {
        e = this.rules.block.html.exec(e);
        if (e) return {
          type: this.options.sanitize ? "paragraph" : "html",
          raw: e[0],
          pre: !this.options.sanitizer && ("pre" === e[1] || "script" === e[1] || "style" === e[1]),
          text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(e[0]) : U(e[0]) : e[0]
        };
      }, t.def = function (e) {
        e = this.rules.block.def.exec(e);
        if (e) return e[3] && (e[3] = e[3].substring(1, e[3].length - 1)), {
          tag: e[1].toLowerCase().replace(/\s+/g, " "),
          raw: e[0],
          href: e[2],
          title: e[3]
        };
      }, t.table = function (e) {
        e = this.rules.block.table.exec(e);
        if (e) {
          var t = {
            type: "table",
            header: C(e[1].replace(/^ *| *\| *$/g, "")),
            align: e[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
            cells: e[3] ? e[3].replace(/\n$/, "").split("\n") : []
          };
          if (t.header.length === t.align.length) {
            t.raw = e[0];
            for (var n = t.align.length, r = 0; r < n; r++) {
              /^ *-+: *$/.test(t.align[r]) ? t.align[r] = "right" : /^ *:-+: *$/.test(t.align[r]) ? t.align[r] = "center" : /^ *:-+ *$/.test(t.align[r]) ? t.align[r] = "left" : t.align[r] = null;
            }
            for (n = t.cells.length, r = 0; r < n; r++) {
              t.cells[r] = C(t.cells[r].replace(/^ *\| *| *\| *$/g, ""), t.header.length);
            }
            return t;
          }
        }
      }, t.lheading = function (e) {
        e = this.rules.block.lheading.exec(e);
        if (e) return {
          type: "heading",
          raw: e[0],
          depth: "=" === e[2].charAt(0) ? 1 : 2,
          text: e[1]
        };
      }, t.paragraph = function (e) {
        e = this.rules.block.paragraph.exec(e);
        if (e) return {
          type: "paragraph",
          raw: e[0],
          text: "\n" === e[1].charAt(e[1].length - 1) ? e[1].slice(0, -1) : e[1]
        };
      }, t.text = function (e, t) {
        e = this.rules.block.text.exec(e);
        if (e) {
          t = t[t.length - 1];
          return t && "text" === t.type ? {
            raw: e[0],
            text: e[0]
          } : {
            type: "text",
            raw: e[0],
            text: e[0]
          };
        }
      }, t.escape = function (e) {
        e = this.rules.inline.escape.exec(e);
        if (e) return {
          type: "escape",
          raw: e[0],
          text: U(e[1])
        };
      }, t.tag = function (e, t, n) {
        e = this.rules.inline.tag.exec(e);
        if (e) return !t && /^<a /i.test(e[0]) ? t = !0 : t && /^<\/a>/i.test(e[0]) && (t = !1), !n && /^<(pre|code|kbd|script)(\s|>)/i.test(e[0]) ? n = !0 : n && /^<\/(pre|code|kbd|script)(\s|>)/i.test(e[0]) && (n = !1), {
          type: this.options.sanitize ? "text" : "html",
          raw: e[0],
          inLink: t,
          inRawBlock: n,
          text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(e[0]) : U(e[0]) : e[0]
        };
      }, t.link = function (e) {
        var t = this.rules.inline.link.exec(e);
        if (t) {
          e = j(t[2], "()");
          -1 < e && (r = (0 === t[0].indexOf("!") ? 5 : 4) + t[1].length + e, t[2] = t[2].substring(0, e), t[0] = t[0].substring(0, r).trim(), t[3] = "");
          var n,
            e = t[2],
            r = "";
          return r = this.options.pedantic ? (n = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(e), n ? (e = n[1], n[3]) : "") : t[3] ? t[3].slice(1, -1) : "", E(t, {
            href: (e = e.trim().replace(/^<([\s\S]*)>$/, "$1")) && e.replace(this.rules.inline._escapes, "$1"),
            title: r && r.replace(this.rules.inline._escapes, "$1")
          }, t[0]);
        }
      }, t.reflink = function (e, t) {
        if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
          e = (n[2] || n[1]).replace(/\s+/g, " ");
          if ((e = t[e.toLowerCase()]) && e.href) return E(n, e, n[0]);
          var n = n[0].charAt(0);
          return {
            type: "text",
            raw: n,
            text: n
          };
        }
      }, t.strong = function (e, t, n) {
        void 0 === n && (n = "");
        var r = this.rules.inline.strong.start.exec(e);
        if (r && (!r[1] || r[1] && ("" === n || this.rules.inline.punctuation.exec(n)))) {
          t = t.slice(-1 * e.length);
          var i,
            s = "**" === r[0] ? this.rules.inline.strong.endAst : this.rules.inline.strong.endUnd;
          for (s.lastIndex = 0; null != (r = s.exec(t));) {
            if (i = this.rules.inline.strong.middle.exec(t.slice(0, r.index + 3))) return {
              type: "strong",
              raw: e.slice(0, i[0].length),
              text: e.slice(2, i[0].length - 2)
            };
          }
        }
      }, t.em = function (e, t, n) {
        void 0 === n && (n = "");
        var r = this.rules.inline.em.start.exec(e);
        if (r && (!r[1] || r[1] && ("" === n || this.rules.inline.punctuation.exec(n)))) {
          t = t.slice(-1 * e.length);
          var i,
            s = "*" === r[0] ? this.rules.inline.em.endAst : this.rules.inline.em.endUnd;
          for (s.lastIndex = 0; null != (r = s.exec(t));) {
            if (i = this.rules.inline.em.middle.exec(t.slice(0, r.index + 2))) return {
              type: "em",
              raw: e.slice(0, i[0].length),
              text: e.slice(1, i[0].length - 1)
            };
          }
        }
      }, t.codespan = function (e) {
        var t = this.rules.inline.code.exec(e);
        if (t) {
          var n = t[2].replace(/\n/g, " "),
            r = /[^ ]/.test(n),
            e = n.startsWith(" ") && n.endsWith(" ");
          return r && e && (n = n.substring(1, n.length - 1)), n = U(n, !0), {
            type: "codespan",
            raw: t[0],
            text: n
          };
        }
      }, t.br = function (e) {
        e = this.rules.inline.br.exec(e);
        if (e) return {
          type: "br",
          raw: e[0]
        };
      }, t.del = function (e) {
        e = this.rules.inline.del.exec(e);
        if (e) return {
          type: "del",
          raw: e[0],
          text: e[2]
        };
      }, t.autolink = function (e, t) {
        e = this.rules.inline.autolink.exec(e);
        if (e) {
          var n,
            t = "@" === e[2] ? "mailto:" + (n = U(this.options.mangle ? t(e[1]) : e[1])) : n = U(e[1]);
          return {
            type: "link",
            raw: e[0],
            text: n,
            href: t,
            tokens: [{
              type: "text",
              raw: n,
              text: n
            }]
          };
        }
      }, t.url = function (e, t) {
        var n, r, i, s;
        if (n = this.rules.inline.url.exec(e)) {
          if ("@" === n[2]) i = "mailto:" + (r = U(this.options.mangle ? t(n[0]) : n[0]));else {
            for (; s = n[0], n[0] = this.rules.inline._backpedal.exec(n[0])[0], s !== n[0];) {
              ;
            }
            r = U(n[0]), i = "www." === n[1] ? "http://" + r : r;
          }
          return {
            type: "link",
            raw: n[0],
            text: r,
            href: i,
            tokens: [{
              type: "text",
              raw: r,
              text: r
            }]
          };
        }
      }, t.inlineText = function (e, t, n) {
        e = this.rules.inline.text.exec(e);
        if (e) {
          n = t ? this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(e[0]) : U(e[0]) : e[0] : U(this.options.smartypants ? n(e[0]) : e[0]);
          return {
            type: "text",
            raw: e[0],
            text: n
          };
        }
      }, e;
    }(),
    R = $,
    T = z,
    $ = A,
    z = {
      newline: /^\n+/,
      code: /^( {4}[^\n]+\n*)+/,
      fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
      hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
      heading: /^ {0,3}(#{1,6}) +([^\n]*?)(?: +#+)? *(?:\n+|$)/,
      blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
      list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?! {0,3}bull )\n*|\s*$)/,
      html: "^ {0,3}(?:<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$))",
      def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
      nptable: R,
      table: R,
      lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
      _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html)[^\n]+)*)/,
      text: /^[^\n]+/,
      _label: /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/,
      _title: /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/
    };
  z.def = T(z.def).replace("label", z._label).replace("title", z._title).getRegex(), z.bullet = /(?:[*+-]|\d{1,9}[.)])/, z.item = /^( *)(bull) ?[^\n]*(?:\n(?! *bull ?)[^\n]*)*/, z.item = T(z.item, "gm").replace(/bull/g, z.bullet).getRegex(), z.listItemStart = T(/^( *)(bull)/).replace("bull", z.bullet).getRegex(), z.list = T(z.list).replace(/bull/g, z.bullet).replace("hr", "\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def", "\\n+(?=" + z.def.source + ")").getRegex(), z._tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", z._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/, z.html = T(z.html, "i").replace("comment", z._comment).replace("tag", z._tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), z.paragraph = T(z._paragraph).replace("hr", z.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag", z._tag).getRegex(), z.blockquote = T(z.blockquote).replace("paragraph", z.paragraph).getRegex(), z.normal = $({}, z), z.gfm = $({}, z.normal, {
    nptable: "^ *([^|\\n ].*\\|.*)\\n {0,3}([-:]+ *\\|[-| :]*)(?:\\n((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)",
    table: "^ *\\|(.+)\\n {0,3}\\|?( *[-:]+[-| :]*)(?:\\n *((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
  }), z.gfm.nptable = T(z.gfm.nptable).replace("hr", z.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag", z._tag).getRegex(), z.gfm.table = T(z.gfm.table).replace("hr", z.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag", z._tag).getRegex(), z.pedantic = $({}, z.normal, {
    html: T("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment", z._comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
    heading: /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,
    fences: R,
    paragraph: T(z.normal._paragraph).replace("hr", z.hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", z.lheading).replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").getRegex()
  });
  R = {
    escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
    autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
    url: R,
    tag: "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",
    link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
    reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
    nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
    reflinkSearch: "reflink|nolink(?!\\()",
    strong: {
      start: /^(?:(\*\*(?=[*punctuation]))|\*\*)(?![\s])|__/,
      middle: /^\*\*(?:(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)|\*(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)*?\*)+?\*\*$|^__(?![\s])((?:(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)|_(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)*?_)+?)__$/,
      endAst: /[^punctuation\s]\*\*(?!\*)|[punctuation]\*\*(?!\*)(?:(?=[punctuation_\s]|$))/,
      endUnd: /[^\s]__(?!_)(?:(?=[punctuation*\s])|$)/
    },
    em: {
      start: /^(?:(\*(?=[punctuation]))|\*)(?![*\s])|_/,
      middle: /^\*(?:(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)|\*(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)*?\*)+?\*$|^_(?![_\s])(?:(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)|_(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)*?_)+?_$/,
      endAst: /[^punctuation\s]\*(?!\*)|[punctuation]\*(?!\*)(?:(?=[punctuation_\s]|$))/,
      endUnd: /[^\s]_(?!_)(?:(?=[punctuation*\s])|$)/
    },
    code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
    br: /^( {2,}|\\)\n(?!\s*$)/,
    del: R,
    text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*]|\b_|$)|[^ ](?= {2,}\n)))/,
    punctuation: /^([\s*punctuation])/,
    _punctuation: "!\"#$%&'()+\\-.,/:;<=>?@\\[\\]`^{|}~"
  };
  R.punctuation = T(R.punctuation).replace(/punctuation/g, R._punctuation).getRegex(), R._blockSkip = "\\[[^\\]]*?\\]\\([^\\)]*?\\)|`[^`]*?`|<[^>]*?>", R._overlapSkip = "__[^_]*?__|\\*\\*\\[^\\*\\]*?\\*\\*", R._comment = T(z._comment).replace("(?:--\x3e|$)", "--\x3e").getRegex(), R.em.start = T(R.em.start).replace(/punctuation/g, R._punctuation).getRegex(), R.em.middle = T(R.em.middle).replace(/punctuation/g, R._punctuation).replace(/overlapSkip/g, R._overlapSkip).getRegex(), R.em.endAst = T(R.em.endAst, "g").replace(/punctuation/g, R._punctuation).getRegex(), R.em.endUnd = T(R.em.endUnd, "g").replace(/punctuation/g, R._punctuation).getRegex(), R.strong.start = T(R.strong.start).replace(/punctuation/g, R._punctuation).getRegex(), R.strong.middle = T(R.strong.middle).replace(/punctuation/g, R._punctuation).replace(/overlapSkip/g, R._overlapSkip).getRegex(), R.strong.endAst = T(R.strong.endAst, "g").replace(/punctuation/g, R._punctuation).getRegex(), R.strong.endUnd = T(R.strong.endUnd, "g").replace(/punctuation/g, R._punctuation).getRegex(), R.blockSkip = T(R._blockSkip, "g").getRegex(), R.overlapSkip = T(R._overlapSkip, "g").getRegex(), R._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g, R._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/, R._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/, R.autolink = T(R.autolink).replace("scheme", R._scheme).replace("email", R._email).getRegex(), R._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/, R.tag = T(R.tag).replace("comment", R._comment).replace("attribute", R._attribute).getRegex(), R._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, R._href = /<(?:\\[<>]?|[^\s<>\\])*>|[^\s\x00-\x1f]*/, R._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/, R.link = T(R.link).replace("label", R._label).replace("href", R._href).replace("title", R._title).getRegex(), R.reflink = T(R.reflink).replace("label", R._label).getRegex(), R.reflinkSearch = T(R.reflinkSearch, "g").replace("reflink", R.reflink).replace("nolink", R.nolink).getRegex(), R.normal = $({}, R), R.pedantic = $({}, R.normal, {
    strong: {
      start: /^__|\*\*/,
      middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
      endAst: /\*\*(?!\*)/g,
      endUnd: /__(?!_)/g
    },
    em: {
      start: /^_|\*/,
      middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
      endAst: /\*(?!\*)/g,
      endUnd: /_(?!_)/g
    },
    link: T(/^!?\[(label)\]\((.*?)\)/).replace("label", R._label).getRegex(),
    reflink: T(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", R._label).getRegex()
  }), R.gfm = $({}, R.normal, {
    escape: T(R.escape).replace("])", "~|])").getRegex(),
    _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
    url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
    _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
    del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
    text: /^([`~]+|[^`~])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*~]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))/
  }), R.gfm.url = T(R.gfm.url, "i").replace("email", R.gfm._extended_email).getRegex(), R.breaks = $({}, R.gfm, {
    br: T(R.br).replace("{2,}", "*").getRegex(),
    text: T(R.gfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
  });
  var R = {
      block: z,
      inline: R
    },
    P = t.defaults,
    L = R.block,
    N = R.inline,
    B = Z;
  function F(e) {
    return e.replace(/---/g, "—").replace(/--/g, "–").replace(/(^|[-\u2014/(\[{"\s])'/g, "$1‘").replace(/'/g, "’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1“").replace(/"/g, "”").replace(/\.{3}/g, "…");
  }
  function M(e) {
    for (var t, n = "", r = e.length, i = 0; i < r; i++) {
      t = e.charCodeAt(i), .5 < Math.random() && (t = "x" + t.toString(16)), n += "&#" + t + ";";
    }
    return n;
  }
  var W = function () {
      function n(e) {
        this.tokens = [], this.tokens.links = Object.create(null), this.options = e || P, this.options.tokenizer = this.options.tokenizer || new D(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options;
        e = {
          block: L.normal,
          inline: N.normal
        };
        this.options.pedantic ? (e.block = L.pedantic, e.inline = N.pedantic) : this.options.gfm && (e.block = L.gfm, this.options.breaks ? e.inline = N.breaks : e.inline = N.gfm), this.tokenizer.rules = e;
      }
      n.lex = function (e, t) {
        return new n(t).lex(e);
      }, n.lexInline = function (e, t) {
        return new n(t).inlineTokens(e);
      };
      var e,
        t,
        r = n.prototype;
      return r.lex = function (e) {
        return e = e.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    "), this.blockTokens(e, this.tokens, !0), this.inline(this.tokens), this.tokens;
      }, r.blockTokens = function (e, t, n) {
        var r, i, s, l;
        for (void 0 === t && (t = []), void 0 === n && (n = !0), e = e.replace(/^ +$/gm, ""); e;) {
          if (r = this.tokenizer.space(e)) e = e.substring(r.raw.length), r.type && t.push(r);else if (r = this.tokenizer.code(e, t)) e = e.substring(r.raw.length), r.type ? t.push(r) : ((l = t[t.length - 1]).raw += "\n" + r.raw, l.text += "\n" + r.text);else if (r = this.tokenizer.fences(e)) e = e.substring(r.raw.length), t.push(r);else if (r = this.tokenizer.heading(e)) e = e.substring(r.raw.length), t.push(r);else if (r = this.tokenizer.nptable(e)) e = e.substring(r.raw.length), t.push(r);else if (r = this.tokenizer.hr(e)) e = e.substring(r.raw.length), t.push(r);else if (r = this.tokenizer.blockquote(e)) e = e.substring(r.raw.length), r.tokens = this.blockTokens(r.text, [], n), t.push(r);else if (r = this.tokenizer.list(e)) {
            for (e = e.substring(r.raw.length), s = r.items.length, i = 0; i < s; i++) {
              r.items[i].tokens = this.blockTokens(r.items[i].text, [], !1);
            }
            t.push(r);
          } else if (r = this.tokenizer.html(e)) e = e.substring(r.raw.length), t.push(r);else if (n && (r = this.tokenizer.def(e))) e = e.substring(r.raw.length), this.tokens.links[r.tag] || (this.tokens.links[r.tag] = {
            href: r.href,
            title: r.title
          });else if (r = this.tokenizer.table(e)) e = e.substring(r.raw.length), t.push(r);else if (r = this.tokenizer.lheading(e)) e = e.substring(r.raw.length), t.push(r);else if (n && (r = this.tokenizer.paragraph(e))) e = e.substring(r.raw.length), t.push(r);else if (r = this.tokenizer.text(e, t)) e = e.substring(r.raw.length), r.type ? t.push(r) : ((l = t[t.length - 1]).raw += "\n" + r.raw, l.text += "\n" + r.text);else if (e) {
            var a = "Infinite loop on byte: " + e.charCodeAt(0);
            if (this.options.silent) {
              console.error(a);
              break;
            }
            throw new Error(a);
          }
        }
        return t;
      }, r.inline = function (e) {
        for (var t, n, r, i, s, l = e.length, a = 0; a < l; a++) {
          switch ((s = e[a]).type) {
            case "paragraph":
            case "text":
            case "heading":
              s.tokens = [], this.inlineTokens(s.text, s.tokens);
              break;
            case "table":
              for (s.tokens = {
                header: [],
                cells: []
              }, r = s.header.length, t = 0; t < r; t++) {
                s.tokens.header[t] = [], this.inlineTokens(s.header[t], s.tokens.header[t]);
              }
              for (r = s.cells.length, t = 0; t < r; t++) {
                for (i = s.cells[t], s.tokens.cells[t] = [], n = 0; n < i.length; n++) {
                  s.tokens.cells[t][n] = [], this.inlineTokens(i[n], s.tokens.cells[t][n]);
                }
              }
              break;
            case "blockquote":
              this.inline(s.tokens);
              break;
            case "list":
              for (r = s.items.length, t = 0; t < r; t++) {
                this.inline(s.items[t].tokens);
              }
          }
        }
        return e;
      }, r.inlineTokens = function (e, t, n, r) {
        var i;
        void 0 === t && (t = []), void 0 === n && (n = !1), void 0 === r && (r = !1);
        var s,
          l,
          a,
          o = e;
        if (this.tokens.links) {
          var c = Object.keys(this.tokens.links);
          if (0 < c.length) for (; null != (s = this.tokenizer.rules.inline.reflinkSearch.exec(o));) {
            c.includes(s[0].slice(s[0].lastIndexOf("[") + 1, -1)) && (o = o.slice(0, s.index) + "[" + B("a", s[0].length - 2) + "]" + o.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
          }
        }
        for (; null != (s = this.tokenizer.rules.inline.blockSkip.exec(o));) {
          o = o.slice(0, s.index) + "[" + B("a", s[0].length - 2) + "]" + o.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
        }
        for (; e;) {
          if (l || (a = ""), l = !1, i = this.tokenizer.escape(e)) e = e.substring(i.raw.length), t.push(i);else if (i = this.tokenizer.tag(e, n, r)) e = e.substring(i.raw.length), n = i.inLink, r = i.inRawBlock, t.push(i);else if (i = this.tokenizer.link(e)) e = e.substring(i.raw.length), "link" === i.type && (i.tokens = this.inlineTokens(i.text, [], !0, r)), t.push(i);else if (i = this.tokenizer.reflink(e, this.tokens.links)) e = e.substring(i.raw.length), "link" === i.type && (i.tokens = this.inlineTokens(i.text, [], !0, r)), t.push(i);else if (i = this.tokenizer.strong(e, o, a)) e = e.substring(i.raw.length), i.tokens = this.inlineTokens(i.text, [], n, r), t.push(i);else if (i = this.tokenizer.em(e, o, a)) e = e.substring(i.raw.length), i.tokens = this.inlineTokens(i.text, [], n, r), t.push(i);else if (i = this.tokenizer.codespan(e)) e = e.substring(i.raw.length), t.push(i);else if (i = this.tokenizer.br(e)) e = e.substring(i.raw.length), t.push(i);else if (i = this.tokenizer.del(e)) e = e.substring(i.raw.length), i.tokens = this.inlineTokens(i.text, [], n, r), t.push(i);else if (i = this.tokenizer.autolink(e, M)) e = e.substring(i.raw.length), t.push(i);else if (n || !(i = this.tokenizer.url(e, M))) {
            if (i = this.tokenizer.inlineText(e, r, F)) e = e.substring(i.raw.length), a = i.raw.slice(-1), l = !0, t.push(i);else if (e) {
              var u = "Infinite loop on byte: " + e.charCodeAt(0);
              if (this.options.silent) {
                console.error(u);
                break;
              }
              throw new Error(u);
            }
          } else e = e.substring(i.raw.length), t.push(i);
        }
        return t;
      }, e = n, t = [{
        key: "rules",
        get: function get() {
          return {
            block: L,
            inline: N
          };
        }
      }], (r = null) && i(e.prototype, r), t && i(e, t), n;
    }(),
    X = t.defaults,
    G = S,
    V = _,
    H = function () {
      function e(e) {
        this.options = e || X;
      }
      var t = e.prototype;
      return t.code = function (e, t, n) {
        var r = (t || "").match(/\S*/)[0];
        return !this.options.highlight || null != (t = this.options.highlight(e, r)) && t !== e && (n = !0, e = t), r ? '<pre><code class="' + this.options.langPrefix + V(r, !0) + '">' + (n ? e : V(e, !0)) + "</code></pre>\n" : "<pre><code>" + (n ? e : V(e, !0)) + "</code></pre>\n";
      }, t.blockquote = function (e) {
        return "<blockquote>\n" + e + "</blockquote>\n";
      }, t.html = function (e) {
        return e;
      }, t.heading = function (e, t, n, r) {
        return this.options.headerIds ? "<h" + t + ' id="' + this.options.headerPrefix + r.slug(n) + '">' + e + "</h" + t + ">\n" : "<h" + t + ">" + e + "</h" + t + ">\n";
      }, t.hr = function () {
        return this.options.xhtml ? "<hr/>\n" : "<hr>\n";
      }, t.list = function (e, t, n) {
        var r = t ? "ol" : "ul";
        return "<" + r + (t && 1 !== n ? ' start="' + n + '"' : "") + ">\n" + e + "</" + r + ">\n";
      }, t.listitem = function (e) {
        return "<li>" + e + "</li>\n";
      }, t.checkbox = function (e) {
        return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox"' + (this.options.xhtml ? " /" : "") + "> ";
      }, t.paragraph = function (e) {
        return "<p>" + e + "</p>\n";
      }, t.table = function (e, t) {
        return "<table>\n<thead>\n" + e + "</thead>\n" + (t = t && "<tbody>" + t + "</tbody>") + "</table>\n";
      }, t.tablerow = function (e) {
        return "<tr>\n" + e + "</tr>\n";
      }, t.tablecell = function (e, t) {
        var n = t.header ? "th" : "td";
        return (t.align ? "<" + n + ' align="' + t.align + '">' : "<" + n + ">") + e + "</" + n + ">\n";
      }, t.strong = function (e) {
        return "<strong>" + e + "</strong>";
      }, t.em = function (e) {
        return "<em>" + e + "</em>";
      }, t.codespan = function (e) {
        return "<code>" + e + "</code>";
      }, t.br = function () {
        return this.options.xhtml ? "<br/>" : "<br>";
      }, t.del = function (e) {
        return "<del>" + e + "</del>";
      }, t.link = function (e, t, n) {
        if (null === (e = G(this.options.sanitize, this.options.baseUrl, e))) return n;
        e = '<a href="' + V(e) + '"';
        return t && (e += ' title="' + t + '"'), e += ">" + n + "</a>";
      }, t.image = function (e, t, n) {
        if (null === (e = G(this.options.sanitize, this.options.baseUrl, e))) return n;
        n = '<img src="' + e + '" alt="' + n + '"';
        return t && (n += ' title="' + t + '"'), n += this.options.xhtml ? "/>" : ">";
      }, t.text = function (e) {
        return e;
      }, e;
    }(),
    J = function () {
      function e() {}
      var t = e.prototype;
      return t.strong = function (e) {
        return e;
      }, t.em = function (e) {
        return e;
      }, t.codespan = function (e) {
        return e;
      }, t.del = function (e) {
        return e;
      }, t.html = function (e) {
        return e;
      }, t.text = function (e) {
        return e;
      }, t.link = function (e, t, n) {
        return "" + n;
      }, t.image = function (e, t, n) {
        return "" + n;
      }, t.br = function () {
        return "";
      }, e;
    }(),
    K = function () {
      function e() {
        this.seen = {};
      }
      var t = e.prototype;
      return t.serialize = function (e) {
        return e.toLowerCase().trim().replace(/<[!\/a-z].*?>/gi, "").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "").replace(/\s/g, "-");
      }, t.getNextSafeSlug = function (e, t) {
        var n = e,
          r = 0;
        if (this.seen.hasOwnProperty(n)) for (r = this.seen[e]; n = e + "-" + ++r, this.seen.hasOwnProperty(n);) {
          ;
        }
        return t || (this.seen[e] = r, this.seen[n] = 0), n;
      }, t.slug = function (e, t) {
        void 0 === t && (t = {});
        var n = this.serialize(e);
        return this.getNextSafeSlug(n, t.dryrun);
      }, e;
    }(),
    Q = t.defaults,
    Y = y,
    ee = function () {
      function n(e) {
        this.options = e || Q, this.options.renderer = this.options.renderer || new H(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.textRenderer = new J(), this.slugger = new K();
      }
      n.parse = function (e, t) {
        return new n(t).parse(e);
      }, n.parseInline = function (e, t) {
        return new n(t).parseInline(e);
      };
      var e = n.prototype;
      return e.parse = function (e, t) {
        void 0 === t && (t = !0);
        for (var n, r, i, s, l, a, o, c, u, p, h, g, f, d, k, b = "", m = e.length, x = 0; x < m; x++) {
          switch ((c = e[x]).type) {
            case "space":
              continue;
            case "hr":
              b += this.renderer.hr();
              continue;
            case "heading":
              b += this.renderer.heading(this.parseInline(c.tokens), c.depth, Y(this.parseInline(c.tokens, this.textRenderer)), this.slugger);
              continue;
            case "code":
              b += this.renderer.code(c.text, c.lang, c.escaped);
              continue;
            case "table":
              for (a = u = "", i = c.header.length, n = 0; n < i; n++) {
                a += this.renderer.tablecell(this.parseInline(c.tokens.header[n]), {
                  header: !0,
                  align: c.align[n]
                });
              }
              for (u += this.renderer.tablerow(a), o = "", i = c.cells.length, n = 0; n < i; n++) {
                for (a = "", s = (l = c.tokens.cells[n]).length, r = 0; r < s; r++) {
                  a += this.renderer.tablecell(this.parseInline(l[r]), {
                    header: !1,
                    align: c.align[r]
                  });
                }
                o += this.renderer.tablerow(a);
              }
              b += this.renderer.table(u, o);
              continue;
            case "blockquote":
              o = this.parse(c.tokens), b += this.renderer.blockquote(o);
              continue;
            case "list":
              for (u = c.ordered, w = c.start, p = c.loose, i = c.items.length, o = "", n = 0; n < i; n++) {
                f = (g = c.items[n]).checked, d = g.task, h = "", g.task && (k = this.renderer.checkbox(f), p ? 0 < g.tokens.length && "text" === g.tokens[0].type ? (g.tokens[0].text = k + " " + g.tokens[0].text, g.tokens[0].tokens && 0 < g.tokens[0].tokens.length && "text" === g.tokens[0].tokens[0].type && (g.tokens[0].tokens[0].text = k + " " + g.tokens[0].tokens[0].text)) : g.tokens.unshift({
                  type: "text",
                  text: k
                }) : h += k), h += this.parse(g.tokens, p), o += this.renderer.listitem(h, d, f);
              }
              b += this.renderer.list(o, u, w);
              continue;
            case "html":
              b += this.renderer.html(c.text);
              continue;
            case "paragraph":
              b += this.renderer.paragraph(this.parseInline(c.tokens));
              continue;
            case "text":
              for (o = c.tokens ? this.parseInline(c.tokens) : c.text; x + 1 < m && "text" === e[x + 1].type;) {
                o += "\n" + ((c = e[++x]).tokens ? this.parseInline(c.tokens) : c.text);
              }
              b += t ? this.renderer.paragraph(o) : o;
              continue;
            default:
              var w = 'Token with "' + c.type + '" type was not found.';
              if (this.options.silent) return void console.error(w);
              throw new Error(w);
          }
        }
        return b;
      }, e.parseInline = function (e, t) {
        t = t || this.renderer;
        for (var n, r = "", i = e.length, s = 0; s < i; s++) {
          switch ((n = e[s]).type) {
            case "escape":
              r += t.text(n.text);
              break;
            case "html":
              r += t.html(n.text);
              break;
            case "link":
              r += t.link(n.href, n.title, this.parseInline(n.tokens, t));
              break;
            case "image":
              r += t.image(n.href, n.title, n.text);
              break;
            case "strong":
              r += t.strong(this.parseInline(n.tokens, t));
              break;
            case "em":
              r += t.em(this.parseInline(n.tokens, t));
              break;
            case "codespan":
              r += t.codespan(n.text);
              break;
            case "br":
              r += t.br();
              break;
            case "del":
              r += t.del(this.parseInline(n.tokens, t));
              break;
            case "text":
              r += t.text(n.text);
              break;
            default:
              var l = 'Token with "' + n.type + '" type was not found.';
              if (this.options.silent) return void console.error(l);
              throw new Error(l);
          }
        }
        return r;
      }, n;
    }(),
    te = A,
    ne = I,
    re = _,
    _ = t.getDefaults,
    ie = t.changeDefaults,
    t = t.defaults;
  function se(e, n, r) {
    if (null == e) throw new Error("marked(): input parameter is undefined or null");
    if ("string" != typeof e) throw new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected");
    if ("function" == typeof n && (r = n, n = null), n = te({}, se.defaults, n || {}), ne(n), r) {
      var i,
        s = n.highlight;
      try {
        i = W.lex(e, n);
      } catch (e) {
        return r(e);
      }
      var l = function l(t) {
        var e;
        if (!t) try {
          e = ee.parse(i, n);
        } catch (e) {
          t = e;
        }
        return n.highlight = s, t ? r(t) : r(null, e);
      };
      if (!s || s.length < 3) return l();
      if (delete n.highlight, !i.length) return l();
      var a = 0;
      return se.walkTokens(i, function (n) {
        "code" === n.type && (a++, setTimeout(function () {
          s(n.text, n.lang, function (e, t) {
            return e ? l(e) : (null != t && t !== n.text && (n.text = t, n.escaped = !0), void (0 === --a && l()));
          });
        }, 0));
      }), void (0 === a && l());
    }
    try {
      var t = W.lex(e, n);
      return n.walkTokens && se.walkTokens(t, n.walkTokens), ee.parse(t, n);
    } catch (e) {
      if (e.message += "\nPlease report this to https://github.com/markedjs/marked.", n.silent) return "<p>An error occurred:</p><pre>" + re(e.message + "", !0) + "</pre>";
      throw e;
    }
  }
  return se.options = se.setOptions = function (e) {
    return te(se.defaults, e), ie(se.defaults), se;
  }, se.getDefaults = _, se.defaults = t, se.use = function (a) {
    var t,
      n = te({}, a);
    a.renderer && function () {
      var e,
        l = se.defaults.renderer || new H();
      for (e in a.renderer) {
        !function (i) {
          var s = l[i];
          l[i] = function () {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) {
              t[n] = arguments[n];
            }
            var r = a.renderer[i].apply(l, t);
            return !1 === r && (r = s.apply(l, t)), r;
          };
        }(e);
      }
      n.renderer = l;
    }(), a.tokenizer && function () {
      var e,
        l = se.defaults.tokenizer || new D();
      for (e in a.tokenizer) {
        !function (i) {
          var s = l[i];
          l[i] = function () {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) {
              t[n] = arguments[n];
            }
            var r = a.tokenizer[i].apply(l, t);
            return !1 === r && (r = s.apply(l, t)), r;
          };
        }(e);
      }
      n.tokenizer = l;
    }(), a.walkTokens && (t = se.defaults.walkTokens, n.walkTokens = function (e) {
      a.walkTokens(e), t && t(e);
    }), se.setOptions(n);
  }, se.walkTokens = function (e, t) {
    for (var n, r = p(e); !(n = r()).done;) {
      var i = n.value;
      switch (t(i), i.type) {
        case "table":
          for (var s = p(i.tokens.header); !(l = s()).done;) {
            var l = l.value;
            se.walkTokens(l, t);
          }
          for (var a, o = p(i.tokens.cells); !(a = o()).done;) {
            for (var c = p(a.value); !(u = c()).done;) {
              var u = u.value;
              se.walkTokens(u, t);
            }
          }
          break;
        case "list":
          se.walkTokens(i.items, t);
          break;
        default:
          i.tokens && se.walkTokens(i.tokens, t);
      }
    }
  }, se.parseInline = function (e, t) {
    if (null == e) throw new Error("marked.parseInline(): input parameter is undefined or null");
    if ("string" != typeof e) throw new Error("marked.parseInline(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected");
    t = te({}, se.defaults, t || {}), ne(t);
    try {
      var n = W.lexInline(e, t);
      return t.walkTokens && se.walkTokens(n, t.walkTokens), ee.parseInline(n, t);
    } catch (e) {
      if (e.message += "\nPlease report this to https://github.com/markedjs/marked.", t.silent) return "<p>An error occurred:</p><pre>" + re(e.message + "", !0) + "</pre>";
      throw e;
    }
  }, se.Parser = ee, se.parser = ee.parse, se.Renderer = H, se.TextRenderer = J, se.Lexer = W, se.lexer = W.lex, se.Tokenizer = D, se.Slugger = K, se.parse = se;
}
;
var _default = t();
exports.default = _default;

/***/ }),

/***/ 507:
/*!************************************************************************************************************************************************!*\
  !*** /Users/zhangzhenfeng/Documents/duyi/project/mysite-uni-app/packageA/uni_modules/zero-markdown-view/components/mp-html/highlight/index.js ***!
  \************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prism = _interopRequireDefault(__webpack_require__(/*! ./prism.min */ 508));
var _config = _interopRequireDefault(__webpack_require__(/*! ./config */ 509));
var _parser = _interopRequireDefault(__webpack_require__(/*! ../parser */ 504));
/**
 * @fileoverview highlight 插件
 * Include prismjs (https://prismjs.com)
 */

function Highlight(vm) {
  this.vm = vm;
}
Highlight.prototype.onParse = function (node, vm) {
  if (node.name === "pre") {
    if (vm.options.editable) {
      node.attrs.class = (node.attrs.class || "") + " hl-pre";
      return;
    }
    var i;
    for (i = node.children.length; i--;) {
      if (node.children[i].name === "code") break;
    }
    if (i === -1) return;
    var code = node.children[i];
    var className = code.attrs.class + " " + node.attrs.class;
    i = className.indexOf("language-");
    if (i === -1) {
      i = className.indexOf("lang-");
      if (i === -1) {
        className = "language-text";
        i = 9;
      } else {
        i += 5;
      }
    } else {
      i += 9;
    }
    var j;
    for (j = i; j < className.length; j++) {
      if (className[j] === " ") break;
    }
    var lang = className.substring(i, j);
    if (code.children.length) {
      var text = this.vm.getText(code.children).replace(/&amp;/g, "&");
      if (!text) return;
      if (node.c) {
        node.c = undefined;
      }
      if (_prism.default.languages[lang]) {
        code.children = new _parser.default(this.vm).parse(
        // 加一层 pre 保留空白符
        "<pre>" + _prism.default.highlight(text, _prism.default.languages[lang], lang).replace(/token /g, "hl-") + "</pre>")[0].children;
      }
      node.attrs.class = "hl-pre";
      code.attrs.class = "hl-code";
      code.attrs.style = "display:block;overflow: auto;";
      if (_config.default.showLanguageName) {
        node.children.push({
          name: "div",
          attrs: {
            class: "hl-language",
            style: "user-select:none;position:absolute;top:0;right:2px;font-size:10px;"
          },
          children: [{
            type: "text",
            text: lang
          }]
        });
      }
      if (_config.default.copyByClickCode) {
        node.attrs.style += (node.attrs.style || "") + ";user-select:none";
        node.attrs["data-content"] = text;
        node.children.push({
          name: "div",
          attrs: {
            class: "hl-copy",
            style: "user-select:none;position:absolute;top:0;right:3px;font-size:10px;"
          }
          // children: [{
          //   type: 'text',
          //   text: '复制'
          // }]
        });

        vm.expose();
      }
      if (_config.default.showLineNumber) {
        var line = text.split("\n").length;
        var children = [];
        for (var k = line; k--;) {
          children.push({
            name: "span",
            attrs: {
              class: "span"
            }
          });
        }
        node.children.push({
          name: "span",
          attrs: {
            class: "line-numbers-rows"
          },
          children: children
        });
      }
    }
  }
};
var _default = Highlight;
exports.default = _default;

/***/ }),

/***/ 508:
/*!****************************************************************************************************************************************************!*\
  !*** /Users/zhangzhenfeng/Documents/duyi/project/mysite-uni-app/packageA/uni_modules/zero-markdown-view/components/mp-html/highlight/prism.min.js ***!
  \****************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/* PrismJS 1.30.0
https://prismjs.com/download.html#themes=prism-tomorrow&languages=markup+css+clike+javascript+c+cpp+go+java+markup-templating+php+python+rust */
var _self = "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {},
  Prism = function (e) {
    var n = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,
      t = 0,
      r = {},
      a = {
        manual: e.Prism && e.Prism.manual,
        disableWorkerMessageHandler: e.Prism && e.Prism.disableWorkerMessageHandler,
        util: {
          encode: function e(n) {
            return n instanceof i ? new i(n.type, e(n.content), n.alias) : Array.isArray(n) ? n.map(e) : n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
          },
          type: function type(e) {
            return Object.prototype.toString.call(e).slice(8, -1);
          },
          objId: function objId(e) {
            return e.__id || Object.defineProperty(e, "__id", {
              value: ++t
            }), e.__id;
          },
          clone: function e(n, t) {
            var r, i;
            switch (t = t || {}, a.util.type(n)) {
              case "Object":
                if (i = a.util.objId(n), t[i]) return t[i];
                for (var l in r = {}, t[i] = r, n) {
                  n.hasOwnProperty(l) && (r[l] = e(n[l], t));
                }
                return r;
              case "Array":
                return i = a.util.objId(n), t[i] ? t[i] : (r = [], t[i] = r, n.forEach(function (n, a) {
                  r[a] = e(n, t);
                }), r);
              default:
                return n;
            }
          },
          getLanguage: function getLanguage(e) {
            for (; e;) {
              var t = n.exec(e.className);
              if (t) return t[1].toLowerCase();
              e = e.parentElement;
            }
            return "none";
          },
          setLanguage: function setLanguage(e, t) {
            e.className = e.className.replace(RegExp(n, "gi"), ""), e.classList.add("language-" + t);
          },
          currentScript: function currentScript() {
            if ("undefined" == typeof document) return null;
            if (document.currentScript && "SCRIPT" === document.currentScript.tagName) return document.currentScript;
            try {
              throw new Error();
            } catch (r) {
              var e = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(r.stack) || [])[1];
              if (e) {
                var n = document.getElementsByTagName("script");
                for (var t in n) {
                  if (n[t].src == e) return n[t];
                }
              }
              return null;
            }
          },
          isActive: function isActive(e, n, t) {
            for (var r = "no-" + n; e;) {
              var a = e.classList;
              if (a.contains(n)) return !0;
              if (a.contains(r)) return !1;
              e = e.parentElement;
            }
            return !!t;
          }
        },
        languages: {
          plain: r,
          plaintext: r,
          text: r,
          txt: r,
          extend: function extend(e, n) {
            var t = a.util.clone(a.languages[e]);
            for (var r in n) {
              t[r] = n[r];
            }
            return t;
          },
          insertBefore: function insertBefore(e, n, t, r) {
            var i = (r = r || a.languages)[e],
              l = {};
            for (var o in i) {
              if (i.hasOwnProperty(o)) {
                if (o == n) for (var s in t) {
                  t.hasOwnProperty(s) && (l[s] = t[s]);
                }
                t.hasOwnProperty(o) || (l[o] = i[o]);
              }
            }
            var u = r[e];
            return r[e] = l, a.languages.DFS(a.languages, function (n, t) {
              t === u && n != e && (this[n] = l);
            }), l;
          },
          DFS: function e(n, t, r, i) {
            i = i || {};
            var l = a.util.objId;
            for (var o in n) {
              if (n.hasOwnProperty(o)) {
                t.call(n, o, n[o], r || o);
                var s = n[o],
                  u = a.util.type(s);
                "Object" !== u || i[l(s)] ? "Array" !== u || i[l(s)] || (i[l(s)] = !0, e(s, t, o, i)) : (i[l(s)] = !0, e(s, t, null, i));
              }
            }
          }
        },
        plugins: {},
        highlightAll: function highlightAll(e, n) {
          a.highlightAllUnder(document, e, n);
        },
        highlightAllUnder: function highlightAllUnder(e, n, t) {
          var r = {
            callback: t,
            container: e,
            selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
          };
          a.hooks.run("before-highlightall", r), r.elements = Array.prototype.slice.apply(r.container.querySelectorAll(r.selector)), a.hooks.run("before-all-elements-highlight", r);
          for (var i, l = 0; i = r.elements[l++];) {
            a.highlightElement(i, !0 === n, r.callback);
          }
        },
        highlightElement: function highlightElement(n, t, r) {
          var i = a.util.getLanguage(n),
            l = a.languages[i];
          a.util.setLanguage(n, i);
          var o = n.parentElement;
          o && "pre" === o.nodeName.toLowerCase() && a.util.setLanguage(o, i);
          var s = {
            element: n,
            language: i,
            grammar: l,
            code: n.textContent
          };
          function u(e) {
            s.highlightedCode = e, a.hooks.run("before-insert", s), s.element.innerHTML = s.highlightedCode, a.hooks.run("after-highlight", s), a.hooks.run("complete", s), r && r.call(s.element);
          }
          if (a.hooks.run("before-sanity-check", s), (o = s.element.parentElement) && "pre" === o.nodeName.toLowerCase() && !o.hasAttribute("tabindex") && o.setAttribute("tabindex", "0"), !s.code) return a.hooks.run("complete", s), void (r && r.call(s.element));
          if (a.hooks.run("before-highlight", s), s.grammar) {
            if (t && e.Worker) {
              var c = new Worker(a.filename);
              c.onmessage = function (e) {
                u(e.data);
              }, c.postMessage(JSON.stringify({
                language: s.language,
                code: s.code,
                immediateClose: !0
              }));
            } else u(a.highlight(s.code, s.grammar, s.language));
          } else u(a.util.encode(s.code));
        },
        highlight: function highlight(e, n, t) {
          var r = {
            code: e,
            grammar: n,
            language: t
          };
          if (a.hooks.run("before-tokenize", r), !r.grammar) throw new Error('The language "' + r.language + '" has no grammar.');
          return r.tokens = a.tokenize(r.code, r.grammar), a.hooks.run("after-tokenize", r), i.stringify(a.util.encode(r.tokens), r.language);
        },
        tokenize: function tokenize(e, n) {
          var t = n.rest;
          if (t) {
            for (var r in t) {
              n[r] = t[r];
            }
            delete n.rest;
          }
          var a = new s();
          return u(a, a.head, e), o(e, a, n, a.head, 0), function (e) {
            for (var n = [], t = e.head.next; t !== e.tail;) {
              n.push(t.value), t = t.next;
            }
            return n;
          }(a);
        },
        hooks: {
          all: {},
          add: function add(e, n) {
            var t = a.hooks.all;
            t[e] = t[e] || [], t[e].push(n);
          },
          run: function run(e, n) {
            var t = a.hooks.all[e];
            if (t && t.length) for (var r, i = 0; r = t[i++];) {
              r(n);
            }
          }
        },
        Token: i
      };
    function i(e, n, t, r) {
      this.type = e, this.content = n, this.alias = t, this.length = 0 | (r || "").length;
    }
    function l(e, n, t, r) {
      e.lastIndex = n;
      var a = e.exec(t);
      if (a && r && a[1]) {
        var i = a[1].length;
        a.index += i, a[0] = a[0].slice(i);
      }
      return a;
    }
    function o(e, n, t, r, s, g) {
      for (var f in t) {
        if (t.hasOwnProperty(f) && t[f]) {
          var h = t[f];
          h = Array.isArray(h) ? h : [h];
          for (var d = 0; d < h.length; ++d) {
            if (g && g.cause == f + "," + d) return;
            var v = h[d],
              p = v.inside,
              m = !!v.lookbehind,
              y = !!v.greedy,
              k = v.alias;
            if (y && !v.pattern.global) {
              var x = v.pattern.toString().match(/[imsuy]*$/)[0];
              v.pattern = RegExp(v.pattern.source, x + "g");
            }
            for (var b = v.pattern || v, w = r.next, A = s; w !== n.tail && !(g && A >= g.reach); A += w.value.length, w = w.next) {
              var P = w.value;
              if (n.length > e.length) return;
              if (!(P instanceof i)) {
                var E,
                  S = 1;
                if (y) {
                  if (!(E = l(b, A, e, m)) || E.index >= e.length) break;
                  var L = E.index,
                    O = E.index + E[0].length,
                    C = A;
                  for (C += w.value.length; L >= C;) {
                    C += (w = w.next).value.length;
                  }
                  if (A = C -= w.value.length, w.value instanceof i) continue;
                  for (var j = w; j !== n.tail && (C < O || "string" == typeof j.value); j = j.next) {
                    S++, C += j.value.length;
                  }
                  S--, P = e.slice(A, C), E.index -= A;
                } else if (!(E = l(b, 0, P, m))) continue;
                L = E.index;
                var N = E[0],
                  _ = P.slice(0, L),
                  M = P.slice(L + N.length),
                  W = A + P.length;
                g && W > g.reach && (g.reach = W);
                var I = w.prev;
                if (_ && (I = u(n, I, _), A += _.length), c(n, I, S), w = u(n, I, new i(f, p ? a.tokenize(N, p) : N, k, N)), M && u(n, w, M), S > 1) {
                  var T = {
                    cause: f + "," + d,
                    reach: W
                  };
                  o(e, n, t, w.prev, A, T), g && T.reach > g.reach && (g.reach = T.reach);
                }
              }
            }
          }
        }
      }
    }
    function s() {
      var e = {
          value: null,
          prev: null,
          next: null
        },
        n = {
          value: null,
          prev: e,
          next: null
        };
      e.next = n, this.head = e, this.tail = n, this.length = 0;
    }
    function u(e, n, t) {
      var r = n.next,
        a = {
          value: t,
          prev: n,
          next: r
        };
      return n.next = a, r.prev = a, e.length++, a;
    }
    function c(e, n, t) {
      for (var r = n.next, a = 0; a < t && r !== e.tail; a++) {
        r = r.next;
      }
      n.next = r, r.prev = n, e.length -= a;
    }
    if (e.Prism = a, i.stringify = function e(n, t) {
      if ("string" == typeof n) return n;
      if (Array.isArray(n)) {
        var r = "";
        return n.forEach(function (n) {
          r += e(n, t);
        }), r;
      }
      var i = {
          type: n.type,
          content: e(n.content, t),
          tag: "span",
          classes: ["token", n.type],
          attributes: {},
          language: t
        },
        l = n.alias;
      l && (Array.isArray(l) ? Array.prototype.push.apply(i.classes, l) : i.classes.push(l)), a.hooks.run("wrap", i);
      var o = "";
      for (var s in i.attributes) {
        o += " " + s + '="' + (i.attributes[s] || "").replace(/"/g, "&quot;") + '"';
      }
      return "<" + i.tag + ' class="' + i.classes.join(" ") + '"' + o + ">" + i.content + "</" + i.tag + ">";
    }, !e.document) return e.addEventListener ? (a.disableWorkerMessageHandler || e.addEventListener("message", function (n) {
      var t = JSON.parse(n.data),
        r = t.language,
        i = t.code,
        l = t.immediateClose;
      e.postMessage(a.highlight(i, a.languages[r], r)), l && e.close();
    }, !1), a) : a;
    var g = a.util.currentScript();
    function f() {
      a.manual || a.highlightAll();
    }
    if (g && (a.filename = g.src, g.hasAttribute("data-manual") && (a.manual = !0)), !a.manual) {
      var h = document.readyState;
      "loading" === h || "interactive" === h && g && g.defer ? document.addEventListener("DOMContentLoaded", f) : window.requestAnimationFrame ? window.requestAnimationFrame(f) : window.setTimeout(f, 16);
    }
    return a;
  }(_self);
var _default = Prism;
exports.default = _default;
"undefined" != typeof global && (global.Prism = Prism);
Prism.languages.markup = {
  comment: {
    pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
    greedy: !0
  },
  prolog: {
    pattern: /<\?[\s\S]+?\?>/,
    greedy: !0
  },
  doctype: {
    pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
    greedy: !0,
    inside: {
      "internal-subset": {
        pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
        lookbehind: !0,
        greedy: !0,
        inside: null
      },
      string: {
        pattern: /"[^"]*"|'[^']*'/,
        greedy: !0
      },
      punctuation: /^<!|>$|[[\]]/,
      "doctype-tag": /^DOCTYPE/i,
      name: /[^\s<>'"]+/
    }
  },
  cdata: {
    pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
    greedy: !0
  },
  tag: {
    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
    greedy: !0,
    inside: {
      tag: {
        pattern: /^<\/?[^\s>\/]+/,
        inside: {
          punctuation: /^<\/?/,
          namespace: /^[^\s>\/:]+:/
        }
      },
      "special-attr": [],
      "attr-value": {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
        inside: {
          punctuation: [{
            pattern: /^=/,
            alias: "attr-equals"
          }, {
            pattern: /^(\s*)["']|["']$/,
            lookbehind: !0
          }]
        }
      },
      punctuation: /\/?>/,
      "attr-name": {
        pattern: /[^\s>\/]+/,
        inside: {
          namespace: /^[^\s>\/:]+:/
        }
      }
    }
  },
  entity: [{
    pattern: /&[\da-z]{1,8};/i,
    alias: "named-entity"
  }, /&#x?[\da-f]{1,8};/i]
}, Prism.languages.markup.tag.inside["attr-value"].inside.entity = Prism.languages.markup.entity, Prism.languages.markup.doctype.inside["internal-subset"].inside = Prism.languages.markup, Prism.hooks.add("wrap", function (a) {
  "entity" === a.type && (a.attributes.title = a.content.replace(/&amp;/, "&"));
}), Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
  value: function value(a, e) {
    var s = {};
    s["language-" + e] = {
      pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
      lookbehind: !0,
      inside: Prism.languages[e]
    }, s.cdata = /^<!\[CDATA\[|\]\]>$/i;
    var t = {
      "included-cdata": {
        pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
        inside: s
      }
    };
    t["language-" + e] = {
      pattern: /[\s\S]+/,
      inside: Prism.languages[e]
    };
    var n = {};
    n[a] = {
      pattern: RegExp("(<__[^>]*>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[^])*?(?=</__>)".replace(/__/g, function () {
        return a;
      }), "i"),
      lookbehind: !0,
      greedy: !0,
      inside: t
    }, Prism.languages.insertBefore("markup", "cdata", n);
  }
}), Object.defineProperty(Prism.languages.markup.tag, "addAttribute", {
  value: function value(a, e) {
    Prism.languages.markup.tag.inside["special-attr"].push({
      pattern: RegExp("(^|[\"'\\s])(?:" + a + ")\\s*=\\s*(?:\"[^\"]*\"|'[^']*'|[^\\s'\">=]+(?=[\\s>]))", "i"),
      lookbehind: !0,
      inside: {
        "attr-name": /^[^\s=]+/,
        "attr-value": {
          pattern: /=[\s\S]+/,
          inside: {
            value: {
              pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
              lookbehind: !0,
              alias: [e, "language-" + e],
              inside: Prism.languages[e]
            },
            punctuation: [{
              pattern: /^=/,
              alias: "attr-equals"
            }, /"|'/]
          }
        }
      }
    });
  }
}), Prism.languages.html = Prism.languages.markup, Prism.languages.mathml = Prism.languages.markup, Prism.languages.svg = Prism.languages.markup, Prism.languages.xml = Prism.languages.extend("markup", {}), Prism.languages.ssml = Prism.languages.xml, Prism.languages.atom = Prism.languages.xml, Prism.languages.rss = Prism.languages.xml;
!function (s) {
  var e = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
  s.languages.css = {
    comment: /\/\*[\s\S]*?\*\//,
    atrule: {
      pattern: RegExp("@[\\w-](?:[^;{\\s\"']|\\s+(?!\\s)|" + e.source + ")*?(?:;|(?=\\s*\\{))"),
      inside: {
        rule: /^@[\w-]+/,
        "selector-function-argument": {
          pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
          lookbehind: !0,
          alias: "selector"
        },
        keyword: {
          pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
          lookbehind: !0
        }
      }
    },
    url: {
      pattern: RegExp("\\burl\\((?:" + e.source + "|(?:[^\\\\\r\n()\"']|\\\\[^])*)\\)", "i"),
      greedy: !0,
      inside: {
        function: /^url/i,
        punctuation: /^\(|\)$/,
        string: {
          pattern: RegExp("^" + e.source + "$"),
          alias: "url"
        }
      }
    },
    selector: {
      pattern: RegExp("(^|[{}\\s])[^{}\\s](?:[^{};\"'\\s]|\\s+(?![\\s{])|" + e.source + ")*(?=\\s*\\{)"),
      lookbehind: !0
    },
    string: {
      pattern: e,
      greedy: !0
    },
    property: {
      pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
      lookbehind: !0
    },
    important: /!important\b/i,
    function: {
      pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
      lookbehind: !0
    },
    punctuation: /[(){};:,]/
  }, s.languages.css.atrule.inside.rest = s.languages.css;
  var t = s.languages.markup;
  t && (t.tag.addInlined("style", "css"), t.tag.addAttribute("style", "css"));
}(Prism);
Prism.languages.clike = {
  comment: [{
    pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
    lookbehind: !0,
    greedy: !0
  }, {
    pattern: /(^|[^\\:])\/\/.*/,
    lookbehind: !0,
    greedy: !0
  }],
  string: {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: !0
  },
  "class-name": {
    pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
    lookbehind: !0,
    inside: {
      punctuation: /[.\\]/
    }
  },
  keyword: /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
  boolean: /\b(?:false|true)\b/,
  function: /\b\w+(?=\()/,
  number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
  operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  punctuation: /[{}[\];(),.:]/
};
Prism.languages.javascript = Prism.languages.extend("clike", {
  "class-name": [Prism.languages.clike["class-name"], {
    pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
    lookbehind: !0
  }],
  keyword: [{
    pattern: /((?:^|\})\s*)catch\b/,
    lookbehind: !0
  }, {
    pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
    lookbehind: !0
  }],
  function: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  number: {
    pattern: RegExp("(^|[^\\w$])(?:NaN|Infinity|0[bB][01]+(?:_[01]+)*n?|0[oO][0-7]+(?:_[0-7]+)*n?|0[xX][\\dA-Fa-f]+(?:_[\\dA-Fa-f]+)*n?|\\d+(?:_\\d+)*n|(?:\\d+(?:_\\d+)*(?:\\.(?:\\d+(?:_\\d+)*)?)?|\\.\\d+(?:_\\d+)*)(?:[Ee][+-]?\\d+(?:_\\d+)*)?)(?![\\w$])"),
    lookbehind: !0
  },
  operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
}), Prism.languages.javascript["class-name"][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/, Prism.languages.insertBefore("javascript", "keyword", {
  regex: {
    pattern: RegExp("((?:^|[^$\\w\\xA0-\\uFFFF.\"'\\])\\s]|\\b(?:return|yield))\\s*)/(?:(?:\\[(?:[^\\]\\\\\r\n]|\\\\.)*\\]|\\\\.|[^/\\\\\\[\r\n])+/[dgimyus]{0,7}|(?:\\[(?:[^[\\]\\\\\r\n]|\\\\.|\\[(?:[^[\\]\\\\\r\n]|\\\\.|\\[(?:[^[\\]\\\\\r\n]|\\\\.)*\\])*\\])*\\]|\\\\.|[^/\\\\\\[\r\n])+/[dgimyus]{0,7}v[dgimyus]{0,7})(?=(?:\\s|/\\*(?:[^*]|\\*(?!/))*\\*/)*(?:$|[\r\n,.;:})\\]]|//))"),
    lookbehind: !0,
    greedy: !0,
    inside: {
      "regex-source": {
        pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
        lookbehind: !0,
        alias: "language-regex",
        inside: Prism.languages.regex
      },
      "regex-delimiter": /^\/|\/$/,
      "regex-flags": /^[a-z]+$/
    }
  },
  "function-variable": {
    pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
    alias: "function"
  },
  parameter: [{
    pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
    lookbehind: !0,
    inside: Prism.languages.javascript
  }, {
    pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
    lookbehind: !0,
    inside: Prism.languages.javascript
  }, {
    pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
    lookbehind: !0,
    inside: Prism.languages.javascript
  }, {
    pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
    lookbehind: !0,
    inside: Prism.languages.javascript
  }],
  constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
}), Prism.languages.insertBefore("javascript", "string", {
  hashbang: {
    pattern: /^#!.*/,
    greedy: !0,
    alias: "comment"
  },
  "template-string": {
    pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
    greedy: !0,
    inside: {
      "template-punctuation": {
        pattern: /^`|`$/,
        alias: "string"
      },
      interpolation: {
        pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
        lookbehind: !0,
        inside: {
          "interpolation-punctuation": {
            pattern: /^\$\{|\}$/,
            alias: "punctuation"
          },
          rest: Prism.languages.javascript
        }
      },
      string: /[\s\S]+/
    }
  },
  "string-property": {
    pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
    lookbehind: !0,
    greedy: !0,
    alias: "property"
  }
}), Prism.languages.insertBefore("javascript", "operator", {
  "literal-property": {
    pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
    lookbehind: !0,
    alias: "property"
  }
}), Prism.languages.markup && (Prism.languages.markup.tag.addInlined("script", "javascript"), Prism.languages.markup.tag.addAttribute("on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)", "javascript")), Prism.languages.js = Prism.languages.javascript;
Prism.languages.c = Prism.languages.extend("clike", {
  comment: {
    pattern: /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
    greedy: !0
  },
  string: {
    pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
    greedy: !0
  },
  "class-name": {
    pattern: /(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+|\b[a-z]\w*_t\b/,
    lookbehind: !0
  },
  keyword: /\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|__attribute__|asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|typeof|union|unsigned|void|volatile|while)\b/,
  function: /\b[a-z_]\w*(?=\s*\()/i,
  number: /(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
  operator: />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/
}), Prism.languages.insertBefore("c", "string", {
  char: {
    pattern: /'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n]){0,32}'/,
    greedy: !0
  }
}), Prism.languages.insertBefore("c", "string", {
  macro: {
    pattern: /(^[\t ]*)#\s*[a-z](?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,
    lookbehind: !0,
    greedy: !0,
    alias: "property",
    inside: {
      string: [{
        pattern: /^(#\s*include\s*)<[^>]+>/,
        lookbehind: !0
      }, Prism.languages.c.string],
      char: Prism.languages.c.char,
      comment: Prism.languages.c.comment,
      "macro-name": [{
        pattern: /(^#\s*define\s+)\w+\b(?!\()/i,
        lookbehind: !0
      }, {
        pattern: /(^#\s*define\s+)\w+\b(?=\()/i,
        lookbehind: !0,
        alias: "function"
      }],
      directive: {
        pattern: /^(#\s*)[a-z]+/,
        lookbehind: !0,
        alias: "keyword"
      },
      "directive-hash": /^#/,
      punctuation: /##|\\(?=[\r\n])/,
      expression: {
        pattern: /\S[\s\S]*/,
        inside: Prism.languages.c
      }
    }
  }
}), Prism.languages.insertBefore("c", "function", {
  constant: /\b(?:EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|__DATE__|__FILE__|__LINE__|__TIMESTAMP__|__TIME__|__func__|stderr|stdin|stdout)\b/
}), delete Prism.languages.c.boolean;
!function (e) {
  var t = /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|char8_t|class|co_await|co_return|co_yield|compl|concept|const|const_cast|consteval|constexpr|constinit|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|final|float|for|friend|goto|if|import|inline|int|int16_t|int32_t|int64_t|int8_t|long|module|mutable|namespace|new|noexcept|nullptr|operator|override|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|uint16_t|uint32_t|uint64_t|uint8_t|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/,
    n = "\\b(?!<keyword>)\\w+(?:\\s*\\.\\s*\\w+)*\\b".replace(/<keyword>/g, function () {
      return t.source;
    });
  e.languages.cpp = e.languages.extend("c", {
    "class-name": [{
      pattern: RegExp("(\\b(?:class|concept|enum|struct|typename)\\s+)(?!<keyword>)\\w+".replace(/<keyword>/g, function () {
        return t.source;
      })),
      lookbehind: !0
    }, /\b[A-Z]\w*(?=\s*::\s*\w+\s*\()/, /\b[A-Z_]\w*(?=\s*::\s*~\w+\s*\()/i, /\b\w+(?=\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>\s*::\s*\w+\s*\()/],
    keyword: t,
    number: {
      pattern: /(?:\b0b[01']+|\b0x(?:[\da-f']+(?:\.[\da-f']*)?|\.[\da-f']+)(?:p[+-]?[\d']+)?|(?:\b[\d']+(?:\.[\d']*)?|\B\.[\d']+)(?:e[+-]?[\d']+)?)[ful]{0,4}/i,
      greedy: !0
    },
    operator: />>=?|<<=?|->|--|\+\+|&&|\|\||[?:~]|<=>|[-+*/%&|^!=<>]=?|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/,
    boolean: /\b(?:false|true)\b/
  }), e.languages.insertBefore("cpp", "string", {
    module: {
      pattern: RegExp('(\\b(?:import|module)\\s+)(?:"(?:\\\\(?:\r\n|[^])|[^"\\\\\r\n])*"|<[^<>\r\n]*>|' + "<mod-name>(?:\\s*:\\s*<mod-name>)?|:\\s*<mod-name>".replace(/<mod-name>/g, function () {
        return n;
      }) + ")"),
      lookbehind: !0,
      greedy: !0,
      inside: {
        string: /^[<"][\s\S]+/,
        operator: /:/,
        punctuation: /\./
      }
    },
    "raw-string": {
      pattern: /R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/,
      alias: "string",
      greedy: !0
    }
  }), e.languages.insertBefore("cpp", "keyword", {
    "generic-function": {
      pattern: /\b(?!operator\b)[a-z_]\w*\s*<(?:[^<>]|<[^<>]*>)*>(?=\s*\()/i,
      inside: {
        function: /^\w+/,
        generic: {
          pattern: /<[\s\S]+/,
          alias: "class-name",
          inside: e.languages.cpp
        }
      }
    }
  }), e.languages.insertBefore("cpp", "operator", {
    "double-colon": {
      pattern: /::/,
      alias: "punctuation"
    }
  }), e.languages.insertBefore("cpp", "class-name", {
    "base-clause": {
      pattern: /(\b(?:class|struct)\s+\w+\s*:\s*)[^;{}"'\s]+(?:\s+[^;{}"'\s]+)*(?=\s*[;{])/,
      lookbehind: !0,
      greedy: !0,
      inside: e.languages.extend("cpp", {})
    }
  }), e.languages.insertBefore("inside", "double-colon", {
    "class-name": /\b[a-z_]\w*\b(?!\s*::)/i
  }, e.languages.cpp["base-clause"]);
}(Prism);
Prism.languages.go = Prism.languages.extend("clike", {
  string: {
    pattern: /(^|[^\\])"(?:\\.|[^"\\\r\n])*"|`[^`]*`/,
    lookbehind: !0,
    greedy: !0
  },
  keyword: /\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(?:to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,
  boolean: /\b(?:_|false|iota|nil|true)\b/,
  number: [/\b0(?:b[01_]+|o[0-7_]+)i?\b/i, /\b0x(?:[a-f\d_]+(?:\.[a-f\d_]*)?|\.[a-f\d_]+)(?:p[+-]?\d+(?:_\d+)*)?i?(?!\w)/i, /(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?[\d_]+)?i?(?!\w)/i],
  operator: /[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,
  builtin: /\b(?:append|bool|byte|cap|close|complex|complex(?:64|128)|copy|delete|error|float(?:32|64)|u?int(?:8|16|32|64)?|imag|len|make|new|panic|print(?:ln)?|real|recover|rune|string|uintptr)\b/
}), Prism.languages.insertBefore("go", "string", {
  char: {
    pattern: /'(?:\\.|[^'\\\r\n]){0,10}'/,
    greedy: !0
  }
}), delete Prism.languages.go["class-name"];
!function (e) {
  var n = /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|non-sealed|null|open|opens|package|permits|private|protected|provides|public|record(?!\s*[(){}[\]<>=%~.:,;?+\-*/&|^])|requires|return|sealed|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/,
    t = "(?:[a-z]\\w*\\s*\\.\\s*)*(?:[A-Z]\\w*\\s*\\.\\s*)*",
    s = {
      pattern: RegExp("(^|[^\\w.])" + t + "[A-Z](?:[\\d_A-Z]*[a-z]\\w*)?\\b"),
      lookbehind: !0,
      inside: {
        namespace: {
          pattern: /^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/,
          inside: {
            punctuation: /\./
          }
        },
        punctuation: /\./
      }
    };
  e.languages.java = e.languages.extend("clike", {
    string: {
      pattern: /(^|[^\\])"(?:\\.|[^"\\\r\n])*"/,
      lookbehind: !0,
      greedy: !0
    },
    "class-name": [s, {
      pattern: RegExp("(^|[^\\w.])" + t + "[A-Z]\\w*(?=\\s+\\w+\\s*[;,=()]|\\s*(?:\\[[\\s,]*\\]\\s*)?::\\s*new\\b)"),
      lookbehind: !0,
      inside: s.inside
    }, {
      pattern: RegExp("(\\b(?:class|enum|extends|implements|instanceof|interface|new|record|throws)\\s+)" + t + "[A-Z]\\w*\\b"),
      lookbehind: !0,
      inside: s.inside
    }],
    keyword: n,
    function: [e.languages.clike.function, {
      pattern: /(::\s*)[a-z_]\w*/,
      lookbehind: !0
    }],
    number: /\b0b[01][01_]*L?\b|\b0x(?:\.[\da-f_p+-]+|[\da-f_]+(?:\.[\da-f_p+-]+)?)\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,
    operator: {
      pattern: /(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,
      lookbehind: !0
    },
    constant: /\b[A-Z][A-Z_\d]+\b/
  }), e.languages.insertBefore("java", "string", {
    "triple-quoted-string": {
      pattern: /"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,
      greedy: !0,
      alias: "string"
    },
    char: {
      pattern: /'(?:\\.|[^'\\\r\n]){1,6}'/,
      greedy: !0
    }
  }), e.languages.insertBefore("java", "class-name", {
    annotation: {
      pattern: /(^|[^.])@\w+(?:\s*\.\s*\w+)*/,
      lookbehind: !0,
      alias: "punctuation"
    },
    generics: {
      pattern: /<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&))*>)*>)*>)*>/,
      inside: {
        "class-name": s,
        keyword: n,
        punctuation: /[<>(),.:]/,
        operator: /[?&|]/
      }
    },
    import: [{
      pattern: RegExp("(\\bimport\\s+)" + t + "(?:[A-Z]\\w*|\\*)(?=\\s*;)"),
      lookbehind: !0,
      inside: {
        namespace: s.inside.namespace,
        punctuation: /\./,
        operator: /\*/,
        "class-name": /\w+/
      }
    }, {
      pattern: RegExp("(\\bimport\\s+static\\s+)" + t + "(?:\\w+|\\*)(?=\\s*;)"),
      lookbehind: !0,
      alias: "static",
      inside: {
        namespace: s.inside.namespace,
        static: /\b\w+$/,
        punctuation: /\./,
        operator: /\*/,
        "class-name": /\w+/
      }
    }],
    namespace: {
      pattern: RegExp("(\\b(?:exports|import(?:\\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\\s+)(?!<keyword>)[a-z]\\w*(?:\\.[a-z]\\w*)*\\.?".replace(/<keyword>/g, function () {
        return n.source;
      })),
      lookbehind: !0,
      inside: {
        punctuation: /\./
      }
    }
  });
}(Prism);
!function (e) {
  function n(e, n) {
    return "___" + e.toUpperCase() + n + "___";
  }
  Object.defineProperties(e.languages["markup-templating"] = {}, {
    buildPlaceholders: {
      value: function value(t, a, r, o) {
        if (t.language === a) {
          var c = t.tokenStack = [];
          t.code = t.code.replace(r, function (e) {
            if ("function" == typeof o && !o(e)) return e;
            for (var r, i = c.length; -1 !== t.code.indexOf(r = n(a, i));) {
              ++i;
            }
            return c[i] = e, r;
          }), t.grammar = e.languages.markup;
        }
      }
    },
    tokenizePlaceholders: {
      value: function value(t, a) {
        if (t.language === a && t.tokenStack) {
          t.grammar = e.languages[a];
          var r = 0,
            o = Object.keys(t.tokenStack);
          !function c(i) {
            for (var u = 0; u < i.length && !(r >= o.length); u++) {
              var g = i[u];
              if ("string" == typeof g || g.content && "string" == typeof g.content) {
                var l = o[r],
                  s = t.tokenStack[l],
                  f = "string" == typeof g ? g : g.content,
                  p = n(a, l),
                  k = f.indexOf(p);
                if (k > -1) {
                  ++r;
                  var m = f.substring(0, k),
                    d = new e.Token(a, e.tokenize(s, t.grammar), "language-" + a, s),
                    h = f.substring(k + p.length),
                    v = [];
                  m && v.push.apply(v, c([m])), v.push(d), h && v.push.apply(v, c([h])), "string" == typeof g ? i.splice.apply(i, [u, 1].concat(v)) : g.content = v;
                }
              } else g.content && c(g.content);
            }
            return i;
          }(t.tokens);
        }
      }
    }
  });
}(Prism);
!function (e) {
  var a = /\/\*[\s\S]*?\*\/|\/\/.*|#(?!\[).*/,
    t = [{
      pattern: /\b(?:false|true)\b/i,
      alias: "boolean"
    }, {
      pattern: /(::\s*)\b[a-z_]\w*\b(?!\s*\()/i,
      greedy: !0,
      lookbehind: !0
    }, {
      pattern: /(\b(?:case|const)\s+)\b[a-z_]\w*(?=\s*[;=])/i,
      greedy: !0,
      lookbehind: !0
    }, /\b(?:null)\b/i, /\b[A-Z_][A-Z0-9_]*\b(?!\s*\()/],
    i = /\b0b[01]+(?:_[01]+)*\b|\b0o[0-7]+(?:_[0-7]+)*\b|\b0x[\da-f]+(?:_[\da-f]+)*\b|(?:\b\d+(?:_\d+)*\.?(?:\d+(?:_\d+)*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    n = /<?=>|\?\?=?|\.{3}|\??->|[!=]=?=?|::|\*\*=?|--|\+\+|&&|\|\||<<|>>|[?~]|[/^|%*&<>.+-]=?/,
    s = /[{}\[\](),:;]/;
  e.languages.php = {
    delimiter: {
      pattern: /\?>$|^<\?(?:php(?=\s)|=)?/i,
      alias: "important"
    },
    comment: a,
    variable: /\$+(?:\w+\b|(?=\{))/,
    package: {
      pattern: /(namespace\s+|use\s+(?:function\s+)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
      lookbehind: !0,
      inside: {
        punctuation: /\\/
      }
    },
    "class-name-definition": {
      pattern: /(\b(?:class|enum|interface|trait)\s+)\b[a-z_]\w*(?!\\)\b/i,
      lookbehind: !0,
      alias: "class-name"
    },
    "function-definition": {
      pattern: /(\bfunction\s+)[a-z_]\w*(?=\s*\()/i,
      lookbehind: !0,
      alias: "function"
    },
    keyword: [{
      pattern: /(\(\s*)\b(?:array|bool|boolean|float|int|integer|object|string)\b(?=\s*\))/i,
      alias: "type-casting",
      greedy: !0,
      lookbehind: !0
    }, {
      pattern: /([(,?]\s*)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|object|self|static|string)\b(?=\s*\$)/i,
      alias: "type-hint",
      greedy: !0,
      lookbehind: !0
    }, {
      pattern: /(\)\s*:\s*(?:\?\s*)?)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|never|object|self|static|string|void)\b/i,
      alias: "return-type",
      greedy: !0,
      lookbehind: !0
    }, {
      pattern: /\b(?:array(?!\s*\()|bool|float|int|iterable|mixed|object|string|void)\b/i,
      alias: "type-declaration",
      greedy: !0
    }, {
      pattern: /(\|\s*)(?:false|null)\b|\b(?:false|null)(?=\s*\|)/i,
      alias: "type-declaration",
      greedy: !0,
      lookbehind: !0
    }, {
      pattern: /\b(?:parent|self|static)(?=\s*::)/i,
      alias: "static-context",
      greedy: !0
    }, {
      pattern: /(\byield\s+)from\b/i,
      lookbehind: !0
    }, /\bclass\b/i, {
      pattern: /((?:^|[^\s>:]|(?:^|[^-])>|(?:^|[^:]):)\s*)\b(?:abstract|and|array|as|break|callable|case|catch|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|enum|eval|exit|extends|final|finally|fn|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|match|namespace|never|new|or|parent|print|private|protected|public|readonly|require|require_once|return|self|static|switch|throw|trait|try|unset|use|var|while|xor|yield|__halt_compiler)\b/i,
      lookbehind: !0
    }],
    "argument-name": {
      pattern: /([(,]\s*)\b[a-z_]\w*(?=\s*:(?!:))/i,
      lookbehind: !0
    },
    "class-name": [{
      pattern: /(\b(?:extends|implements|instanceof|new(?!\s+self|\s+static))\s+|\bcatch\s*\()\b[a-z_]\w*(?!\\)\b/i,
      greedy: !0,
      lookbehind: !0
    }, {
      pattern: /(\|\s*)\b[a-z_]\w*(?!\\)\b/i,
      greedy: !0,
      lookbehind: !0
    }, {
      pattern: /\b[a-z_]\w*(?!\\)\b(?=\s*\|)/i,
      greedy: !0
    }, {
      pattern: /(\|\s*)(?:\\?\b[a-z_]\w*)+\b/i,
      alias: "class-name-fully-qualified",
      greedy: !0,
      lookbehind: !0,
      inside: {
        punctuation: /\\/
      }
    }, {
      pattern: /(?:\\?\b[a-z_]\w*)+\b(?=\s*\|)/i,
      alias: "class-name-fully-qualified",
      greedy: !0,
      inside: {
        punctuation: /\\/
      }
    }, {
      pattern: /(\b(?:extends|implements|instanceof|new(?!\s+self\b|\s+static\b))\s+|\bcatch\s*\()(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
      alias: "class-name-fully-qualified",
      greedy: !0,
      lookbehind: !0,
      inside: {
        punctuation: /\\/
      }
    }, {
      pattern: /\b[a-z_]\w*(?=\s*\$)/i,
      alias: "type-declaration",
      greedy: !0
    }, {
      pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
      alias: ["class-name-fully-qualified", "type-declaration"],
      greedy: !0,
      inside: {
        punctuation: /\\/
      }
    }, {
      pattern: /\b[a-z_]\w*(?=\s*::)/i,
      alias: "static-context",
      greedy: !0
    }, {
      pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*::)/i,
      alias: ["class-name-fully-qualified", "static-context"],
      greedy: !0,
      inside: {
        punctuation: /\\/
      }
    }, {
      pattern: /([(,?]\s*)[a-z_]\w*(?=\s*\$)/i,
      alias: "type-hint",
      greedy: !0,
      lookbehind: !0
    }, {
      pattern: /([(,?]\s*)(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
      alias: ["class-name-fully-qualified", "type-hint"],
      greedy: !0,
      lookbehind: !0,
      inside: {
        punctuation: /\\/
      }
    }, {
      pattern: /(\)\s*:\s*(?:\?\s*)?)\b[a-z_]\w*(?!\\)\b/i,
      alias: "return-type",
      greedy: !0,
      lookbehind: !0
    }, {
      pattern: /(\)\s*:\s*(?:\?\s*)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
      alias: ["class-name-fully-qualified", "return-type"],
      greedy: !0,
      lookbehind: !0,
      inside: {
        punctuation: /\\/
      }
    }],
    constant: t,
    function: {
      pattern: /(^|[^\\\w])\\?[a-z_](?:[\w\\]*\w)?(?=\s*\()/i,
      lookbehind: !0,
      inside: {
        punctuation: /\\/
      }
    },
    property: {
      pattern: /(->\s*)\w+/,
      lookbehind: !0
    },
    number: i,
    operator: n,
    punctuation: s
  };
  var l = {
      pattern: /\{\$(?:\{(?:\{[^{}]+\}|[^{}]+)\}|[^{}])+\}|(^|[^\\{])\$+(?:\w+(?:\[[^\r\n\[\]]+\]|->\w+)?)/,
      lookbehind: !0,
      inside: e.languages.php
    },
    r = [{
      pattern: /<<<'([^']+)'[\r\n](?:.*[\r\n])*?\1;/,
      alias: "nowdoc-string",
      greedy: !0,
      inside: {
        delimiter: {
          pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
          alias: "symbol",
          inside: {
            punctuation: /^<<<'?|[';]$/
          }
        }
      }
    }, {
      pattern: /<<<(?:"([^"]+)"[\r\n](?:.*[\r\n])*?\1;|([a-z_]\w*)[\r\n](?:.*[\r\n])*?\2;)/i,
      alias: "heredoc-string",
      greedy: !0,
      inside: {
        delimiter: {
          pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
          alias: "symbol",
          inside: {
            punctuation: /^<<<"?|[";]$/
          }
        },
        interpolation: l
      }
    }, {
      pattern: /`(?:\\[\s\S]|[^\\`])*`/,
      alias: "backtick-quoted-string",
      greedy: !0
    }, {
      pattern: /'(?:\\[\s\S]|[^\\'])*'/,
      alias: "single-quoted-string",
      greedy: !0
    }, {
      pattern: /"(?:\\[\s\S]|[^\\"])*"/,
      alias: "double-quoted-string",
      greedy: !0,
      inside: {
        interpolation: l
      }
    }];
  e.languages.insertBefore("php", "variable", {
    string: r,
    attribute: {
      pattern: /#\[(?:[^"'\/#]|\/(?![*/])|\/\/.*$|#(?!\[).*$|\/\*(?:[^*]|\*(?!\/))*\*\/|"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*')+\](?=\s*[a-z$#])/im,
      greedy: !0,
      inside: {
        "attribute-content": {
          pattern: /^(#\[)[\s\S]+(?=\]$)/,
          lookbehind: !0,
          inside: {
            comment: a,
            string: r,
            "attribute-class-name": [{
              pattern: /([^:]|^)\b[a-z_]\w*(?!\\)\b/i,
              alias: "class-name",
              greedy: !0,
              lookbehind: !0
            }, {
              pattern: /([^:]|^)(?:\\?\b[a-z_]\w*)+/i,
              alias: ["class-name", "class-name-fully-qualified"],
              greedy: !0,
              lookbehind: !0,
              inside: {
                punctuation: /\\/
              }
            }],
            constant: t,
            number: i,
            operator: n,
            punctuation: s
          }
        },
        delimiter: {
          pattern: /^#\[|\]$/,
          alias: "punctuation"
        }
      }
    }
  }), e.hooks.add("before-tokenize", function (a) {
    /<\?/.test(a.code) && e.languages["markup-templating"].buildPlaceholders(a, "php", /<\?(?:[^"'/#]|\/(?![*/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|(?:\/\/|#(?!\[))(?:[^?\n\r]|\?(?!>))*(?=$|\?>|[\r\n])|#\[|\/\*(?:[^*]|\*(?!\/))*(?:\*\/|$))*?(?:\?>|$)/g);
  }), e.hooks.add("after-tokenize", function (a) {
    e.languages["markup-templating"].tokenizePlaceholders(a, "php");
  });
}(Prism);
Prism.languages.python = {
  comment: {
    pattern: /(^|[^\\])#.*/,
    lookbehind: !0,
    greedy: !0
  },
  "string-interpolation": {
    pattern: /(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
    greedy: !0,
    inside: {
      interpolation: {
        pattern: /((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,
        lookbehind: !0,
        inside: {
          "format-spec": {
            pattern: /(:)[^:(){}]+(?=\}$)/,
            lookbehind: !0
          },
          "conversion-option": {
            pattern: /![sra](?=[:}]$)/,
            alias: "punctuation"
          },
          rest: null
        }
      },
      string: /[\s\S]+/
    }
  },
  "triple-quoted-string": {
    pattern: /(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i,
    greedy: !0,
    alias: "string"
  },
  string: {
    pattern: /(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
    greedy: !0
  },
  function: {
    pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
    lookbehind: !0
  },
  "class-name": {
    pattern: /(\bclass\s+)\w+/i,
    lookbehind: !0
  },
  decorator: {
    pattern: /(^[\t ]*)@\w+(?:\.\w+)*/m,
    lookbehind: !0,
    alias: ["annotation", "punctuation"],
    inside: {
      punctuation: /\./
    }
  },
  keyword: /\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
  builtin: /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
  boolean: /\b(?:False|None|True)\b/,
  number: /\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,
  operator: /[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
  punctuation: /[{}[\];(),.:]/
}, Prism.languages.python["string-interpolation"].inside.interpolation.inside.rest = Prism.languages.python, Prism.languages.py = Prism.languages.python;
!function (e) {
  for (var a = "/\\*(?:[^*/]|\\*(?!/)|/(?!\\*)|<self>)*\\*/", t = 0; t < 2; t++) {
    a = a.replace(/<self>/g, function () {
      return a;
    });
  }
  a = a.replace(/<self>/g, function () {
    return "[^\\s\\S]";
  }), e.languages.rust = {
    comment: [{
      pattern: RegExp("(^|[^\\\\])" + a),
      lookbehind: !0,
      greedy: !0
    }, {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: !0,
      greedy: !0
    }],
    string: {
      pattern: /b?"(?:\\[\s\S]|[^\\"])*"|b?r(#*)"(?:[^"]|"(?!\1))*"\1/,
      greedy: !0
    },
    char: {
      pattern: /b?'(?:\\(?:x[0-7][\da-fA-F]|u\{(?:[\da-fA-F]_*){1,6}\}|.)|[^\\\r\n\t'])'/,
      greedy: !0
    },
    attribute: {
      pattern: /#!?\[(?:[^\[\]"]|"(?:\\[\s\S]|[^\\"])*")*\]/,
      greedy: !0,
      alias: "attr-name",
      inside: {
        string: null
      }
    },
    "closure-params": {
      pattern: /([=(,:]\s*|\bmove\s*)\|[^|]*\||\|[^|]*\|(?=\s*(?:\{|->))/,
      lookbehind: !0,
      greedy: !0,
      inside: {
        "closure-punctuation": {
          pattern: /^\||\|$/,
          alias: "punctuation"
        },
        rest: null
      }
    },
    "lifetime-annotation": {
      pattern: /'\w+/,
      alias: "symbol"
    },
    "fragment-specifier": {
      pattern: /(\$\w+:)[a-z]+/,
      lookbehind: !0,
      alias: "punctuation"
    },
    variable: /\$\w+/,
    "function-definition": {
      pattern: /(\bfn\s+)\w+/,
      lookbehind: !0,
      alias: "function"
    },
    "type-definition": {
      pattern: /(\b(?:enum|struct|trait|type|union)\s+)\w+/,
      lookbehind: !0,
      alias: "class-name"
    },
    "module-declaration": [{
      pattern: /(\b(?:crate|mod)\s+)[a-z][a-z_\d]*/,
      lookbehind: !0,
      alias: "namespace"
    }, {
      pattern: /(\b(?:crate|self|super)\s*)::\s*[a-z][a-z_\d]*\b(?:\s*::(?:\s*[a-z][a-z_\d]*\s*::)*)?/,
      lookbehind: !0,
      alias: "namespace",
      inside: {
        punctuation: /::/
      }
    }],
    keyword: [/\b(?:Self|abstract|as|async|await|become|box|break|const|continue|crate|do|dyn|else|enum|extern|final|fn|for|if|impl|in|let|loop|macro|match|mod|move|mut|override|priv|pub|ref|return|self|static|struct|super|trait|try|type|typeof|union|unsafe|unsized|use|virtual|where|while|yield)\b/, /\b(?:bool|char|f(?:32|64)|[ui](?:8|16|32|64|128|size)|str)\b/],
    function: /\b[a-z_]\w*(?=\s*(?:::\s*<|\())/,
    macro: {
      pattern: /\b\w+!/,
      alias: "property"
    },
    constant: /\b[A-Z_][A-Z_\d]+\b/,
    "class-name": /\b[A-Z]\w*\b/,
    namespace: {
      pattern: /(?:\b[a-z][a-z_\d]*\s*::\s*)*\b[a-z][a-z_\d]*\s*::(?!\s*<)/,
      inside: {
        punctuation: /::/
      }
    },
    number: /\b(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0o[0-7](?:_?[0-7])*|0b[01](?:_?[01])*|(?:(?:\d(?:_?\d)*)?\.)?\d(?:_?\d)*(?:[Ee][+-]?\d+)?)(?:_?(?:f32|f64|[iu](?:8|16|32|64|size)?))?\b/,
    boolean: /\b(?:false|true)\b/,
    punctuation: /->|\.\.=|\.{1,3}|::|[{}[\];(),:]/,
    operator: /[-+*\/%!^]=?|=[=>]?|&[&=]?|\|[|=]?|<<?=?|>>?=?|[@?]/
  }, e.languages.rust["closure-params"].inside.rest = e.languages.rust, e.languages.rust.attribute.inside.string = e.languages.rust.string;
}(Prism);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/webpack/buildin/global.js */ 3)))

/***/ }),

/***/ 509:
/*!*************************************************************************************************************************************************!*\
  !*** /Users/zhangzhenfeng/Documents/duyi/project/mysite-uni-app/packageA/uni_modules/zero-markdown-view/components/mp-html/highlight/config.js ***!
  \*************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  // copyByLongPress: false, // 是否需要长按代码块时显示复制代码内容菜单
  copyByClickCode: true,
  // 点击代码块复制
  showLanguageName: true // 是否在代码块右上角显示语言的名称
  // showLineNumber: false // 是否显示行号,需要重新打包mp-html
};
exports.default = _default;

/***/ }),

/***/ 510:
/*!********************************************************************************************************************************************!*\
  !*** /Users/zhangzhenfeng/Documents/duyi/project/mysite-uni-app/packageA/uni_modules/zero-markdown-view/components/mp-html/latex/index.js ***!
  \********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _katex = _interopRequireDefault(__webpack_require__(/*! ./katex.min */ 511));
/**
 * @fileoverview latex 插件
 * katex.min.js来源 https://github.com/rojer95/katex-mini
 */

function Latex() {}
Latex.prototype.onParse = function (node, vm) {
  // $...$包裹的内容为latex公式
  if (!vm.options.editable && node.type === 'text' && node.text.includes('$')) {
    var part = node.text.split(/(\${1,2})/);
    var children = [];
    var status = 0;
    for (var i = 0; i < part.length; i++) {
      if (i % 2 === 0) {
        // 文本内容
        if (part[i]) {
          if (status === 0) {
            children.push({
              type: 'text',
              text: part[i]
            });
          } else {
            if (status === 1) {
              // 行内公式
              var nodes = _katex.default.default(part[i]);
              children.push({
                name: 'span',
                attrs: {},
                l: 'T',
                f: 'display:inline-block',
                children: nodes
              });
            } else {
              // 块公式
              var _nodes = _katex.default.default(part[i], {
                displayMode: true
              });
              children.push({
                name: 'div',
                attrs: {
                  style: 'text-align:center'
                },
                children: _nodes
              });
            }
          }
        }
      } else {
        // 分隔符
        if (part[i] === '$' && part[i + 2] === '$') {
          // 行内公式
          status = 1;
          part[i + 2] = '';
        } else if (part[i] === '$$' && part[i + 2] === '$$') {
          // 块公式
          status = 2;
          part[i + 2] = '';
        } else {
          if (part[i] && part[i] !== '$$') {
            // 普通$符号
            part[i + 1] = part[i] + part[i + 1];
          }
          // 重置状态
          status = 0;
        }
      }
    }
    delete node.type;
    delete node.text;
    node.name = 'span';
    node.attrs = {};
    node.children = children;
  }
};
var _default = Latex;
exports.default = _default;

/***/ }),

/***/ 511:
/*!************************************************************************************************************************************************!*\
  !*** /Users/zhangzhenfeng/Documents/duyi/project/mysite-uni-app/packageA/uni_modules/zero-markdown-view/components/mp-html/latex/katex.min.js ***!
  \************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ 13));
function t() {
  return function (e) {
    var t = {};
    function r(n) {
      if (t[n]) return t[n].exports;
      var a = t[n] = {
        i: n,
        l: !1,
        exports: {}
      };
      return e[n].call(a.exports, a, a.exports, r), a.l = !0, a.exports;
    }
    return r.m = e, r.c = t, r.d = function (e, t, n) {
      r.o(e, t) || Object.defineProperty(e, t, {
        enumerable: !0,
        get: n
      });
    }, r.r = function (e) {
      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
        value: "Module"
      }), Object.defineProperty(e, "__esModule", {
        value: !0
      });
    }, r.t = function (e, t) {
      if (1 & t && (e = r(e)), 8 & t) return e;
      if (4 & t && "object" == (0, _typeof2.default)(e) && e && e.__esModule) return e;
      var n = Object.create(null);
      if (r.r(n), Object.defineProperty(n, "default", {
        enumerable: !0,
        value: e
      }), 2 & t && "string" != typeof e) for (var a in e) {
        r.d(n, a, function (t) {
          return e[t];
        }.bind(null, a));
      }
      return n;
    }, r.n = function (e) {
      var t = e && e.__esModule ? function () {
        return e.default;
      } : function () {
        return e;
      };
      return r.d(t, "a", t), t;
    }, r.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }, r.p = "", r(r.s = 0);
  }([function (e, t, r) {
    "use strict";

    var n = this && this.__assign || function () {
        return (n = Object.assign || function (e) {
          for (var t, r = 1, n = arguments.length; r < n; r++) {
            for (var a in t = arguments[r]) {
              Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
            }
          }
          return e;
        }).apply(this, arguments);
      },
      a = this && this.__importDefault || function (e) {
        return e && e.__esModule ? e : {
          default: e
        };
      };
    Object.defineProperty(t, "__esModule", {
      value: !0
    }), t.createClass = void 0;
    var i = a(r(1));
    r(2);
    var o = /([A-Z])/g,
      s = {
        "&": "&amp;",
        ">": "&gt;",
        "<": "&lt;",
        '"': "&quot;",
        "'": "&#x27;"
      },
      l = /[&><"']/g;
    function h(e) {
      return String(e).replace(l, function (e) {
        return s[e];
      });
    }
    var c = function c(e) {
      return "data:image/svg+xml," + encodeURIComponent(e.replace(/\s+/g, " "));
    };
    t.createClass = function (e) {
      var t;
      return null !== (t = null == e ? void 0 : e.filter(function (e) {
        return e;
      }).join(" ")) && void 0 !== t ? t : "";
    };
    var m = function m(e, r) {
      return e.map(function (e) {
        var n,
          a = r;
        (null === (n = null == e ? void 0 : e.style) || void 0 === n ? void 0 : n.color) && (a = e.style.color);
        var s = void 0;
        e instanceof i.default.__domTree.Span && (s = "span"), e instanceof i.default.__domTree.Anchor && (s = "anchor"), e instanceof i.default.__domTree.LineNode && (s = "line"), e instanceof i.default.__domTree.PathNode && (s = "path"), e instanceof i.default.__domTree.SvgNode && (s = "svg", a && (e.attributes.fill = a)), e instanceof i.default.__domTree.SymbolNode && (s = "text");
        var l = e.children && e.children.length > 0 ? m(e.children, a) : [];
        return s ? function (e, r, n) {
          var a = !1;
          r.classes && r.classes.length > 0 && (a = !0);
          var i,
            s = h((0, t.createClass)(r.classes)),
            l = "";
          for (var m in "text" === e && r.italic > 0 && (l += "margin-right:" + r.italic + "em;"), r.style) {
            r.style.hasOwnProperty(m) && (l += "".concat((i = m, i.replace(o, "-$1").toLowerCase()), ":").concat(r.style[m], ";"));
          }
          l && (a = !0);
          var u = {};
          for (var p in r.attributes) {
            r.attributes.hasOwnProperty(p) && (u[p] = h(r.attributes[p]));
          }
          if ("span" === e) return {
            name: "span",
            attrs: {
              class: s + " katex-span",
              style: l
            },
            children: n
          };
          if ("text" === e) {
            var d = h(r.text);
            return a ? {
              name: "span",
              attrs: {
                class: s,
                style: l
              },
              children: [{
                type: "text",
                text: d
              }]
            } : {
              type: "text",
              text: d
            };
          }
          if ("svg" === e) {
            var f = r.toMarkup();
            return {
              name: "img",
              attrs: {
                src: c(f),
                class: "katex-svg"
              }
            };
          }
          return null;
        }(s, e, l) : l;
      }).reduce(function (e, t) {
        return Array.isArray(t) ? e.push.apply(e, t) : e.push(t), e;
      }, []).filter(function (e) {
        return !!e;
      });
    };
    t.default = function (e, t) {
      void 0 === t && (t = {});
      try {
        var r = i.default.__renderToDomTree(e, n(n({}, t), {
          output: "html"
        }));
        return m([r]);
      } catch (e) {
        return [{
          name: "span",
          attrs: {
            style: "color:red;"
          },
          children: [{
            type: "text",
            text: e.message
          }]
        }];
      }
    };
  }, function (e, t, r) {
    var n;
    "undefined" != typeof self && self, n = function n() {
      return function () {
        "use strict";

        var e = {
            d: function d(t, r) {
              for (var n in r) {
                e.o(r, n) && !e.o(t, n) && Object.defineProperty(t, n, {
                  enumerable: !0,
                  get: r[n]
                });
              }
            },
            o: function o(e, t) {
              return Object.prototype.hasOwnProperty.call(e, t);
            }
          },
          t = {};
        e.d(t, {
          default: function _default() {
            return Fn;
          }
        });
        var r = function e(t, r) {
          this.position = void 0;
          var n,
            a = "KaTeX parse error: " + t,
            i = r && r.loc;
          if (i && i.start <= i.end) {
            var o = i.lexer.input;
            n = i.start;
            var s = i.end;
            n === o.length ? a += " at end of input: " : a += " at position " + (n + 1) + ": ";
            var l = o.slice(n, s).replace(/[^]/g, "$&̲");
            a += (n > 15 ? "…" + o.slice(n - 15, n) : o.slice(0, n)) + l + (s + 15 < o.length ? o.slice(s, s + 15) + "…" : o.slice(s));
          }
          var h = new Error(a);
          return h.name = "ParseError", h.__proto__ = e.prototype, h.position = n, h;
        };
        r.prototype.__proto__ = Error.prototype;
        var n = r,
          a = /([A-Z])/g,
          i = {
            "&": "&amp;",
            ">": "&gt;",
            "<": "&lt;",
            '"': "&quot;",
            "'": "&#x27;"
          },
          o = /[&><"']/g,
          s = function e(t) {
            return "ordgroup" === t.type || "color" === t.type ? 1 === t.body.length ? e(t.body[0]) : t : "font" === t.type ? e(t.body) : t;
          },
          l = {
            contains: function contains(e, t) {
              return -1 !== e.indexOf(t);
            },
            deflt: function deflt(e, t) {
              return void 0 === e ? t : e;
            },
            escape: function escape(e) {
              return String(e).replace(o, function (e) {
                return i[e];
              });
            },
            hyphenate: function hyphenate(e) {
              return e.replace(a, "-$1").toLowerCase();
            },
            getBaseElem: s,
            isCharacterBox: function isCharacterBox(e) {
              var t = s(e);
              return "mathord" === t.type || "textord" === t.type || "atom" === t.type;
            },
            protocolFromUrl: function protocolFromUrl(e) {
              var t = /^\s*([^\\/#]*?)(?::|&#0*58|&#x0*3a)/i.exec(e);
              return null != t ? t[1] : "_relative";
            }
          },
          h = {
            displayMode: {
              type: "boolean",
              description: "Render math in display mode, which puts the math in display style (so \\int and \\sum are large, for example), and centers the math on the page on its own line.",
              cli: "-d, --display-mode"
            },
            output: {
              type: {
                enum: ["htmlAndMathml", "html", "mathml"]
              },
              description: "Determines the markup language of the output.",
              cli: "-F, --format <type>"
            },
            leqno: {
              type: "boolean",
              description: "Render display math in leqno style (left-justified tags)."
            },
            fleqn: {
              type: "boolean",
              description: "Render display math flush left."
            },
            throwOnError: {
              type: "boolean",
              default: !0,
              cli: "-t, --no-throw-on-error",
              cliDescription: "Render errors (in the color given by --error-color) instead of throwing a ParseError exception when encountering an error."
            },
            errorColor: {
              type: "string",
              default: "#cc0000",
              cli: "-c, --error-color <color>",
              cliDescription: "A color string given in the format 'rgb' or 'rrggbb' (no #). This option determines the color of errors rendered by the -t option.",
              cliProcessor: function cliProcessor(e) {
                return "#" + e;
              }
            },
            macros: {
              type: "object",
              cli: "-m, --macro <def>",
              cliDescription: "Define custom macro of the form '\\foo:expansion' (use multiple -m arguments for multiple macros).",
              cliDefault: [],
              cliProcessor: function cliProcessor(e, t) {
                return t.push(e), t;
              }
            },
            minRuleThickness: {
              type: "number",
              description: "Specifies a minimum thickness, in ems, for fraction lines, `\\sqrt` top lines, `{array}` vertical lines, `\\hline`, `\\hdashline`, `\\underline`, `\\overline`, and the borders of `\\fbox`, `\\boxed`, and `\\fcolorbox`.",
              processor: function processor(e) {
                return Math.max(0, e);
              },
              cli: "--min-rule-thickness <size>",
              cliProcessor: parseFloat
            },
            colorIsTextColor: {
              type: "boolean",
              description: "Makes \\color behave like LaTeX's 2-argument \\textcolor, instead of LaTeX's one-argument \\color mode change.",
              cli: "-b, --color-is-text-color"
            },
            strict: {
              type: [{
                enum: ["warn", "ignore", "error"]
              }, "boolean", "function"],
              description: "Turn on strict / LaTeX faithfulness mode, which throws an error if the input uses features that are not supported by LaTeX.",
              cli: "-S, --strict",
              cliDefault: !1
            },
            trust: {
              type: ["boolean", "function"],
              description: "Trust the input, enabling all HTML features such as \\url.",
              cli: "-T, --trust"
            },
            maxSize: {
              type: "number",
              default: 1 / 0,
              description: "If non-zero, all user-specified sizes, e.g. in \\rule{500em}{500em}, will be capped to maxSize ems. Otherwise, elements and spaces can be arbitrarily large",
              processor: function processor(e) {
                return Math.max(0, e);
              },
              cli: "-s, --max-size <n>",
              cliProcessor: parseInt
            },
            maxExpand: {
              type: "number",
              default: 1e3,
              description: "Limit the number of macro expansions to the specified number, to prevent e.g. infinite macro loops. If set to Infinity, the macro expander will try to fully expand as in LaTeX.",
              processor: function processor(e) {
                return Math.max(0, e);
              },
              cli: "-e, --max-expand <n>",
              cliProcessor: function cliProcessor(e) {
                return "Infinity" === e ? 1 / 0 : parseInt(e);
              }
            },
            globalGroup: {
              type: "boolean",
              cli: !1
            }
          };
        function c(e) {
          if (e.default) return e.default;
          var t = e.type,
            r = Array.isArray(t) ? t[0] : t;
          if ("string" != typeof r) return r.enum[0];
          switch (r) {
            case "boolean":
              return !1;
            case "string":
              return "";
            case "number":
              return 0;
            case "object":
              return {};
          }
        }
        var m = function () {
            function e(e) {
              for (var t in this.displayMode = void 0, this.output = void 0, this.leqno = void 0, this.fleqn = void 0, this.throwOnError = void 0, this.errorColor = void 0, this.macros = void 0, this.minRuleThickness = void 0, this.colorIsTextColor = void 0, this.strict = void 0, this.trust = void 0, this.maxSize = void 0, this.maxExpand = void 0, this.globalGroup = void 0, e = e || {}, h) {
                if (h.hasOwnProperty(t)) {
                  var r = h[t];
                  this[t] = void 0 !== e[t] ? r.processor ? r.processor(e[t]) : e[t] : c(r);
                }
              }
            }
            var t = e.prototype;
            return t.reportNonstrict = function (e, t, r) {
              var a = this.strict;
              if ("function" == typeof a && (a = a(e, t, r)), a && "ignore" !== a) {
                if (!0 === a || "error" === a) throw new n("LaTeX-incompatible input and strict mode is set to 'error': " + t + " [" + e + "]", r);
                "warn" === a ? "undefined" != typeof console && console.warn("LaTeX-incompatible input and strict mode is set to 'warn': " + t + " [" + e + "]") : "undefined" != typeof console && console.warn("LaTeX-incompatible input and strict mode is set to unrecognized '" + a + "': " + t + " [" + e + "]");
              }
            }, t.useStrictBehavior = function (e, t, r) {
              var n = this.strict;
              if ("function" == typeof n) try {
                n = n(e, t, r);
              } catch (e) {
                n = "error";
              }
              return !(!n || "ignore" === n || !0 !== n && "error" !== n && ("warn" === n ? ("undefined" != typeof console && console.warn("LaTeX-incompatible input and strict mode is set to 'warn': " + t + " [" + e + "]"), 1) : ("undefined" != typeof console && console.warn("LaTeX-incompatible input and strict mode is set to unrecognized '" + n + "': " + t + " [" + e + "]"), 1)));
            }, t.isTrusted = function (e) {
              e.url && !e.protocol && (e.protocol = l.protocolFromUrl(e.url));
              var t = "function" == typeof this.trust ? this.trust(e) : this.trust;
              return Boolean(t);
            }, e;
          }(),
          u = function () {
            function e(e, t, r) {
              this.id = void 0, this.size = void 0, this.cramped = void 0, this.id = e, this.size = t, this.cramped = r;
            }
            var t = e.prototype;
            return t.sup = function () {
              return p[d[this.id]];
            }, t.sub = function () {
              return p[f[this.id]];
            }, t.fracNum = function () {
              return p[g[this.id]];
            }, t.fracDen = function () {
              return p[v[this.id]];
            }, t.cramp = function () {
              return p[y[this.id]];
            }, t.text = function () {
              return p[b[this.id]];
            }, t.isTight = function () {
              return this.size >= 2;
            }, e;
          }(),
          p = [new u(0, 0, !1), new u(1, 0, !0), new u(2, 1, !1), new u(3, 1, !0), new u(4, 2, !1), new u(5, 2, !0), new u(6, 3, !1), new u(7, 3, !0)],
          d = [4, 5, 4, 5, 6, 7, 6, 7],
          f = [5, 5, 5, 5, 7, 7, 7, 7],
          g = [2, 3, 4, 5, 6, 7, 6, 7],
          v = [3, 3, 5, 5, 7, 7, 7, 7],
          y = [1, 1, 3, 3, 5, 5, 7, 7],
          b = [0, 1, 2, 3, 2, 3, 2, 3],
          x = {
            DISPLAY: p[0],
            TEXT: p[2],
            SCRIPT: p[4],
            SCRIPTSCRIPT: p[6]
          },
          w = [{
            name: "latin",
            blocks: [[256, 591], [768, 879]]
          }, {
            name: "cyrillic",
            blocks: [[1024, 1279]]
          }, {
            name: "armenian",
            blocks: [[1328, 1423]]
          }, {
            name: "brahmic",
            blocks: [[2304, 4255]]
          }, {
            name: "georgian",
            blocks: [[4256, 4351]]
          }, {
            name: "cjk",
            blocks: [[12288, 12543], [19968, 40879], [65280, 65376]]
          }, {
            name: "hangul",
            blocks: [[44032, 55215]]
          }],
          k = [];
        function S(e) {
          for (var t = 0; t < k.length; t += 2) {
            if (e >= k[t] && e <= k[t + 1]) return !0;
          }
          return !1;
        }
        w.forEach(function (e) {
          return e.blocks.forEach(function (e) {
            return k.push.apply(k, e);
          });
        });
        var M = {
            doubleleftarrow: "M262 157\nl10-10c34-36 62.7-77 86-123 3.3-8 5-13.3 5-16 0-5.3-6.7-8-20-8-7.3\n 0-12.2.5-14.5 1.5-2.3 1-4.8 4.5-7.5 10.5-49.3 97.3-121.7 169.3-217 216-28\n 14-57.3 25-88 33-6.7 2-11 3.8-13 5.5-2 1.7-3 4.2-3 7.5s1 5.8 3 7.5\nc2 1.7 6.3 3.5 13 5.5 68 17.3 128.2 47.8 180.5 91.5 52.3 43.7 93.8 96.2 124.5\n 157.5 9.3 8 15.3 12.3 18 13h6c12-.7 18-4 18-10 0-2-1.7-7-5-15-23.3-46-52-87\n-86-123l-10-10h399738v-40H218c328 0 0 0 0 0l-10-8c-26.7-20-65.7-43-117-69 2.7\n-2 6-3.7 10-5 36.7-16 72.3-37.3 107-64l10-8h399782v-40z\nm8 0v40h399730v-40zm0 194v40h399730v-40z",
            doublerightarrow: "M399738 392l\n-10 10c-34 36-62.7 77-86 123-3.3 8-5 13.3-5 16 0 5.3 6.7 8 20 8 7.3 0 12.2-.5\n 14.5-1.5 2.3-1 4.8-4.5 7.5-10.5 49.3-97.3 121.7-169.3 217-216 28-14 57.3-25 88\n-33 6.7-2 11-3.8 13-5.5 2-1.7 3-4.2 3-7.5s-1-5.8-3-7.5c-2-1.7-6.3-3.5-13-5.5-68\n-17.3-128.2-47.8-180.5-91.5-52.3-43.7-93.8-96.2-124.5-157.5-9.3-8-15.3-12.3-18\n-13h-6c-12 .7-18 4-18 10 0 2 1.7 7 5 15 23.3 46 52 87 86 123l10 10H0v40h399782\nc-328 0 0 0 0 0l10 8c26.7 20 65.7 43 117 69-2.7 2-6 3.7-10 5-36.7 16-72.3 37.3\n-107 64l-10 8H0v40zM0 157v40h399730v-40zm0 194v40h399730v-40z",
            leftarrow: "M400000 241H110l3-3c68.7-52.7 113.7-120\n 135-202 4-14.7 6-23 6-25 0-7.3-7-11-21-11-8 0-13.2.8-15.5 2.5-2.3 1.7-4.2 5.8\n-5.5 12.5-1.3 4.7-2.7 10.3-4 17-12 48.7-34.8 92-68.5 130S65.3 228.3 18 247\nc-10 4-16 7.7-18 11 0 8.7 6 14.3 18 17 47.3 18.7 87.8 47 121.5 85S196 441.3 208\n 490c.7 2 1.3 5 2 9s1.2 6.7 1.5 8c.3 1.3 1 3.3 2 6s2.2 4.5 3.5 5.5c1.3 1 3.3\n 1.8 6 2.5s6 1 10 1c14 0 21-3.7 21-11 0-2-2-10.3-6-25-20-79.3-65-146.7-135-202\n l-3-3h399890zM100 241v40h399900v-40z",
            leftbrace: "M6 548l-6-6v-35l6-11c56-104 135.3-181.3 238-232 57.3-28.7 117\n-45 179-50h399577v120H403c-43.3 7-81 15-113 26-100.7 33-179.7 91-237 174-2.7\n 5-6 9-10 13-.7 1-7.3 1-20 1H6z",
            leftbraceunder: "M0 6l6-6h17c12.688 0 19.313.3 20 1 4 4 7.313 8.3 10 13\n 35.313 51.3 80.813 93.8 136.5 127.5 55.688 33.7 117.188 55.8 184.5 66.5.688\n 0 2 .3 4 1 18.688 2.7 76 4.3 172 5h399450v120H429l-6-1c-124.688-8-235-61.7\n-331-161C60.687 138.7 32.312 99.3 7 54L0 41V6z",
            leftgroup: "M400000 80\nH435C64 80 168.3 229.4 21 260c-5.9 1.2-18 0-18 0-2 0-3-1-3-3v-38C76 61 257 0\n 435 0h399565z",
            leftgroupunder: "M400000 262\nH435C64 262 168.3 112.6 21 82c-5.9-1.2-18 0-18 0-2 0-3 1-3 3v38c76 158 257 219\n 435 219h399565z",
            leftharpoon: "M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3\n-3.3 10.2-9.5 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5\n-18.3 3-21-1.3-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7\n-196 228-6.7 4.7-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40z",
            leftharpoonplus: "M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3-3.3 10.2-9.5\n 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5-18.3 3-21-1.3\n-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7-196 228-6.7 4.7\n-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40zM0 435v40h400000v-40z\nm0 0v40h400000v-40z",
            leftharpoondown: "M7 241c-4 4-6.333 8.667-7 14 0 5.333.667 9 2 11s5.333\n 5.333 12 10c90.667 54 156 130 196 228 3.333 10.667 6.333 16.333 9 17 2 .667 5\n 1 9 1h5c10.667 0 16.667-2 18-6 2-2.667 1-9.667-3-21-32-87.333-82.667-157.667\n-152-211l-3-3h399907v-40zM93 281 H400000 v-40L7 241z",
            leftharpoondownplus: "M7 435c-4 4-6.3 8.7-7 14 0 5.3.7 9 2 11s5.3 5.3 12\n 10c90.7 54 156 130 196 228 3.3 10.7 6.3 16.3 9 17 2 .7 5 1 9 1h5c10.7 0 16.7\n-2 18-6 2-2.7 1-9.7-3-21-32-87.3-82.7-157.7-152-211l-3-3h399907v-40H7zm93 0\nv40h399900v-40zM0 241v40h399900v-40zm0 0v40h399900v-40z",
            lefthook: "M400000 281 H103s-33-11.2-61-33.5S0 197.3 0 164s14.2-61.2 42.5\n-83.5C70.8 58.2 104 47 142 47 c16.7 0 25 6.7 25 20 0 12-8.7 18.7-26 20-40 3.3\n-68.7 15.7-86 37-10 12-15 25.3-15 40 0 22.7 9.8 40.7 29.5 54 19.7 13.3 43.5 21\n 71.5 23h399859zM103 281v-40h399897v40z",
            leftlinesegment: "M40 281 V428 H0 V94 H40 V241 H400000 v40z\nM40 281 V428 H0 V94 H40 V241 H400000 v40z",
            leftmapsto: "M40 281 V448H0V74H40V241H400000v40z\nM40 281 V448H0V74H40V241H400000v40z",
            leftToFrom: "M0 147h400000v40H0zm0 214c68 40 115.7 95.7 143 167h22c15.3 0 23\n-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69-70-101l-7-8h399905v-40H95l7-8\nc28.7-32 52-65.7 70-101 10.7-23.3 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 265.3\n 68 321 0 361zm0-174v-40h399900v40zm100 154v40h399900v-40z",
            longequal: "M0 50 h400000 v40H0z m0 194h40000v40H0z\nM0 50 h400000 v40H0z m0 194h40000v40H0z",
            midbrace: "M200428 334\nc-100.7-8.3-195.3-44-280-108-55.3-42-101.7-93-139-153l-9-14c-2.7 4-5.7 8.7-9 14\n-53.3 86.7-123.7 153-211 199-66.7 36-137.3 56.3-212 62H0V214h199568c178.3-11.7\n 311.7-78.3 403-201 6-8 9.7-12 11-12 .7-.7 6.7-1 18-1s17.3.3 18 1c1.3 0 5 4 11\n 12 44.7 59.3 101.3 106.3 170 141s145.3 54.3 229 60h199572v120z",
            midbraceunder: "M199572 214\nc100.7 8.3 195.3 44 280 108 55.3 42 101.7 93 139 153l9 14c2.7-4 5.7-8.7 9-14\n 53.3-86.7 123.7-153 211-199 66.7-36 137.3-56.3 212-62h199568v120H200432c-178.3\n 11.7-311.7 78.3-403 201-6 8-9.7 12-11 12-.7.7-6.7 1-18 1s-17.3-.3-18-1c-1.3 0\n-5-4-11-12-44.7-59.3-101.3-106.3-170-141s-145.3-54.3-229-60H0V214z",
            oiintSize1: "M512.6 71.6c272.6 0 320.3 106.8 320.3 178.2 0 70.8-47.7 177.6\n-320.3 177.6S193.1 320.6 193.1 249.8c0-71.4 46.9-178.2 319.5-178.2z\nm368.1 178.2c0-86.4-60.9-215.4-368.1-215.4-306.4 0-367.3 129-367.3 215.4 0 85.8\n60.9 214.8 367.3 214.8 307.2 0 368.1-129 368.1-214.8z",
            oiintSize2: "M757.8 100.1c384.7 0 451.1 137.6 451.1 230 0 91.3-66.4 228.8\n-451.1 228.8-386.3 0-452.7-137.5-452.7-228.8 0-92.4 66.4-230 452.7-230z\nm502.4 230c0-111.2-82.4-277.2-502.4-277.2s-504 166-504 277.2\nc0 110 84 276 504 276s502.4-166 502.4-276z",
            oiiintSize1: "M681.4 71.6c408.9 0 480.5 106.8 480.5 178.2 0 70.8-71.6 177.6\n-480.5 177.6S202.1 320.6 202.1 249.8c0-71.4 70.5-178.2 479.3-178.2z\nm525.8 178.2c0-86.4-86.8-215.4-525.7-215.4-437.9 0-524.7 129-524.7 215.4 0\n85.8 86.8 214.8 524.7 214.8 438.9 0 525.7-129 525.7-214.8z",
            oiiintSize2: "M1021.2 53c603.6 0 707.8 165.8 707.8 277.2 0 110-104.2 275.8\n-707.8 275.8-606 0-710.2-165.8-710.2-275.8C311 218.8 415.2 53 1021.2 53z\nm770.4 277.1c0-131.2-126.4-327.6-770.5-327.6S248.4 198.9 248.4 330.1\nc0 130 128.8 326.4 772.7 326.4s770.5-196.4 770.5-326.4z",
            rightarrow: "M0 241v40h399891c-47.3 35.3-84 78-110 128\n-16.7 32-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20\n 11 8 0 13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7\n 39-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85\n-40.5-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5\n-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67\n 151.7 139 205zm0 0v40h399900v-40z",
            rightbrace: "M400000 542l\n-6 6h-17c-12.7 0-19.3-.3-20-1-4-4-7.3-8.3-10-13-35.3-51.3-80.8-93.8-136.5-127.5\ns-117.2-55.8-184.5-66.5c-.7 0-2-.3-4-1-18.7-2.7-76-4.3-172-5H0V214h399571l6 1\nc124.7 8 235 61.7 331 161 31.3 33.3 59.7 72.7 85 118l7 13v35z",
            rightbraceunder: "M399994 0l6 6v35l-6 11c-56 104-135.3 181.3-238 232-57.3\n 28.7-117 45-179 50H-300V214h399897c43.3-7 81-15 113-26 100.7-33 179.7-91 237\n-174 2.7-5 6-9 10-13 .7-1 7.3-1 20-1h17z",
            rightgroup: "M0 80h399565c371 0 266.7 149.4 414 180 5.9 1.2 18 0 18 0 2 0\n 3-1 3-3v-38c-76-158-257-219-435-219H0z",
            rightgroupunder: "M0 262h399565c371 0 266.7-149.4 414-180 5.9-1.2 18 0 18\n 0 2 0 3 1 3 3v38c-76 158-257 219-435 219H0z",
            rightharpoon: "M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3\n-3.7-15.3-11-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2\n-10.7 0-16.7 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58\n 69.2 92 94.5zm0 0v40h399900v-40z",
            rightharpoonplus: "M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3-3.7-15.3-11\n-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2-10.7 0-16.7\n 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58 69.2 92 94.5z\nm0 0v40h399900v-40z m100 194v40h399900v-40zm0 0v40h399900v-40z",
            rightharpoondown: "M399747 511c0 7.3 6.7 11 20 11 8 0 13-.8 15-2.5s4.7-6.8\n 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3 8.5-5.8 9.5\n-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3-64.7 57-92 95\n-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 241v40h399900v-40z",
            rightharpoondownplus: "M399747 705c0 7.3 6.7 11 20 11 8 0 13-.8\n 15-2.5s4.7-6.8 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3\n 8.5-5.8 9.5-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3\n-64.7 57-92 95-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 435v40h399900v-40z\nm0-194v40h400000v-40zm0 0v40h400000v-40z",
            righthook: "M399859 241c-764 0 0 0 0 0 40-3.3 68.7-15.7 86-37 10-12 15-25.3\n 15-40 0-22.7-9.8-40.7-29.5-54-19.7-13.3-43.5-21-71.5-23-17.3-1.3-26-8-26-20 0\n-13.3 8.7-20 26-20 38 0 71 11.2 99 33.5 0 0 7 5.6 21 16.7 14 11.2 21 33.5 21\n 66.8s-14 61.2-42 83.5c-28 22.3-61 33.5-99 33.5L0 241z M0 281v-40h399859v40z",
            rightlinesegment: "M399960 241 V94 h40 V428 h-40 V281 H0 v-40z\nM399960 241 V94 h40 V428 h-40 V281 H0 v-40z",
            rightToFrom: "M400000 167c-70.7-42-118-97.7-142-167h-23c-15.3 0-23 .3-23\n 1 0 1.3 5.3 13.7 16 37 18 35.3 41.3 69 70 101l7 8H0v40h399905l-7 8c-28.7 32\n-52 65.7-70 101-10.7 23.3-16 35.7-16 37 0 .7 7.7 1 23 1h23c24-69.3 71.3-125 142\n-167z M100 147v40h399900v-40zM0 341v40h399900v-40z",
            twoheadleftarrow: "M0 167c68 40\n 115.7 95.7 143 167h22c15.3 0 23-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69\n-70-101l-7-8h125l9 7c50.7 39.3 85 86 103 140h46c0-4.7-6.3-18.7-19-42-18-35.3\n-40-67.3-66-96l-9-9h399716v-40H284l9-9c26-28.7 48-60.7 66-96 12.7-23.333 19\n-37.333 19-42h-46c-18 54-52.3 100.7-103 140l-9 7H95l7-8c28.7-32 52-65.7 70-101\n 10.7-23.333 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 71.3 68 127 0 167z",
            twoheadrightarrow: "M400000 167\nc-68-40-115.7-95.7-143-167h-22c-15.3 0-23 .3-23 1 0 1.3 5.3 13.7 16 37 18 35.3\n 41.3 69 70 101l7 8h-125l-9-7c-50.7-39.3-85-86-103-140h-46c0 4.7 6.3 18.7 19 42\n 18 35.3 40 67.3 66 96l9 9H0v40h399716l-9 9c-26 28.7-48 60.7-66 96-12.7 23.333\n-19 37.333-19 42h46c18-54 52.3-100.7 103-140l9-7h125l-7 8c-28.7 32-52 65.7-70\n 101-10.7 23.333-16 35.7-16 37 0 .7 7.7 1 23 1h22c27.3-71.3 75-127 143-167z",
            tilde1: "M200 55.538c-77 0-168 73.953-177 73.953-3 0-7\n-2.175-9-5.437L2 97c-1-2-2-4-2-6 0-4 2-7 5-9l20-12C116 12 171 0 207 0c86 0\n 114 68 191 68 78 0 168-68 177-68 4 0 7 2 9 5l12 19c1 2.175 2 4.35 2 6.525 0\n 4.35-2 7.613-5 9.788l-19 13.05c-92 63.077-116.937 75.308-183 76.128\n-68.267.847-113-73.952-191-73.952z",
            tilde2: "M344 55.266c-142 0-300.638 81.316-311.5 86.418\n-8.01 3.762-22.5 10.91-23.5 5.562L1 120c-1-2-1-3-1-4 0-5 3-9 8-10l18.4-9C160.9\n 31.9 283 0 358 0c148 0 188 122 331 122s314-97 326-97c4 0 8 2 10 7l7 21.114\nc1 2.14 1 3.21 1 4.28 0 5.347-3 9.626-7 10.696l-22.3 12.622C852.6 158.372 751\n 181.476 676 181.476c-149 0-189-126.21-332-126.21z",
            tilde3: "M786 59C457 59 32 175.242 13 175.242c-6 0-10-3.457\n-11-10.37L.15 138c-1-7 3-12 10-13l19.2-6.4C378.4 40.7 634.3 0 804.3 0c337 0\n 411.8 157 746.8 157 328 0 754-112 773-112 5 0 10 3 11 9l1 14.075c1 8.066-.697\n 16.595-6.697 17.492l-21.052 7.31c-367.9 98.146-609.15 122.696-778.15 122.696\n -338 0-409-156.573-744-156.573z",
            tilde4: "M786 58C457 58 32 177.487 13 177.487c-6 0-10-3.345\n-11-10.035L.15 143c-1-7 3-12 10-13l22-6.7C381.2 35 637.15 0 807.15 0c337 0 409\n 177 744 177 328 0 754-127 773-127 5 0 10 3 11 9l1 14.794c1 7.805-3 13.38-9\n 14.495l-20.7 5.574c-366.85 99.79-607.3 139.372-776.3 139.372-338 0-409\n -175.236-744-175.236z",
            vec: "M377 20c0-5.333 1.833-10 5.5-14S391 0 397 0c4.667 0 8.667 1.667 12 5\n3.333 2.667 6.667 9 10 19 6.667 24.667 20.333 43.667 41 57 7.333 4.667 11\n10.667 11 18 0 6-1 10-3 12s-6.667 5-14 9c-28.667 14.667-53.667 35.667-75 63\n-1.333 1.333-3.167 3.5-5.5 6.5s-4 4.833-5 5.5c-1 .667-2.5 1.333-4.5 2s-4.333 1\n-7 1c-4.667 0-9.167-1.833-13.5-5.5S337 184 337 178c0-12.667 15.667-32.333 47-59\nH213l-171-1c-8.667-6-13-12.333-13-19 0-4.667 4.333-11.333 13-20h359\nc-16-25.333-24-45-24-59z",
            widehat1: "M529 0h5l519 115c5 1 9 5 9 10 0 1-1 2-1 3l-4 22\nc-1 5-5 9-11 9h-2L532 67 19 159h-2c-5 0-9-4-11-9l-5-22c-1-6 2-12 8-13z",
            widehat2: "M1181 0h2l1171 176c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 220h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z",
            widehat3: "M1181 0h2l1171 236c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 280h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z",
            widehat4: "M1181 0h2l1171 296c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 340h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z",
            widecheck1: "M529,159h5l519,-115c5,-1,9,-5,9,-10c0,-1,-1,-2,-1,-3l-4,-22c-1,\n-5,-5,-9,-11,-9h-2l-512,92l-513,-92h-2c-5,0,-9,4,-11,9l-5,22c-1,6,2,12,8,13z",
            widecheck2: "M1181,220h2l1171,-176c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,153l-1167,-153h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z",
            widecheck3: "M1181,280h2l1171,-236c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,213l-1167,-213h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z",
            widecheck4: "M1181,340h2l1171,-296c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,273l-1167,-273h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z",
            baraboveleftarrow: "M400000 620h-399890l3 -3c68.7 -52.7 113.7 -120 135 -202\nc4 -14.7 6 -23 6 -25c0 -7.3 -7 -11 -21 -11c-8 0 -13.2 0.8 -15.5 2.5\nc-2.3 1.7 -4.2 5.8 -5.5 12.5c-1.3 4.7 -2.7 10.3 -4 17c-12 48.7 -34.8 92 -68.5 130\ns-74.2 66.3 -121.5 85c-10 4 -16 7.7 -18 11c0 8.7 6 14.3 18 17c47.3 18.7 87.8 47\n121.5 85s56.5 81.3 68.5 130c0.7 2 1.3 5 2 9s1.2 6.7 1.5 8c0.3 1.3 1 3.3 2 6\ns2.2 4.5 3.5 5.5c1.3 1 3.3 1.8 6 2.5s6 1 10 1c14 0 21 -3.7 21 -11\nc0 -2 -2 -10.3 -6 -25c-20 -79.3 -65 -146.7 -135 -202l-3 -3h399890z\nM100 620v40h399900v-40z M0 241v40h399900v-40zM0 241v40h399900v-40z",
            rightarrowabovebar: "M0 241v40h399891c-47.3 35.3-84 78-110 128-16.7 32\n-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20 11 8 0\n13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7 39\n-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85-40.5\n-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5\n-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67\n151.7 139 205zm96 379h399894v40H0zm0 0h399904v40H0z",
            baraboveshortleftharpoon: "M507,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11\nc1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17\nc2,0.7,5,1,9,1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21\nc-32,-87.3,-82.7,-157.7,-152,-211c0,0,-3,-3,-3,-3l399351,0l0,-40\nc-398570,0,-399437,0,-399437,0z M593 435 v40 H399500 v-40z\nM0 281 v-40 H399908 v40z M0 281 v-40 H399908 v40z",
            rightharpoonaboveshortbar: "M0,241 l0,40c399126,0,399993,0,399993,0\nc4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,\n-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6\nc-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z\nM0 241 v40 H399908 v-40z M0 475 v-40 H399500 v40z M0 475 v-40 H399500 v40z",
            shortbaraboveleftharpoon: "M7,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11\nc1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17c2,0.7,5,1,9,\n1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21c-32,-87.3,-82.7,-157.7,\n-152,-211c0,0,-3,-3,-3,-3l399907,0l0,-40c-399126,0,-399993,0,-399993,0z\nM93 435 v40 H400000 v-40z M500 241 v40 H400000 v-40z M500 241 v40 H400000 v-40z",
            shortrightharpoonabovebar: "M53,241l0,40c398570,0,399437,0,399437,0\nc4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,\n-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6\nc-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z\nM500 241 v40 H399408 v-40z M500 435 v40 H400000 v-40z"
          },
          z = function () {
            function e(e) {
              this.children = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.maxFontSize = void 0, this.style = void 0, this.children = e, this.classes = [], this.height = 0, this.depth = 0, this.maxFontSize = 0, this.style = {};
            }
            var t = e.prototype;
            return t.hasClass = function (e) {
              return l.contains(this.classes, e);
            }, t.toNode = function () {
              for (var e = document.createDocumentFragment(), t = 0; t < this.children.length; t++) {
                e.appendChild(this.children[t].toNode());
              }
              return e;
            }, t.toMarkup = function () {
              for (var e = "", t = 0; t < this.children.length; t++) {
                e += this.children[t].toMarkup();
              }
              return e;
            }, t.toText = function () {
              var e = function e(_e2) {
                return _e2.toText();
              };
              return this.children.map(e).join("");
            }, e;
          }(),
          A = {
            "AMS-Regular": {
              32: [0, 0, 0, 0, .25],
              65: [0, .68889, 0, 0, .72222],
              66: [0, .68889, 0, 0, .66667],
              67: [0, .68889, 0, 0, .72222],
              68: [0, .68889, 0, 0, .72222],
              69: [0, .68889, 0, 0, .66667],
              70: [0, .68889, 0, 0, .61111],
              71: [0, .68889, 0, 0, .77778],
              72: [0, .68889, 0, 0, .77778],
              73: [0, .68889, 0, 0, .38889],
              74: [.16667, .68889, 0, 0, .5],
              75: [0, .68889, 0, 0, .77778],
              76: [0, .68889, 0, 0, .66667],
              77: [0, .68889, 0, 0, .94445],
              78: [0, .68889, 0, 0, .72222],
              79: [.16667, .68889, 0, 0, .77778],
              80: [0, .68889, 0, 0, .61111],
              81: [.16667, .68889, 0, 0, .77778],
              82: [0, .68889, 0, 0, .72222],
              83: [0, .68889, 0, 0, .55556],
              84: [0, .68889, 0, 0, .66667],
              85: [0, .68889, 0, 0, .72222],
              86: [0, .68889, 0, 0, .72222],
              87: [0, .68889, 0, 0, 1],
              88: [0, .68889, 0, 0, .72222],
              89: [0, .68889, 0, 0, .72222],
              90: [0, .68889, 0, 0, .66667],
              107: [0, .68889, 0, 0, .55556],
              160: [0, 0, 0, 0, .25],
              165: [0, .675, .025, 0, .75],
              174: [.15559, .69224, 0, 0, .94666],
              240: [0, .68889, 0, 0, .55556],
              295: [0, .68889, 0, 0, .54028],
              710: [0, .825, 0, 0, 2.33334],
              732: [0, .9, 0, 0, 2.33334],
              770: [0, .825, 0, 0, 2.33334],
              771: [0, .9, 0, 0, 2.33334],
              989: [.08167, .58167, 0, 0, .77778],
              1008: [0, .43056, .04028, 0, .66667],
              8245: [0, .54986, 0, 0, .275],
              8463: [0, .68889, 0, 0, .54028],
              8487: [0, .68889, 0, 0, .72222],
              8498: [0, .68889, 0, 0, .55556],
              8502: [0, .68889, 0, 0, .66667],
              8503: [0, .68889, 0, 0, .44445],
              8504: [0, .68889, 0, 0, .66667],
              8513: [0, .68889, 0, 0, .63889],
              8592: [-.03598, .46402, 0, 0, .5],
              8594: [-.03598, .46402, 0, 0, .5],
              8602: [-.13313, .36687, 0, 0, 1],
              8603: [-.13313, .36687, 0, 0, 1],
              8606: [.01354, .52239, 0, 0, 1],
              8608: [.01354, .52239, 0, 0, 1],
              8610: [.01354, .52239, 0, 0, 1.11111],
              8611: [.01354, .52239, 0, 0, 1.11111],
              8619: [0, .54986, 0, 0, 1],
              8620: [0, .54986, 0, 0, 1],
              8621: [-.13313, .37788, 0, 0, 1.38889],
              8622: [-.13313, .36687, 0, 0, 1],
              8624: [0, .69224, 0, 0, .5],
              8625: [0, .69224, 0, 0, .5],
              8630: [0, .43056, 0, 0, 1],
              8631: [0, .43056, 0, 0, 1],
              8634: [.08198, .58198, 0, 0, .77778],
              8635: [.08198, .58198, 0, 0, .77778],
              8638: [.19444, .69224, 0, 0, .41667],
              8639: [.19444, .69224, 0, 0, .41667],
              8642: [.19444, .69224, 0, 0, .41667],
              8643: [.19444, .69224, 0, 0, .41667],
              8644: [.1808, .675, 0, 0, 1],
              8646: [.1808, .675, 0, 0, 1],
              8647: [.1808, .675, 0, 0, 1],
              8648: [.19444, .69224, 0, 0, .83334],
              8649: [.1808, .675, 0, 0, 1],
              8650: [.19444, .69224, 0, 0, .83334],
              8651: [.01354, .52239, 0, 0, 1],
              8652: [.01354, .52239, 0, 0, 1],
              8653: [-.13313, .36687, 0, 0, 1],
              8654: [-.13313, .36687, 0, 0, 1],
              8655: [-.13313, .36687, 0, 0, 1],
              8666: [.13667, .63667, 0, 0, 1],
              8667: [.13667, .63667, 0, 0, 1],
              8669: [-.13313, .37788, 0, 0, 1],
              8672: [-.064, .437, 0, 0, 1.334],
              8674: [-.064, .437, 0, 0, 1.334],
              8705: [0, .825, 0, 0, .5],
              8708: [0, .68889, 0, 0, .55556],
              8709: [.08167, .58167, 0, 0, .77778],
              8717: [0, .43056, 0, 0, .42917],
              8722: [-.03598, .46402, 0, 0, .5],
              8724: [.08198, .69224, 0, 0, .77778],
              8726: [.08167, .58167, 0, 0, .77778],
              8733: [0, .69224, 0, 0, .77778],
              8736: [0, .69224, 0, 0, .72222],
              8737: [0, .69224, 0, 0, .72222],
              8738: [.03517, .52239, 0, 0, .72222],
              8739: [.08167, .58167, 0, 0, .22222],
              8740: [.25142, .74111, 0, 0, .27778],
              8741: [.08167, .58167, 0, 0, .38889],
              8742: [.25142, .74111, 0, 0, .5],
              8756: [0, .69224, 0, 0, .66667],
              8757: [0, .69224, 0, 0, .66667],
              8764: [-.13313, .36687, 0, 0, .77778],
              8765: [-.13313, .37788, 0, 0, .77778],
              8769: [-.13313, .36687, 0, 0, .77778],
              8770: [-.03625, .46375, 0, 0, .77778],
              8774: [.30274, .79383, 0, 0, .77778],
              8776: [-.01688, .48312, 0, 0, .77778],
              8778: [.08167, .58167, 0, 0, .77778],
              8782: [.06062, .54986, 0, 0, .77778],
              8783: [.06062, .54986, 0, 0, .77778],
              8785: [.08198, .58198, 0, 0, .77778],
              8786: [.08198, .58198, 0, 0, .77778],
              8787: [.08198, .58198, 0, 0, .77778],
              8790: [0, .69224, 0, 0, .77778],
              8791: [.22958, .72958, 0, 0, .77778],
              8796: [.08198, .91667, 0, 0, .77778],
              8806: [.25583, .75583, 0, 0, .77778],
              8807: [.25583, .75583, 0, 0, .77778],
              8808: [.25142, .75726, 0, 0, .77778],
              8809: [.25142, .75726, 0, 0, .77778],
              8812: [.25583, .75583, 0, 0, .5],
              8814: [.20576, .70576, 0, 0, .77778],
              8815: [.20576, .70576, 0, 0, .77778],
              8816: [.30274, .79383, 0, 0, .77778],
              8817: [.30274, .79383, 0, 0, .77778],
              8818: [.22958, .72958, 0, 0, .77778],
              8819: [.22958, .72958, 0, 0, .77778],
              8822: [.1808, .675, 0, 0, .77778],
              8823: [.1808, .675, 0, 0, .77778],
              8828: [.13667, .63667, 0, 0, .77778],
              8829: [.13667, .63667, 0, 0, .77778],
              8830: [.22958, .72958, 0, 0, .77778],
              8831: [.22958, .72958, 0, 0, .77778],
              8832: [.20576, .70576, 0, 0, .77778],
              8833: [.20576, .70576, 0, 0, .77778],
              8840: [.30274, .79383, 0, 0, .77778],
              8841: [.30274, .79383, 0, 0, .77778],
              8842: [.13597, .63597, 0, 0, .77778],
              8843: [.13597, .63597, 0, 0, .77778],
              8847: [.03517, .54986, 0, 0, .77778],
              8848: [.03517, .54986, 0, 0, .77778],
              8858: [.08198, .58198, 0, 0, .77778],
              8859: [.08198, .58198, 0, 0, .77778],
              8861: [.08198, .58198, 0, 0, .77778],
              8862: [0, .675, 0, 0, .77778],
              8863: [0, .675, 0, 0, .77778],
              8864: [0, .675, 0, 0, .77778],
              8865: [0, .675, 0, 0, .77778],
              8872: [0, .69224, 0, 0, .61111],
              8873: [0, .69224, 0, 0, .72222],
              8874: [0, .69224, 0, 0, .88889],
              8876: [0, .68889, 0, 0, .61111],
              8877: [0, .68889, 0, 0, .61111],
              8878: [0, .68889, 0, 0, .72222],
              8879: [0, .68889, 0, 0, .72222],
              8882: [.03517, .54986, 0, 0, .77778],
              8883: [.03517, .54986, 0, 0, .77778],
              8884: [.13667, .63667, 0, 0, .77778],
              8885: [.13667, .63667, 0, 0, .77778],
              8888: [0, .54986, 0, 0, 1.11111],
              8890: [.19444, .43056, 0, 0, .55556],
              8891: [.19444, .69224, 0, 0, .61111],
              8892: [.19444, .69224, 0, 0, .61111],
              8901: [0, .54986, 0, 0, .27778],
              8903: [.08167, .58167, 0, 0, .77778],
              8905: [.08167, .58167, 0, 0, .77778],
              8906: [.08167, .58167, 0, 0, .77778],
              8907: [0, .69224, 0, 0, .77778],
              8908: [0, .69224, 0, 0, .77778],
              8909: [-.03598, .46402, 0, 0, .77778],
              8910: [0, .54986, 0, 0, .76042],
              8911: [0, .54986, 0, 0, .76042],
              8912: [.03517, .54986, 0, 0, .77778],
              8913: [.03517, .54986, 0, 0, .77778],
              8914: [0, .54986, 0, 0, .66667],
              8915: [0, .54986, 0, 0, .66667],
              8916: [0, .69224, 0, 0, .66667],
              8918: [.0391, .5391, 0, 0, .77778],
              8919: [.0391, .5391, 0, 0, .77778],
              8920: [.03517, .54986, 0, 0, 1.33334],
              8921: [.03517, .54986, 0, 0, 1.33334],
              8922: [.38569, .88569, 0, 0, .77778],
              8923: [.38569, .88569, 0, 0, .77778],
              8926: [.13667, .63667, 0, 0, .77778],
              8927: [.13667, .63667, 0, 0, .77778],
              8928: [.30274, .79383, 0, 0, .77778],
              8929: [.30274, .79383, 0, 0, .77778],
              8934: [.23222, .74111, 0, 0, .77778],
              8935: [.23222, .74111, 0, 0, .77778],
              8936: [.23222, .74111, 0, 0, .77778],
              8937: [.23222, .74111, 0, 0, .77778],
              8938: [.20576, .70576, 0, 0, .77778],
              8939: [.20576, .70576, 0, 0, .77778],
              8940: [.30274, .79383, 0, 0, .77778],
              8941: [.30274, .79383, 0, 0, .77778],
              8994: [.19444, .69224, 0, 0, .77778],
              8995: [.19444, .69224, 0, 0, .77778],
              9416: [.15559, .69224, 0, 0, .90222],
              9484: [0, .69224, 0, 0, .5],
              9488: [0, .69224, 0, 0, .5],
              9492: [0, .37788, 0, 0, .5],
              9496: [0, .37788, 0, 0, .5],
              9585: [.19444, .68889, 0, 0, .88889],
              9586: [.19444, .74111, 0, 0, .88889],
              9632: [0, .675, 0, 0, .77778],
              9633: [0, .675, 0, 0, .77778],
              9650: [0, .54986, 0, 0, .72222],
              9651: [0, .54986, 0, 0, .72222],
              9654: [.03517, .54986, 0, 0, .77778],
              9660: [0, .54986, 0, 0, .72222],
              9661: [0, .54986, 0, 0, .72222],
              9664: [.03517, .54986, 0, 0, .77778],
              9674: [.11111, .69224, 0, 0, .66667],
              9733: [.19444, .69224, 0, 0, .94445],
              10003: [0, .69224, 0, 0, .83334],
              10016: [0, .69224, 0, 0, .83334],
              10731: [.11111, .69224, 0, 0, .66667],
              10846: [.19444, .75583, 0, 0, .61111],
              10877: [.13667, .63667, 0, 0, .77778],
              10878: [.13667, .63667, 0, 0, .77778],
              10885: [.25583, .75583, 0, 0, .77778],
              10886: [.25583, .75583, 0, 0, .77778],
              10887: [.13597, .63597, 0, 0, .77778],
              10888: [.13597, .63597, 0, 0, .77778],
              10889: [.26167, .75726, 0, 0, .77778],
              10890: [.26167, .75726, 0, 0, .77778],
              10891: [.48256, .98256, 0, 0, .77778],
              10892: [.48256, .98256, 0, 0, .77778],
              10901: [.13667, .63667, 0, 0, .77778],
              10902: [.13667, .63667, 0, 0, .77778],
              10933: [.25142, .75726, 0, 0, .77778],
              10934: [.25142, .75726, 0, 0, .77778],
              10935: [.26167, .75726, 0, 0, .77778],
              10936: [.26167, .75726, 0, 0, .77778],
              10937: [.26167, .75726, 0, 0, .77778],
              10938: [.26167, .75726, 0, 0, .77778],
              10949: [.25583, .75583, 0, 0, .77778],
              10950: [.25583, .75583, 0, 0, .77778],
              10955: [.28481, .79383, 0, 0, .77778],
              10956: [.28481, .79383, 0, 0, .77778],
              57350: [.08167, .58167, 0, 0, .22222],
              57351: [.08167, .58167, 0, 0, .38889],
              57352: [.08167, .58167, 0, 0, .77778],
              57353: [0, .43056, .04028, 0, .66667],
              57356: [.25142, .75726, 0, 0, .77778],
              57357: [.25142, .75726, 0, 0, .77778],
              57358: [.41951, .91951, 0, 0, .77778],
              57359: [.30274, .79383, 0, 0, .77778],
              57360: [.30274, .79383, 0, 0, .77778],
              57361: [.41951, .91951, 0, 0, .77778],
              57366: [.25142, .75726, 0, 0, .77778],
              57367: [.25142, .75726, 0, 0, .77778],
              57368: [.25142, .75726, 0, 0, .77778],
              57369: [.25142, .75726, 0, 0, .77778],
              57370: [.13597, .63597, 0, 0, .77778],
              57371: [.13597, .63597, 0, 0, .77778]
            },
            "Caligraphic-Regular": {
              32: [0, 0, 0, 0, .25],
              65: [0, .68333, 0, .19445, .79847],
              66: [0, .68333, .03041, .13889, .65681],
              67: [0, .68333, .05834, .13889, .52653],
              68: [0, .68333, .02778, .08334, .77139],
              69: [0, .68333, .08944, .11111, .52778],
              70: [0, .68333, .09931, .11111, .71875],
              71: [.09722, .68333, .0593, .11111, .59487],
              72: [0, .68333, .00965, .11111, .84452],
              73: [0, .68333, .07382, 0, .54452],
              74: [.09722, .68333, .18472, .16667, .67778],
              75: [0, .68333, .01445, .05556, .76195],
              76: [0, .68333, 0, .13889, .68972],
              77: [0, .68333, 0, .13889, 1.2009],
              78: [0, .68333, .14736, .08334, .82049],
              79: [0, .68333, .02778, .11111, .79611],
              80: [0, .68333, .08222, .08334, .69556],
              81: [.09722, .68333, 0, .11111, .81667],
              82: [0, .68333, 0, .08334, .8475],
              83: [0, .68333, .075, .13889, .60556],
              84: [0, .68333, .25417, 0, .54464],
              85: [0, .68333, .09931, .08334, .62583],
              86: [0, .68333, .08222, 0, .61278],
              87: [0, .68333, .08222, .08334, .98778],
              88: [0, .68333, .14643, .13889, .7133],
              89: [.09722, .68333, .08222, .08334, .66834],
              90: [0, .68333, .07944, .13889, .72473],
              160: [0, 0, 0, 0, .25]
            },
            "Fraktur-Regular": {
              32: [0, 0, 0, 0, .25],
              33: [0, .69141, 0, 0, .29574],
              34: [0, .69141, 0, 0, .21471],
              38: [0, .69141, 0, 0, .73786],
              39: [0, .69141, 0, 0, .21201],
              40: [.24982, .74947, 0, 0, .38865],
              41: [.24982, .74947, 0, 0, .38865],
              42: [0, .62119, 0, 0, .27764],
              43: [.08319, .58283, 0, 0, .75623],
              44: [0, .10803, 0, 0, .27764],
              45: [.08319, .58283, 0, 0, .75623],
              46: [0, .10803, 0, 0, .27764],
              47: [.24982, .74947, 0, 0, .50181],
              48: [0, .47534, 0, 0, .50181],
              49: [0, .47534, 0, 0, .50181],
              50: [0, .47534, 0, 0, .50181],
              51: [.18906, .47534, 0, 0, .50181],
              52: [.18906, .47534, 0, 0, .50181],
              53: [.18906, .47534, 0, 0, .50181],
              54: [0, .69141, 0, 0, .50181],
              55: [.18906, .47534, 0, 0, .50181],
              56: [0, .69141, 0, 0, .50181],
              57: [.18906, .47534, 0, 0, .50181],
              58: [0, .47534, 0, 0, .21606],
              59: [.12604, .47534, 0, 0, .21606],
              61: [-.13099, .36866, 0, 0, .75623],
              63: [0, .69141, 0, 0, .36245],
              65: [0, .69141, 0, 0, .7176],
              66: [0, .69141, 0, 0, .88397],
              67: [0, .69141, 0, 0, .61254],
              68: [0, .69141, 0, 0, .83158],
              69: [0, .69141, 0, 0, .66278],
              70: [.12604, .69141, 0, 0, .61119],
              71: [0, .69141, 0, 0, .78539],
              72: [.06302, .69141, 0, 0, .7203],
              73: [0, .69141, 0, 0, .55448],
              74: [.12604, .69141, 0, 0, .55231],
              75: [0, .69141, 0, 0, .66845],
              76: [0, .69141, 0, 0, .66602],
              77: [0, .69141, 0, 0, 1.04953],
              78: [0, .69141, 0, 0, .83212],
              79: [0, .69141, 0, 0, .82699],
              80: [.18906, .69141, 0, 0, .82753],
              81: [.03781, .69141, 0, 0, .82699],
              82: [0, .69141, 0, 0, .82807],
              83: [0, .69141, 0, 0, .82861],
              84: [0, .69141, 0, 0, .66899],
              85: [0, .69141, 0, 0, .64576],
              86: [0, .69141, 0, 0, .83131],
              87: [0, .69141, 0, 0, 1.04602],
              88: [0, .69141, 0, 0, .71922],
              89: [.18906, .69141, 0, 0, .83293],
              90: [.12604, .69141, 0, 0, .60201],
              91: [.24982, .74947, 0, 0, .27764],
              93: [.24982, .74947, 0, 0, .27764],
              94: [0, .69141, 0, 0, .49965],
              97: [0, .47534, 0, 0, .50046],
              98: [0, .69141, 0, 0, .51315],
              99: [0, .47534, 0, 0, .38946],
              100: [0, .62119, 0, 0, .49857],
              101: [0, .47534, 0, 0, .40053],
              102: [.18906, .69141, 0, 0, .32626],
              103: [.18906, .47534, 0, 0, .5037],
              104: [.18906, .69141, 0, 0, .52126],
              105: [0, .69141, 0, 0, .27899],
              106: [0, .69141, 0, 0, .28088],
              107: [0, .69141, 0, 0, .38946],
              108: [0, .69141, 0, 0, .27953],
              109: [0, .47534, 0, 0, .76676],
              110: [0, .47534, 0, 0, .52666],
              111: [0, .47534, 0, 0, .48885],
              112: [.18906, .52396, 0, 0, .50046],
              113: [.18906, .47534, 0, 0, .48912],
              114: [0, .47534, 0, 0, .38919],
              115: [0, .47534, 0, 0, .44266],
              116: [0, .62119, 0, 0, .33301],
              117: [0, .47534, 0, 0, .5172],
              118: [0, .52396, 0, 0, .5118],
              119: [0, .52396, 0, 0, .77351],
              120: [.18906, .47534, 0, 0, .38865],
              121: [.18906, .47534, 0, 0, .49884],
              122: [.18906, .47534, 0, 0, .39054],
              160: [0, 0, 0, 0, .25],
              8216: [0, .69141, 0, 0, .21471],
              8217: [0, .69141, 0, 0, .21471],
              58112: [0, .62119, 0, 0, .49749],
              58113: [0, .62119, 0, 0, .4983],
              58114: [.18906, .69141, 0, 0, .33328],
              58115: [.18906, .69141, 0, 0, .32923],
              58116: [.18906, .47534, 0, 0, .50343],
              58117: [0, .69141, 0, 0, .33301],
              58118: [0, .62119, 0, 0, .33409],
              58119: [0, .47534, 0, 0, .50073]
            },
            "Main-Bold": {
              32: [0, 0, 0, 0, .25],
              33: [0, .69444, 0, 0, .35],
              34: [0, .69444, 0, 0, .60278],
              35: [.19444, .69444, 0, 0, .95833],
              36: [.05556, .75, 0, 0, .575],
              37: [.05556, .75, 0, 0, .95833],
              38: [0, .69444, 0, 0, .89444],
              39: [0, .69444, 0, 0, .31944],
              40: [.25, .75, 0, 0, .44722],
              41: [.25, .75, 0, 0, .44722],
              42: [0, .75, 0, 0, .575],
              43: [.13333, .63333, 0, 0, .89444],
              44: [.19444, .15556, 0, 0, .31944],
              45: [0, .44444, 0, 0, .38333],
              46: [0, .15556, 0, 0, .31944],
              47: [.25, .75, 0, 0, .575],
              48: [0, .64444, 0, 0, .575],
              49: [0, .64444, 0, 0, .575],
              50: [0, .64444, 0, 0, .575],
              51: [0, .64444, 0, 0, .575],
              52: [0, .64444, 0, 0, .575],
              53: [0, .64444, 0, 0, .575],
              54: [0, .64444, 0, 0, .575],
              55: [0, .64444, 0, 0, .575],
              56: [0, .64444, 0, 0, .575],
              57: [0, .64444, 0, 0, .575],
              58: [0, .44444, 0, 0, .31944],
              59: [.19444, .44444, 0, 0, .31944],
              60: [.08556, .58556, 0, 0, .89444],
              61: [-.10889, .39111, 0, 0, .89444],
              62: [.08556, .58556, 0, 0, .89444],
              63: [0, .69444, 0, 0, .54305],
              64: [0, .69444, 0, 0, .89444],
              65: [0, .68611, 0, 0, .86944],
              66: [0, .68611, 0, 0, .81805],
              67: [0, .68611, 0, 0, .83055],
              68: [0, .68611, 0, 0, .88194],
              69: [0, .68611, 0, 0, .75555],
              70: [0, .68611, 0, 0, .72361],
              71: [0, .68611, 0, 0, .90416],
              72: [0, .68611, 0, 0, .9],
              73: [0, .68611, 0, 0, .43611],
              74: [0, .68611, 0, 0, .59444],
              75: [0, .68611, 0, 0, .90138],
              76: [0, .68611, 0, 0, .69166],
              77: [0, .68611, 0, 0, 1.09166],
              78: [0, .68611, 0, 0, .9],
              79: [0, .68611, 0, 0, .86388],
              80: [0, .68611, 0, 0, .78611],
              81: [.19444, .68611, 0, 0, .86388],
              82: [0, .68611, 0, 0, .8625],
              83: [0, .68611, 0, 0, .63889],
              84: [0, .68611, 0, 0, .8],
              85: [0, .68611, 0, 0, .88472],
              86: [0, .68611, .01597, 0, .86944],
              87: [0, .68611, .01597, 0, 1.18888],
              88: [0, .68611, 0, 0, .86944],
              89: [0, .68611, .02875, 0, .86944],
              90: [0, .68611, 0, 0, .70277],
              91: [.25, .75, 0, 0, .31944],
              92: [.25, .75, 0, 0, .575],
              93: [.25, .75, 0, 0, .31944],
              94: [0, .69444, 0, 0, .575],
              95: [.31, .13444, .03194, 0, .575],
              97: [0, .44444, 0, 0, .55902],
              98: [0, .69444, 0, 0, .63889],
              99: [0, .44444, 0, 0, .51111],
              100: [0, .69444, 0, 0, .63889],
              101: [0, .44444, 0, 0, .52708],
              102: [0, .69444, .10903, 0, .35139],
              103: [.19444, .44444, .01597, 0, .575],
              104: [0, .69444, 0, 0, .63889],
              105: [0, .69444, 0, 0, .31944],
              106: [.19444, .69444, 0, 0, .35139],
              107: [0, .69444, 0, 0, .60694],
              108: [0, .69444, 0, 0, .31944],
              109: [0, .44444, 0, 0, .95833],
              110: [0, .44444, 0, 0, .63889],
              111: [0, .44444, 0, 0, .575],
              112: [.19444, .44444, 0, 0, .63889],
              113: [.19444, .44444, 0, 0, .60694],
              114: [0, .44444, 0, 0, .47361],
              115: [0, .44444, 0, 0, .45361],
              116: [0, .63492, 0, 0, .44722],
              117: [0, .44444, 0, 0, .63889],
              118: [0, .44444, .01597, 0, .60694],
              119: [0, .44444, .01597, 0, .83055],
              120: [0, .44444, 0, 0, .60694],
              121: [.19444, .44444, .01597, 0, .60694],
              122: [0, .44444, 0, 0, .51111],
              123: [.25, .75, 0, 0, .575],
              124: [.25, .75, 0, 0, .31944],
              125: [.25, .75, 0, 0, .575],
              126: [.35, .34444, 0, 0, .575],
              160: [0, 0, 0, 0, .25],
              163: [0, .69444, 0, 0, .86853],
              168: [0, .69444, 0, 0, .575],
              172: [0, .44444, 0, 0, .76666],
              176: [0, .69444, 0, 0, .86944],
              177: [.13333, .63333, 0, 0, .89444],
              184: [.17014, 0, 0, 0, .51111],
              198: [0, .68611, 0, 0, 1.04166],
              215: [.13333, .63333, 0, 0, .89444],
              216: [.04861, .73472, 0, 0, .89444],
              223: [0, .69444, 0, 0, .59722],
              230: [0, .44444, 0, 0, .83055],
              247: [.13333, .63333, 0, 0, .89444],
              248: [.09722, .54167, 0, 0, .575],
              305: [0, .44444, 0, 0, .31944],
              338: [0, .68611, 0, 0, 1.16944],
              339: [0, .44444, 0, 0, .89444],
              567: [.19444, .44444, 0, 0, .35139],
              710: [0, .69444, 0, 0, .575],
              711: [0, .63194, 0, 0, .575],
              713: [0, .59611, 0, 0, .575],
              714: [0, .69444, 0, 0, .575],
              715: [0, .69444, 0, 0, .575],
              728: [0, .69444, 0, 0, .575],
              729: [0, .69444, 0, 0, .31944],
              730: [0, .69444, 0, 0, .86944],
              732: [0, .69444, 0, 0, .575],
              733: [0, .69444, 0, 0, .575],
              915: [0, .68611, 0, 0, .69166],
              916: [0, .68611, 0, 0, .95833],
              920: [0, .68611, 0, 0, .89444],
              923: [0, .68611, 0, 0, .80555],
              926: [0, .68611, 0, 0, .76666],
              928: [0, .68611, 0, 0, .9],
              931: [0, .68611, 0, 0, .83055],
              933: [0, .68611, 0, 0, .89444],
              934: [0, .68611, 0, 0, .83055],
              936: [0, .68611, 0, 0, .89444],
              937: [0, .68611, 0, 0, .83055],
              8211: [0, .44444, .03194, 0, .575],
              8212: [0, .44444, .03194, 0, 1.14999],
              8216: [0, .69444, 0, 0, .31944],
              8217: [0, .69444, 0, 0, .31944],
              8220: [0, .69444, 0, 0, .60278],
              8221: [0, .69444, 0, 0, .60278],
              8224: [.19444, .69444, 0, 0, .51111],
              8225: [.19444, .69444, 0, 0, .51111],
              8242: [0, .55556, 0, 0, .34444],
              8407: [0, .72444, .15486, 0, .575],
              8463: [0, .69444, 0, 0, .66759],
              8465: [0, .69444, 0, 0, .83055],
              8467: [0, .69444, 0, 0, .47361],
              8472: [.19444, .44444, 0, 0, .74027],
              8476: [0, .69444, 0, 0, .83055],
              8501: [0, .69444, 0, 0, .70277],
              8592: [-.10889, .39111, 0, 0, 1.14999],
              8593: [.19444, .69444, 0, 0, .575],
              8594: [-.10889, .39111, 0, 0, 1.14999],
              8595: [.19444, .69444, 0, 0, .575],
              8596: [-.10889, .39111, 0, 0, 1.14999],
              8597: [.25, .75, 0, 0, .575],
              8598: [.19444, .69444, 0, 0, 1.14999],
              8599: [.19444, .69444, 0, 0, 1.14999],
              8600: [.19444, .69444, 0, 0, 1.14999],
              8601: [.19444, .69444, 0, 0, 1.14999],
              8636: [-.10889, .39111, 0, 0, 1.14999],
              8637: [-.10889, .39111, 0, 0, 1.14999],
              8640: [-.10889, .39111, 0, 0, 1.14999],
              8641: [-.10889, .39111, 0, 0, 1.14999],
              8656: [-.10889, .39111, 0, 0, 1.14999],
              8657: [.19444, .69444, 0, 0, .70277],
              8658: [-.10889, .39111, 0, 0, 1.14999],
              8659: [.19444, .69444, 0, 0, .70277],
              8660: [-.10889, .39111, 0, 0, 1.14999],
              8661: [.25, .75, 0, 0, .70277],
              8704: [0, .69444, 0, 0, .63889],
              8706: [0, .69444, .06389, 0, .62847],
              8707: [0, .69444, 0, 0, .63889],
              8709: [.05556, .75, 0, 0, .575],
              8711: [0, .68611, 0, 0, .95833],
              8712: [.08556, .58556, 0, 0, .76666],
              8715: [.08556, .58556, 0, 0, .76666],
              8722: [.13333, .63333, 0, 0, .89444],
              8723: [.13333, .63333, 0, 0, .89444],
              8725: [.25, .75, 0, 0, .575],
              8726: [.25, .75, 0, 0, .575],
              8727: [-.02778, .47222, 0, 0, .575],
              8728: [-.02639, .47361, 0, 0, .575],
              8729: [-.02639, .47361, 0, 0, .575],
              8730: [.18, .82, 0, 0, .95833],
              8733: [0, .44444, 0, 0, .89444],
              8734: [0, .44444, 0, 0, 1.14999],
              8736: [0, .69224, 0, 0, .72222],
              8739: [.25, .75, 0, 0, .31944],
              8741: [.25, .75, 0, 0, .575],
              8743: [0, .55556, 0, 0, .76666],
              8744: [0, .55556, 0, 0, .76666],
              8745: [0, .55556, 0, 0, .76666],
              8746: [0, .55556, 0, 0, .76666],
              8747: [.19444, .69444, .12778, 0, .56875],
              8764: [-.10889, .39111, 0, 0, .89444],
              8768: [.19444, .69444, 0, 0, .31944],
              8771: [.00222, .50222, 0, 0, .89444],
              8773: [.027, .638, 0, 0, .894],
              8776: [.02444, .52444, 0, 0, .89444],
              8781: [.00222, .50222, 0, 0, .89444],
              8801: [.00222, .50222, 0, 0, .89444],
              8804: [.19667, .69667, 0, 0, .89444],
              8805: [.19667, .69667, 0, 0, .89444],
              8810: [.08556, .58556, 0, 0, 1.14999],
              8811: [.08556, .58556, 0, 0, 1.14999],
              8826: [.08556, .58556, 0, 0, .89444],
              8827: [.08556, .58556, 0, 0, .89444],
              8834: [.08556, .58556, 0, 0, .89444],
              8835: [.08556, .58556, 0, 0, .89444],
              8838: [.19667, .69667, 0, 0, .89444],
              8839: [.19667, .69667, 0, 0, .89444],
              8846: [0, .55556, 0, 0, .76666],
              8849: [.19667, .69667, 0, 0, .89444],
              8850: [.19667, .69667, 0, 0, .89444],
              8851: [0, .55556, 0, 0, .76666],
              8852: [0, .55556, 0, 0, .76666],
              8853: [.13333, .63333, 0, 0, .89444],
              8854: [.13333, .63333, 0, 0, .89444],
              8855: [.13333, .63333, 0, 0, .89444],
              8856: [.13333, .63333, 0, 0, .89444],
              8857: [.13333, .63333, 0, 0, .89444],
              8866: [0, .69444, 0, 0, .70277],
              8867: [0, .69444, 0, 0, .70277],
              8868: [0, .69444, 0, 0, .89444],
              8869: [0, .69444, 0, 0, .89444],
              8900: [-.02639, .47361, 0, 0, .575],
              8901: [-.02639, .47361, 0, 0, .31944],
              8902: [-.02778, .47222, 0, 0, .575],
              8968: [.25, .75, 0, 0, .51111],
              8969: [.25, .75, 0, 0, .51111],
              8970: [.25, .75, 0, 0, .51111],
              8971: [.25, .75, 0, 0, .51111],
              8994: [-.13889, .36111, 0, 0, 1.14999],
              8995: [-.13889, .36111, 0, 0, 1.14999],
              9651: [.19444, .69444, 0, 0, 1.02222],
              9657: [-.02778, .47222, 0, 0, .575],
              9661: [.19444, .69444, 0, 0, 1.02222],
              9667: [-.02778, .47222, 0, 0, .575],
              9711: [.19444, .69444, 0, 0, 1.14999],
              9824: [.12963, .69444, 0, 0, .89444],
              9825: [.12963, .69444, 0, 0, .89444],
              9826: [.12963, .69444, 0, 0, .89444],
              9827: [.12963, .69444, 0, 0, .89444],
              9837: [0, .75, 0, 0, .44722],
              9838: [.19444, .69444, 0, 0, .44722],
              9839: [.19444, .69444, 0, 0, .44722],
              10216: [.25, .75, 0, 0, .44722],
              10217: [.25, .75, 0, 0, .44722],
              10815: [0, .68611, 0, 0, .9],
              10927: [.19667, .69667, 0, 0, .89444],
              10928: [.19667, .69667, 0, 0, .89444],
              57376: [.19444, .69444, 0, 0, 0]
            },
            "Main-BoldItalic": {
              32: [0, 0, 0, 0, .25],
              33: [0, .69444, .11417, 0, .38611],
              34: [0, .69444, .07939, 0, .62055],
              35: [.19444, .69444, .06833, 0, .94444],
              37: [.05556, .75, .12861, 0, .94444],
              38: [0, .69444, .08528, 0, .88555],
              39: [0, .69444, .12945, 0, .35555],
              40: [.25, .75, .15806, 0, .47333],
              41: [.25, .75, .03306, 0, .47333],
              42: [0, .75, .14333, 0, .59111],
              43: [.10333, .60333, .03306, 0, .88555],
              44: [.19444, .14722, 0, 0, .35555],
              45: [0, .44444, .02611, 0, .41444],
              46: [0, .14722, 0, 0, .35555],
              47: [.25, .75, .15806, 0, .59111],
              48: [0, .64444, .13167, 0, .59111],
              49: [0, .64444, .13167, 0, .59111],
              50: [0, .64444, .13167, 0, .59111],
              51: [0, .64444, .13167, 0, .59111],
              52: [.19444, .64444, .13167, 0, .59111],
              53: [0, .64444, .13167, 0, .59111],
              54: [0, .64444, .13167, 0, .59111],
              55: [.19444, .64444, .13167, 0, .59111],
              56: [0, .64444, .13167, 0, .59111],
              57: [0, .64444, .13167, 0, .59111],
              58: [0, .44444, .06695, 0, .35555],
              59: [.19444, .44444, .06695, 0, .35555],
              61: [-.10889, .39111, .06833, 0, .88555],
              63: [0, .69444, .11472, 0, .59111],
              64: [0, .69444, .09208, 0, .88555],
              65: [0, .68611, 0, 0, .86555],
              66: [0, .68611, .0992, 0, .81666],
              67: [0, .68611, .14208, 0, .82666],
              68: [0, .68611, .09062, 0, .87555],
              69: [0, .68611, .11431, 0, .75666],
              70: [0, .68611, .12903, 0, .72722],
              71: [0, .68611, .07347, 0, .89527],
              72: [0, .68611, .17208, 0, .8961],
              73: [0, .68611, .15681, 0, .47166],
              74: [0, .68611, .145, 0, .61055],
              75: [0, .68611, .14208, 0, .89499],
              76: [0, .68611, 0, 0, .69777],
              77: [0, .68611, .17208, 0, 1.07277],
              78: [0, .68611, .17208, 0, .8961],
              79: [0, .68611, .09062, 0, .85499],
              80: [0, .68611, .0992, 0, .78721],
              81: [.19444, .68611, .09062, 0, .85499],
              82: [0, .68611, .02559, 0, .85944],
              83: [0, .68611, .11264, 0, .64999],
              84: [0, .68611, .12903, 0, .7961],
              85: [0, .68611, .17208, 0, .88083],
              86: [0, .68611, .18625, 0, .86555],
              87: [0, .68611, .18625, 0, 1.15999],
              88: [0, .68611, .15681, 0, .86555],
              89: [0, .68611, .19803, 0, .86555],
              90: [0, .68611, .14208, 0, .70888],
              91: [.25, .75, .1875, 0, .35611],
              93: [.25, .75, .09972, 0, .35611],
              94: [0, .69444, .06709, 0, .59111],
              95: [.31, .13444, .09811, 0, .59111],
              97: [0, .44444, .09426, 0, .59111],
              98: [0, .69444, .07861, 0, .53222],
              99: [0, .44444, .05222, 0, .53222],
              100: [0, .69444, .10861, 0, .59111],
              101: [0, .44444, .085, 0, .53222],
              102: [.19444, .69444, .21778, 0, .4],
              103: [.19444, .44444, .105, 0, .53222],
              104: [0, .69444, .09426, 0, .59111],
              105: [0, .69326, .11387, 0, .35555],
              106: [.19444, .69326, .1672, 0, .35555],
              107: [0, .69444, .11111, 0, .53222],
              108: [0, .69444, .10861, 0, .29666],
              109: [0, .44444, .09426, 0, .94444],
              110: [0, .44444, .09426, 0, .64999],
              111: [0, .44444, .07861, 0, .59111],
              112: [.19444, .44444, .07861, 0, .59111],
              113: [.19444, .44444, .105, 0, .53222],
              114: [0, .44444, .11111, 0, .50167],
              115: [0, .44444, .08167, 0, .48694],
              116: [0, .63492, .09639, 0, .385],
              117: [0, .44444, .09426, 0, .62055],
              118: [0, .44444, .11111, 0, .53222],
              119: [0, .44444, .11111, 0, .76777],
              120: [0, .44444, .12583, 0, .56055],
              121: [.19444, .44444, .105, 0, .56166],
              122: [0, .44444, .13889, 0, .49055],
              126: [.35, .34444, .11472, 0, .59111],
              160: [0, 0, 0, 0, .25],
              168: [0, .69444, .11473, 0, .59111],
              176: [0, .69444, 0, 0, .94888],
              184: [.17014, 0, 0, 0, .53222],
              198: [0, .68611, .11431, 0, 1.02277],
              216: [.04861, .73472, .09062, 0, .88555],
              223: [.19444, .69444, .09736, 0, .665],
              230: [0, .44444, .085, 0, .82666],
              248: [.09722, .54167, .09458, 0, .59111],
              305: [0, .44444, .09426, 0, .35555],
              338: [0, .68611, .11431, 0, 1.14054],
              339: [0, .44444, .085, 0, .82666],
              567: [.19444, .44444, .04611, 0, .385],
              710: [0, .69444, .06709, 0, .59111],
              711: [0, .63194, .08271, 0, .59111],
              713: [0, .59444, .10444, 0, .59111],
              714: [0, .69444, .08528, 0, .59111],
              715: [0, .69444, 0, 0, .59111],
              728: [0, .69444, .10333, 0, .59111],
              729: [0, .69444, .12945, 0, .35555],
              730: [0, .69444, 0, 0, .94888],
              732: [0, .69444, .11472, 0, .59111],
              733: [0, .69444, .11472, 0, .59111],
              915: [0, .68611, .12903, 0, .69777],
              916: [0, .68611, 0, 0, .94444],
              920: [0, .68611, .09062, 0, .88555],
              923: [0, .68611, 0, 0, .80666],
              926: [0, .68611, .15092, 0, .76777],
              928: [0, .68611, .17208, 0, .8961],
              931: [0, .68611, .11431, 0, .82666],
              933: [0, .68611, .10778, 0, .88555],
              934: [0, .68611, .05632, 0, .82666],
              936: [0, .68611, .10778, 0, .88555],
              937: [0, .68611, .0992, 0, .82666],
              8211: [0, .44444, .09811, 0, .59111],
              8212: [0, .44444, .09811, 0, 1.18221],
              8216: [0, .69444, .12945, 0, .35555],
              8217: [0, .69444, .12945, 0, .35555],
              8220: [0, .69444, .16772, 0, .62055],
              8221: [0, .69444, .07939, 0, .62055]
            },
            "Main-Italic": {
              32: [0, 0, 0, 0, .25],
              33: [0, .69444, .12417, 0, .30667],
              34: [0, .69444, .06961, 0, .51444],
              35: [.19444, .69444, .06616, 0, .81777],
              37: [.05556, .75, .13639, 0, .81777],
              38: [0, .69444, .09694, 0, .76666],
              39: [0, .69444, .12417, 0, .30667],
              40: [.25, .75, .16194, 0, .40889],
              41: [.25, .75, .03694, 0, .40889],
              42: [0, .75, .14917, 0, .51111],
              43: [.05667, .56167, .03694, 0, .76666],
              44: [.19444, .10556, 0, 0, .30667],
              45: [0, .43056, .02826, 0, .35778],
              46: [0, .10556, 0, 0, .30667],
              47: [.25, .75, .16194, 0, .51111],
              48: [0, .64444, .13556, 0, .51111],
              49: [0, .64444, .13556, 0, .51111],
              50: [0, .64444, .13556, 0, .51111],
              51: [0, .64444, .13556, 0, .51111],
              52: [.19444, .64444, .13556, 0, .51111],
              53: [0, .64444, .13556, 0, .51111],
              54: [0, .64444, .13556, 0, .51111],
              55: [.19444, .64444, .13556, 0, .51111],
              56: [0, .64444, .13556, 0, .51111],
              57: [0, .64444, .13556, 0, .51111],
              58: [0, .43056, .0582, 0, .30667],
              59: [.19444, .43056, .0582, 0, .30667],
              61: [-.13313, .36687, .06616, 0, .76666],
              63: [0, .69444, .1225, 0, .51111],
              64: [0, .69444, .09597, 0, .76666],
              65: [0, .68333, 0, 0, .74333],
              66: [0, .68333, .10257, 0, .70389],
              67: [0, .68333, .14528, 0, .71555],
              68: [0, .68333, .09403, 0, .755],
              69: [0, .68333, .12028, 0, .67833],
              70: [0, .68333, .13305, 0, .65277],
              71: [0, .68333, .08722, 0, .77361],
              72: [0, .68333, .16389, 0, .74333],
              73: [0, .68333, .15806, 0, .38555],
              74: [0, .68333, .14028, 0, .525],
              75: [0, .68333, .14528, 0, .76888],
              76: [0, .68333, 0, 0, .62722],
              77: [0, .68333, .16389, 0, .89666],
              78: [0, .68333, .16389, 0, .74333],
              79: [0, .68333, .09403, 0, .76666],
              80: [0, .68333, .10257, 0, .67833],
              81: [.19444, .68333, .09403, 0, .76666],
              82: [0, .68333, .03868, 0, .72944],
              83: [0, .68333, .11972, 0, .56222],
              84: [0, .68333, .13305, 0, .71555],
              85: [0, .68333, .16389, 0, .74333],
              86: [0, .68333, .18361, 0, .74333],
              87: [0, .68333, .18361, 0, .99888],
              88: [0, .68333, .15806, 0, .74333],
              89: [0, .68333, .19383, 0, .74333],
              90: [0, .68333, .14528, 0, .61333],
              91: [.25, .75, .1875, 0, .30667],
              93: [.25, .75, .10528, 0, .30667],
              94: [0, .69444, .06646, 0, .51111],
              95: [.31, .12056, .09208, 0, .51111],
              97: [0, .43056, .07671, 0, .51111],
              98: [0, .69444, .06312, 0, .46],
              99: [0, .43056, .05653, 0, .46],
              100: [0, .69444, .10333, 0, .51111],
              101: [0, .43056, .07514, 0, .46],
              102: [.19444, .69444, .21194, 0, .30667],
              103: [.19444, .43056, .08847, 0, .46],
              104: [0, .69444, .07671, 0, .51111],
              105: [0, .65536, .1019, 0, .30667],
              106: [.19444, .65536, .14467, 0, .30667],
              107: [0, .69444, .10764, 0, .46],
              108: [0, .69444, .10333, 0, .25555],
              109: [0, .43056, .07671, 0, .81777],
              110: [0, .43056, .07671, 0, .56222],
              111: [0, .43056, .06312, 0, .51111],
              112: [.19444, .43056, .06312, 0, .51111],
              113: [.19444, .43056, .08847, 0, .46],
              114: [0, .43056, .10764, 0, .42166],
              115: [0, .43056, .08208, 0, .40889],
              116: [0, .61508, .09486, 0, .33222],
              117: [0, .43056, .07671, 0, .53666],
              118: [0, .43056, .10764, 0, .46],
              119: [0, .43056, .10764, 0, .66444],
              120: [0, .43056, .12042, 0, .46389],
              121: [.19444, .43056, .08847, 0, .48555],
              122: [0, .43056, .12292, 0, .40889],
              126: [.35, .31786, .11585, 0, .51111],
              160: [0, 0, 0, 0, .25],
              168: [0, .66786, .10474, 0, .51111],
              176: [0, .69444, 0, 0, .83129],
              184: [.17014, 0, 0, 0, .46],
              198: [0, .68333, .12028, 0, .88277],
              216: [.04861, .73194, .09403, 0, .76666],
              223: [.19444, .69444, .10514, 0, .53666],
              230: [0, .43056, .07514, 0, .71555],
              248: [.09722, .52778, .09194, 0, .51111],
              338: [0, .68333, .12028, 0, .98499],
              339: [0, .43056, .07514, 0, .71555],
              710: [0, .69444, .06646, 0, .51111],
              711: [0, .62847, .08295, 0, .51111],
              713: [0, .56167, .10333, 0, .51111],
              714: [0, .69444, .09694, 0, .51111],
              715: [0, .69444, 0, 0, .51111],
              728: [0, .69444, .10806, 0, .51111],
              729: [0, .66786, .11752, 0, .30667],
              730: [0, .69444, 0, 0, .83129],
              732: [0, .66786, .11585, 0, .51111],
              733: [0, .69444, .1225, 0, .51111],
              915: [0, .68333, .13305, 0, .62722],
              916: [0, .68333, 0, 0, .81777],
              920: [0, .68333, .09403, 0, .76666],
              923: [0, .68333, 0, 0, .69222],
              926: [0, .68333, .15294, 0, .66444],
              928: [0, .68333, .16389, 0, .74333],
              931: [0, .68333, .12028, 0, .71555],
              933: [0, .68333, .11111, 0, .76666],
              934: [0, .68333, .05986, 0, .71555],
              936: [0, .68333, .11111, 0, .76666],
              937: [0, .68333, .10257, 0, .71555],
              8211: [0, .43056, .09208, 0, .51111],
              8212: [0, .43056, .09208, 0, 1.02222],
              8216: [0, .69444, .12417, 0, .30667],
              8217: [0, .69444, .12417, 0, .30667],
              8220: [0, .69444, .1685, 0, .51444],
              8221: [0, .69444, .06961, 0, .51444],
              8463: [0, .68889, 0, 0, .54028]
            },
            "Main-Regular": {
              32: [0, 0, 0, 0, .25],
              33: [0, .69444, 0, 0, .27778],
              34: [0, .69444, 0, 0, .5],
              35: [.19444, .69444, 0, 0, .83334],
              36: [.05556, .75, 0, 0, .5],
              37: [.05556, .75, 0, 0, .83334],
              38: [0, .69444, 0, 0, .77778],
              39: [0, .69444, 0, 0, .27778],
              40: [.25, .75, 0, 0, .38889],
              41: [.25, .75, 0, 0, .38889],
              42: [0, .75, 0, 0, .5],
              43: [.08333, .58333, 0, 0, .77778],
              44: [.19444, .10556, 0, 0, .27778],
              45: [0, .43056, 0, 0, .33333],
              46: [0, .10556, 0, 0, .27778],
              47: [.25, .75, 0, 0, .5],
              48: [0, .64444, 0, 0, .5],
              49: [0, .64444, 0, 0, .5],
              50: [0, .64444, 0, 0, .5],
              51: [0, .64444, 0, 0, .5],
              52: [0, .64444, 0, 0, .5],
              53: [0, .64444, 0, 0, .5],
              54: [0, .64444, 0, 0, .5],
              55: [0, .64444, 0, 0, .5],
              56: [0, .64444, 0, 0, .5],
              57: [0, .64444, 0, 0, .5],
              58: [0, .43056, 0, 0, .27778],
              59: [.19444, .43056, 0, 0, .27778],
              60: [.0391, .5391, 0, 0, .77778],
              61: [-.13313, .36687, 0, 0, .77778],
              62: [.0391, .5391, 0, 0, .77778],
              63: [0, .69444, 0, 0, .47222],
              64: [0, .69444, 0, 0, .77778],
              65: [0, .68333, 0, 0, .75],
              66: [0, .68333, 0, 0, .70834],
              67: [0, .68333, 0, 0, .72222],
              68: [0, .68333, 0, 0, .76389],
              69: [0, .68333, 0, 0, .68056],
              70: [0, .68333, 0, 0, .65278],
              71: [0, .68333, 0, 0, .78472],
              72: [0, .68333, 0, 0, .75],
              73: [0, .68333, 0, 0, .36111],
              74: [0, .68333, 0, 0, .51389],
              75: [0, .68333, 0, 0, .77778],
              76: [0, .68333, 0, 0, .625],
              77: [0, .68333, 0, 0, .91667],
              78: [0, .68333, 0, 0, .75],
              79: [0, .68333, 0, 0, .77778],
              80: [0, .68333, 0, 0, .68056],
              81: [.19444, .68333, 0, 0, .77778],
              82: [0, .68333, 0, 0, .73611],
              83: [0, .68333, 0, 0, .55556],
              84: [0, .68333, 0, 0, .72222],
              85: [0, .68333, 0, 0, .75],
              86: [0, .68333, .01389, 0, .75],
              87: [0, .68333, .01389, 0, 1.02778],
              88: [0, .68333, 0, 0, .75],
              89: [0, .68333, .025, 0, .75],
              90: [0, .68333, 0, 0, .61111],
              91: [.25, .75, 0, 0, .27778],
              92: [.25, .75, 0, 0, .5],
              93: [.25, .75, 0, 0, .27778],
              94: [0, .69444, 0, 0, .5],
              95: [.31, .12056, .02778, 0, .5],
              97: [0, .43056, 0, 0, .5],
              98: [0, .69444, 0, 0, .55556],
              99: [0, .43056, 0, 0, .44445],
              100: [0, .69444, 0, 0, .55556],
              101: [0, .43056, 0, 0, .44445],
              102: [0, .69444, .07778, 0, .30556],
              103: [.19444, .43056, .01389, 0, .5],
              104: [0, .69444, 0, 0, .55556],
              105: [0, .66786, 0, 0, .27778],
              106: [.19444, .66786, 0, 0, .30556],
              107: [0, .69444, 0, 0, .52778],
              108: [0, .69444, 0, 0, .27778],
              109: [0, .43056, 0, 0, .83334],
              110: [0, .43056, 0, 0, .55556],
              111: [0, .43056, 0, 0, .5],
              112: [.19444, .43056, 0, 0, .55556],
              113: [.19444, .43056, 0, 0, .52778],
              114: [0, .43056, 0, 0, .39167],
              115: [0, .43056, 0, 0, .39445],
              116: [0, .61508, 0, 0, .38889],
              117: [0, .43056, 0, 0, .55556],
              118: [0, .43056, .01389, 0, .52778],
              119: [0, .43056, .01389, 0, .72222],
              120: [0, .43056, 0, 0, .52778],
              121: [.19444, .43056, .01389, 0, .52778],
              122: [0, .43056, 0, 0, .44445],
              123: [.25, .75, 0, 0, .5],
              124: [.25, .75, 0, 0, .27778],
              125: [.25, .75, 0, 0, .5],
              126: [.35, .31786, 0, 0, .5],
              160: [0, 0, 0, 0, .25],
              163: [0, .69444, 0, 0, .76909],
              167: [.19444, .69444, 0, 0, .44445],
              168: [0, .66786, 0, 0, .5],
              172: [0, .43056, 0, 0, .66667],
              176: [0, .69444, 0, 0, .75],
              177: [.08333, .58333, 0, 0, .77778],
              182: [.19444, .69444, 0, 0, .61111],
              184: [.17014, 0, 0, 0, .44445],
              198: [0, .68333, 0, 0, .90278],
              215: [.08333, .58333, 0, 0, .77778],
              216: [.04861, .73194, 0, 0, .77778],
              223: [0, .69444, 0, 0, .5],
              230: [0, .43056, 0, 0, .72222],
              247: [.08333, .58333, 0, 0, .77778],
              248: [.09722, .52778, 0, 0, .5],
              305: [0, .43056, 0, 0, .27778],
              338: [0, .68333, 0, 0, 1.01389],
              339: [0, .43056, 0, 0, .77778],
              567: [.19444, .43056, 0, 0, .30556],
              710: [0, .69444, 0, 0, .5],
              711: [0, .62847, 0, 0, .5],
              713: [0, .56778, 0, 0, .5],
              714: [0, .69444, 0, 0, .5],
              715: [0, .69444, 0, 0, .5],
              728: [0, .69444, 0, 0, .5],
              729: [0, .66786, 0, 0, .27778],
              730: [0, .69444, 0, 0, .75],
              732: [0, .66786, 0, 0, .5],
              733: [0, .69444, 0, 0, .5],
              915: [0, .68333, 0, 0, .625],
              916: [0, .68333, 0, 0, .83334],
              920: [0, .68333, 0, 0, .77778],
              923: [0, .68333, 0, 0, .69445],
              926: [0, .68333, 0, 0, .66667],
              928: [0, .68333, 0, 0, .75],
              931: [0, .68333, 0, 0, .72222],
              933: [0, .68333, 0, 0, .77778],
              934: [0, .68333, 0, 0, .72222],
              936: [0, .68333, 0, 0, .77778],
              937: [0, .68333, 0, 0, .72222],
              8211: [0, .43056, .02778, 0, .5],
              8212: [0, .43056, .02778, 0, 1],
              8216: [0, .69444, 0, 0, .27778],
              8217: [0, .69444, 0, 0, .27778],
              8220: [0, .69444, 0, 0, .5],
              8221: [0, .69444, 0, 0, .5],
              8224: [.19444, .69444, 0, 0, .44445],
              8225: [.19444, .69444, 0, 0, .44445],
              8230: [0, .123, 0, 0, 1.172],
              8242: [0, .55556, 0, 0, .275],
              8407: [0, .71444, .15382, 0, .5],
              8463: [0, .68889, 0, 0, .54028],
              8465: [0, .69444, 0, 0, .72222],
              8467: [0, .69444, 0, .11111, .41667],
              8472: [.19444, .43056, 0, .11111, .63646],
              8476: [0, .69444, 0, 0, .72222],
              8501: [0, .69444, 0, 0, .61111],
              8592: [-.13313, .36687, 0, 0, 1],
              8593: [.19444, .69444, 0, 0, .5],
              8594: [-.13313, .36687, 0, 0, 1],
              8595: [.19444, .69444, 0, 0, .5],
              8596: [-.13313, .36687, 0, 0, 1],
              8597: [.25, .75, 0, 0, .5],
              8598: [.19444, .69444, 0, 0, 1],
              8599: [.19444, .69444, 0, 0, 1],
              8600: [.19444, .69444, 0, 0, 1],
              8601: [.19444, .69444, 0, 0, 1],
              8614: [.011, .511, 0, 0, 1],
              8617: [.011, .511, 0, 0, 1.126],
              8618: [.011, .511, 0, 0, 1.126],
              8636: [-.13313, .36687, 0, 0, 1],
              8637: [-.13313, .36687, 0, 0, 1],
              8640: [-.13313, .36687, 0, 0, 1],
              8641: [-.13313, .36687, 0, 0, 1],
              8652: [.011, .671, 0, 0, 1],
              8656: [-.13313, .36687, 0, 0, 1],
              8657: [.19444, .69444, 0, 0, .61111],
              8658: [-.13313, .36687, 0, 0, 1],
              8659: [.19444, .69444, 0, 0, .61111],
              8660: [-.13313, .36687, 0, 0, 1],
              8661: [.25, .75, 0, 0, .61111],
              8704: [0, .69444, 0, 0, .55556],
              8706: [0, .69444, .05556, .08334, .5309],
              8707: [0, .69444, 0, 0, .55556],
              8709: [.05556, .75, 0, 0, .5],
              8711: [0, .68333, 0, 0, .83334],
              8712: [.0391, .5391, 0, 0, .66667],
              8715: [.0391, .5391, 0, 0, .66667],
              8722: [.08333, .58333, 0, 0, .77778],
              8723: [.08333, .58333, 0, 0, .77778],
              8725: [.25, .75, 0, 0, .5],
              8726: [.25, .75, 0, 0, .5],
              8727: [-.03472, .46528, 0, 0, .5],
              8728: [-.05555, .44445, 0, 0, .5],
              8729: [-.05555, .44445, 0, 0, .5],
              8730: [.2, .8, 0, 0, .83334],
              8733: [0, .43056, 0, 0, .77778],
              8734: [0, .43056, 0, 0, 1],
              8736: [0, .69224, 0, 0, .72222],
              8739: [.25, .75, 0, 0, .27778],
              8741: [.25, .75, 0, 0, .5],
              8743: [0, .55556, 0, 0, .66667],
              8744: [0, .55556, 0, 0, .66667],
              8745: [0, .55556, 0, 0, .66667],
              8746: [0, .55556, 0, 0, .66667],
              8747: [.19444, .69444, .11111, 0, .41667],
              8764: [-.13313, .36687, 0, 0, .77778],
              8768: [.19444, .69444, 0, 0, .27778],
              8771: [-.03625, .46375, 0, 0, .77778],
              8773: [-.022, .589, 0, 0, .778],
              8776: [-.01688, .48312, 0, 0, .77778],
              8781: [-.03625, .46375, 0, 0, .77778],
              8784: [-.133, .673, 0, 0, .778],
              8801: [-.03625, .46375, 0, 0, .77778],
              8804: [.13597, .63597, 0, 0, .77778],
              8805: [.13597, .63597, 0, 0, .77778],
              8810: [.0391, .5391, 0, 0, 1],
              8811: [.0391, .5391, 0, 0, 1],
              8826: [.0391, .5391, 0, 0, .77778],
              8827: [.0391, .5391, 0, 0, .77778],
              8834: [.0391, .5391, 0, 0, .77778],
              8835: [.0391, .5391, 0, 0, .77778],
              8838: [.13597, .63597, 0, 0, .77778],
              8839: [.13597, .63597, 0, 0, .77778],
              8846: [0, .55556, 0, 0, .66667],
              8849: [.13597, .63597, 0, 0, .77778],
              8850: [.13597, .63597, 0, 0, .77778],
              8851: [0, .55556, 0, 0, .66667],
              8852: [0, .55556, 0, 0, .66667],
              8853: [.08333, .58333, 0, 0, .77778],
              8854: [.08333, .58333, 0, 0, .77778],
              8855: [.08333, .58333, 0, 0, .77778],
              8856: [.08333, .58333, 0, 0, .77778],
              8857: [.08333, .58333, 0, 0, .77778],
              8866: [0, .69444, 0, 0, .61111],
              8867: [0, .69444, 0, 0, .61111],
              8868: [0, .69444, 0, 0, .77778],
              8869: [0, .69444, 0, 0, .77778],
              8872: [.249, .75, 0, 0, .867],
              8900: [-.05555, .44445, 0, 0, .5],
              8901: [-.05555, .44445, 0, 0, .27778],
              8902: [-.03472, .46528, 0, 0, .5],
              8904: [.005, .505, 0, 0, .9],
              8942: [.03, .903, 0, 0, .278],
              8943: [-.19, .313, 0, 0, 1.172],
              8945: [-.1, .823, 0, 0, 1.282],
              8968: [.25, .75, 0, 0, .44445],
              8969: [.25, .75, 0, 0, .44445],
              8970: [.25, .75, 0, 0, .44445],
              8971: [.25, .75, 0, 0, .44445],
              8994: [-.14236, .35764, 0, 0, 1],
              8995: [-.14236, .35764, 0, 0, 1],
              9136: [.244, .744, 0, 0, .412],
              9137: [.244, .745, 0, 0, .412],
              9651: [.19444, .69444, 0, 0, .88889],
              9657: [-.03472, .46528, 0, 0, .5],
              9661: [.19444, .69444, 0, 0, .88889],
              9667: [-.03472, .46528, 0, 0, .5],
              9711: [.19444, .69444, 0, 0, 1],
              9824: [.12963, .69444, 0, 0, .77778],
              9825: [.12963, .69444, 0, 0, .77778],
              9826: [.12963, .69444, 0, 0, .77778],
              9827: [.12963, .69444, 0, 0, .77778],
              9837: [0, .75, 0, 0, .38889],
              9838: [.19444, .69444, 0, 0, .38889],
              9839: [.19444, .69444, 0, 0, .38889],
              10216: [.25, .75, 0, 0, .38889],
              10217: [.25, .75, 0, 0, .38889],
              10222: [.244, .744, 0, 0, .412],
              10223: [.244, .745, 0, 0, .412],
              10229: [.011, .511, 0, 0, 1.609],
              10230: [.011, .511, 0, 0, 1.638],
              10231: [.011, .511, 0, 0, 1.859],
              10232: [.024, .525, 0, 0, 1.609],
              10233: [.024, .525, 0, 0, 1.638],
              10234: [.024, .525, 0, 0, 1.858],
              10236: [.011, .511, 0, 0, 1.638],
              10815: [0, .68333, 0, 0, .75],
              10927: [.13597, .63597, 0, 0, .77778],
              10928: [.13597, .63597, 0, 0, .77778],
              57376: [.19444, .69444, 0, 0, 0]
            },
            "Math-BoldItalic": {
              32: [0, 0, 0, 0, .25],
              48: [0, .44444, 0, 0, .575],
              49: [0, .44444, 0, 0, .575],
              50: [0, .44444, 0, 0, .575],
              51: [.19444, .44444, 0, 0, .575],
              52: [.19444, .44444, 0, 0, .575],
              53: [.19444, .44444, 0, 0, .575],
              54: [0, .64444, 0, 0, .575],
              55: [.19444, .44444, 0, 0, .575],
              56: [0, .64444, 0, 0, .575],
              57: [.19444, .44444, 0, 0, .575],
              65: [0, .68611, 0, 0, .86944],
              66: [0, .68611, .04835, 0, .8664],
              67: [0, .68611, .06979, 0, .81694],
              68: [0, .68611, .03194, 0, .93812],
              69: [0, .68611, .05451, 0, .81007],
              70: [0, .68611, .15972, 0, .68889],
              71: [0, .68611, 0, 0, .88673],
              72: [0, .68611, .08229, 0, .98229],
              73: [0, .68611, .07778, 0, .51111],
              74: [0, .68611, .10069, 0, .63125],
              75: [0, .68611, .06979, 0, .97118],
              76: [0, .68611, 0, 0, .75555],
              77: [0, .68611, .11424, 0, 1.14201],
              78: [0, .68611, .11424, 0, .95034],
              79: [0, .68611, .03194, 0, .83666],
              80: [0, .68611, .15972, 0, .72309],
              81: [.19444, .68611, 0, 0, .86861],
              82: [0, .68611, .00421, 0, .87235],
              83: [0, .68611, .05382, 0, .69271],
              84: [0, .68611, .15972, 0, .63663],
              85: [0, .68611, .11424, 0, .80027],
              86: [0, .68611, .25555, 0, .67778],
              87: [0, .68611, .15972, 0, 1.09305],
              88: [0, .68611, .07778, 0, .94722],
              89: [0, .68611, .25555, 0, .67458],
              90: [0, .68611, .06979, 0, .77257],
              97: [0, .44444, 0, 0, .63287],
              98: [0, .69444, 0, 0, .52083],
              99: [0, .44444, 0, 0, .51342],
              100: [0, .69444, 0, 0, .60972],
              101: [0, .44444, 0, 0, .55361],
              102: [.19444, .69444, .11042, 0, .56806],
              103: [.19444, .44444, .03704, 0, .5449],
              104: [0, .69444, 0, 0, .66759],
              105: [0, .69326, 0, 0, .4048],
              106: [.19444, .69326, .0622, 0, .47083],
              107: [0, .69444, .01852, 0, .6037],
              108: [0, .69444, .0088, 0, .34815],
              109: [0, .44444, 0, 0, 1.0324],
              110: [0, .44444, 0, 0, .71296],
              111: [0, .44444, 0, 0, .58472],
              112: [.19444, .44444, 0, 0, .60092],
              113: [.19444, .44444, .03704, 0, .54213],
              114: [0, .44444, .03194, 0, .5287],
              115: [0, .44444, 0, 0, .53125],
              116: [0, .63492, 0, 0, .41528],
              117: [0, .44444, 0, 0, .68102],
              118: [0, .44444, .03704, 0, .56666],
              119: [0, .44444, .02778, 0, .83148],
              120: [0, .44444, 0, 0, .65903],
              121: [.19444, .44444, .03704, 0, .59028],
              122: [0, .44444, .04213, 0, .55509],
              160: [0, 0, 0, 0, .25],
              915: [0, .68611, .15972, 0, .65694],
              916: [0, .68611, 0, 0, .95833],
              920: [0, .68611, .03194, 0, .86722],
              923: [0, .68611, 0, 0, .80555],
              926: [0, .68611, .07458, 0, .84125],
              928: [0, .68611, .08229, 0, .98229],
              931: [0, .68611, .05451, 0, .88507],
              933: [0, .68611, .15972, 0, .67083],
              934: [0, .68611, 0, 0, .76666],
              936: [0, .68611, .11653, 0, .71402],
              937: [0, .68611, .04835, 0, .8789],
              945: [0, .44444, 0, 0, .76064],
              946: [.19444, .69444, .03403, 0, .65972],
              947: [.19444, .44444, .06389, 0, .59003],
              948: [0, .69444, .03819, 0, .52222],
              949: [0, .44444, 0, 0, .52882],
              950: [.19444, .69444, .06215, 0, .50833],
              951: [.19444, .44444, .03704, 0, .6],
              952: [0, .69444, .03194, 0, .5618],
              953: [0, .44444, 0, 0, .41204],
              954: [0, .44444, 0, 0, .66759],
              955: [0, .69444, 0, 0, .67083],
              956: [.19444, .44444, 0, 0, .70787],
              957: [0, .44444, .06898, 0, .57685],
              958: [.19444, .69444, .03021, 0, .50833],
              959: [0, .44444, 0, 0, .58472],
              960: [0, .44444, .03704, 0, .68241],
              961: [.19444, .44444, 0, 0, .6118],
              962: [.09722, .44444, .07917, 0, .42361],
              963: [0, .44444, .03704, 0, .68588],
              964: [0, .44444, .13472, 0, .52083],
              965: [0, .44444, .03704, 0, .63055],
              966: [.19444, .44444, 0, 0, .74722],
              967: [.19444, .44444, 0, 0, .71805],
              968: [.19444, .69444, .03704, 0, .75833],
              969: [0, .44444, .03704, 0, .71782],
              977: [0, .69444, 0, 0, .69155],
              981: [.19444, .69444, 0, 0, .7125],
              982: [0, .44444, .03194, 0, .975],
              1009: [.19444, .44444, 0, 0, .6118],
              1013: [0, .44444, 0, 0, .48333],
              57649: [0, .44444, 0, 0, .39352],
              57911: [.19444, .44444, 0, 0, .43889]
            },
            "Math-Italic": {
              32: [0, 0, 0, 0, .25],
              48: [0, .43056, 0, 0, .5],
              49: [0, .43056, 0, 0, .5],
              50: [0, .43056, 0, 0, .5],
              51: [.19444, .43056, 0, 0, .5],
              52: [.19444, .43056, 0, 0, .5],
              53: [.19444, .43056, 0, 0, .5],
              54: [0, .64444, 0, 0, .5],
              55: [.19444, .43056, 0, 0, .5],
              56: [0, .64444, 0, 0, .5],
              57: [.19444, .43056, 0, 0, .5],
              65: [0, .68333, 0, .13889, .75],
              66: [0, .68333, .05017, .08334, .75851],
              67: [0, .68333, .07153, .08334, .71472],
              68: [0, .68333, .02778, .05556, .82792],
              69: [0, .68333, .05764, .08334, .7382],
              70: [0, .68333, .13889, .08334, .64306],
              71: [0, .68333, 0, .08334, .78625],
              72: [0, .68333, .08125, .05556, .83125],
              73: [0, .68333, .07847, .11111, .43958],
              74: [0, .68333, .09618, .16667, .55451],
              75: [0, .68333, .07153, .05556, .84931],
              76: [0, .68333, 0, .02778, .68056],
              77: [0, .68333, .10903, .08334, .97014],
              78: [0, .68333, .10903, .08334, .80347],
              79: [0, .68333, .02778, .08334, .76278],
              80: [0, .68333, .13889, .08334, .64201],
              81: [.19444, .68333, 0, .08334, .79056],
              82: [0, .68333, .00773, .08334, .75929],
              83: [0, .68333, .05764, .08334, .6132],
              84: [0, .68333, .13889, .08334, .58438],
              85: [0, .68333, .10903, .02778, .68278],
              86: [0, .68333, .22222, 0, .58333],
              87: [0, .68333, .13889, 0, .94445],
              88: [0, .68333, .07847, .08334, .82847],
              89: [0, .68333, .22222, 0, .58056],
              90: [0, .68333, .07153, .08334, .68264],
              97: [0, .43056, 0, 0, .52859],
              98: [0, .69444, 0, 0, .42917],
              99: [0, .43056, 0, .05556, .43276],
              100: [0, .69444, 0, .16667, .52049],
              101: [0, .43056, 0, .05556, .46563],
              102: [.19444, .69444, .10764, .16667, .48959],
              103: [.19444, .43056, .03588, .02778, .47697],
              104: [0, .69444, 0, 0, .57616],
              105: [0, .65952, 0, 0, .34451],
              106: [.19444, .65952, .05724, 0, .41181],
              107: [0, .69444, .03148, 0, .5206],
              108: [0, .69444, .01968, .08334, .29838],
              109: [0, .43056, 0, 0, .87801],
              110: [0, .43056, 0, 0, .60023],
              111: [0, .43056, 0, .05556, .48472],
              112: [.19444, .43056, 0, .08334, .50313],
              113: [.19444, .43056, .03588, .08334, .44641],
              114: [0, .43056, .02778, .05556, .45116],
              115: [0, .43056, 0, .05556, .46875],
              116: [0, .61508, 0, .08334, .36111],
              117: [0, .43056, 0, .02778, .57246],
              118: [0, .43056, .03588, .02778, .48472],
              119: [0, .43056, .02691, .08334, .71592],
              120: [0, .43056, 0, .02778, .57153],
              121: [.19444, .43056, .03588, .05556, .49028],
              122: [0, .43056, .04398, .05556, .46505],
              160: [0, 0, 0, 0, .25],
              915: [0, .68333, .13889, .08334, .61528],
              916: [0, .68333, 0, .16667, .83334],
              920: [0, .68333, .02778, .08334, .76278],
              923: [0, .68333, 0, .16667, .69445],
              926: [0, .68333, .07569, .08334, .74236],
              928: [0, .68333, .08125, .05556, .83125],
              931: [0, .68333, .05764, .08334, .77986],
              933: [0, .68333, .13889, .05556, .58333],
              934: [0, .68333, 0, .08334, .66667],
              936: [0, .68333, .11, .05556, .61222],
              937: [0, .68333, .05017, .08334, .7724],
              945: [0, .43056, .0037, .02778, .6397],
              946: [.19444, .69444, .05278, .08334, .56563],
              947: [.19444, .43056, .05556, 0, .51773],
              948: [0, .69444, .03785, .05556, .44444],
              949: [0, .43056, 0, .08334, .46632],
              950: [.19444, .69444, .07378, .08334, .4375],
              951: [.19444, .43056, .03588, .05556, .49653],
              952: [0, .69444, .02778, .08334, .46944],
              953: [0, .43056, 0, .05556, .35394],
              954: [0, .43056, 0, 0, .57616],
              955: [0, .69444, 0, 0, .58334],
              956: [.19444, .43056, 0, .02778, .60255],
              957: [0, .43056, .06366, .02778, .49398],
              958: [.19444, .69444, .04601, .11111, .4375],
              959: [0, .43056, 0, .05556, .48472],
              960: [0, .43056, .03588, 0, .57003],
              961: [.19444, .43056, 0, .08334, .51702],
              962: [.09722, .43056, .07986, .08334, .36285],
              963: [0, .43056, .03588, 0, .57141],
              964: [0, .43056, .1132, .02778, .43715],
              965: [0, .43056, .03588, .02778, .54028],
              966: [.19444, .43056, 0, .08334, .65417],
              967: [.19444, .43056, 0, .05556, .62569],
              968: [.19444, .69444, .03588, .11111, .65139],
              969: [0, .43056, .03588, 0, .62245],
              977: [0, .69444, 0, .08334, .59144],
              981: [.19444, .69444, 0, .08334, .59583],
              982: [0, .43056, .02778, 0, .82813],
              1009: [.19444, .43056, 0, .08334, .51702],
              1013: [0, .43056, 0, .05556, .4059],
              57649: [0, .43056, 0, .02778, .32246],
              57911: [.19444, .43056, 0, .08334, .38403]
            },
            "SansSerif-Bold": {
              32: [0, 0, 0, 0, .25],
              33: [0, .69444, 0, 0, .36667],
              34: [0, .69444, 0, 0, .55834],
              35: [.19444, .69444, 0, 0, .91667],
              36: [.05556, .75, 0, 0, .55],
              37: [.05556, .75, 0, 0, 1.02912],
              38: [0, .69444, 0, 0, .83056],
              39: [0, .69444, 0, 0, .30556],
              40: [.25, .75, 0, 0, .42778],
              41: [.25, .75, 0, 0, .42778],
              42: [0, .75, 0, 0, .55],
              43: [.11667, .61667, 0, 0, .85556],
              44: [.10556, .13056, 0, 0, .30556],
              45: [0, .45833, 0, 0, .36667],
              46: [0, .13056, 0, 0, .30556],
              47: [.25, .75, 0, 0, .55],
              48: [0, .69444, 0, 0, .55],
              49: [0, .69444, 0, 0, .55],
              50: [0, .69444, 0, 0, .55],
              51: [0, .69444, 0, 0, .55],
              52: [0, .69444, 0, 0, .55],
              53: [0, .69444, 0, 0, .55],
              54: [0, .69444, 0, 0, .55],
              55: [0, .69444, 0, 0, .55],
              56: [0, .69444, 0, 0, .55],
              57: [0, .69444, 0, 0, .55],
              58: [0, .45833, 0, 0, .30556],
              59: [.10556, .45833, 0, 0, .30556],
              61: [-.09375, .40625, 0, 0, .85556],
              63: [0, .69444, 0, 0, .51945],
              64: [0, .69444, 0, 0, .73334],
              65: [0, .69444, 0, 0, .73334],
              66: [0, .69444, 0, 0, .73334],
              67: [0, .69444, 0, 0, .70278],
              68: [0, .69444, 0, 0, .79445],
              69: [0, .69444, 0, 0, .64167],
              70: [0, .69444, 0, 0, .61111],
              71: [0, .69444, 0, 0, .73334],
              72: [0, .69444, 0, 0, .79445],
              73: [0, .69444, 0, 0, .33056],
              74: [0, .69444, 0, 0, .51945],
              75: [0, .69444, 0, 0, .76389],
              76: [0, .69444, 0, 0, .58056],
              77: [0, .69444, 0, 0, .97778],
              78: [0, .69444, 0, 0, .79445],
              79: [0, .69444, 0, 0, .79445],
              80: [0, .69444, 0, 0, .70278],
              81: [.10556, .69444, 0, 0, .79445],
              82: [0, .69444, 0, 0, .70278],
              83: [0, .69444, 0, 0, .61111],
              84: [0, .69444, 0, 0, .73334],
              85: [0, .69444, 0, 0, .76389],
              86: [0, .69444, .01528, 0, .73334],
              87: [0, .69444, .01528, 0, 1.03889],
              88: [0, .69444, 0, 0, .73334],
              89: [0, .69444, .0275, 0, .73334],
              90: [0, .69444, 0, 0, .67223],
              91: [.25, .75, 0, 0, .34306],
              93: [.25, .75, 0, 0, .34306],
              94: [0, .69444, 0, 0, .55],
              95: [.35, .10833, .03056, 0, .55],
              97: [0, .45833, 0, 0, .525],
              98: [0, .69444, 0, 0, .56111],
              99: [0, .45833, 0, 0, .48889],
              100: [0, .69444, 0, 0, .56111],
              101: [0, .45833, 0, 0, .51111],
              102: [0, .69444, .07639, 0, .33611],
              103: [.19444, .45833, .01528, 0, .55],
              104: [0, .69444, 0, 0, .56111],
              105: [0, .69444, 0, 0, .25556],
              106: [.19444, .69444, 0, 0, .28611],
              107: [0, .69444, 0, 0, .53056],
              108: [0, .69444, 0, 0, .25556],
              109: [0, .45833, 0, 0, .86667],
              110: [0, .45833, 0, 0, .56111],
              111: [0, .45833, 0, 0, .55],
              112: [.19444, .45833, 0, 0, .56111],
              113: [.19444, .45833, 0, 0, .56111],
              114: [0, .45833, .01528, 0, .37222],
              115: [0, .45833, 0, 0, .42167],
              116: [0, .58929, 0, 0, .40417],
              117: [0, .45833, 0, 0, .56111],
              118: [0, .45833, .01528, 0, .5],
              119: [0, .45833, .01528, 0, .74445],
              120: [0, .45833, 0, 0, .5],
              121: [.19444, .45833, .01528, 0, .5],
              122: [0, .45833, 0, 0, .47639],
              126: [.35, .34444, 0, 0, .55],
              160: [0, 0, 0, 0, .25],
              168: [0, .69444, 0, 0, .55],
              176: [0, .69444, 0, 0, .73334],
              180: [0, .69444, 0, 0, .55],
              184: [.17014, 0, 0, 0, .48889],
              305: [0, .45833, 0, 0, .25556],
              567: [.19444, .45833, 0, 0, .28611],
              710: [0, .69444, 0, 0, .55],
              711: [0, .63542, 0, 0, .55],
              713: [0, .63778, 0, 0, .55],
              728: [0, .69444, 0, 0, .55],
              729: [0, .69444, 0, 0, .30556],
              730: [0, .69444, 0, 0, .73334],
              732: [0, .69444, 0, 0, .55],
              733: [0, .69444, 0, 0, .55],
              915: [0, .69444, 0, 0, .58056],
              916: [0, .69444, 0, 0, .91667],
              920: [0, .69444, 0, 0, .85556],
              923: [0, .69444, 0, 0, .67223],
              926: [0, .69444, 0, 0, .73334],
              928: [0, .69444, 0, 0, .79445],
              931: [0, .69444, 0, 0, .79445],
              933: [0, .69444, 0, 0, .85556],
              934: [0, .69444, 0, 0, .79445],
              936: [0, .69444, 0, 0, .85556],
              937: [0, .69444, 0, 0, .79445],
              8211: [0, .45833, .03056, 0, .55],
              8212: [0, .45833, .03056, 0, 1.10001],
              8216: [0, .69444, 0, 0, .30556],
              8217: [0, .69444, 0, 0, .30556],
              8220: [0, .69444, 0, 0, .55834],
              8221: [0, .69444, 0, 0, .55834]
            },
            "SansSerif-Italic": {
              32: [0, 0, 0, 0, .25],
              33: [0, .69444, .05733, 0, .31945],
              34: [0, .69444, .00316, 0, .5],
              35: [.19444, .69444, .05087, 0, .83334],
              36: [.05556, .75, .11156, 0, .5],
              37: [.05556, .75, .03126, 0, .83334],
              38: [0, .69444, .03058, 0, .75834],
              39: [0, .69444, .07816, 0, .27778],
              40: [.25, .75, .13164, 0, .38889],
              41: [.25, .75, .02536, 0, .38889],
              42: [0, .75, .11775, 0, .5],
              43: [.08333, .58333, .02536, 0, .77778],
              44: [.125, .08333, 0, 0, .27778],
              45: [0, .44444, .01946, 0, .33333],
              46: [0, .08333, 0, 0, .27778],
              47: [.25, .75, .13164, 0, .5],
              48: [0, .65556, .11156, 0, .5],
              49: [0, .65556, .11156, 0, .5],
              50: [0, .65556, .11156, 0, .5],
              51: [0, .65556, .11156, 0, .5],
              52: [0, .65556, .11156, 0, .5],
              53: [0, .65556, .11156, 0, .5],
              54: [0, .65556, .11156, 0, .5],
              55: [0, .65556, .11156, 0, .5],
              56: [0, .65556, .11156, 0, .5],
              57: [0, .65556, .11156, 0, .5],
              58: [0, .44444, .02502, 0, .27778],
              59: [.125, .44444, .02502, 0, .27778],
              61: [-.13, .37, .05087, 0, .77778],
              63: [0, .69444, .11809, 0, .47222],
              64: [0, .69444, .07555, 0, .66667],
              65: [0, .69444, 0, 0, .66667],
              66: [0, .69444, .08293, 0, .66667],
              67: [0, .69444, .11983, 0, .63889],
              68: [0, .69444, .07555, 0, .72223],
              69: [0, .69444, .11983, 0, .59722],
              70: [0, .69444, .13372, 0, .56945],
              71: [0, .69444, .11983, 0, .66667],
              72: [0, .69444, .08094, 0, .70834],
              73: [0, .69444, .13372, 0, .27778],
              74: [0, .69444, .08094, 0, .47222],
              75: [0, .69444, .11983, 0, .69445],
              76: [0, .69444, 0, 0, .54167],
              77: [0, .69444, .08094, 0, .875],
              78: [0, .69444, .08094, 0, .70834],
              79: [0, .69444, .07555, 0, .73611],
              80: [0, .69444, .08293, 0, .63889],
              81: [.125, .69444, .07555, 0, .73611],
              82: [0, .69444, .08293, 0, .64584],
              83: [0, .69444, .09205, 0, .55556],
              84: [0, .69444, .13372, 0, .68056],
              85: [0, .69444, .08094, 0, .6875],
              86: [0, .69444, .1615, 0, .66667],
              87: [0, .69444, .1615, 0, .94445],
              88: [0, .69444, .13372, 0, .66667],
              89: [0, .69444, .17261, 0, .66667],
              90: [0, .69444, .11983, 0, .61111],
              91: [.25, .75, .15942, 0, .28889],
              93: [.25, .75, .08719, 0, .28889],
              94: [0, .69444, .0799, 0, .5],
              95: [.35, .09444, .08616, 0, .5],
              97: [0, .44444, .00981, 0, .48056],
              98: [0, .69444, .03057, 0, .51667],
              99: [0, .44444, .08336, 0, .44445],
              100: [0, .69444, .09483, 0, .51667],
              101: [0, .44444, .06778, 0, .44445],
              102: [0, .69444, .21705, 0, .30556],
              103: [.19444, .44444, .10836, 0, .5],
              104: [0, .69444, .01778, 0, .51667],
              105: [0, .67937, .09718, 0, .23889],
              106: [.19444, .67937, .09162, 0, .26667],
              107: [0, .69444, .08336, 0, .48889],
              108: [0, .69444, .09483, 0, .23889],
              109: [0, .44444, .01778, 0, .79445],
              110: [0, .44444, .01778, 0, .51667],
              111: [0, .44444, .06613, 0, .5],
              112: [.19444, .44444, .0389, 0, .51667],
              113: [.19444, .44444, .04169, 0, .51667],
              114: [0, .44444, .10836, 0, .34167],
              115: [0, .44444, .0778, 0, .38333],
              116: [0, .57143, .07225, 0, .36111],
              117: [0, .44444, .04169, 0, .51667],
              118: [0, .44444, .10836, 0, .46111],
              119: [0, .44444, .10836, 0, .68334],
              120: [0, .44444, .09169, 0, .46111],
              121: [.19444, .44444, .10836, 0, .46111],
              122: [0, .44444, .08752, 0, .43472],
              126: [.35, .32659, .08826, 0, .5],
              160: [0, 0, 0, 0, .25],
              168: [0, .67937, .06385, 0, .5],
              176: [0, .69444, 0, 0, .73752],
              184: [.17014, 0, 0, 0, .44445],
              305: [0, .44444, .04169, 0, .23889],
              567: [.19444, .44444, .04169, 0, .26667],
              710: [0, .69444, .0799, 0, .5],
              711: [0, .63194, .08432, 0, .5],
              713: [0, .60889, .08776, 0, .5],
              714: [0, .69444, .09205, 0, .5],
              715: [0, .69444, 0, 0, .5],
              728: [0, .69444, .09483, 0, .5],
              729: [0, .67937, .07774, 0, .27778],
              730: [0, .69444, 0, 0, .73752],
              732: [0, .67659, .08826, 0, .5],
              733: [0, .69444, .09205, 0, .5],
              915: [0, .69444, .13372, 0, .54167],
              916: [0, .69444, 0, 0, .83334],
              920: [0, .69444, .07555, 0, .77778],
              923: [0, .69444, 0, 0, .61111],
              926: [0, .69444, .12816, 0, .66667],
              928: [0, .69444, .08094, 0, .70834],
              931: [0, .69444, .11983, 0, .72222],
              933: [0, .69444, .09031, 0, .77778],
              934: [0, .69444, .04603, 0, .72222],
              936: [0, .69444, .09031, 0, .77778],
              937: [0, .69444, .08293, 0, .72222],
              8211: [0, .44444, .08616, 0, .5],
              8212: [0, .44444, .08616, 0, 1],
              8216: [0, .69444, .07816, 0, .27778],
              8217: [0, .69444, .07816, 0, .27778],
              8220: [0, .69444, .14205, 0, .5],
              8221: [0, .69444, .00316, 0, .5]
            },
            "SansSerif-Regular": {
              32: [0, 0, 0, 0, .25],
              33: [0, .69444, 0, 0, .31945],
              34: [0, .69444, 0, 0, .5],
              35: [.19444, .69444, 0, 0, .83334],
              36: [.05556, .75, 0, 0, .5],
              37: [.05556, .75, 0, 0, .83334],
              38: [0, .69444, 0, 0, .75834],
              39: [0, .69444, 0, 0, .27778],
              40: [.25, .75, 0, 0, .38889],
              41: [.25, .75, 0, 0, .38889],
              42: [0, .75, 0, 0, .5],
              43: [.08333, .58333, 0, 0, .77778],
              44: [.125, .08333, 0, 0, .27778],
              45: [0, .44444, 0, 0, .33333],
              46: [0, .08333, 0, 0, .27778],
              47: [.25, .75, 0, 0, .5],
              48: [0, .65556, 0, 0, .5],
              49: [0, .65556, 0, 0, .5],
              50: [0, .65556, 0, 0, .5],
              51: [0, .65556, 0, 0, .5],
              52: [0, .65556, 0, 0, .5],
              53: [0, .65556, 0, 0, .5],
              54: [0, .65556, 0, 0, .5],
              55: [0, .65556, 0, 0, .5],
              56: [0, .65556, 0, 0, .5],
              57: [0, .65556, 0, 0, .5],
              58: [0, .44444, 0, 0, .27778],
              59: [.125, .44444, 0, 0, .27778],
              61: [-.13, .37, 0, 0, .77778],
              63: [0, .69444, 0, 0, .47222],
              64: [0, .69444, 0, 0, .66667],
              65: [0, .69444, 0, 0, .66667],
              66: [0, .69444, 0, 0, .66667],
              67: [0, .69444, 0, 0, .63889],
              68: [0, .69444, 0, 0, .72223],
              69: [0, .69444, 0, 0, .59722],
              70: [0, .69444, 0, 0, .56945],
              71: [0, .69444, 0, 0, .66667],
              72: [0, .69444, 0, 0, .70834],
              73: [0, .69444, 0, 0, .27778],
              74: [0, .69444, 0, 0, .47222],
              75: [0, .69444, 0, 0, .69445],
              76: [0, .69444, 0, 0, .54167],
              77: [0, .69444, 0, 0, .875],
              78: [0, .69444, 0, 0, .70834],
              79: [0, .69444, 0, 0, .73611],
              80: [0, .69444, 0, 0, .63889],
              81: [.125, .69444, 0, 0, .73611],
              82: [0, .69444, 0, 0, .64584],
              83: [0, .69444, 0, 0, .55556],
              84: [0, .69444, 0, 0, .68056],
              85: [0, .69444, 0, 0, .6875],
              86: [0, .69444, .01389, 0, .66667],
              87: [0, .69444, .01389, 0, .94445],
              88: [0, .69444, 0, 0, .66667],
              89: [0, .69444, .025, 0, .66667],
              90: [0, .69444, 0, 0, .61111],
              91: [.25, .75, 0, 0, .28889],
              93: [.25, .75, 0, 0, .28889],
              94: [0, .69444, 0, 0, .5],
              95: [.35, .09444, .02778, 0, .5],
              97: [0, .44444, 0, 0, .48056],
              98: [0, .69444, 0, 0, .51667],
              99: [0, .44444, 0, 0, .44445],
              100: [0, .69444, 0, 0, .51667],
              101: [0, .44444, 0, 0, .44445],
              102: [0, .69444, .06944, 0, .30556],
              103: [.19444, .44444, .01389, 0, .5],
              104: [0, .69444, 0, 0, .51667],
              105: [0, .67937, 0, 0, .23889],
              106: [.19444, .67937, 0, 0, .26667],
              107: [0, .69444, 0, 0, .48889],
              108: [0, .69444, 0, 0, .23889],
              109: [0, .44444, 0, 0, .79445],
              110: [0, .44444, 0, 0, .51667],
              111: [0, .44444, 0, 0, .5],
              112: [.19444, .44444, 0, 0, .51667],
              113: [.19444, .44444, 0, 0, .51667],
              114: [0, .44444, .01389, 0, .34167],
              115: [0, .44444, 0, 0, .38333],
              116: [0, .57143, 0, 0, .36111],
              117: [0, .44444, 0, 0, .51667],
              118: [0, .44444, .01389, 0, .46111],
              119: [0, .44444, .01389, 0, .68334],
              120: [0, .44444, 0, 0, .46111],
              121: [.19444, .44444, .01389, 0, .46111],
              122: [0, .44444, 0, 0, .43472],
              126: [.35, .32659, 0, 0, .5],
              160: [0, 0, 0, 0, .25],
              168: [0, .67937, 0, 0, .5],
              176: [0, .69444, 0, 0, .66667],
              184: [.17014, 0, 0, 0, .44445],
              305: [0, .44444, 0, 0, .23889],
              567: [.19444, .44444, 0, 0, .26667],
              710: [0, .69444, 0, 0, .5],
              711: [0, .63194, 0, 0, .5],
              713: [0, .60889, 0, 0, .5],
              714: [0, .69444, 0, 0, .5],
              715: [0, .69444, 0, 0, .5],
              728: [0, .69444, 0, 0, .5],
              729: [0, .67937, 0, 0, .27778],
              730: [0, .69444, 0, 0, .66667],
              732: [0, .67659, 0, 0, .5],
              733: [0, .69444, 0, 0, .5],
              915: [0, .69444, 0, 0, .54167],
              916: [0, .69444, 0, 0, .83334],
              920: [0, .69444, 0, 0, .77778],
              923: [0, .69444, 0, 0, .61111],
              926: [0, .69444, 0, 0, .66667],
              928: [0, .69444, 0, 0, .70834],
              931: [0, .69444, 0, 0, .72222],
              933: [0, .69444, 0, 0, .77778],
              934: [0, .69444, 0, 0, .72222],
              936: [0, .69444, 0, 0, .77778],
              937: [0, .69444, 0, 0, .72222],
              8211: [0, .44444, .02778, 0, .5],
              8212: [0, .44444, .02778, 0, 1],
              8216: [0, .69444, 0, 0, .27778],
              8217: [0, .69444, 0, 0, .27778],
              8220: [0, .69444, 0, 0, .5],
              8221: [0, .69444, 0, 0, .5]
            },
            "Script-Regular": {
              32: [0, 0, 0, 0, .25],
              65: [0, .7, .22925, 0, .80253],
              66: [0, .7, .04087, 0, .90757],
              67: [0, .7, .1689, 0, .66619],
              68: [0, .7, .09371, 0, .77443],
              69: [0, .7, .18583, 0, .56162],
              70: [0, .7, .13634, 0, .89544],
              71: [0, .7, .17322, 0, .60961],
              72: [0, .7, .29694, 0, .96919],
              73: [0, .7, .19189, 0, .80907],
              74: [.27778, .7, .19189, 0, 1.05159],
              75: [0, .7, .31259, 0, .91364],
              76: [0, .7, .19189, 0, .87373],
              77: [0, .7, .15981, 0, 1.08031],
              78: [0, .7, .3525, 0, .9015],
              79: [0, .7, .08078, 0, .73787],
              80: [0, .7, .08078, 0, 1.01262],
              81: [0, .7, .03305, 0, .88282],
              82: [0, .7, .06259, 0, .85],
              83: [0, .7, .19189, 0, .86767],
              84: [0, .7, .29087, 0, .74697],
              85: [0, .7, .25815, 0, .79996],
              86: [0, .7, .27523, 0, .62204],
              87: [0, .7, .27523, 0, .80532],
              88: [0, .7, .26006, 0, .94445],
              89: [0, .7, .2939, 0, .70961],
              90: [0, .7, .24037, 0, .8212],
              160: [0, 0, 0, 0, .25]
            },
            "Size1-Regular": {
              32: [0, 0, 0, 0, .25],
              40: [.35001, .85, 0, 0, .45834],
              41: [.35001, .85, 0, 0, .45834],
              47: [.35001, .85, 0, 0, .57778],
              91: [.35001, .85, 0, 0, .41667],
              92: [.35001, .85, 0, 0, .57778],
              93: [.35001, .85, 0, 0, .41667],
              123: [.35001, .85, 0, 0, .58334],
              125: [.35001, .85, 0, 0, .58334],
              160: [0, 0, 0, 0, .25],
              710: [0, .72222, 0, 0, .55556],
              732: [0, .72222, 0, 0, .55556],
              770: [0, .72222, 0, 0, .55556],
              771: [0, .72222, 0, 0, .55556],
              8214: [-99e-5, .601, 0, 0, .77778],
              8593: [1e-5, .6, 0, 0, .66667],
              8595: [1e-5, .6, 0, 0, .66667],
              8657: [1e-5, .6, 0, 0, .77778],
              8659: [1e-5, .6, 0, 0, .77778],
              8719: [.25001, .75, 0, 0, .94445],
              8720: [.25001, .75, 0, 0, .94445],
              8721: [.25001, .75, 0, 0, 1.05556],
              8730: [.35001, .85, 0, 0, 1],
              8739: [-.00599, .606, 0, 0, .33333],
              8741: [-.00599, .606, 0, 0, .55556],
              8747: [.30612, .805, .19445, 0, .47222],
              8748: [.306, .805, .19445, 0, .47222],
              8749: [.306, .805, .19445, 0, .47222],
              8750: [.30612, .805, .19445, 0, .47222],
              8896: [.25001, .75, 0, 0, .83334],
              8897: [.25001, .75, 0, 0, .83334],
              8898: [.25001, .75, 0, 0, .83334],
              8899: [.25001, .75, 0, 0, .83334],
              8968: [.35001, .85, 0, 0, .47222],
              8969: [.35001, .85, 0, 0, .47222],
              8970: [.35001, .85, 0, 0, .47222],
              8971: [.35001, .85, 0, 0, .47222],
              9168: [-99e-5, .601, 0, 0, .66667],
              10216: [.35001, .85, 0, 0, .47222],
              10217: [.35001, .85, 0, 0, .47222],
              10752: [.25001, .75, 0, 0, 1.11111],
              10753: [.25001, .75, 0, 0, 1.11111],
              10754: [.25001, .75, 0, 0, 1.11111],
              10756: [.25001, .75, 0, 0, .83334],
              10758: [.25001, .75, 0, 0, .83334]
            },
            "Size2-Regular": {
              32: [0, 0, 0, 0, .25],
              40: [.65002, 1.15, 0, 0, .59722],
              41: [.65002, 1.15, 0, 0, .59722],
              47: [.65002, 1.15, 0, 0, .81111],
              91: [.65002, 1.15, 0, 0, .47222],
              92: [.65002, 1.15, 0, 0, .81111],
              93: [.65002, 1.15, 0, 0, .47222],
              123: [.65002, 1.15, 0, 0, .66667],
              125: [.65002, 1.15, 0, 0, .66667],
              160: [0, 0, 0, 0, .25],
              710: [0, .75, 0, 0, 1],
              732: [0, .75, 0, 0, 1],
              770: [0, .75, 0, 0, 1],
              771: [0, .75, 0, 0, 1],
              8719: [.55001, 1.05, 0, 0, 1.27778],
              8720: [.55001, 1.05, 0, 0, 1.27778],
              8721: [.55001, 1.05, 0, 0, 1.44445],
              8730: [.65002, 1.15, 0, 0, 1],
              8747: [.86225, 1.36, .44445, 0, .55556],
              8748: [.862, 1.36, .44445, 0, .55556],
              8749: [.862, 1.36, .44445, 0, .55556],
              8750: [.86225, 1.36, .44445, 0, .55556],
              8896: [.55001, 1.05, 0, 0, 1.11111],
              8897: [.55001, 1.05, 0, 0, 1.11111],
              8898: [.55001, 1.05, 0, 0, 1.11111],
              8899: [.55001, 1.05, 0, 0, 1.11111],
              8968: [.65002, 1.15, 0, 0, .52778],
              8969: [.65002, 1.15, 0, 0, .52778],
              8970: [.65002, 1.15, 0, 0, .52778],
              8971: [.65002, 1.15, 0, 0, .52778],
              10216: [.65002, 1.15, 0, 0, .61111],
              10217: [.65002, 1.15, 0, 0, .61111],
              10752: [.55001, 1.05, 0, 0, 1.51112],
              10753: [.55001, 1.05, 0, 0, 1.51112],
              10754: [.55001, 1.05, 0, 0, 1.51112],
              10756: [.55001, 1.05, 0, 0, 1.11111],
              10758: [.55001, 1.05, 0, 0, 1.11111]
            },
            "Size3-Regular": {
              32: [0, 0, 0, 0, .25],
              40: [.95003, 1.45, 0, 0, .73611],
              41: [.95003, 1.45, 0, 0, .73611],
              47: [.95003, 1.45, 0, 0, 1.04445],
              91: [.95003, 1.45, 0, 0, .52778],
              92: [.95003, 1.45, 0, 0, 1.04445],
              93: [.95003, 1.45, 0, 0, .52778],
              123: [.95003, 1.45, 0, 0, .75],
              125: [.95003, 1.45, 0, 0, .75],
              160: [0, 0, 0, 0, .25],
              710: [0, .75, 0, 0, 1.44445],
              732: [0, .75, 0, 0, 1.44445],
              770: [0, .75, 0, 0, 1.44445],
              771: [0, .75, 0, 0, 1.44445],
              8730: [.95003, 1.45, 0, 0, 1],
              8968: [.95003, 1.45, 0, 0, .58334],
              8969: [.95003, 1.45, 0, 0, .58334],
              8970: [.95003, 1.45, 0, 0, .58334],
              8971: [.95003, 1.45, 0, 0, .58334],
              10216: [.95003, 1.45, 0, 0, .75],
              10217: [.95003, 1.45, 0, 0, .75]
            },
            "Size4-Regular": {
              32: [0, 0, 0, 0, .25],
              40: [1.25003, 1.75, 0, 0, .79167],
              41: [1.25003, 1.75, 0, 0, .79167],
              47: [1.25003, 1.75, 0, 0, 1.27778],
              91: [1.25003, 1.75, 0, 0, .58334],
              92: [1.25003, 1.75, 0, 0, 1.27778],
              93: [1.25003, 1.75, 0, 0, .58334],
              123: [1.25003, 1.75, 0, 0, .80556],
              125: [1.25003, 1.75, 0, 0, .80556],
              160: [0, 0, 0, 0, .25],
              710: [0, .825, 0, 0, 1.8889],
              732: [0, .825, 0, 0, 1.8889],
              770: [0, .825, 0, 0, 1.8889],
              771: [0, .825, 0, 0, 1.8889],
              8730: [1.25003, 1.75, 0, 0, 1],
              8968: [1.25003, 1.75, 0, 0, .63889],
              8969: [1.25003, 1.75, 0, 0, .63889],
              8970: [1.25003, 1.75, 0, 0, .63889],
              8971: [1.25003, 1.75, 0, 0, .63889],
              9115: [.64502, 1.155, 0, 0, .875],
              9116: [1e-5, .6, 0, 0, .875],
              9117: [.64502, 1.155, 0, 0, .875],
              9118: [.64502, 1.155, 0, 0, .875],
              9119: [1e-5, .6, 0, 0, .875],
              9120: [.64502, 1.155, 0, 0, .875],
              9121: [.64502, 1.155, 0, 0, .66667],
              9122: [-99e-5, .601, 0, 0, .66667],
              9123: [.64502, 1.155, 0, 0, .66667],
              9124: [.64502, 1.155, 0, 0, .66667],
              9125: [-99e-5, .601, 0, 0, .66667],
              9126: [.64502, 1.155, 0, 0, .66667],
              9127: [1e-5, .9, 0, 0, .88889],
              9128: [.65002, 1.15, 0, 0, .88889],
              9129: [.90001, 0, 0, 0, .88889],
              9130: [0, .3, 0, 0, .88889],
              9131: [1e-5, .9, 0, 0, .88889],
              9132: [.65002, 1.15, 0, 0, .88889],
              9133: [.90001, 0, 0, 0, .88889],
              9143: [.88502, .915, 0, 0, 1.05556],
              10216: [1.25003, 1.75, 0, 0, .80556],
              10217: [1.25003, 1.75, 0, 0, .80556],
              57344: [-.00499, .605, 0, 0, 1.05556],
              57345: [-.00499, .605, 0, 0, 1.05556],
              57680: [0, .12, 0, 0, .45],
              57681: [0, .12, 0, 0, .45],
              57682: [0, .12, 0, 0, .45],
              57683: [0, .12, 0, 0, .45]
            },
            "Typewriter-Regular": {
              32: [0, 0, 0, 0, .525],
              33: [0, .61111, 0, 0, .525],
              34: [0, .61111, 0, 0, .525],
              35: [0, .61111, 0, 0, .525],
              36: [.08333, .69444, 0, 0, .525],
              37: [.08333, .69444, 0, 0, .525],
              38: [0, .61111, 0, 0, .525],
              39: [0, .61111, 0, 0, .525],
              40: [.08333, .69444, 0, 0, .525],
              41: [.08333, .69444, 0, 0, .525],
              42: [0, .52083, 0, 0, .525],
              43: [-.08056, .53055, 0, 0, .525],
              44: [.13889, .125, 0, 0, .525],
              45: [-.08056, .53055, 0, 0, .525],
              46: [0, .125, 0, 0, .525],
              47: [.08333, .69444, 0, 0, .525],
              48: [0, .61111, 0, 0, .525],
              49: [0, .61111, 0, 0, .525],
              50: [0, .61111, 0, 0, .525],
              51: [0, .61111, 0, 0, .525],
              52: [0, .61111, 0, 0, .525],
              53: [0, .61111, 0, 0, .525],
              54: [0, .61111, 0, 0, .525],
              55: [0, .61111, 0, 0, .525],
              56: [0, .61111, 0, 0, .525],
              57: [0, .61111, 0, 0, .525],
              58: [0, .43056, 0, 0, .525],
              59: [.13889, .43056, 0, 0, .525],
              60: [-.05556, .55556, 0, 0, .525],
              61: [-.19549, .41562, 0, 0, .525],
              62: [-.05556, .55556, 0, 0, .525],
              63: [0, .61111, 0, 0, .525],
              64: [0, .61111, 0, 0, .525],
              65: [0, .61111, 0, 0, .525],
              66: [0, .61111, 0, 0, .525],
              67: [0, .61111, 0, 0, .525],
              68: [0, .61111, 0, 0, .525],
              69: [0, .61111, 0, 0, .525],
              70: [0, .61111, 0, 0, .525],
              71: [0, .61111, 0, 0, .525],
              72: [0, .61111, 0, 0, .525],
              73: [0, .61111, 0, 0, .525],
              74: [0, .61111, 0, 0, .525],
              75: [0, .61111, 0, 0, .525],
              76: [0, .61111, 0, 0, .525],
              77: [0, .61111, 0, 0, .525],
              78: [0, .61111, 0, 0, .525],
              79: [0, .61111, 0, 0, .525],
              80: [0, .61111, 0, 0, .525],
              81: [.13889, .61111, 0, 0, .525],
              82: [0, .61111, 0, 0, .525],
              83: [0, .61111, 0, 0, .525],
              84: [0, .61111, 0, 0, .525],
              85: [0, .61111, 0, 0, .525],
              86: [0, .61111, 0, 0, .525],
              87: [0, .61111, 0, 0, .525],
              88: [0, .61111, 0, 0, .525],
              89: [0, .61111, 0, 0, .525],
              90: [0, .61111, 0, 0, .525],
              91: [.08333, .69444, 0, 0, .525],
              92: [.08333, .69444, 0, 0, .525],
              93: [.08333, .69444, 0, 0, .525],
              94: [0, .61111, 0, 0, .525],
              95: [.09514, 0, 0, 0, .525],
              96: [0, .61111, 0, 0, .525],
              97: [0, .43056, 0, 0, .525],
              98: [0, .61111, 0, 0, .525],
              99: [0, .43056, 0, 0, .525],
              100: [0, .61111, 0, 0, .525],
              101: [0, .43056, 0, 0, .525],
              102: [0, .61111, 0, 0, .525],
              103: [.22222, .43056, 0, 0, .525],
              104: [0, .61111, 0, 0, .525],
              105: [0, .61111, 0, 0, .525],
              106: [.22222, .61111, 0, 0, .525],
              107: [0, .61111, 0, 0, .525],
              108: [0, .61111, 0, 0, .525],
              109: [0, .43056, 0, 0, .525],
              110: [0, .43056, 0, 0, .525],
              111: [0, .43056, 0, 0, .525],
              112: [.22222, .43056, 0, 0, .525],
              113: [.22222, .43056, 0, 0, .525],
              114: [0, .43056, 0, 0, .525],
              115: [0, .43056, 0, 0, .525],
              116: [0, .55358, 0, 0, .525],
              117: [0, .43056, 0, 0, .525],
              118: [0, .43056, 0, 0, .525],
              119: [0, .43056, 0, 0, .525],
              120: [0, .43056, 0, 0, .525],
              121: [.22222, .43056, 0, 0, .525],
              122: [0, .43056, 0, 0, .525],
              123: [.08333, .69444, 0, 0, .525],
              124: [.08333, .69444, 0, 0, .525],
              125: [.08333, .69444, 0, 0, .525],
              126: [0, .61111, 0, 0, .525],
              127: [0, .61111, 0, 0, .525],
              160: [0, 0, 0, 0, .525],
              176: [0, .61111, 0, 0, .525],
              184: [.19445, 0, 0, 0, .525],
              305: [0, .43056, 0, 0, .525],
              567: [.22222, .43056, 0, 0, .525],
              711: [0, .56597, 0, 0, .525],
              713: [0, .56555, 0, 0, .525],
              714: [0, .61111, 0, 0, .525],
              715: [0, .61111, 0, 0, .525],
              728: [0, .61111, 0, 0, .525],
              730: [0, .61111, 0, 0, .525],
              770: [0, .61111, 0, 0, .525],
              771: [0, .61111, 0, 0, .525],
              776: [0, .61111, 0, 0, .525],
              915: [0, .61111, 0, 0, .525],
              916: [0, .61111, 0, 0, .525],
              920: [0, .61111, 0, 0, .525],
              923: [0, .61111, 0, 0, .525],
              926: [0, .61111, 0, 0, .525],
              928: [0, .61111, 0, 0, .525],
              931: [0, .61111, 0, 0, .525],
              933: [0, .61111, 0, 0, .525],
              934: [0, .61111, 0, 0, .525],
              936: [0, .61111, 0, 0, .525],
              937: [0, .61111, 0, 0, .525],
              8216: [0, .61111, 0, 0, .525],
              8217: [0, .61111, 0, 0, .525],
              8242: [0, .61111, 0, 0, .525],
              9251: [.11111, .21944, 0, 0, .525]
            }
          },
          T = {
            slant: [.25, .25, .25],
            space: [0, 0, 0],
            stretch: [0, 0, 0],
            shrink: [0, 0, 0],
            xHeight: [.431, .431, .431],
            quad: [1, 1.171, 1.472],
            extraSpace: [0, 0, 0],
            num1: [.677, .732, .925],
            num2: [.394, .384, .387],
            num3: [.444, .471, .504],
            denom1: [.686, .752, 1.025],
            denom2: [.345, .344, .532],
            sup1: [.413, .503, .504],
            sup2: [.363, .431, .404],
            sup3: [.289, .286, .294],
            sub1: [.15, .143, .2],
            sub2: [.247, .286, .4],
            supDrop: [.386, .353, .494],
            subDrop: [.05, .071, .1],
            delim1: [2.39, 1.7, 1.98],
            delim2: [1.01, 1.157, 1.42],
            axisHeight: [.25, .25, .25],
            defaultRuleThickness: [.04, .049, .049],
            bigOpSpacing1: [.111, .111, .111],
            bigOpSpacing2: [.166, .166, .166],
            bigOpSpacing3: [.2, .2, .2],
            bigOpSpacing4: [.6, .611, .611],
            bigOpSpacing5: [.1, .143, .143],
            sqrtRuleThickness: [.04, .04, .04],
            ptPerEm: [10, 10, 10],
            doubleRuleSep: [.2, .2, .2],
            arrayRuleWidth: [.04, .04, .04],
            fboxsep: [.3, .3, .3],
            fboxrule: [.04, .04, .04]
          },
          B = {
            "Å": "A",
            "Ð": "D",
            "Þ": "o",
            "å": "a",
            "ð": "d",
            "þ": "o",
            "А": "A",
            "Б": "B",
            "В": "B",
            "Г": "F",
            "Д": "A",
            "Е": "E",
            "Ж": "K",
            "З": "3",
            "И": "N",
            "Й": "N",
            "К": "K",
            "Л": "N",
            "М": "M",
            "Н": "H",
            "О": "O",
            "П": "N",
            "Р": "P",
            "С": "C",
            "Т": "T",
            "У": "y",
            "Ф": "O",
            "Х": "X",
            "Ц": "U",
            "Ч": "h",
            "Ш": "W",
            "Щ": "W",
            "Ъ": "B",
            "Ы": "X",
            "Ь": "B",
            "Э": "3",
            "Ю": "X",
            "Я": "R",
            "а": "a",
            "б": "b",
            "в": "a",
            "г": "r",
            "д": "y",
            "е": "e",
            "ж": "m",
            "з": "e",
            "и": "n",
            "й": "n",
            "к": "n",
            "л": "n",
            "м": "m",
            "н": "n",
            "о": "o",
            "п": "n",
            "р": "p",
            "с": "c",
            "т": "o",
            "у": "y",
            "ф": "b",
            "х": "x",
            "ц": "n",
            "ч": "n",
            "ш": "w",
            "щ": "w",
            "ъ": "a",
            "ы": "m",
            "ь": "a",
            "э": "e",
            "ю": "m",
            "я": "r"
          };
        function C(e, t, r) {
          if (!A[t]) throw new Error("Font metrics not found for font: " + t + ".");
          var n = e.charCodeAt(0),
            a = A[t][n];
          if (!a && e[0] in B && (n = B[e[0]].charCodeAt(0), a = A[t][n]), a || "text" !== r || S(n) && (a = A[t][77]), a) return {
            depth: a[0],
            height: a[1],
            italic: a[2],
            skew: a[3],
            width: a[4]
          };
        }
        var N = {},
          q = [[1, 1, 1], [2, 1, 1], [3, 1, 1], [4, 2, 1], [5, 2, 1], [6, 3, 1], [7, 4, 2], [8, 6, 3], [9, 7, 6], [10, 8, 7], [11, 10, 9]],
          I = [.5, .6, .7, .8, .9, 1, 1.2, 1.44, 1.728, 2.074, 2.488],
          O = function O(e, t) {
            return t.size < 2 ? e : q[e - 1][t.size - 1];
          },
          R = function () {
            function e(t) {
              this.style = void 0, this.color = void 0, this.size = void 0, this.textSize = void 0, this.phantom = void 0, this.font = void 0, this.fontFamily = void 0, this.fontWeight = void 0, this.fontShape = void 0, this.sizeMultiplier = void 0, this.maxSize = void 0, this.minRuleThickness = void 0, this._fontMetrics = void 0, this.style = t.style, this.color = t.color, this.size = t.size || e.BASESIZE, this.textSize = t.textSize || this.size, this.phantom = !!t.phantom, this.font = t.font || "", this.fontFamily = t.fontFamily || "", this.fontWeight = t.fontWeight || "", this.fontShape = t.fontShape || "", this.sizeMultiplier = I[this.size - 1], this.maxSize = t.maxSize, this.minRuleThickness = t.minRuleThickness, this._fontMetrics = void 0;
            }
            var t = e.prototype;
            return t.extend = function (t) {
              var r = {
                style: this.style,
                size: this.size,
                textSize: this.textSize,
                color: this.color,
                phantom: this.phantom,
                font: this.font,
                fontFamily: this.fontFamily,
                fontWeight: this.fontWeight,
                fontShape: this.fontShape,
                maxSize: this.maxSize,
                minRuleThickness: this.minRuleThickness
              };
              for (var n in t) {
                t.hasOwnProperty(n) && (r[n] = t[n]);
              }
              return new e(r);
            }, t.havingStyle = function (e) {
              return this.style === e ? this : this.extend({
                style: e,
                size: O(this.textSize, e)
              });
            }, t.havingCrampedStyle = function () {
              return this.havingStyle(this.style.cramp());
            }, t.havingSize = function (e) {
              return this.size === e && this.textSize === e ? this : this.extend({
                style: this.style.text(),
                size: e,
                textSize: e,
                sizeMultiplier: I[e - 1]
              });
            }, t.havingBaseStyle = function (t) {
              t = t || this.style.text();
              var r = O(e.BASESIZE, t);
              return this.size === r && this.textSize === e.BASESIZE && this.style === t ? this : this.extend({
                style: t,
                size: r
              });
            }, t.havingBaseSizing = function () {
              var e;
              switch (this.style.id) {
                case 4:
                case 5:
                  e = 3;
                  break;
                case 6:
                case 7:
                  e = 1;
                  break;
                default:
                  e = 6;
              }
              return this.extend({
                style: this.style.text(),
                size: e
              });
            }, t.withColor = function (e) {
              return this.extend({
                color: e
              });
            }, t.withPhantom = function () {
              return this.extend({
                phantom: !0
              });
            }, t.withFont = function (e) {
              return this.extend({
                font: e
              });
            }, t.withTextFontFamily = function (e) {
              return this.extend({
                fontFamily: e,
                font: ""
              });
            }, t.withTextFontWeight = function (e) {
              return this.extend({
                fontWeight: e,
                font: ""
              });
            }, t.withTextFontShape = function (e) {
              return this.extend({
                fontShape: e,
                font: ""
              });
            }, t.sizingClasses = function (e) {
              return e.size !== this.size ? ["sizing", "reset-size" + e.size, "size" + this.size] : [];
            }, t.baseSizingClasses = function () {
              return this.size !== e.BASESIZE ? ["sizing", "reset-size" + this.size, "size" + e.BASESIZE] : [];
            }, t.fontMetrics = function () {
              return this._fontMetrics || (this._fontMetrics = function (e) {
                var t;
                if (!N[t = e >= 5 ? 0 : e >= 3 ? 1 : 2]) {
                  var r = N[t] = {
                    cssEmPerMu: T.quad[t] / 18
                  };
                  for (var n in T) {
                    T.hasOwnProperty(n) && (r[n] = T[n][t]);
                  }
                }
                return N[t];
              }(this.size)), this._fontMetrics;
            }, t.getColor = function () {
              return this.phantom ? "transparent" : this.color;
            }, e;
          }();
        R.BASESIZE = 6;
        var H = R,
          E = {
            pt: 1,
            mm: 7227 / 2540,
            cm: 7227 / 254,
            in: 72.27,
            bp: 1.00375,
            pc: 12,
            dd: 1238 / 1157,
            cc: 14856 / 1157,
            nd: 685 / 642,
            nc: 1370 / 107,
            sp: 1 / 65536,
            px: 1.00375
          },
          L = {
            ex: !0,
            em: !0,
            mu: !0
          },
          D = function D(e) {
            return "string" != typeof e && (e = e.unit), e in E || e in L || "ex" === e;
          },
          P = function P(e, t) {
            var r;
            if (e.unit in E) r = E[e.unit] / t.fontMetrics().ptPerEm / t.sizeMultiplier;else if ("mu" === e.unit) r = t.fontMetrics().cssEmPerMu;else {
              var a;
              if (a = t.style.isTight() ? t.havingStyle(t.style.text()) : t, "ex" === e.unit) r = a.fontMetrics().xHeight;else {
                if ("em" !== e.unit) throw new n("Invalid unit: '" + e.unit + "'");
                r = a.fontMetrics().quad;
              }
              a !== t && (r *= a.sizeMultiplier / t.sizeMultiplier);
            }
            return Math.min(e.number * r, t.maxSize);
          },
          F = function F(e) {
            return +e.toFixed(4) + "em";
          },
          V = function V(e) {
            return e.filter(function (e) {
              return e;
            }).join(" ");
          },
          G = function G(e, t, r) {
            if (this.classes = e || [], this.attributes = {}, this.height = 0, this.depth = 0, this.maxFontSize = 0, this.style = r || {}, t) {
              t.style.isTight() && this.classes.push("mtight");
              var n = t.getColor();
              n && (this.style.color = n);
            }
          },
          U = function U(e) {
            var t = document.createElement(e);
            for (var r in t.className = V(this.classes), this.style) {
              this.style.hasOwnProperty(r) && (t.style[r] = this.style[r]);
            }
            for (var n in this.attributes) {
              this.attributes.hasOwnProperty(n) && t.setAttribute(n, this.attributes[n]);
            }
            for (var a = 0; a < this.children.length; a++) {
              t.appendChild(this.children[a].toNode());
            }
            return t;
          },
          _ = function _(e) {
            var t = "<" + e;
            this.classes.length && (t += ' class="' + l.escape(V(this.classes)) + '"');
            var r = "";
            for (var n in this.style) {
              this.style.hasOwnProperty(n) && (r += l.hyphenate(n) + ":" + this.style[n] + ";");
            }
            for (var a in r && (t += ' style="' + l.escape(r) + '"'), this.attributes) {
              this.attributes.hasOwnProperty(a) && (t += " " + a + '="' + l.escape(this.attributes[a]) + '"');
            }
            t += ">";
            for (var i = 0; i < this.children.length; i++) {
              t += this.children[i].toMarkup();
            }
            return t += "</" + e + ">";
          },
          Y = function () {
            function e(e, t, r, n) {
              this.children = void 0, this.attributes = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.width = void 0, this.maxFontSize = void 0, this.style = void 0, G.call(this, e, r, n), this.children = t || [];
            }
            var t = e.prototype;
            return t.setAttribute = function (e, t) {
              this.attributes[e] = t;
            }, t.hasClass = function (e) {
              return l.contains(this.classes, e);
            }, t.toNode = function () {
              return U.call(this, "span");
            }, t.toMarkup = function () {
              return _.call(this, "span");
            }, e;
          }(),
          X = function () {
            function e(e, t, r, n) {
              this.children = void 0, this.attributes = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.maxFontSize = void 0, this.style = void 0, G.call(this, t, n), this.children = r || [], this.setAttribute("href", e);
            }
            var t = e.prototype;
            return t.setAttribute = function (e, t) {
              this.attributes[e] = t;
            }, t.hasClass = function (e) {
              return l.contains(this.classes, e);
            }, t.toNode = function () {
              return U.call(this, "a");
            }, t.toMarkup = function () {
              return _.call(this, "a");
            }, e;
          }(),
          W = function () {
            function e(e, t, r) {
              this.src = void 0, this.alt = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.maxFontSize = void 0, this.style = void 0, this.alt = t, this.src = e, this.classes = ["mord"], this.style = r;
            }
            var t = e.prototype;
            return t.hasClass = function (e) {
              return l.contains(this.classes, e);
            }, t.toNode = function () {
              var e = document.createElement("img");
              for (var t in e.src = this.src, e.alt = this.alt, e.className = "mord", this.style) {
                this.style.hasOwnProperty(t) && (e.style[t] = this.style[t]);
              }
              return e;
            }, t.toMarkup = function () {
              var e = "<img  src='" + this.src + " 'alt='" + this.alt + "' ",
                t = "";
              for (var r in this.style) {
                this.style.hasOwnProperty(r) && (t += l.hyphenate(r) + ":" + this.style[r] + ";");
              }
              return t && (e += ' style="' + l.escape(t) + '"'), e += "'/>";
            }, e;
          }(),
          j = {
            "î": "ı̂",
            "ï": "ı̈",
            "í": "ı́",
            "ì": "ı̀"
          },
          $ = function () {
            function e(e, t, r, n, a, i, o, s) {
              this.text = void 0, this.height = void 0, this.depth = void 0, this.italic = void 0, this.skew = void 0, this.width = void 0, this.maxFontSize = void 0, this.classes = void 0, this.style = void 0, this.text = e, this.height = t || 0, this.depth = r || 0, this.italic = n || 0, this.skew = a || 0, this.width = i || 0, this.classes = o || [], this.style = s || {}, this.maxFontSize = 0;
              var l = function (e) {
                for (var t = 0; t < w.length; t++) {
                  for (var r = w[t], n = 0; n < r.blocks.length; n++) {
                    var a = r.blocks[n];
                    if (e >= a[0] && e <= a[1]) return r.name;
                  }
                }
                return null;
              }(this.text.charCodeAt(0));
              l && this.classes.push(l + "_fallback"), /[îïíì]/.test(this.text) && (this.text = j[this.text]);
            }
            var t = e.prototype;
            return t.hasClass = function (e) {
              return l.contains(this.classes, e);
            }, t.toNode = function () {
              var e = document.createTextNode(this.text),
                t = null;
              for (var r in this.italic > 0 && ((t = document.createElement("span")).style.marginRight = F(this.italic)), this.classes.length > 0 && ((t = t || document.createElement("span")).className = V(this.classes)), this.style) {
                this.style.hasOwnProperty(r) && ((t = t || document.createElement("span")).style[r] = this.style[r]);
              }
              return t ? (t.appendChild(e), t) : e;
            }, t.toMarkup = function () {
              var e = !1,
                t = "<span";
              this.classes.length && (e = !0, t += ' class="', t += l.escape(V(this.classes)), t += '"');
              var r = "";
              for (var n in this.italic > 0 && (r += "margin-right:" + this.italic + "em;"), this.style) {
                this.style.hasOwnProperty(n) && (r += l.hyphenate(n) + ":" + this.style[n] + ";");
              }
              r && (e = !0, t += ' style="' + l.escape(r) + '"');
              var a = l.escape(this.text);
              return e ? (t += ">", t += a, t += "</span>") : a;
            }, e;
          }(),
          Z = function () {
            function e(e, t) {
              this.children = void 0, this.attributes = void 0, this.children = e || [], this.attributes = t || {};
            }
            var t = e.prototype;
            return t.toNode = function () {
              var e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
              for (var t in this.attributes) {
                Object.prototype.hasOwnProperty.call(this.attributes, t) && e.setAttribute(t, this.attributes[t]);
              }
              for (var r = 0; r < this.children.length; r++) {
                e.appendChild(this.children[r].toNode());
              }
              return e;
            }, t.toMarkup = function () {
              var e = '<svg xmlns="http://www.w3.org/2000/svg"';
              for (var t in this.attributes) {
                Object.prototype.hasOwnProperty.call(this.attributes, t) && (e += " " + t + "='" + this.attributes[t] + "'");
              }
              e += ">";
              for (var r = 0; r < this.children.length; r++) {
                e += this.children[r].toMarkup();
              }
              return e += "</svg>";
            }, e;
          }(),
          K = function () {
            function e(e, t) {
              this.pathName = void 0, this.alternate = void 0, this.pathName = e, this.alternate = t;
            }
            var t = e.prototype;
            return t.toNode = function () {
              var e = document.createElementNS("http://www.w3.org/2000/svg", "path");
              return this.alternate ? e.setAttribute("d", this.alternate) : e.setAttribute("d", M[this.pathName]), e;
            }, t.toMarkup = function () {
              return this.alternate ? "<path d='" + this.alternate + "'/>" : "<path d='" + M[this.pathName] + "'/>";
            }, e;
          }(),
          J = function () {
            function e(e) {
              this.attributes = void 0, this.attributes = e || {};
            }
            var t = e.prototype;
            return t.toNode = function () {
              var e = document.createElementNS("http://www.w3.org/2000/svg", "line");
              for (var t in this.attributes) {
                Object.prototype.hasOwnProperty.call(this.attributes, t) && e.setAttribute(t, this.attributes[t]);
              }
              return e;
            }, t.toMarkup = function () {
              var e = "<line";
              for (var t in this.attributes) {
                Object.prototype.hasOwnProperty.call(this.attributes, t) && (e += " " + t + "='" + this.attributes[t] + "'");
              }
              return e += "/>";
            }, e;
          }();
        function Q(e) {
          if (e instanceof $) return e;
          throw new Error("Expected symbolNode but got " + String(e) + ".");
        }
        var ee = {
            bin: 1,
            close: 1,
            inner: 1,
            open: 1,
            punct: 1,
            rel: 1
          },
          te = {
            "accent-token": 1,
            mathord: 1,
            "op-token": 1,
            spacing: 1,
            textord: 1
          },
          re = {
            math: {},
            text: {}
          },
          ne = re;
        function ae(e, t, r, n, a, i) {
          re[e][a] = {
            font: t,
            group: r,
            replace: n
          }, i && n && (re[e][n] = re[e][a]);
        }
        var ie = "math",
          oe = "main",
          se = "ams",
          le = "accent-token",
          he = "bin",
          ce = "mathord",
          me = "op-token",
          ue = "rel",
          pe = "textord";
        ae(ie, oe, ue, "≡", "\\equiv", !0), ae(ie, oe, ue, "≺", "\\prec", !0), ae(ie, oe, ue, "≻", "\\succ", !0), ae(ie, oe, ue, "∼", "\\sim", !0), ae(ie, oe, ue, "⊥", "\\perp"), ae(ie, oe, ue, "⪯", "\\preceq", !0), ae(ie, oe, ue, "⪰", "\\succeq", !0), ae(ie, oe, ue, "≃", "\\simeq", !0), ae(ie, oe, ue, "∣", "\\mid", !0), ae(ie, oe, ue, "≪", "\\ll", !0), ae(ie, oe, ue, "≫", "\\gg", !0), ae(ie, oe, ue, "≍", "\\asymp", !0), ae(ie, oe, ue, "∥", "\\parallel"), ae(ie, oe, ue, "⋈", "\\bowtie", !0), ae(ie, oe, ue, "⌣", "\\smile", !0), ae(ie, oe, ue, "⊑", "\\sqsubseteq", !0), ae(ie, oe, ue, "⊒", "\\sqsupseteq", !0), ae(ie, oe, ue, "≐", "\\doteq", !0), ae(ie, oe, ue, "⌢", "\\frown", !0), ae(ie, oe, ue, "∋", "\\ni", !0), ae(ie, oe, ue, "∝", "\\propto", !0), ae(ie, oe, ue, "⊢", "\\vdash", !0), ae(ie, oe, ue, "⊣", "\\dashv", !0), ae(ie, oe, ue, "∋", "\\owns"), ae(ie, oe, "punct", ".", "\\ldotp"), ae(ie, oe, "punct", "⋅", "\\cdotp"), ae(ie, oe, pe, "#", "\\#"), ae("text", oe, pe, "#", "\\#"), ae(ie, oe, pe, "&", "\\&"), ae("text", oe, pe, "&", "\\&"), ae(ie, oe, pe, "ℵ", "\\aleph", !0), ae(ie, oe, pe, "∀", "\\forall", !0), ae(ie, oe, pe, "ℏ", "\\hbar", !0), ae(ie, oe, pe, "∃", "\\exists", !0), ae(ie, oe, pe, "∇", "\\nabla", !0), ae(ie, oe, pe, "♭", "\\flat", !0), ae(ie, oe, pe, "ℓ", "\\ell", !0), ae(ie, oe, pe, "♮", "\\natural", !0), ae(ie, oe, pe, "♣", "\\clubsuit", !0), ae(ie, oe, pe, "℘", "\\wp", !0), ae(ie, oe, pe, "♯", "\\sharp", !0), ae(ie, oe, pe, "♢", "\\diamondsuit", !0), ae(ie, oe, pe, "ℜ", "\\Re", !0), ae(ie, oe, pe, "♡", "\\heartsuit", !0), ae(ie, oe, pe, "ℑ", "\\Im", !0), ae(ie, oe, pe, "♠", "\\spadesuit", !0), ae(ie, oe, pe, "§", "\\S", !0), ae("text", oe, pe, "§", "\\S"), ae(ie, oe, pe, "¶", "\\P", !0), ae("text", oe, pe, "¶", "\\P"), ae(ie, oe, pe, "†", "\\dag"), ae("text", oe, pe, "†", "\\dag"), ae("text", oe, pe, "†", "\\textdagger"), ae(ie, oe, pe, "‡", "\\ddag"), ae("text", oe, pe, "‡", "\\ddag"), ae("text", oe, pe, "‡", "\\textdaggerdbl"), ae(ie, oe, "close", "⎱", "\\rmoustache", !0), ae(ie, oe, "open", "⎰", "\\lmoustache", !0), ae(ie, oe, "close", "⟯", "\\rgroup", !0), ae(ie, oe, "open", "⟮", "\\lgroup", !0), ae(ie, oe, he, "∓", "\\mp", !0), ae(ie, oe, he, "⊖", "\\ominus", !0), ae(ie, oe, he, "⊎", "\\uplus", !0), ae(ie, oe, he, "⊓", "\\sqcap", !0), ae(ie, oe, he, "∗", "\\ast"), ae(ie, oe, he, "⊔", "\\sqcup", !0), ae(ie, oe, he, "◯", "\\bigcirc", !0), ae(ie, oe, he, "∙", "\\bullet", !0), ae(ie, oe, he, "‡", "\\ddagger"), ae(ie, oe, he, "≀", "\\wr", !0), ae(ie, oe, he, "⨿", "\\amalg"), ae(ie, oe, he, "&", "\\And"), ae(ie, oe, ue, "⟵", "\\longleftarrow", !0), ae(ie, oe, ue, "⇐", "\\Leftarrow", !0), ae(ie, oe, ue, "⟸", "\\Longleftarrow", !0), ae(ie, oe, ue, "⟶", "\\longrightarrow", !0), ae(ie, oe, ue, "⇒", "\\Rightarrow", !0), ae(ie, oe, ue, "⟹", "\\Longrightarrow", !0), ae(ie, oe, ue, "↔", "\\leftrightarrow", !0), ae(ie, oe, ue, "⟷", "\\longleftrightarrow", !0), ae(ie, oe, ue, "⇔", "\\Leftrightarrow", !0), ae(ie, oe, ue, "⟺", "\\Longleftrightarrow", !0), ae(ie, oe, ue, "↦", "\\mapsto", !0), ae(ie, oe, ue, "⟼", "\\longmapsto", !0), ae(ie, oe, ue, "↗", "\\nearrow", !0), ae(ie, oe, ue, "↩", "\\hookleftarrow", !0), ae(ie, oe, ue, "↪", "\\hookrightarrow", !0), ae(ie, oe, ue, "↘", "\\searrow", !0), ae(ie, oe, ue, "↼", "\\leftharpoonup", !0), ae(ie, oe, ue, "⇀", "\\rightharpoonup", !0), ae(ie, oe, ue, "↙", "\\swarrow", !0), ae(ie, oe, ue, "↽", "\\leftharpoondown", !0), ae(ie, oe, ue, "⇁", "\\rightharpoondown", !0), ae(ie, oe, ue, "↖", "\\nwarrow", !0), ae(ie, oe, ue, "⇌", "\\rightleftharpoons", !0), ae(ie, se, ue, "≮", "\\nless", !0), ae(ie, se, ue, "", "\\@nleqslant"), ae(ie, se, ue, "", "\\@nleqq"), ae(ie, se, ue, "⪇", "\\lneq", !0), ae(ie, se, ue, "≨", "\\lneqq", !0), ae(ie, se, ue, "", "\\@lvertneqq"), ae(ie, se, ue, "⋦", "\\lnsim", !0), ae(ie, se, ue, "⪉", "\\lnapprox", !0), ae(ie, se, ue, "⊀", "\\nprec", !0), ae(ie, se, ue, "⋠", "\\npreceq", !0), ae(ie, se, ue, "⋨", "\\precnsim", !0), ae(ie, se, ue, "⪹", "\\precnapprox", !0), ae(ie, se, ue, "≁", "\\nsim", !0), ae(ie, se, ue, "", "\\@nshortmid"), ae(ie, se, ue, "∤", "\\nmid", !0), ae(ie, se, ue, "⊬", "\\nvdash", !0), ae(ie, se, ue, "⊭", "\\nvDash", !0), ae(ie, se, ue, "⋪", "\\ntriangleleft"), ae(ie, se, ue, "⋬", "\\ntrianglelefteq", !0), ae(ie, se, ue, "⊊", "\\subsetneq", !0), ae(ie, se, ue, "", "\\@varsubsetneq"), ae(ie, se, ue, "⫋", "\\subsetneqq", !0), ae(ie, se, ue, "", "\\@varsubsetneqq"), ae(ie, se, ue, "≯", "\\ngtr", !0), ae(ie, se, ue, "", "\\@ngeqslant"), ae(ie, se, ue, "", "\\@ngeqq"), ae(ie, se, ue, "⪈", "\\gneq", !0), ae(ie, se, ue, "≩", "\\gneqq", !0), ae(ie, se, ue, "", "\\@gvertneqq"), ae(ie, se, ue, "⋧", "\\gnsim", !0), ae(ie, se, ue, "⪊", "\\gnapprox", !0), ae(ie, se, ue, "⊁", "\\nsucc", !0), ae(ie, se, ue, "⋡", "\\nsucceq", !0), ae(ie, se, ue, "⋩", "\\succnsim", !0), ae(ie, se, ue, "⪺", "\\succnapprox", !0), ae(ie, se, ue, "≆", "\\ncong", !0), ae(ie, se, ue, "", "\\@nshortparallel"), ae(ie, se, ue, "∦", "\\nparallel", !0), ae(ie, se, ue, "⊯", "\\nVDash", !0), ae(ie, se, ue, "⋫", "\\ntriangleright"), ae(ie, se, ue, "⋭", "\\ntrianglerighteq", !0), ae(ie, se, ue, "", "\\@nsupseteqq"), ae(ie, se, ue, "⊋", "\\supsetneq", !0), ae(ie, se, ue, "", "\\@varsupsetneq"), ae(ie, se, ue, "⫌", "\\supsetneqq", !0), ae(ie, se, ue, "", "\\@varsupsetneqq"), ae(ie, se, ue, "⊮", "\\nVdash", !0), ae(ie, se, ue, "⪵", "\\precneqq", !0), ae(ie, se, ue, "⪶", "\\succneqq", !0), ae(ie, se, ue, "", "\\@nsubseteqq"), ae(ie, se, he, "⊴", "\\unlhd"), ae(ie, se, he, "⊵", "\\unrhd"), ae(ie, se, ue, "↚", "\\nleftarrow", !0), ae(ie, se, ue, "↛", "\\nrightarrow", !0), ae(ie, se, ue, "⇍", "\\nLeftarrow", !0), ae(ie, se, ue, "⇏", "\\nRightarrow", !0), ae(ie, se, ue, "↮", "\\nleftrightarrow", !0), ae(ie, se, ue, "⇎", "\\nLeftrightarrow", !0), ae(ie, se, ue, "△", "\\vartriangle"), ae(ie, se, pe, "ℏ", "\\hslash"), ae(ie, se, pe, "▽", "\\triangledown"), ae(ie, se, pe, "◊", "\\lozenge"), ae(ie, se, pe, "Ⓢ", "\\circledS"), ae(ie, se, pe, "®", "\\circledR"), ae("text", se, pe, "®", "\\circledR"), ae(ie, se, pe, "∡", "\\measuredangle", !0), ae(ie, se, pe, "∄", "\\nexists"), ae(ie, se, pe, "℧", "\\mho"), ae(ie, se, pe, "Ⅎ", "\\Finv", !0), ae(ie, se, pe, "⅁", "\\Game", !0), ae(ie, se, pe, "‵", "\\backprime"), ae(ie, se, pe, "▲", "\\blacktriangle"), ae(ie, se, pe, "▼", "\\blacktriangledown"), ae(ie, se, pe, "■", "\\blacksquare"), ae(ie, se, pe, "⧫", "\\blacklozenge"), ae(ie, se, pe, "★", "\\bigstar"), ae(ie, se, pe, "∢", "\\sphericalangle", !0), ae(ie, se, pe, "∁", "\\complement", !0), ae(ie, se, pe, "ð", "\\eth", !0), ae("text", oe, pe, "ð", "ð"), ae(ie, se, pe, "╱", "\\diagup"), ae(ie, se, pe, "╲", "\\diagdown"), ae(ie, se, pe, "□", "\\square"), ae(ie, se, pe, "□", "\\Box"), ae(ie, se, pe, "◊", "\\Diamond"), ae(ie, se, pe, "¥", "\\yen", !0), ae("text", se, pe, "¥", "\\yen", !0), ae(ie, se, pe, "✓", "\\checkmark", !0), ae("text", se, pe, "✓", "\\checkmark"), ae(ie, se, pe, "ℶ", "\\beth", !0), ae(ie, se, pe, "ℸ", "\\daleth", !0), ae(ie, se, pe, "ℷ", "\\gimel", !0), ae(ie, se, pe, "ϝ", "\\digamma", !0), ae(ie, se, pe, "ϰ", "\\varkappa"), ae(ie, se, "open", "┌", "\\@ulcorner", !0), ae(ie, se, "close", "┐", "\\@urcorner", !0), ae(ie, se, "open", "└", "\\@llcorner", !0), ae(ie, se, "close", "┘", "\\@lrcorner", !0), ae(ie, se, ue, "≦", "\\leqq", !0), ae(ie, se, ue, "⩽", "\\leqslant", !0), ae(ie, se, ue, "⪕", "\\eqslantless", !0), ae(ie, se, ue, "≲", "\\lesssim", !0), ae(ie, se, ue, "⪅", "\\lessapprox", !0), ae(ie, se, ue, "≊", "\\approxeq", !0), ae(ie, se, he, "⋖", "\\lessdot"), ae(ie, se, ue, "⋘", "\\lll", !0), ae(ie, se, ue, "≶", "\\lessgtr", !0), ae(ie, se, ue, "⋚", "\\lesseqgtr", !0), ae(ie, se, ue, "⪋", "\\lesseqqgtr", !0), ae(ie, se, ue, "≑", "\\doteqdot"), ae(ie, se, ue, "≓", "\\risingdotseq", !0), ae(ie, se, ue, "≒", "\\fallingdotseq", !0), ae(ie, se, ue, "∽", "\\backsim", !0), ae(ie, se, ue, "⋍", "\\backsimeq", !0), ae(ie, se, ue, "⫅", "\\subseteqq", !0), ae(ie, se, ue, "⋐", "\\Subset", !0), ae(ie, se, ue, "⊏", "\\sqsubset", !0), ae(ie, se, ue, "≼", "\\preccurlyeq", !0), ae(ie, se, ue, "⋞", "\\curlyeqprec", !0), ae(ie, se, ue, "≾", "\\precsim", !0), ae(ie, se, ue, "⪷", "\\precapprox", !0), ae(ie, se, ue, "⊲", "\\vartriangleleft"), ae(ie, se, ue, "⊴", "\\trianglelefteq"), ae(ie, se, ue, "⊨", "\\vDash", !0), ae(ie, se, ue, "⊪", "\\Vvdash", !0), ae(ie, se, ue, "⌣", "\\smallsmile"), ae(ie, se, ue, "⌢", "\\smallfrown"), ae(ie, se, ue, "≏", "\\bumpeq", !0), ae(ie, se, ue, "≎", "\\Bumpeq", !0), ae(ie, se, ue, "≧", "\\geqq", !0), ae(ie, se, ue, "⩾", "\\geqslant", !0), ae(ie, se, ue, "⪖", "\\eqslantgtr", !0), ae(ie, se, ue, "≳", "\\gtrsim", !0), ae(ie, se, ue, "⪆", "\\gtrapprox", !0), ae(ie, se, he, "⋗", "\\gtrdot"), ae(ie, se, ue, "⋙", "\\ggg", !0), ae(ie, se, ue, "≷", "\\gtrless", !0), ae(ie, se, ue, "⋛", "\\gtreqless", !0), ae(ie, se, ue, "⪌", "\\gtreqqless", !0), ae(ie, se, ue, "≖", "\\eqcirc", !0), ae(ie, se, ue, "≗", "\\circeq", !0), ae(ie, se, ue, "≜", "\\triangleq", !0), ae(ie, se, ue, "∼", "\\thicksim"), ae(ie, se, ue, "≈", "\\thickapprox"), ae(ie, se, ue, "⫆", "\\supseteqq", !0), ae(ie, se, ue, "⋑", "\\Supset", !0), ae(ie, se, ue, "⊐", "\\sqsupset", !0), ae(ie, se, ue, "≽", "\\succcurlyeq", !0), ae(ie, se, ue, "⋟", "\\curlyeqsucc", !0), ae(ie, se, ue, "≿", "\\succsim", !0), ae(ie, se, ue, "⪸", "\\succapprox", !0), ae(ie, se, ue, "⊳", "\\vartriangleright"), ae(ie, se, ue, "⊵", "\\trianglerighteq"), ae(ie, se, ue, "⊩", "\\Vdash", !0), ae(ie, se, ue, "∣", "\\shortmid"), ae(ie, se, ue, "∥", "\\shortparallel"), ae(ie, se, ue, "≬", "\\between", !0), ae(ie, se, ue, "⋔", "\\pitchfork", !0), ae(ie, se, ue, "∝", "\\varpropto"), ae(ie, se, ue, "◀", "\\blacktriangleleft"), ae(ie, se, ue, "∴", "\\therefore", !0), ae(ie, se, ue, "∍", "\\backepsilon"), ae(ie, se, ue, "▶", "\\blacktriangleright"), ae(ie, se, ue, "∵", "\\because", !0), ae(ie, se, ue, "⋘", "\\llless"), ae(ie, se, ue, "⋙", "\\gggtr"), ae(ie, se, he, "⊲", "\\lhd"), ae(ie, se, he, "⊳", "\\rhd"), ae(ie, se, ue, "≂", "\\eqsim", !0), ae(ie, oe, ue, "⋈", "\\Join"), ae(ie, se, ue, "≑", "\\Doteq", !0), ae(ie, se, he, "∔", "\\dotplus", !0), ae(ie, se, he, "∖", "\\smallsetminus"), ae(ie, se, he, "⋒", "\\Cap", !0), ae(ie, se, he, "⋓", "\\Cup", !0), ae(ie, se, he, "⩞", "\\doublebarwedge", !0), ae(ie, se, he, "⊟", "\\boxminus", !0), ae(ie, se, he, "⊞", "\\boxplus", !0), ae(ie, se, he, "⋇", "\\divideontimes", !0), ae(ie, se, he, "⋉", "\\ltimes", !0), ae(ie, se, he, "⋊", "\\rtimes", !0), ae(ie, se, he, "⋋", "\\leftthreetimes", !0), ae(ie, se, he, "⋌", "\\rightthreetimes", !0), ae(ie, se, he, "⋏", "\\curlywedge", !0), ae(ie, se, he, "⋎", "\\curlyvee", !0), ae(ie, se, he, "⊝", "\\circleddash", !0), ae(ie, se, he, "⊛", "\\circledast", !0), ae(ie, se, he, "⋅", "\\centerdot"), ae(ie, se, he, "⊺", "\\intercal", !0), ae(ie, se, he, "⋒", "\\doublecap"), ae(ie, se, he, "⋓", "\\doublecup"), ae(ie, se, he, "⊠", "\\boxtimes", !0), ae(ie, se, ue, "⇢", "\\dashrightarrow", !0), ae(ie, se, ue, "⇠", "\\dashleftarrow", !0), ae(ie, se, ue, "⇇", "\\leftleftarrows", !0), ae(ie, se, ue, "⇆", "\\leftrightarrows", !0), ae(ie, se, ue, "⇚", "\\Lleftarrow", !0), ae(ie, se, ue, "↞", "\\twoheadleftarrow", !0), ae(ie, se, ue, "↢", "\\leftarrowtail", !0), ae(ie, se, ue, "↫", "\\looparrowleft", !0), ae(ie, se, ue, "⇋", "\\leftrightharpoons", !0), ae(ie, se, ue, "↶", "\\curvearrowleft", !0), ae(ie, se, ue, "↺", "\\circlearrowleft", !0), ae(ie, se, ue, "↰", "\\Lsh", !0), ae(ie, se, ue, "⇈", "\\upuparrows", !0), ae(ie, se, ue, "↿", "\\upharpoonleft", !0), ae(ie, se, ue, "⇃", "\\downharpoonleft", !0), ae(ie, oe, ue, "⊶", "\\origof", !0), ae(ie, oe, ue, "⊷", "\\imageof", !0), ae(ie, se, ue, "⊸", "\\multimap", !0), ae(ie, se, ue, "↭", "\\leftrightsquigarrow", !0), ae(ie, se, ue, "⇉", "\\rightrightarrows", !0), ae(ie, se, ue, "⇄", "\\rightleftarrows", !0), ae(ie, se, ue, "↠", "\\twoheadrightarrow", !0), ae(ie, se, ue, "↣", "\\rightarrowtail", !0), ae(ie, se, ue, "↬", "\\looparrowright", !0), ae(ie, se, ue, "↷", "\\curvearrowright", !0), ae(ie, se, ue, "↻", "\\circlearrowright", !0), ae(ie, se, ue, "↱", "\\Rsh", !0), ae(ie, se, ue, "⇊", "\\downdownarrows", !0), ae(ie, se, ue, "↾", "\\upharpoonright", !0), ae(ie, se, ue, "⇂", "\\downharpoonright", !0), ae(ie, se, ue, "⇝", "\\rightsquigarrow", !0), ae(ie, se, ue, "⇝", "\\leadsto"), ae(ie, se, ue, "⇛", "\\Rrightarrow", !0), ae(ie, se, ue, "↾", "\\restriction"), ae(ie, oe, pe, "‘", "`"), ae(ie, oe, pe, "$", "\\$"), ae("text", oe, pe, "$", "\\$"), ae("text", oe, pe, "$", "\\textdollar"), ae(ie, oe, pe, "%", "\\%"), ae("text", oe, pe, "%", "\\%"), ae(ie, oe, pe, "_", "\\_"), ae("text", oe, pe, "_", "\\_"), ae("text", oe, pe, "_", "\\textunderscore"), ae(ie, oe, pe, "∠", "\\angle", !0), ae(ie, oe, pe, "∞", "\\infty", !0), ae(ie, oe, pe, "′", "\\prime"), ae(ie, oe, pe, "△", "\\triangle"), ae(ie, oe, pe, "Γ", "\\Gamma", !0), ae(ie, oe, pe, "Δ", "\\Delta", !0), ae(ie, oe, pe, "Θ", "\\Theta", !0), ae(ie, oe, pe, "Λ", "\\Lambda", !0), ae(ie, oe, pe, "Ξ", "\\Xi", !0), ae(ie, oe, pe, "Π", "\\Pi", !0), ae(ie, oe, pe, "Σ", "\\Sigma", !0), ae(ie, oe, pe, "Υ", "\\Upsilon", !0), ae(ie, oe, pe, "Φ", "\\Phi", !0), ae(ie, oe, pe, "Ψ", "\\Psi", !0), ae(ie, oe, pe, "Ω", "\\Omega", !0), ae(ie, oe, pe, "A", "Α"), ae(ie, oe, pe, "B", "Β"), ae(ie, oe, pe, "E", "Ε"), ae(ie, oe, pe, "Z", "Ζ"), ae(ie, oe, pe, "H", "Η"), ae(ie, oe, pe, "I", "Ι"), ae(ie, oe, pe, "K", "Κ"), ae(ie, oe, pe, "M", "Μ"), ae(ie, oe, pe, "N", "Ν"), ae(ie, oe, pe, "O", "Ο"), ae(ie, oe, pe, "P", "Ρ"), ae(ie, oe, pe, "T", "Τ"), ae(ie, oe, pe, "X", "Χ"), ae(ie, oe, pe, "¬", "\\neg", !0), ae(ie, oe, pe, "¬", "\\lnot"), ae(ie, oe, pe, "⊤", "\\top"), ae(ie, oe, pe, "⊥", "\\bot"), ae(ie, oe, pe, "∅", "\\emptyset"), ae(ie, se, pe, "∅", "\\varnothing"), ae(ie, oe, ce, "α", "\\alpha", !0), ae(ie, oe, ce, "β", "\\beta", !0), ae(ie, oe, ce, "γ", "\\gamma", !0), ae(ie, oe, ce, "δ", "\\delta", !0), ae(ie, oe, ce, "ϵ", "\\epsilon", !0), ae(ie, oe, ce, "ζ", "\\zeta", !0), ae(ie, oe, ce, "η", "\\eta", !0), ae(ie, oe, ce, "θ", "\\theta", !0), ae(ie, oe, ce, "ι", "\\iota", !0), ae(ie, oe, ce, "κ", "\\kappa", !0), ae(ie, oe, ce, "λ", "\\lambda", !0), ae(ie, oe, ce, "μ", "\\mu", !0), ae(ie, oe, ce, "ν", "\\nu", !0), ae(ie, oe, ce, "ξ", "\\xi", !0), ae(ie, oe, ce, "ο", "\\omicron", !0), ae(ie, oe, ce, "π", "\\pi", !0), ae(ie, oe, ce, "ρ", "\\rho", !0), ae(ie, oe, ce, "σ", "\\sigma", !0), ae(ie, oe, ce, "τ", "\\tau", !0), ae(ie, oe, ce, "υ", "\\upsilon", !0), ae(ie, oe, ce, "ϕ", "\\phi", !0), ae(ie, oe, ce, "χ", "\\chi", !0), ae(ie, oe, ce, "ψ", "\\psi", !0), ae(ie, oe, ce, "ω", "\\omega", !0), ae(ie, oe, ce, "ε", "\\varepsilon", !0), ae(ie, oe, ce, "ϑ", "\\vartheta", !0), ae(ie, oe, ce, "ϖ", "\\varpi", !0), ae(ie, oe, ce, "ϱ", "\\varrho", !0), ae(ie, oe, ce, "ς", "\\varsigma", !0), ae(ie, oe, ce, "φ", "\\varphi", !0), ae(ie, oe, he, "∗", "*", !0), ae(ie, oe, he, "+", "+"), ae(ie, oe, he, "−", "-", !0), ae(ie, oe, he, "⋅", "\\cdot", !0), ae(ie, oe, he, "∘", "\\circ", !0), ae(ie, oe, he, "÷", "\\div", !0), ae(ie, oe, he, "±", "\\pm", !0), ae(ie, oe, he, "×", "\\times", !0), ae(ie, oe, he, "∩", "\\cap", !0), ae(ie, oe, he, "∪", "\\cup", !0), ae(ie, oe, he, "∖", "\\setminus", !0), ae(ie, oe, he, "∧", "\\land"), ae(ie, oe, he, "∨", "\\lor"), ae(ie, oe, he, "∧", "\\wedge", !0), ae(ie, oe, he, "∨", "\\vee", !0), ae(ie, oe, pe, "√", "\\surd"), ae(ie, oe, "open", "⟨", "\\langle", !0), ae(ie, oe, "open", "∣", "\\lvert"), ae(ie, oe, "open", "∥", "\\lVert"), ae(ie, oe, "close", "?", "?"), ae(ie, oe, "close", "!", "!"), ae(ie, oe, "close", "⟩", "\\rangle", !0), ae(ie, oe, "close", "∣", "\\rvert"), ae(ie, oe, "close", "∥", "\\rVert"), ae(ie, oe, ue, "=", "="), ae(ie, oe, ue, ":", ":"), ae(ie, oe, ue, "≈", "\\approx", !0), ae(ie, oe, ue, "≅", "\\cong", !0), ae(ie, oe, ue, "≥", "\\ge"), ae(ie, oe, ue, "≥", "\\geq", !0), ae(ie, oe, ue, "←", "\\gets"), ae(ie, oe, ue, ">", "\\gt", !0), ae(ie, oe, ue, "∈", "\\in", !0), ae(ie, oe, ue, "", "\\@not"), ae(ie, oe, ue, "⊂", "\\subset", !0), ae(ie, oe, ue, "⊃", "\\supset", !0), ae(ie, oe, ue, "⊆", "\\subseteq", !0), ae(ie, oe, ue, "⊇", "\\supseteq", !0), ae(ie, se, ue, "⊈", "\\nsubseteq", !0), ae(ie, se, ue, "⊉", "\\nsupseteq", !0), ae(ie, oe, ue, "⊨", "\\models"), ae(ie, oe, ue, "←", "\\leftarrow", !0), ae(ie, oe, ue, "≤", "\\le"), ae(ie, oe, ue, "≤", "\\leq", !0), ae(ie, oe, ue, "<", "\\lt", !0), ae(ie, oe, ue, "→", "\\rightarrow", !0), ae(ie, oe, ue, "→", "\\to"), ae(ie, se, ue, "≱", "\\ngeq", !0), ae(ie, se, ue, "≰", "\\nleq", !0), ae(ie, oe, "spacing", " ", "\\ "), ae(ie, oe, "spacing", " ", "\\space"), ae(ie, oe, "spacing", " ", "\\nobreakspace"), ae("text", oe, "spacing", " ", "\\ "), ae("text", oe, "spacing", " ", " "), ae("text", oe, "spacing", " ", "\\space"), ae("text", oe, "spacing", " ", "\\nobreakspace"), ae(ie, oe, "spacing", null, "\\nobreak"), ae(ie, oe, "spacing", null, "\\allowbreak"), ae(ie, oe, "punct", ",", ","), ae(ie, oe, "punct", ";", ";"), ae(ie, se, he, "⊼", "\\barwedge", !0), ae(ie, se, he, "⊻", "\\veebar", !0), ae(ie, oe, he, "⊙", "\\odot", !0), ae(ie, oe, he, "⊕", "\\oplus", !0), ae(ie, oe, he, "⊗", "\\otimes", !0), ae(ie, oe, pe, "∂", "\\partial", !0), ae(ie, oe, he, "⊘", "\\oslash", !0), ae(ie, se, he, "⊚", "\\circledcirc", !0), ae(ie, se, he, "⊡", "\\boxdot", !0), ae(ie, oe, he, "△", "\\bigtriangleup"), ae(ie, oe, he, "▽", "\\bigtriangledown"), ae(ie, oe, he, "†", "\\dagger"), ae(ie, oe, he, "⋄", "\\diamond"), ae(ie, oe, he, "⋆", "\\star"), ae(ie, oe, he, "◃", "\\triangleleft"), ae(ie, oe, he, "▹", "\\triangleright"), ae(ie, oe, "open", "{", "\\{"), ae("text", oe, pe, "{", "\\{"), ae("text", oe, pe, "{", "\\textbraceleft"), ae(ie, oe, "close", "}", "\\}"), ae("text", oe, pe, "}", "\\}"), ae("text", oe, pe, "}", "\\textbraceright"), ae(ie, oe, "open", "{", "\\lbrace"), ae(ie, oe, "close", "}", "\\rbrace"), ae(ie, oe, "open", "[", "\\lbrack", !0), ae("text", oe, pe, "[", "\\lbrack", !0), ae(ie, oe, "close", "]", "\\rbrack", !0), ae("text", oe, pe, "]", "\\rbrack", !0), ae(ie, oe, "open", "(", "\\lparen", !0), ae(ie, oe, "close", ")", "\\rparen", !0), ae("text", oe, pe, "<", "\\textless", !0), ae("text", oe, pe, ">", "\\textgreater", !0), ae(ie, oe, "open", "⌊", "\\lfloor", !0), ae(ie, oe, "close", "⌋", "\\rfloor", !0), ae(ie, oe, "open", "⌈", "\\lceil", !0), ae(ie, oe, "close", "⌉", "\\rceil", !0), ae(ie, oe, pe, "\\", "\\backslash"), ae(ie, oe, pe, "∣", "|"), ae(ie, oe, pe, "∣", "\\vert"), ae("text", oe, pe, "|", "\\textbar", !0), ae(ie, oe, pe, "∥", "\\|"), ae(ie, oe, pe, "∥", "\\Vert"), ae("text", oe, pe, "∥", "\\textbardbl"), ae("text", oe, pe, "~", "\\textasciitilde"), ae("text", oe, pe, "\\", "\\textbackslash"), ae("text", oe, pe, "^", "\\textasciicircum"), ae(ie, oe, ue, "↑", "\\uparrow", !0), ae(ie, oe, ue, "⇑", "\\Uparrow", !0), ae(ie, oe, ue, "↓", "\\downarrow", !0), ae(ie, oe, ue, "⇓", "\\Downarrow", !0), ae(ie, oe, ue, "↕", "\\updownarrow", !0), ae(ie, oe, ue, "⇕", "\\Updownarrow", !0), ae(ie, oe, me, "∐", "\\coprod"), ae(ie, oe, me, "⋁", "\\bigvee"), ae(ie, oe, me, "⋀", "\\bigwedge"), ae(ie, oe, me, "⨄", "\\biguplus"), ae(ie, oe, me, "⋂", "\\bigcap"), ae(ie, oe, me, "⋃", "\\bigcup"), ae(ie, oe, me, "∫", "\\int"), ae(ie, oe, me, "∫", "\\intop"), ae(ie, oe, me, "∬", "\\iint"), ae(ie, oe, me, "∭", "\\iiint"), ae(ie, oe, me, "∏", "\\prod"), ae(ie, oe, me, "∑", "\\sum"), ae(ie, oe, me, "⨂", "\\bigotimes"), ae(ie, oe, me, "⨁", "\\bigoplus"), ae(ie, oe, me, "⨀", "\\bigodot"), ae(ie, oe, me, "∮", "\\oint"), ae(ie, oe, me, "∯", "\\oiint"), ae(ie, oe, me, "∰", "\\oiiint"), ae(ie, oe, me, "⨆", "\\bigsqcup"), ae(ie, oe, me, "∫", "\\smallint"), ae("text", oe, "inner", "…", "\\textellipsis"), ae(ie, oe, "inner", "…", "\\mathellipsis"), ae("text", oe, "inner", "…", "\\ldots", !0), ae(ie, oe, "inner", "…", "\\ldots", !0), ae(ie, oe, "inner", "⋯", "\\@cdots", !0), ae(ie, oe, "inner", "⋱", "\\ddots", !0), ae(ie, oe, pe, "⋮", "\\varvdots"), ae(ie, oe, le, "ˊ", "\\acute"), ae(ie, oe, le, "ˋ", "\\grave"), ae(ie, oe, le, "¨", "\\ddot"), ae(ie, oe, le, "~", "\\tilde"), ae(ie, oe, le, "ˉ", "\\bar"), ae(ie, oe, le, "˘", "\\breve"), ae(ie, oe, le, "ˇ", "\\check"), ae(ie, oe, le, "^", "\\hat"), ae(ie, oe, le, "⃗", "\\vec"), ae(ie, oe, le, "˙", "\\dot"), ae(ie, oe, le, "˚", "\\mathring"), ae(ie, oe, ce, "", "\\@imath"), ae(ie, oe, ce, "", "\\@jmath"), ae(ie, oe, pe, "ı", "ı"), ae(ie, oe, pe, "ȷ", "ȷ"), ae("text", oe, pe, "ı", "\\i", !0), ae("text", oe, pe, "ȷ", "\\j", !0), ae("text", oe, pe, "ß", "\\ss", !0), ae("text", oe, pe, "æ", "\\ae", !0), ae("text", oe, pe, "œ", "\\oe", !0), ae("text", oe, pe, "ø", "\\o", !0), ae("text", oe, pe, "Æ", "\\AE", !0), ae("text", oe, pe, "Œ", "\\OE", !0), ae("text", oe, pe, "Ø", "\\O", !0), ae("text", oe, le, "ˊ", "\\'"), ae("text", oe, le, "ˋ", "\\`"), ae("text", oe, le, "ˆ", "\\^"), ae("text", oe, le, "˜", "\\~"), ae("text", oe, le, "ˉ", "\\="), ae("text", oe, le, "˘", "\\u"), ae("text", oe, le, "˙", "\\."), ae("text", oe, le, "¸", "\\c"), ae("text", oe, le, "˚", "\\r"), ae("text", oe, le, "ˇ", "\\v"), ae("text", oe, le, "¨", '\\"'), ae("text", oe, le, "˝", "\\H"), ae("text", oe, le, "◯", "\\textcircled");
        var de = {
          "--": !0,
          "---": !0,
          "``": !0,
          "''": !0
        };
        ae("text", oe, pe, "–", "--", !0), ae("text", oe, pe, "–", "\\textendash"), ae("text", oe, pe, "—", "---", !0), ae("text", oe, pe, "—", "\\textemdash"), ae("text", oe, pe, "‘", "`", !0), ae("text", oe, pe, "‘", "\\textquoteleft"), ae("text", oe, pe, "’", "'", !0), ae("text", oe, pe, "’", "\\textquoteright"), ae("text", oe, pe, "“", "``", !0), ae("text", oe, pe, "“", "\\textquotedblleft"), ae("text", oe, pe, "”", "''", !0), ae("text", oe, pe, "”", "\\textquotedblright"), ae(ie, oe, pe, "°", "\\degree", !0), ae("text", oe, pe, "°", "\\degree"), ae("text", oe, pe, "°", "\\textdegree", !0), ae(ie, oe, pe, "£", "\\pounds"), ae(ie, oe, pe, "£", "\\mathsterling", !0), ae("text", oe, pe, "£", "\\pounds"), ae("text", oe, pe, "£", "\\textsterling", !0), ae(ie, se, pe, "✠", "\\maltese"), ae("text", se, pe, "✠", "\\maltese");
        for (var fe = 0; fe < '0123456789/@."'.length; fe++) {
          var ge = '0123456789/@."'.charAt(fe);
          ae(ie, oe, pe, ge, ge);
        }
        for (var ve = 0; ve < '0123456789!@*()-=+";:?/.,'.length; ve++) {
          var ye = '0123456789!@*()-=+";:?/.,'.charAt(ve);
          ae("text", oe, pe, ye, ye);
        }
        for (var be = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", xe = 0; xe < be.length; xe++) {
          var we = be.charAt(xe);
          ae(ie, oe, ce, we, we), ae("text", oe, pe, we, we);
        }
        ae(ie, se, pe, "C", "ℂ"), ae("text", se, pe, "C", "ℂ"), ae(ie, se, pe, "H", "ℍ"), ae("text", se, pe, "H", "ℍ"), ae(ie, se, pe, "N", "ℕ"), ae("text", se, pe, "N", "ℕ"), ae(ie, se, pe, "P", "ℙ"), ae("text", se, pe, "P", "ℙ"), ae(ie, se, pe, "Q", "ℚ"), ae("text", se, pe, "Q", "ℚ"), ae(ie, se, pe, "R", "ℝ"), ae("text", se, pe, "R", "ℝ"), ae(ie, se, pe, "Z", "ℤ"), ae("text", se, pe, "Z", "ℤ"), ae(ie, oe, ce, "h", "ℎ"), ae("text", oe, ce, "h", "ℎ");
        for (var ke = "", Se = 0; Se < be.length; Se++) {
          var Me = be.charAt(Se);
          ae(ie, oe, ce, Me, ke = String.fromCharCode(55349, 56320 + Se)), ae("text", oe, pe, Me, ke), ae(ie, oe, ce, Me, ke = String.fromCharCode(55349, 56372 + Se)), ae("text", oe, pe, Me, ke), ae(ie, oe, ce, Me, ke = String.fromCharCode(55349, 56424 + Se)), ae("text", oe, pe, Me, ke), ae(ie, oe, ce, Me, ke = String.fromCharCode(55349, 56580 + Se)), ae("text", oe, pe, Me, ke), ae(ie, oe, ce, Me, ke = String.fromCharCode(55349, 56736 + Se)), ae("text", oe, pe, Me, ke), ae(ie, oe, ce, Me, ke = String.fromCharCode(55349, 56788 + Se)), ae("text", oe, pe, Me, ke), ae(ie, oe, ce, Me, ke = String.fromCharCode(55349, 56840 + Se)), ae("text", oe, pe, Me, ke), ae(ie, oe, ce, Me, ke = String.fromCharCode(55349, 56944 + Se)), ae("text", oe, pe, Me, ke), Se < 26 && (ae(ie, oe, ce, Me, ke = String.fromCharCode(55349, 56632 + Se)), ae("text", oe, pe, Me, ke), ae(ie, oe, ce, Me, ke = String.fromCharCode(55349, 56476 + Se)), ae("text", oe, pe, Me, ke));
        }
        ae(ie, oe, ce, "k", ke = String.fromCharCode(55349, 56668)), ae("text", oe, pe, "k", ke);
        for (var ze = 0; ze < 10; ze++) {
          var Ae = ze.toString();
          ae(ie, oe, ce, Ae, ke = String.fromCharCode(55349, 57294 + ze)), ae("text", oe, pe, Ae, ke), ae(ie, oe, ce, Ae, ke = String.fromCharCode(55349, 57314 + ze)), ae("text", oe, pe, Ae, ke), ae(ie, oe, ce, Ae, ke = String.fromCharCode(55349, 57324 + ze)), ae("text", oe, pe, Ae, ke), ae(ie, oe, ce, Ae, ke = String.fromCharCode(55349, 57334 + ze)), ae("text", oe, pe, Ae, ke);
        }
        for (var Te = 0; Te < "ÐÞþ".length; Te++) {
          var Be = "ÐÞþ".charAt(Te);
          ae(ie, oe, ce, Be, Be), ae("text", oe, pe, Be, Be);
        }
        var Ce = [["mathbf", "textbf", "Main-Bold"], ["mathbf", "textbf", "Main-Bold"], ["mathnormal", "textit", "Math-Italic"], ["mathnormal", "textit", "Math-Italic"], ["boldsymbol", "boldsymbol", "Main-BoldItalic"], ["boldsymbol", "boldsymbol", "Main-BoldItalic"], ["mathscr", "textscr", "Script-Regular"], ["", "", ""], ["", "", ""], ["", "", ""], ["mathfrak", "textfrak", "Fraktur-Regular"], ["mathfrak", "textfrak", "Fraktur-Regular"], ["mathbb", "textbb", "AMS-Regular"], ["mathbb", "textbb", "AMS-Regular"], ["", "", ""], ["", "", ""], ["mathsf", "textsf", "SansSerif-Regular"], ["mathsf", "textsf", "SansSerif-Regular"], ["mathboldsf", "textboldsf", "SansSerif-Bold"], ["mathboldsf", "textboldsf", "SansSerif-Bold"], ["mathitsf", "textitsf", "SansSerif-Italic"], ["mathitsf", "textitsf", "SansSerif-Italic"], ["", "", ""], ["", "", ""], ["mathtt", "texttt", "Typewriter-Regular"], ["mathtt", "texttt", "Typewriter-Regular"]],
          Ne = [["mathbf", "textbf", "Main-Bold"], ["", "", ""], ["mathsf", "textsf", "SansSerif-Regular"], ["mathboldsf", "textboldsf", "SansSerif-Bold"], ["mathtt", "texttt", "Typewriter-Regular"]],
          qe = function qe(e, t, r) {
            return ne[r][e] && ne[r][e].replace && (e = ne[r][e].replace), {
              value: e,
              metrics: C(e, t, r)
            };
          },
          Ie = function Ie(e, t, r, n, a) {
            var i,
              o = qe(e, t, r),
              s = o.metrics;
            if (e = o.value, s) {
              var l = s.italic;
              ("text" === r || n && "mathit" === n.font) && (l = 0), i = new $(e, s.height, s.depth, l, s.skew, s.width, a);
            } else "undefined" != typeof console && console.warn("No character metrics for '" + e + "' in style '" + t + "' and mode '" + r + "'"), i = new $(e, 0, 0, 0, 0, 0, a);
            if (n) {
              i.maxFontSize = n.sizeMultiplier, n.style.isTight() && i.classes.push("mtight");
              var h = n.getColor();
              h && (i.style.color = h);
            }
            return i;
          },
          Oe = function Oe(e, t) {
            if (V(e.classes) !== V(t.classes) || e.skew !== t.skew || e.maxFontSize !== t.maxFontSize) return !1;
            if (1 === e.classes.length) {
              var r = e.classes[0];
              if ("mbin" === r || "mord" === r) return !1;
            }
            for (var n in e.style) {
              if (e.style.hasOwnProperty(n) && e.style[n] !== t.style[n]) return !1;
            }
            for (var a in t.style) {
              if (t.style.hasOwnProperty(a) && e.style[a] !== t.style[a]) return !1;
            }
            return !0;
          },
          Re = function Re(e) {
            for (var t = 0, r = 0, n = 0, a = 0; a < e.children.length; a++) {
              var i = e.children[a];
              i.height > t && (t = i.height), i.depth > r && (r = i.depth), i.maxFontSize > n && (n = i.maxFontSize);
            }
            e.height = t, e.depth = r, e.maxFontSize = n;
          },
          He = function He(e, t, r, n) {
            var a = new Y(e, t, r, n);
            return Re(a), a;
          },
          Ee = function Ee(e, t, r, n) {
            return new Y(e, t, r, n);
          },
          Le = function Le(e) {
            var t = new z(e);
            return Re(t), t;
          },
          De = function De(e, t, r) {
            var n = "";
            switch (e) {
              case "amsrm":
                n = "AMS";
                break;
              case "textrm":
                n = "Main";
                break;
              case "textsf":
                n = "SansSerif";
                break;
              case "texttt":
                n = "Typewriter";
                break;
              default:
                n = e;
            }
            return n + "-" + ("textbf" === t && "textit" === r ? "BoldItalic" : "textbf" === t ? "Bold" : "textit" === t ? "Italic" : "Regular");
          },
          Pe = {
            mathbf: {
              variant: "bold",
              fontName: "Main-Bold"
            },
            mathrm: {
              variant: "normal",
              fontName: "Main-Regular"
            },
            textit: {
              variant: "italic",
              fontName: "Main-Italic"
            },
            mathit: {
              variant: "italic",
              fontName: "Main-Italic"
            },
            mathnormal: {
              variant: "italic",
              fontName: "Math-Italic"
            },
            mathbb: {
              variant: "double-struck",
              fontName: "AMS-Regular"
            },
            mathcal: {
              variant: "script",
              fontName: "Caligraphic-Regular"
            },
            mathfrak: {
              variant: "fraktur",
              fontName: "Fraktur-Regular"
            },
            mathscr: {
              variant: "script",
              fontName: "Script-Regular"
            },
            mathsf: {
              variant: "sans-serif",
              fontName: "SansSerif-Regular"
            },
            mathtt: {
              variant: "monospace",
              fontName: "Typewriter-Regular"
            }
          },
          Fe = {
            vec: ["vec", .471, .714],
            oiintSize1: ["oiintSize1", .957, .499],
            oiintSize2: ["oiintSize2", 1.472, .659],
            oiiintSize1: ["oiiintSize1", 1.304, .499],
            oiiintSize2: ["oiiintSize2", 1.98, .659]
          },
          Ve = {
            fontMap: Pe,
            makeSymbol: Ie,
            mathsym: function mathsym(e, t, r, n) {
              return void 0 === n && (n = []), "boldsymbol" === r.font && qe(e, "Main-Bold", t).metrics ? Ie(e, "Main-Bold", t, r, n.concat(["mathbf"])) : "\\" === e || "main" === ne[t][e].font ? Ie(e, "Main-Regular", t, r, n) : Ie(e, "AMS-Regular", t, r, n.concat(["amsrm"]));
            },
            makeSpan: He,
            makeSvgSpan: Ee,
            makeLineSpan: function makeLineSpan(e, t, r) {
              var n = He([e], [], t);
              return n.height = Math.max(r || t.fontMetrics().defaultRuleThickness, t.minRuleThickness), n.style.borderBottomWidth = F(n.height), n.maxFontSize = 1, n;
            },
            makeAnchor: function makeAnchor(e, t, r, n) {
              var a = new X(e, t, r, n);
              return Re(a), a;
            },
            makeFragment: Le,
            wrapFragment: function wrapFragment(e, t) {
              return e instanceof z ? He([], [e], t) : e;
            },
            makeVList: function makeVList(e, t) {
              for (var r = function (e) {
                  if ("individualShift" === e.positionType) {
                    for (var t = e.children, r = [t[0]], n = -t[0].shift - t[0].elem.depth, a = n, i = 1; i < t.length; i++) {
                      var o = -t[i].shift - a - t[i].elem.depth,
                        s = o - (t[i - 1].elem.height + t[i - 1].elem.depth);
                      a += o, r.push({
                        type: "kern",
                        size: s
                      }), r.push(t[i]);
                    }
                    return {
                      children: r,
                      depth: n
                    };
                  }
                  var l;
                  if ("top" === e.positionType) {
                    for (var h = e.positionData, c = 0; c < e.children.length; c++) {
                      var m = e.children[c];
                      h -= "kern" === m.type ? m.size : m.elem.height + m.elem.depth;
                    }
                    l = h;
                  } else if ("bottom" === e.positionType) l = -e.positionData;else {
                    var u = e.children[0];
                    if ("elem" !== u.type) throw new Error('First child must have type "elem".');
                    if ("shift" === e.positionType) l = -u.elem.depth - e.positionData;else {
                      if ("firstBaseline" !== e.positionType) throw new Error("Invalid positionType " + e.positionType + ".");
                      l = -u.elem.depth;
                    }
                  }
                  return {
                    children: e.children,
                    depth: l
                  };
                }(e), n = r.children, a = r.depth, i = 0, o = 0; o < n.length; o++) {
                var s = n[o];
                if ("elem" === s.type) {
                  var l = s.elem;
                  i = Math.max(i, l.maxFontSize, l.height);
                }
              }
              i += 2;
              var h = He(["pstrut"], []);
              h.style.height = F(i);
              for (var c = [], m = a, u = a, p = a, d = 0; d < n.length; d++) {
                var f = n[d];
                if ("kern" === f.type) p += f.size;else {
                  var g = f.elem,
                    v = f.wrapperClasses || [],
                    y = f.wrapperStyle || {},
                    b = He(v, [h, g], void 0, y);
                  b.style.top = F(-i - p - g.depth), f.marginLeft && (b.style.marginLeft = f.marginLeft), f.marginRight && (b.style.marginRight = f.marginRight), c.push(b), p += g.height + g.depth;
                }
                m = Math.min(m, p), u = Math.max(u, p);
              }
              var x,
                w = He(["vlist"], c);
              if (w.style.height = F(u), m < 0) {
                var k = He([], []),
                  S = He(["vlist"], [k]);
                S.style.height = F(-m);
                var M = He(["vlist-s"], [new $("​")]);
                x = [He(["vlist-r"], [w, M]), He(["vlist-r"], [S])];
              } else x = [He(["vlist-r"], [w])];
              var z = He(["vlist-t"], x);
              return 2 === x.length && z.classes.push("vlist-t2"), z.height = u, z.depth = -m, z;
            },
            makeOrd: function makeOrd(e, t, r) {
              var a = e.mode,
                i = e.text,
                o = ["mord"],
                s = "math" === a || "text" === a && t.font,
                l = s ? t.font : t.fontFamily;
              if (55349 === i.charCodeAt(0)) {
                var h = function (e, t) {
                    var r = 1024 * (e.charCodeAt(0) - 55296) + (e.charCodeAt(1) - 56320) + 65536,
                      a = "math" === t ? 0 : 1;
                    if (119808 <= r && r < 120484) {
                      var i = Math.floor((r - 119808) / 26);
                      return [Ce[i][2], Ce[i][a]];
                    }
                    if (120782 <= r && r <= 120831) {
                      var o = Math.floor((r - 120782) / 10);
                      return [Ne[o][2], Ne[o][a]];
                    }
                    if (120485 === r || 120486 === r) return [Ce[0][2], Ce[0][a]];
                    if (120486 < r && r < 120782) return ["", ""];
                    throw new n("Unsupported character: " + e);
                  }(i, a),
                  c = h[0],
                  m = h[1];
                return Ie(i, c, a, t, o.concat(m));
              }
              if (l) {
                var u, p;
                if ("boldsymbol" === l) {
                  var d = function (e, t, r, n, a) {
                    return "textord" !== a && qe(e, "Math-BoldItalic", t).metrics ? {
                      fontName: "Math-BoldItalic",
                      fontClass: "boldsymbol"
                    } : {
                      fontName: "Main-Bold",
                      fontClass: "mathbf"
                    };
                  }(i, a, 0, 0, r);
                  u = d.fontName, p = [d.fontClass];
                } else s ? (u = Pe[l].fontName, p = [l]) : (u = De(l, t.fontWeight, t.fontShape), p = [l, t.fontWeight, t.fontShape]);
                if (qe(i, u, a).metrics) return Ie(i, u, a, t, o.concat(p));
                if (de.hasOwnProperty(i) && "Typewriter" === u.substr(0, 10)) {
                  for (var f = [], g = 0; g < i.length; g++) {
                    f.push(Ie(i[g], u, a, t, o.concat(p)));
                  }
                  return Le(f);
                }
              }
              if ("mathord" === r) return Ie(i, "Math-Italic", a, t, o.concat(["mathnormal"]));
              if ("textord" === r) {
                var v = ne[a][i] && ne[a][i].font;
                if ("ams" === v) {
                  var y = De("amsrm", t.fontWeight, t.fontShape);
                  return Ie(i, y, a, t, o.concat("amsrm", t.fontWeight, t.fontShape));
                }
                if ("main" !== v && v) {
                  var b = De(v, t.fontWeight, t.fontShape);
                  return Ie(i, b, a, t, o.concat(b, t.fontWeight, t.fontShape));
                }
                var x = De("textrm", t.fontWeight, t.fontShape);
                return Ie(i, x, a, t, o.concat(t.fontWeight, t.fontShape));
              }
              throw new Error("unexpected type: " + r + " in makeOrd");
            },
            makeGlue: function makeGlue(e, t) {
              var r = He(["mspace"], [], t),
                n = P(e, t);
              return r.style.marginRight = F(n), r;
            },
            staticSvg: function staticSvg(e, t) {
              var r = Fe[e],
                n = r[0],
                a = r[1],
                i = r[2],
                o = new K(n),
                s = new Z([o], {
                  width: F(a),
                  height: F(i),
                  style: "width:" + F(a),
                  viewBox: "0 0 " + 1e3 * a + " " + 1e3 * i,
                  preserveAspectRatio: "xMinYMin"
                }),
                l = Ee(["overlay"], [s], t);
              return l.height = i, l.style.height = F(i), l.style.width = F(a), l;
            },
            svgData: Fe,
            tryCombineChars: function tryCombineChars(e) {
              for (var t = 0; t < e.length - 1; t++) {
                var r = e[t],
                  n = e[t + 1];
                r instanceof $ && n instanceof $ && Oe(r, n) && (r.text += n.text, r.height = Math.max(r.height, n.height), r.depth = Math.max(r.depth, n.depth), r.italic = n.italic, e.splice(t + 1, 1), t--);
              }
              return e;
            }
          },
          Ge = {
            number: 3,
            unit: "mu"
          },
          Ue = {
            number: 4,
            unit: "mu"
          },
          _e = {
            number: 5,
            unit: "mu"
          },
          Ye = {
            mord: {
              mop: Ge,
              mbin: Ue,
              mrel: _e,
              minner: Ge
            },
            mop: {
              mord: Ge,
              mop: Ge,
              mrel: _e,
              minner: Ge
            },
            mbin: {
              mord: Ue,
              mop: Ue,
              mopen: Ue,
              minner: Ue
            },
            mrel: {
              mord: _e,
              mop: _e,
              mopen: _e,
              minner: _e
            },
            mopen: {},
            mclose: {
              mop: Ge,
              mbin: Ue,
              mrel: _e,
              minner: Ge
            },
            mpunct: {
              mord: Ge,
              mop: Ge,
              mrel: _e,
              mopen: Ge,
              mclose: Ge,
              mpunct: Ge,
              minner: Ge
            },
            minner: {
              mord: Ge,
              mop: Ge,
              mbin: Ue,
              mrel: _e,
              mopen: Ge,
              mpunct: Ge,
              minner: Ge
            }
          },
          Xe = {
            mord: {
              mop: Ge
            },
            mop: {
              mord: Ge,
              mop: Ge
            },
            mbin: {},
            mrel: {},
            mopen: {},
            mclose: {
              mop: Ge
            },
            mpunct: {},
            minner: {
              mop: Ge
            }
          },
          We = {},
          je = {},
          $e = {};
        function Ze(e) {
          for (var t = e.type, r = e.names, n = e.props, a = e.handler, i = e.htmlBuilder, o = e.mathmlBuilder, s = {
              type: t,
              numArgs: n.numArgs,
              argTypes: n.argTypes,
              allowedInArgument: !!n.allowedInArgument,
              allowedInText: !!n.allowedInText,
              allowedInMath: void 0 === n.allowedInMath || n.allowedInMath,
              numOptionalArgs: n.numOptionalArgs || 0,
              infix: !!n.infix,
              primitive: !!n.primitive,
              handler: a
            }, l = 0; l < r.length; ++l) {
            We[r[l]] = s;
          }
          t && (i && (je[t] = i), o && ($e[t] = o));
        }
        function Ke(e) {
          Ze({
            type: e.type,
            names: [],
            props: {
              numArgs: 0
            },
            handler: function handler() {
              throw new Error("Should never be called.");
            },
            htmlBuilder: e.htmlBuilder,
            mathmlBuilder: e.mathmlBuilder
          });
        }
        var Je = function Je(e) {
            return "ordgroup" === e.type && 1 === e.body.length ? e.body[0] : e;
          },
          Qe = function Qe(e) {
            return "ordgroup" === e.type ? e.body : [e];
          },
          et = Ve.makeSpan,
          tt = ["leftmost", "mbin", "mopen", "mrel", "mop", "mpunct"],
          rt = ["rightmost", "mrel", "mclose", "mpunct"],
          nt = {
            display: x.DISPLAY,
            text: x.TEXT,
            script: x.SCRIPT,
            scriptscript: x.SCRIPTSCRIPT
          },
          at = {
            mord: "mord",
            mop: "mop",
            mbin: "mbin",
            mrel: "mrel",
            mopen: "mopen",
            mclose: "mclose",
            mpunct: "mpunct",
            minner: "minner"
          },
          it = function it(e, t, r, n) {
            void 0 === n && (n = [null, null]);
            for (var a = [], i = 0; i < e.length; i++) {
              var o = ct(e[i], t);
              if (o instanceof z) {
                var s = o.children;
                a.push.apply(a, s);
              } else a.push(o);
            }
            if (Ve.tryCombineChars(a), !r) return a;
            var h = t;
            if (1 === e.length) {
              var c = e[0];
              "sizing" === c.type ? h = t.havingSize(c.size) : "styling" === c.type && (h = t.havingStyle(nt[c.style]));
            }
            var m = et([n[0] || "leftmost"], [], t),
              u = et([n[1] || "rightmost"], [], t),
              p = "root" === r;
            return ot(a, function (e, t) {
              var r = t.classes[0],
                n = e.classes[0];
              "mbin" === r && l.contains(rt, n) ? t.classes[0] = "mord" : "mbin" === n && l.contains(tt, r) && (e.classes[0] = "mord");
            }, {
              node: m
            }, u, p), ot(a, function (e, t) {
              var r = lt(t),
                n = lt(e),
                a = r && n ? e.hasClass("mtight") ? Xe[r][n] : Ye[r][n] : null;
              if (a) return Ve.makeGlue(a, h);
            }, {
              node: m
            }, u, p), a;
          },
          ot = function e(t, r, n, a, i) {
            a && t.push(a);
            for (var o = 0; o < t.length; o++) {
              var s = t[o],
                l = st(s);
              if (l) e(l.children, r, n, null, i);else {
                var h = !s.hasClass("mspace");
                if (h) {
                  var c = r(s, n.node);
                  c && (n.insertAfter ? n.insertAfter(c) : (t.unshift(c), o++));
                }
                h ? n.node = s : i && s.hasClass("newline") && (n.node = et(["leftmost"])), n.insertAfter = function (e) {
                  return function (r) {
                    t.splice(e + 1, 0, r), o++;
                  };
                }(o);
              }
            }
            a && t.pop();
          },
          st = function st(e) {
            return e instanceof z || e instanceof X || e instanceof Y && e.hasClass("enclosing") ? e : null;
          },
          lt = function lt(e, t) {
            return e ? (t && (e = function e(t, r) {
              var n = st(t);
              if (n) {
                var a = n.children;
                if (a.length) {
                  if ("right" === r) return e(a[a.length - 1], "right");
                  if ("left" === r) return e(a[0], "left");
                }
              }
              return t;
            }(e, t)), at[e.classes[0]] || null) : null;
          },
          ht = function ht(e, t) {
            var r = ["nulldelimiter"].concat(e.baseSizingClasses());
            return et(t.concat(r));
          },
          ct = function ct(e, t, r) {
            if (!e) return et();
            if (je[e.type]) {
              var a = je[e.type](e, t);
              if (r && t.size !== r.size) {
                a = et(t.sizingClasses(r), [a], t);
                var i = t.sizeMultiplier / r.sizeMultiplier;
                a.height *= i, a.depth *= i;
              }
              return a;
            }
            throw new n("Got group of unknown type: '" + e.type + "'");
          };
        function mt(e, t) {
          var r = et(["base"], e, t),
            n = et(["strut"]);
          return n.style.height = F(r.height + r.depth), r.depth && (n.style.verticalAlign = F(-r.depth)), r.children.unshift(n), r;
        }
        function ut(e, t) {
          var r = null;
          1 === e.length && "tag" === e[0].type && (r = e[0].tag, e = e[0].body);
          var n,
            a = it(e, t, "root");
          2 === a.length && a[1].hasClass("tag") && (n = a.pop());
          for (var i, o = [], s = [], l = 0; l < a.length; l++) {
            if (s.push(a[l]), a[l].hasClass("mbin") || a[l].hasClass("mrel") || a[l].hasClass("allowbreak")) {
              for (var h = !1; l < a.length - 1 && a[l + 1].hasClass("mspace") && !a[l + 1].hasClass("newline");) {
                l++, s.push(a[l]), a[l].hasClass("nobreak") && (h = !0);
              }
              h || (o.push(mt(s, t)), s = []);
            } else a[l].hasClass("newline") && (s.pop(), s.length > 0 && (o.push(mt(s, t)), s = []), o.push(a[l]));
          }
          s.length > 0 && o.push(mt(s, t)), r ? ((i = mt(it(r, t, !0))).classes = ["tag"], o.push(i)) : n && o.push(n);
          var c = et(["katex-html"], o);
          if (c.setAttribute("aria-hidden", "true"), i) {
            var m = i.children[0];
            m.style.height = F(c.height + c.depth), c.depth && (m.style.verticalAlign = F(-c.depth));
          }
          return c;
        }
        function pt(e) {
          return new z(e);
        }
        var dt = function () {
            function e(e, t, r) {
              this.type = void 0, this.attributes = void 0, this.children = void 0, this.classes = void 0, this.type = e, this.attributes = {}, this.children = t || [], this.classes = r || [];
            }
            var t = e.prototype;
            return t.setAttribute = function (e, t) {
              this.attributes[e] = t;
            }, t.getAttribute = function (e) {
              return this.attributes[e];
            }, t.toNode = function () {
              var e = document.createElementNS("http://www.w3.org/1998/Math/MathML", this.type);
              for (var t in this.attributes) {
                Object.prototype.hasOwnProperty.call(this.attributes, t) && e.setAttribute(t, this.attributes[t]);
              }
              this.classes.length > 0 && (e.className = V(this.classes));
              for (var r = 0; r < this.children.length; r++) {
                e.appendChild(this.children[r].toNode());
              }
              return e;
            }, t.toMarkup = function () {
              var e = "<" + this.type;
              for (var t in this.attributes) {
                Object.prototype.hasOwnProperty.call(this.attributes, t) && (e += " " + t + '="', e += l.escape(this.attributes[t]), e += '"');
              }
              this.classes.length > 0 && (e += ' class ="' + l.escape(V(this.classes)) + '"'), e += ">";
              for (var r = 0; r < this.children.length; r++) {
                e += this.children[r].toMarkup();
              }
              return e += "</" + this.type + ">";
            }, t.toText = function () {
              return this.children.map(function (e) {
                return e.toText();
              }).join("");
            }, e;
          }(),
          ft = function () {
            function e(e) {
              this.text = void 0, this.text = e;
            }
            var t = e.prototype;
            return t.toNode = function () {
              return document.createTextNode(this.text);
            }, t.toMarkup = function () {
              return l.escape(this.toText());
            }, t.toText = function () {
              return this.text;
            }, e;
          }(),
          gt = {
            MathNode: dt,
            TextNode: ft,
            SpaceNode: function () {
              function e(e) {
                this.width = void 0, this.character = void 0, this.width = e, this.character = e >= .05555 && e <= .05556 ? " " : e >= .1666 && e <= .1667 ? " " : e >= .2222 && e <= .2223 ? " " : e >= .2777 && e <= .2778 ? "  " : e >= -.05556 && e <= -.05555 ? " ⁣" : e >= -.1667 && e <= -.1666 ? " ⁣" : e >= -.2223 && e <= -.2222 ? " ⁣" : e >= -.2778 && e <= -.2777 ? " ⁣" : null;
              }
              var t = e.prototype;
              return t.toNode = function () {
                if (this.character) return document.createTextNode(this.character);
                var e = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mspace");
                return e.setAttribute("width", F(this.width)), e;
              }, t.toMarkup = function () {
                return this.character ? "<mtext>" + this.character + "</mtext>" : '<mspace width="' + F(this.width) + '"/>';
              }, t.toText = function () {
                return this.character ? this.character : " ";
              }, e;
            }(),
            newDocumentFragment: pt
          },
          vt = function vt(e, t, r) {
            return !ne[t][e] || !ne[t][e].replace || 55349 === e.charCodeAt(0) || de.hasOwnProperty(e) && r && (r.fontFamily && "tt" === r.fontFamily.substr(4, 2) || r.font && "tt" === r.font.substr(4, 2)) || (e = ne[t][e].replace), new gt.TextNode(e);
          },
          yt = function yt(e) {
            return 1 === e.length ? e[0] : new gt.MathNode("mrow", e);
          },
          bt = function bt(e, t) {
            if ("texttt" === t.fontFamily) return "monospace";
            if ("textsf" === t.fontFamily) return "textit" === t.fontShape && "textbf" === t.fontWeight ? "sans-serif-bold-italic" : "textit" === t.fontShape ? "sans-serif-italic" : "textbf" === t.fontWeight ? "bold-sans-serif" : "sans-serif";
            if ("textit" === t.fontShape && "textbf" === t.fontWeight) return "bold-italic";
            if ("textit" === t.fontShape) return "italic";
            if ("textbf" === t.fontWeight) return "bold";
            var r = t.font;
            if (!r || "mathnormal" === r) return null;
            var n = e.mode;
            if ("mathit" === r) return "italic";
            if ("boldsymbol" === r) return "textord" === e.type ? "bold" : "bold-italic";
            if ("mathbf" === r) return "bold";
            if ("mathbb" === r) return "double-struck";
            if ("mathfrak" === r) return "fraktur";
            if ("mathscr" === r || "mathcal" === r) return "script";
            if ("mathsf" === r) return "sans-serif";
            if ("mathtt" === r) return "monospace";
            var a = e.text;
            return l.contains(["\\imath", "\\jmath"], a) ? null : (ne[n][a] && ne[n][a].replace && (a = ne[n][a].replace), C(a, Ve.fontMap[r].fontName, n) ? Ve.fontMap[r].variant : null);
          },
          xt = function xt(e, t, r) {
            if (1 === e.length) {
              var n = kt(e[0], t);
              return r && n instanceof dt && "mo" === n.type && (n.setAttribute("lspace", "0em"), n.setAttribute("rspace", "0em")), [n];
            }
            for (var a, i = [], o = 0; o < e.length; o++) {
              var s = kt(e[o], t);
              if (s instanceof dt && a instanceof dt) {
                if ("mtext" === s.type && "mtext" === a.type && s.getAttribute("mathvariant") === a.getAttribute("mathvariant")) {
                  var l;
                  (l = a.children).push.apply(l, s.children);
                  continue;
                }
                if ("mn" === s.type && "mn" === a.type) {
                  var h;
                  (h = a.children).push.apply(h, s.children);
                  continue;
                }
                if ("mi" === s.type && 1 === s.children.length && "mn" === a.type) {
                  var c = s.children[0];
                  if (c instanceof ft && "." === c.text) {
                    var m;
                    (m = a.children).push.apply(m, s.children);
                    continue;
                  }
                } else if ("mi" === a.type && 1 === a.children.length) {
                  var u = a.children[0];
                  if (u instanceof ft && "̸" === u.text && ("mo" === s.type || "mi" === s.type || "mn" === s.type)) {
                    var p = s.children[0];
                    p instanceof ft && p.text.length > 0 && (p.text = p.text.slice(0, 1) + "̸" + p.text.slice(1), i.pop());
                  }
                }
              }
              i.push(s), a = s;
            }
            return i;
          },
          wt = function wt(e, t, r) {
            return yt(xt(e, t, r));
          },
          kt = function kt(e, t) {
            if (!e) return new gt.MathNode("mrow");
            if ($e[e.type]) return $e[e.type](e, t);
            throw new n("Got group of unknown type: '" + e.type + "'");
          };
        function St(e, t, r, n, a) {
          var i,
            o = xt(e, r);
          i = 1 === o.length && o[0] instanceof dt && l.contains(["mrow", "mtable"], o[0].type) ? o[0] : new gt.MathNode("mrow", o);
          var s = new gt.MathNode("annotation", [new gt.TextNode(t)]);
          s.setAttribute("encoding", "application/x-tex");
          var h = new gt.MathNode("semantics", [i, s]),
            c = new gt.MathNode("math", [h]);
          c.setAttribute("xmlns", "http://www.w3.org/1998/Math/MathML"), n && c.setAttribute("display", "block");
          var m = a ? "katex" : "katex-mathml";
          return Ve.makeSpan([m], [c]);
        }
        var Mt = function Mt(e) {
            return new H({
              style: e.displayMode ? x.DISPLAY : x.TEXT,
              maxSize: e.maxSize,
              minRuleThickness: e.minRuleThickness
            });
          },
          zt = function zt(e, t) {
            if (t.displayMode) {
              var r = ["katex-display"];
              t.leqno && r.push("leqno"), t.fleqn && r.push("fleqn"), e = Ve.makeSpan(r, [e]);
            }
            return e;
          },
          At = {
            widehat: "^",
            widecheck: "ˇ",
            widetilde: "~",
            utilde: "~",
            overleftarrow: "←",
            underleftarrow: "←",
            xleftarrow: "←",
            overrightarrow: "→",
            underrightarrow: "→",
            xrightarrow: "→",
            underbrace: "⏟",
            overbrace: "⏞",
            overgroup: "⏠",
            undergroup: "⏡",
            overleftrightarrow: "↔",
            underleftrightarrow: "↔",
            xleftrightarrow: "↔",
            Overrightarrow: "⇒",
            xRightarrow: "⇒",
            overleftharpoon: "↼",
            xleftharpoonup: "↼",
            overrightharpoon: "⇀",
            xrightharpoonup: "⇀",
            xLeftarrow: "⇐",
            xLeftrightarrow: "⇔",
            xhookleftarrow: "↩",
            xhookrightarrow: "↪",
            xmapsto: "↦",
            xrightharpoondown: "⇁",
            xleftharpoondown: "↽",
            xrightleftharpoons: "⇌",
            xleftrightharpoons: "⇋",
            xtwoheadleftarrow: "↞",
            xtwoheadrightarrow: "↠",
            xlongequal: "=",
            xtofrom: "⇄",
            xrightleftarrows: "⇄",
            xrightequilibrium: "⇌",
            xleftequilibrium: "⇋",
            "\\cdrightarrow": "→",
            "\\cdleftarrow": "←",
            "\\cdlongequal": "="
          },
          Tt = {
            overrightarrow: [["rightarrow"], .888, 522, "xMaxYMin"],
            overleftarrow: [["leftarrow"], .888, 522, "xMinYMin"],
            underrightarrow: [["rightarrow"], .888, 522, "xMaxYMin"],
            underleftarrow: [["leftarrow"], .888, 522, "xMinYMin"],
            xrightarrow: [["rightarrow"], 1.469, 522, "xMaxYMin"],
            "\\cdrightarrow": [["rightarrow"], 3, 522, "xMaxYMin"],
            xleftarrow: [["leftarrow"], 1.469, 522, "xMinYMin"],
            "\\cdleftarrow": [["leftarrow"], 3, 522, "xMinYMin"],
            Overrightarrow: [["doublerightarrow"], .888, 560, "xMaxYMin"],
            xRightarrow: [["doublerightarrow"], 1.526, 560, "xMaxYMin"],
            xLeftarrow: [["doubleleftarrow"], 1.526, 560, "xMinYMin"],
            overleftharpoon: [["leftharpoon"], .888, 522, "xMinYMin"],
            xleftharpoonup: [["leftharpoon"], .888, 522, "xMinYMin"],
            xleftharpoondown: [["leftharpoondown"], .888, 522, "xMinYMin"],
            overrightharpoon: [["rightharpoon"], .888, 522, "xMaxYMin"],
            xrightharpoonup: [["rightharpoon"], .888, 522, "xMaxYMin"],
            xrightharpoondown: [["rightharpoondown"], .888, 522, "xMaxYMin"],
            xlongequal: [["longequal"], .888, 334, "xMinYMin"],
            "\\cdlongequal": [["longequal"], 3, 334, "xMinYMin"],
            xtwoheadleftarrow: [["twoheadleftarrow"], .888, 334, "xMinYMin"],
            xtwoheadrightarrow: [["twoheadrightarrow"], .888, 334, "xMaxYMin"],
            overleftrightarrow: [["leftarrow", "rightarrow"], .888, 522],
            overbrace: [["leftbrace", "midbrace", "rightbrace"], 1.6, 548],
            underbrace: [["leftbraceunder", "midbraceunder", "rightbraceunder"], 1.6, 548],
            underleftrightarrow: [["leftarrow", "rightarrow"], .888, 522],
            xleftrightarrow: [["leftarrow", "rightarrow"], 1.75, 522],
            xLeftrightarrow: [["doubleleftarrow", "doublerightarrow"], 1.75, 560],
            xrightleftharpoons: [["leftharpoondownplus", "rightharpoonplus"], 1.75, 716],
            xleftrightharpoons: [["leftharpoonplus", "rightharpoondownplus"], 1.75, 716],
            xhookleftarrow: [["leftarrow", "righthook"], 1.08, 522],
            xhookrightarrow: [["lefthook", "rightarrow"], 1.08, 522],
            overlinesegment: [["leftlinesegment", "rightlinesegment"], .888, 522],
            underlinesegment: [["leftlinesegment", "rightlinesegment"], .888, 522],
            overgroup: [["leftgroup", "rightgroup"], .888, 342],
            undergroup: [["leftgroupunder", "rightgroupunder"], .888, 342],
            xmapsto: [["leftmapsto", "rightarrow"], 1.5, 522],
            xtofrom: [["leftToFrom", "rightToFrom"], 1.75, 528],
            xrightleftarrows: [["baraboveleftarrow", "rightarrowabovebar"], 1.75, 901],
            xrightequilibrium: [["baraboveshortleftharpoon", "rightharpoonaboveshortbar"], 1.75, 716],
            xleftequilibrium: [["shortbaraboveleftharpoon", "shortrightharpoonabovebar"], 1.75, 716]
          },
          Bt = function Bt(e, t, r, n, a) {
            var i,
              o = e.height + e.depth + r + n;
            if (/fbox|color|angl/.test(t)) {
              if (i = Ve.makeSpan(["stretchy", t], [], a), "fbox" === t) {
                var s = a.color && a.getColor();
                s && (i.style.borderColor = s);
              }
            } else {
              var l = [];
              /^[bx]cancel$/.test(t) && l.push(new J({
                x1: "0",
                y1: "0",
                x2: "100%",
                y2: "100%",
                "stroke-width": "0.046em"
              })), /^x?cancel$/.test(t) && l.push(new J({
                x1: "0",
                y1: "100%",
                x2: "100%",
                y2: "0",
                "stroke-width": "0.046em"
              }));
              var h = new Z(l, {
                width: "100%",
                height: F(o)
              });
              i = Ve.makeSvgSpan([], [h], a);
            }
            return i.height = o, i.style.height = F(o), i;
          },
          Ct = function Ct(e) {
            var t = new gt.MathNode("mo", [new gt.TextNode(At[e.replace(/^\\/, "")])]);
            return t.setAttribute("stretchy", "true"), t;
          },
          Nt = function Nt(e, t) {
            var r = function () {
                var r = 4e5,
                  n = e.label.substr(1);
                if (l.contains(["widehat", "widecheck", "widetilde", "utilde"], n)) {
                  var a,
                    i,
                    o,
                    s = "ordgroup" === (d = e.base).type ? d.body.length : 1;
                  if (s > 5) "widehat" === n || "widecheck" === n ? (a = 420, r = 2364, o = .42, i = n + "4") : (a = 312, r = 2340, o = .34, i = "tilde4");else {
                    var h = [1, 1, 2, 2, 3, 3][s];
                    "widehat" === n || "widecheck" === n ? (r = [0, 1062, 2364, 2364, 2364][h], a = [0, 239, 300, 360, 420][h], o = [0, .24, .3, .3, .36, .42][h], i = n + h) : (r = [0, 600, 1033, 2339, 2340][h], a = [0, 260, 286, 306, 312][h], o = [0, .26, .286, .3, .306, .34][h], i = "tilde" + h);
                  }
                  var c = new K(i),
                    m = new Z([c], {
                      width: "100%",
                      height: F(o),
                      viewBox: "0 0 " + r + " " + a,
                      preserveAspectRatio: "none"
                    });
                  return {
                    span: Ve.makeSvgSpan([], [m], t),
                    minWidth: 0,
                    height: o
                  };
                }
                var u,
                  p,
                  d,
                  f = [],
                  g = Tt[n],
                  v = g[0],
                  y = g[1],
                  b = g[2],
                  x = b / 1e3,
                  w = v.length;
                if (1 === w) u = ["hide-tail"], p = [g[3]];else if (2 === w) u = ["halfarrow-left", "halfarrow-right"], p = ["xMinYMin", "xMaxYMin"];else {
                  if (3 !== w) throw new Error("Correct katexImagesData or update code here to support\n                    " + w + " children.");
                  u = ["brace-left", "brace-center", "brace-right"], p = ["xMinYMin", "xMidYMin", "xMaxYMin"];
                }
                for (var k = 0; k < w; k++) {
                  var S = new K(v[k]),
                    M = new Z([S], {
                      width: "400em",
                      height: F(x),
                      viewBox: "0 0 " + r + " " + b,
                      preserveAspectRatio: p[k] + " slice"
                    }),
                    z = Ve.makeSvgSpan([u[k]], [M], t);
                  if (1 === w) return {
                    span: z,
                    minWidth: y,
                    height: x
                  };
                  z.style.height = F(x), f.push(z);
                }
                return {
                  span: Ve.makeSpan(["stretchy"], f, t),
                  minWidth: y,
                  height: x
                };
              }(),
              n = r.span,
              a = r.minWidth,
              i = r.height;
            return n.height = i, n.style.height = F(i), a > 0 && (n.style.minWidth = F(a)), n;
          };
        function qt(e, t) {
          if (!e || e.type !== t) throw new Error("Expected node of type " + t + ", but got " + (e ? "node of type " + e.type : String(e)));
          return e;
        }
        function It(e) {
          var t = Ot(e);
          if (!t) throw new Error("Expected node of symbol group type, but got " + (e ? "node of type " + e.type : String(e)));
          return t;
        }
        function Ot(e) {
          return e && ("atom" === e.type || te.hasOwnProperty(e.type)) ? e : null;
        }
        var Rt = function Rt(e, t) {
            var r, n, a;
            e && "supsub" === e.type ? (r = (n = qt(e.base, "accent")).base, e.base = r, a = function (e) {
              if (e instanceof Y) return e;
              throw new Error("Expected span<HtmlDomNode> but got " + String(e) + ".");
            }(ct(e, t)), e.base = n) : r = (n = qt(e, "accent")).base;
            var i = ct(r, t.havingCrampedStyle()),
              o = 0;
            if (n.isShifty && l.isCharacterBox(r)) {
              var s = l.getBaseElem(r);
              o = Q(ct(s, t.havingCrampedStyle())).skew;
            }
            var h,
              c = "\\c" === n.label,
              m = c ? i.height + i.depth : Math.min(i.height, t.fontMetrics().xHeight);
            if (n.isStretchy) h = Nt(n, t), h = Ve.makeVList({
              positionType: "firstBaseline",
              children: [{
                type: "elem",
                elem: i
              }, {
                type: "elem",
                elem: h,
                wrapperClasses: ["svg-align"],
                wrapperStyle: o > 0 ? {
                  width: "calc(100% - " + F(2 * o) + ")",
                  marginLeft: F(2 * o)
                } : void 0
              }]
            }, t);else {
              var u, p;
              "\\vec" === n.label ? (u = Ve.staticSvg("vec", t), p = Ve.svgData.vec[1]) : ((u = Q(u = Ve.makeOrd({
                mode: n.mode,
                text: n.label
              }, t, "textord"))).italic = 0, p = u.width, c && (m += u.depth)), h = Ve.makeSpan(["accent-body"], [u]);
              var d = "\\textcircled" === n.label;
              d && (h.classes.push("accent-full"), m = i.height);
              var f = o;
              d || (f -= p / 2), h.style.left = F(f), "\\textcircled" === n.label && (h.style.top = ".2em"), h = Ve.makeVList({
                positionType: "firstBaseline",
                children: [{
                  type: "elem",
                  elem: i
                }, {
                  type: "kern",
                  size: -m
                }, {
                  type: "elem",
                  elem: h
                }]
              }, t);
            }
            var g = Ve.makeSpan(["mord", "accent"], [h], t);
            return a ? (a.children[0] = g, a.height = Math.max(g.height, a.height), a.classes[0] = "mord", a) : g;
          },
          Ht = function Ht(e, t) {
            var r = e.isStretchy ? Ct(e.label) : new gt.MathNode("mo", [vt(e.label, e.mode)]),
              n = new gt.MathNode("mover", [kt(e.base, t), r]);
            return n.setAttribute("accent", "true"), n;
          },
          Et = new RegExp(["\\acute", "\\grave", "\\ddot", "\\tilde", "\\bar", "\\breve", "\\check", "\\hat", "\\vec", "\\dot", "\\mathring"].map(function (e) {
            return "\\" + e;
          }).join("|"));
        Ze({
          type: "accent",
          names: ["\\acute", "\\grave", "\\ddot", "\\tilde", "\\bar", "\\breve", "\\check", "\\hat", "\\vec", "\\dot", "\\mathring", "\\widecheck", "\\widehat", "\\widetilde", "\\overrightarrow", "\\overleftarrow", "\\Overrightarrow", "\\overleftrightarrow", "\\overgroup", "\\overlinesegment", "\\overleftharpoon", "\\overrightharpoon"],
          props: {
            numArgs: 1
          },
          handler: function handler(e, t) {
            var r = Je(t[0]),
              n = !Et.test(e.funcName),
              a = !n || "\\widehat" === e.funcName || "\\widetilde" === e.funcName || "\\widecheck" === e.funcName;
            return {
              type: "accent",
              mode: e.parser.mode,
              label: e.funcName,
              isStretchy: n,
              isShifty: a,
              base: r
            };
          },
          htmlBuilder: Rt,
          mathmlBuilder: Ht
        }), Ze({
          type: "accent",
          names: ["\\'", "\\`", "\\^", "\\~", "\\=", "\\u", "\\.", '\\"', "\\c", "\\r", "\\H", "\\v", "\\textcircled"],
          props: {
            numArgs: 1,
            allowedInText: !0,
            allowedInMath: !0,
            argTypes: ["primitive"]
          },
          handler: function handler(e, t) {
            var r = t[0],
              n = e.parser.mode;
            return "math" === n && (e.parser.settings.reportNonstrict("mathVsTextAccents", "LaTeX's accent " + e.funcName + " works only in text mode"), n = "text"), {
              type: "accent",
              mode: n,
              label: e.funcName,
              isStretchy: !1,
              isShifty: !0,
              base: r
            };
          },
          htmlBuilder: Rt,
          mathmlBuilder: Ht
        }), Ze({
          type: "accentUnder",
          names: ["\\underleftarrow", "\\underrightarrow", "\\underleftrightarrow", "\\undergroup", "\\underlinesegment", "\\utilde"],
          props: {
            numArgs: 1
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = e.funcName,
              a = t[0];
            return {
              type: "accentUnder",
              mode: r.mode,
              label: n,
              base: a
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r = ct(e.base, t),
              n = Nt(e, t),
              a = "\\utilde" === e.label ? .12 : 0,
              i = Ve.makeVList({
                positionType: "top",
                positionData: r.height,
                children: [{
                  type: "elem",
                  elem: n,
                  wrapperClasses: ["svg-align"]
                }, {
                  type: "kern",
                  size: a
                }, {
                  type: "elem",
                  elem: r
                }]
              }, t);
            return Ve.makeSpan(["mord", "accentunder"], [i], t);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = Ct(e.label),
              n = new gt.MathNode("munder", [kt(e.base, t), r]);
            return n.setAttribute("accentunder", "true"), n;
          }
        });
        var Lt = function Lt(e) {
          var t = new gt.MathNode("mpadded", e ? [e] : []);
          return t.setAttribute("width", "+0.6em"), t.setAttribute("lspace", "0.3em"), t;
        };
        Ze({
          type: "xArrow",
          names: ["\\xleftarrow", "\\xrightarrow", "\\xLeftarrow", "\\xRightarrow", "\\xleftrightarrow", "\\xLeftrightarrow", "\\xhookleftarrow", "\\xhookrightarrow", "\\xmapsto", "\\xrightharpoondown", "\\xrightharpoonup", "\\xleftharpoondown", "\\xleftharpoonup", "\\xrightleftharpoons", "\\xleftrightharpoons", "\\xlongequal", "\\xtwoheadrightarrow", "\\xtwoheadleftarrow", "\\xtofrom", "\\xrightleftarrows", "\\xrightequilibrium", "\\xleftequilibrium", "\\\\cdrightarrow", "\\\\cdleftarrow", "\\\\cdlongequal"],
          props: {
            numArgs: 1,
            numOptionalArgs: 1
          },
          handler: function handler(e, t, r) {
            var n = e.parser,
              a = e.funcName;
            return {
              type: "xArrow",
              mode: n.mode,
              label: a,
              body: t[0],
              below: r[0]
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r,
              n = t.style,
              a = t.havingStyle(n.sup()),
              i = Ve.wrapFragment(ct(e.body, a, t), t),
              o = "\\x" === e.label.slice(0, 2) ? "x" : "cd";
            i.classes.push(o + "-arrow-pad"), e.below && (a = t.havingStyle(n.sub()), (r = Ve.wrapFragment(ct(e.below, a, t), t)).classes.push(o + "-arrow-pad"));
            var s,
              l = Nt(e, t),
              h = -t.fontMetrics().axisHeight + .5 * l.height,
              c = -t.fontMetrics().axisHeight - .5 * l.height - .111;
            if ((i.depth > .25 || "\\xleftequilibrium" === e.label) && (c -= i.depth), r) {
              var m = -t.fontMetrics().axisHeight + r.height + .5 * l.height + .111;
              s = Ve.makeVList({
                positionType: "individualShift",
                children: [{
                  type: "elem",
                  elem: i,
                  shift: c
                }, {
                  type: "elem",
                  elem: l,
                  shift: h
                }, {
                  type: "elem",
                  elem: r,
                  shift: m
                }]
              }, t);
            } else s = Ve.makeVList({
              positionType: "individualShift",
              children: [{
                type: "elem",
                elem: i,
                shift: c
              }, {
                type: "elem",
                elem: l,
                shift: h
              }]
            }, t);
            return s.children[0].children[0].children[1].classes.push("svg-align"), Ve.makeSpan(["mrel", "x-arrow"], [s], t);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r,
              n = Ct(e.label);
            if (n.setAttribute("minsize", "x" === e.label.charAt(0) ? "1.75em" : "3.0em"), e.body) {
              var a = Lt(kt(e.body, t));
              if (e.below) {
                var i = Lt(kt(e.below, t));
                r = new gt.MathNode("munderover", [n, i, a]);
              } else r = new gt.MathNode("mover", [n, a]);
            } else if (e.below) {
              var o = Lt(kt(e.below, t));
              r = new gt.MathNode("munder", [n, o]);
            } else r = Lt(), r = new gt.MathNode("mover", [n, r]);
            return r;
          }
        });
        var Dt = {
            ">": "\\\\cdrightarrow",
            "<": "\\\\cdleftarrow",
            "=": "\\\\cdlongequal",
            A: "\\uparrow",
            V: "\\downarrow",
            "|": "\\Vert",
            ".": "no arrow"
          },
          Pt = function Pt(e) {
            return "textord" === e.type && "@" === e.text;
          };
        function Ft(e, t, r) {
          var n = Dt[e];
          switch (n) {
            case "\\\\cdrightarrow":
            case "\\\\cdleftarrow":
              return r.callFunction(n, [t[0]], [t[1]]);
            case "\\uparrow":
            case "\\downarrow":
              var a = {
                  type: "atom",
                  text: n,
                  mode: "math",
                  family: "rel"
                },
                i = {
                  type: "ordgroup",
                  mode: "math",
                  body: [r.callFunction("\\\\cdleft", [t[0]], []), r.callFunction("\\Big", [a], []), r.callFunction("\\\\cdright", [t[1]], [])]
                };
              return r.callFunction("\\\\cdparent", [i], []);
            case "\\\\cdlongequal":
              return r.callFunction("\\\\cdlongequal", [], []);
            case "\\Vert":
              return r.callFunction("\\Big", [{
                type: "textord",
                text: "\\Vert",
                mode: "math"
              }], []);
            default:
              return {
                type: "textord",
                text: " ",
                mode: "math"
              };
          }
        }
        Ze({
          type: "cdlabel",
          names: ["\\\\cdleft", "\\\\cdright"],
          props: {
            numArgs: 1
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = e.funcName;
            return {
              type: "cdlabel",
              mode: r.mode,
              side: n.slice(4),
              label: t[0]
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r = t.havingStyle(t.style.sup()),
              n = Ve.wrapFragment(ct(e.label, r, t), t);
            return n.classes.push("cd-label-" + e.side), n.style.bottom = F(.8 - n.depth), n.height = 0, n.depth = 0, n;
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = new gt.MathNode("mrow", [kt(e.label, t)]);
            return (r = new gt.MathNode("mpadded", [r])).setAttribute("width", "0"), "left" === e.side && r.setAttribute("lspace", "-1width"), r.setAttribute("voffset", "0.7em"), (r = new gt.MathNode("mstyle", [r])).setAttribute("displaystyle", "false"), r.setAttribute("scriptlevel", "1"), r;
          }
        }), Ze({
          type: "cdlabelparent",
          names: ["\\\\cdparent"],
          props: {
            numArgs: 1
          },
          handler: function handler(e, t) {
            return {
              type: "cdlabelparent",
              mode: e.parser.mode,
              fragment: t[0]
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r = Ve.wrapFragment(ct(e.fragment, t), t);
            return r.classes.push("cd-vert-arrow"), r;
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            return new gt.MathNode("mrow", [kt(e.fragment, t)]);
          }
        }), Ze({
          type: "textord",
          names: ["\\@char"],
          props: {
            numArgs: 1,
            allowedInText: !0
          },
          handler: function handler(e, t) {
            for (var r = e.parser, a = qt(t[0], "ordgroup").body, i = "", o = 0; o < a.length; o++) {
              i += qt(a[o], "textord").text;
            }
            var s,
              l = parseInt(i);
            if (isNaN(l)) throw new n("\\@char has non-numeric argument " + i);
            if (l < 0 || l >= 1114111) throw new n("\\@char with invalid code point " + i);
            return l <= 65535 ? s = String.fromCharCode(l) : (l -= 65536, s = String.fromCharCode(55296 + (l >> 10), 56320 + (1023 & l))), {
              type: "textord",
              mode: r.mode,
              text: s
            };
          }
        });
        var Vt = function Vt(e, t) {
            var r = it(e.body, t.withColor(e.color), !1);
            return Ve.makeFragment(r);
          },
          Gt = function Gt(e, t) {
            var r = xt(e.body, t.withColor(e.color)),
              n = new gt.MathNode("mstyle", r);
            return n.setAttribute("mathcolor", e.color), n;
          };
        Ze({
          type: "color",
          names: ["\\textcolor"],
          props: {
            numArgs: 2,
            allowedInText: !0,
            argTypes: ["color", "original"]
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = qt(t[0], "color-token").color,
              a = t[1];
            return {
              type: "color",
              mode: r.mode,
              color: n,
              body: Qe(a)
            };
          },
          htmlBuilder: Vt,
          mathmlBuilder: Gt
        }), Ze({
          type: "color",
          names: ["\\color"],
          props: {
            numArgs: 1,
            allowedInText: !0,
            argTypes: ["color"]
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = e.breakOnTokenText,
              a = qt(t[0], "color-token").color;
            r.gullet.macros.set("\\current@color", a);
            var i = r.parseExpression(!0, n);
            return {
              type: "color",
              mode: r.mode,
              color: a,
              body: i
            };
          },
          htmlBuilder: Vt,
          mathmlBuilder: Gt
        }), Ze({
          type: "cr",
          names: ["\\\\"],
          props: {
            numArgs: 0,
            numOptionalArgs: 1,
            argTypes: ["size"],
            allowedInText: !0
          },
          handler: function handler(e, t, r) {
            var n = e.parser,
              a = r[0],
              i = !n.settings.displayMode || !n.settings.useStrictBehavior("newLineInDisplayMode", "In LaTeX, \\\\ or \\newline does nothing in display mode");
            return {
              type: "cr",
              mode: n.mode,
              newLine: i,
              size: a && qt(a, "size").value
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r = Ve.makeSpan(["mspace"], [], t);
            return e.newLine && (r.classes.push("newline"), e.size && (r.style.marginTop = F(P(e.size, t)))), r;
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = new gt.MathNode("mspace");
            return e.newLine && (r.setAttribute("linebreak", "newline"), e.size && r.setAttribute("height", F(P(e.size, t)))), r;
          }
        });
        var Ut = {
            "\\global": "\\global",
            "\\long": "\\\\globallong",
            "\\\\globallong": "\\\\globallong",
            "\\def": "\\gdef",
            "\\gdef": "\\gdef",
            "\\edef": "\\xdef",
            "\\xdef": "\\xdef",
            "\\let": "\\\\globallet",
            "\\futurelet": "\\\\globalfuture"
          },
          _t = function _t(e) {
            var t = e.text;
            if (/^(?:[\\{}$&#^_]|EOF)$/.test(t)) throw new n("Expected a control sequence", e);
            return t;
          },
          Yt = function Yt(e, t, r, n) {
            var a = e.gullet.macros.get(r.text);
            null == a && (r.noexpand = !0, a = {
              tokens: [r],
              numArgs: 0,
              unexpandable: !e.gullet.isExpandable(r.text)
            }), e.gullet.macros.set(t, a, n);
          };
        Ze({
          type: "internal",
          names: ["\\global", "\\long", "\\\\globallong"],
          props: {
            numArgs: 0,
            allowedInText: !0
          },
          handler: function handler(e) {
            var t = e.parser,
              r = e.funcName;
            t.consumeSpaces();
            var a = t.fetch();
            if (Ut[a.text]) return "\\global" !== r && "\\\\globallong" !== r || (a.text = Ut[a.text]), qt(t.parseFunction(), "internal");
            throw new n("Invalid token after macro prefix", a);
          }
        }), Ze({
          type: "internal",
          names: ["\\def", "\\gdef", "\\edef", "\\xdef"],
          props: {
            numArgs: 0,
            allowedInText: !0,
            primitive: !0
          },
          handler: function handler(e) {
            var t = e.parser,
              r = e.funcName,
              a = t.gullet.popToken(),
              i = a.text;
            if (/^(?:[\\{}$&#^_]|EOF)$/.test(i)) throw new n("Expected a control sequence", a);
            for (var o, s = 0, l = [[]]; "{" !== t.gullet.future().text;) {
              if ("#" === (a = t.gullet.popToken()).text) {
                if ("{" === t.gullet.future().text) {
                  o = t.gullet.future(), l[s].push("{");
                  break;
                }
                if (a = t.gullet.popToken(), !/^[1-9]$/.test(a.text)) throw new n('Invalid argument number "' + a.text + '"');
                if (parseInt(a.text) !== s + 1) throw new n('Argument number "' + a.text + '" out of order');
                s++, l.push([]);
              } else {
                if ("EOF" === a.text) throw new n("Expected a macro definition");
                l[s].push(a.text);
              }
            }
            var h = t.gullet.consumeArg().tokens;
            return o && h.unshift(o), "\\edef" !== r && "\\xdef" !== r || (h = t.gullet.expandTokens(h)).reverse(), t.gullet.macros.set(i, {
              tokens: h,
              numArgs: s,
              delimiters: l
            }, r === Ut[r]), {
              type: "internal",
              mode: t.mode
            };
          }
        }), Ze({
          type: "internal",
          names: ["\\let", "\\\\globallet"],
          props: {
            numArgs: 0,
            allowedInText: !0,
            primitive: !0
          },
          handler: function handler(e) {
            var t = e.parser,
              r = e.funcName,
              n = _t(t.gullet.popToken());
            t.gullet.consumeSpaces();
            var a = function (e) {
              var t = e.gullet.popToken();
              return "=" === t.text && " " === (t = e.gullet.popToken()).text && (t = e.gullet.popToken()), t;
            }(t);
            return Yt(t, n, a, "\\\\globallet" === r), {
              type: "internal",
              mode: t.mode
            };
          }
        }), Ze({
          type: "internal",
          names: ["\\futurelet", "\\\\globalfuture"],
          props: {
            numArgs: 0,
            allowedInText: !0,
            primitive: !0
          },
          handler: function handler(e) {
            var t = e.parser,
              r = e.funcName,
              n = _t(t.gullet.popToken()),
              a = t.gullet.popToken(),
              i = t.gullet.popToken();
            return Yt(t, n, i, "\\\\globalfuture" === r), t.gullet.pushToken(i), t.gullet.pushToken(a), {
              type: "internal",
              mode: t.mode
            };
          }
        });
        var Xt = function Xt(e, t, r) {
            var n = C(ne.math[e] && ne.math[e].replace || e, t, r);
            if (!n) throw new Error("Unsupported symbol " + e + " and font size " + t + ".");
            return n;
          },
          Wt = function Wt(e, t, r, n) {
            var a = r.havingBaseStyle(t),
              i = Ve.makeSpan(n.concat(a.sizingClasses(r)), [e], r),
              o = a.sizeMultiplier / r.sizeMultiplier;
            return i.height *= o, i.depth *= o, i.maxFontSize = a.sizeMultiplier, i;
          },
          jt = function jt(e, t, r) {
            var n = t.havingBaseStyle(r),
              a = (1 - t.sizeMultiplier / n.sizeMultiplier) * t.fontMetrics().axisHeight;
            e.classes.push("delimcenter"), e.style.top = F(a), e.height -= a, e.depth += a;
          },
          $t = function $t(e, t, r, n, a, i) {
            var o = function (e, t, r, n) {
                return Ve.makeSymbol(e, "Size" + t + "-Regular", r, n);
              }(e, t, a, n),
              s = Wt(Ve.makeSpan(["delimsizing", "size" + t], [o], n), x.TEXT, n, i);
            return r && jt(s, n, x.TEXT), s;
          },
          Zt = function Zt(e, t, r) {
            var n;
            return n = "Size1-Regular" === t ? "delim-size1" : "delim-size4", {
              type: "elem",
              elem: Ve.makeSpan(["delimsizinginner", n], [Ve.makeSpan([], [Ve.makeSymbol(e, t, r)])])
            };
          },
          Kt = function Kt(e, t, r) {
            var n = A["Size4-Regular"][e.charCodeAt(0)] ? A["Size4-Regular"][e.charCodeAt(0)][4] : A["Size1-Regular"][e.charCodeAt(0)][4],
              a = new K("inner", function (e, t) {
                switch (e) {
                  case "⎜":
                    return "M291 0 H417 V" + t + " H291z M291 0 H417 V" + t + " H291z";
                  case "∣":
                    return "M145 0 H188 V" + t + " H145z M145 0 H188 V" + t + " H145z";
                  case "∥":
                    return "M145 0 H188 V" + t + " H145z M145 0 H188 V" + t + " H145zM367 0 H410 V" + t + " H367z M367 0 H410 V" + t + " H367z";
                  case "⎟":
                    return "M457 0 H583 V" + t + " H457z M457 0 H583 V" + t + " H457z";
                  case "⎢":
                    return "M319 0 H403 V" + t + " H319z M319 0 H403 V" + t + " H319z";
                  case "⎥":
                    return "M263 0 H347 V" + t + " H263z M263 0 H347 V" + t + " H263z";
                  case "⎪":
                    return "M384 0 H504 V" + t + " H384z M384 0 H504 V" + t + " H384z";
                  case "⏐":
                    return "M312 0 H355 V" + t + " H312z M312 0 H355 V" + t + " H312z";
                  case "‖":
                    return "M257 0 H300 V" + t + " H257z M257 0 H300 V" + t + " H257zM478 0 H521 V" + t + " H478z M478 0 H521 V" + t + " H478z";
                  default:
                    return "";
                }
              }(e, Math.round(1e3 * t))),
              i = new Z([a], {
                width: F(n),
                height: F(t),
                style: "width:" + F(n),
                viewBox: "0 0 " + 1e3 * n + " " + Math.round(1e3 * t),
                preserveAspectRatio: "xMinYMin"
              }),
              o = Ve.makeSvgSpan([], [i], r);
            return o.height = t, o.style.height = F(t), o.style.width = F(n), {
              type: "elem",
              elem: o
            };
          },
          Jt = {
            type: "kern",
            size: -.008
          },
          Qt = ["|", "\\lvert", "\\rvert", "\\vert"],
          er = ["\\|", "\\lVert", "\\rVert", "\\Vert"],
          tr = function tr(e, t, r, n, a, i) {
            var o, s, h, c;
            o = h = c = e, s = null;
            var m = "Size1-Regular";
            "\\uparrow" === e ? h = c = "⏐" : "\\Uparrow" === e ? h = c = "‖" : "\\downarrow" === e ? o = h = "⏐" : "\\Downarrow" === e ? o = h = "‖" : "\\updownarrow" === e ? (o = "\\uparrow", h = "⏐", c = "\\downarrow") : "\\Updownarrow" === e ? (o = "\\Uparrow", h = "‖", c = "\\Downarrow") : l.contains(Qt, e) ? h = "∣" : l.contains(er, e) ? h = "∥" : "[" === e || "\\lbrack" === e ? (o = "⎡", h = "⎢", c = "⎣", m = "Size4-Regular") : "]" === e || "\\rbrack" === e ? (o = "⎤", h = "⎥", c = "⎦", m = "Size4-Regular") : "\\lfloor" === e || "⌊" === e ? (h = o = "⎢", c = "⎣", m = "Size4-Regular") : "\\lceil" === e || "⌈" === e ? (o = "⎡", h = c = "⎢", m = "Size4-Regular") : "\\rfloor" === e || "⌋" === e ? (h = o = "⎥", c = "⎦", m = "Size4-Regular") : "\\rceil" === e || "⌉" === e ? (o = "⎤", h = c = "⎥", m = "Size4-Regular") : "(" === e || "\\lparen" === e ? (o = "⎛", h = "⎜", c = "⎝", m = "Size4-Regular") : ")" === e || "\\rparen" === e ? (o = "⎞", h = "⎟", c = "⎠", m = "Size4-Regular") : "\\{" === e || "\\lbrace" === e ? (o = "⎧", s = "⎨", c = "⎩", h = "⎪", m = "Size4-Regular") : "\\}" === e || "\\rbrace" === e ? (o = "⎫", s = "⎬", c = "⎭", h = "⎪", m = "Size4-Regular") : "\\lgroup" === e || "⟮" === e ? (o = "⎧", c = "⎩", h = "⎪", m = "Size4-Regular") : "\\rgroup" === e || "⟯" === e ? (o = "⎫", c = "⎭", h = "⎪", m = "Size4-Regular") : "\\lmoustache" === e || "⎰" === e ? (o = "⎧", c = "⎭", h = "⎪", m = "Size4-Regular") : "\\rmoustache" !== e && "⎱" !== e || (o = "⎫", c = "⎩", h = "⎪", m = "Size4-Regular");
            var u = Xt(o, m, a),
              p = u.height + u.depth,
              d = Xt(h, m, a),
              f = d.height + d.depth,
              g = Xt(c, m, a),
              v = g.height + g.depth,
              y = 0,
              b = 1;
            if (null !== s) {
              var w = Xt(s, m, a);
              y = w.height + w.depth, b = 2;
            }
            var k = p + v + y,
              S = k + Math.max(0, Math.ceil((t - k) / (b * f))) * b * f,
              M = n.fontMetrics().axisHeight;
            r && (M *= n.sizeMultiplier);
            var z = S / 2 - M,
              A = [];
            if (A.push(Zt(c, m, a)), A.push(Jt), null === s) {
              var T = S - p - v + .016;
              A.push(Kt(h, T, n));
            } else {
              var B = (S - p - v - y) / 2 + .016;
              A.push(Kt(h, B, n)), A.push(Jt), A.push(Zt(s, m, a)), A.push(Jt), A.push(Kt(h, B, n));
            }
            A.push(Jt), A.push(Zt(o, m, a));
            var C = n.havingBaseStyle(x.TEXT),
              N = Ve.makeVList({
                positionType: "bottom",
                positionData: z,
                children: A
              }, C);
            return Wt(Ve.makeSpan(["delimsizing", "mult"], [N], C), x.TEXT, n, i);
          },
          rr = function rr(e, t, r, n, a) {
            var i = function (e, t, r) {
                t *= 1e3;
                var n = "";
                switch (e) {
                  case "sqrtMain":
                    n = function (e, t) {
                      return "M95," + (622 + e + t) + "\nc-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14\nc0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54\nc44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10\ns173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429\nc69,-144,104.5,-217.7,106.5,-221\nl" + e / 2.075 + " -" + e + "\nc5.3,-9.3,12,-14,20,-14\nH400000v" + (40 + e) + "H845.2724\ns-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7\nc-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z\nM" + (834 + e) + " " + t + "h400000v" + (40 + e) + "h-400000z";
                    }(t, 80);
                    break;
                  case "sqrtSize1":
                    n = function (e, t) {
                      return "M263," + (601 + e + t) + "c0.7,0,18,39.7,52,119\nc34,79.3,68.167,158.7,102.5,238c34.3,79.3,51.8,119.3,52.5,120\nc340,-704.7,510.7,-1060.3,512,-1067\nl" + e / 2.084 + " -" + e + "\nc4.7,-7.3,11,-11,19,-11\nH40000v" + (40 + e) + "H1012.3\ns-271.3,567,-271.3,567c-38.7,80.7,-84,175,-136,283c-52,108,-89.167,185.3,-111.5,232\nc-22.3,46.7,-33.8,70.3,-34.5,71c-4.7,4.7,-12.3,7,-23,7s-12,-1,-12,-1\ns-109,-253,-109,-253c-72.7,-168,-109.3,-252,-110,-252c-10.7,8,-22,16.7,-34,26\nc-22,17.3,-33.3,26,-34,26s-26,-26,-26,-26s76,-59,76,-59s76,-60,76,-60z\nM" + (1001 + e) + " " + t + "h400000v" + (40 + e) + "h-400000z";
                    }(t, 80);
                    break;
                  case "sqrtSize2":
                    n = function (e, t) {
                      return "M983 " + (10 + e + t) + "\nl" + e / 3.13 + " -" + e + "\nc4,-6.7,10,-10,18,-10 H400000v" + (40 + e) + "\nH1013.1s-83.4,268,-264.1,840c-180.7,572,-277,876.3,-289,913c-4.7,4.7,-12.7,7,-24,7\ns-12,0,-12,0c-1.3,-3.3,-3.7,-11.7,-7,-25c-35.3,-125.3,-106.7,-373.3,-214,-744\nc-10,12,-21,25,-33,39s-32,39,-32,39c-6,-5.3,-15,-14,-27,-26s25,-30,25,-30\nc26.7,-32.7,52,-63,76,-91s52,-60,52,-60s208,722,208,722\nc56,-175.3,126.3,-397.3,211,-666c84.7,-268.7,153.8,-488.2,207.5,-658.5\nc53.7,-170.3,84.5,-266.8,92.5,-289.5z\nM" + (1001 + e) + " " + t + "h400000v" + (40 + e) + "h-400000z";
                    }(t, 80);
                    break;
                  case "sqrtSize3":
                    n = function (e, t) {
                      return "M424," + (2398 + e + t) + "\nc-1.3,-0.7,-38.5,-172,-111.5,-514c-73,-342,-109.8,-513.3,-110.5,-514\nc0,-2,-10.7,14.3,-32,49c-4.7,7.3,-9.8,15.7,-15.5,25c-5.7,9.3,-9.8,16,-12.5,20\ns-5,7,-5,7c-4,-3.3,-8.3,-7.7,-13,-13s-13,-13,-13,-13s76,-122,76,-122s77,-121,77,-121\ns209,968,209,968c0,-2,84.7,-361.7,254,-1079c169.3,-717.3,254.7,-1077.7,256,-1081\nl" + e / 4.223 + " -" + e + "c4,-6.7,10,-10,18,-10 H400000\nv" + (40 + e) + "H1014.6\ns-87.3,378.7,-272.6,1166c-185.3,787.3,-279.3,1182.3,-282,1185\nc-2,6,-10,9,-24,9\nc-8,0,-12,-0.7,-12,-2z M" + (1001 + e) + " " + t + "\nh400000v" + (40 + e) + "h-400000z";
                    }(t, 80);
                    break;
                  case "sqrtSize4":
                    n = function (e, t) {
                      return "M473," + (2713 + e + t) + "\nc339.3,-1799.3,509.3,-2700,510,-2702 l" + e / 5.298 + " -" + e + "\nc3.3,-7.3,9.3,-11,18,-11 H400000v" + (40 + e) + "H1017.7\ns-90.5,478,-276.2,1466c-185.7,988,-279.5,1483,-281.5,1485c-2,6,-10,9,-24,9\nc-8,0,-12,-0.7,-12,-2c0,-1.3,-5.3,-32,-16,-92c-50.7,-293.3,-119.7,-693.3,-207,-1200\nc0,-1.3,-5.3,8.7,-16,30c-10.7,21.3,-21.3,42.7,-32,64s-16,33,-16,33s-26,-26,-26,-26\ns76,-153,76,-153s77,-151,77,-151c0.7,0.7,35.7,202,105,604c67.3,400.7,102,602.7,104,\n606zM" + (1001 + e) + " " + t + "h400000v" + (40 + e) + "H1017.7z";
                    }(t, 80);
                    break;
                  case "sqrtTall":
                    n = function (e, t, r) {
                      return "M702 " + (e + t) + "H400000" + (40 + e) + "\nH742v" + (r - 54 - t - e) + "l-4 4-4 4c-.667.7 -2 1.5-4 2.5s-4.167 1.833-6.5 2.5-5.5 1-9.5 1\nh-12l-28-84c-16.667-52-96.667 -294.333-240-727l-212 -643 -85 170\nc-4-3.333-8.333-7.667-13 -13l-13-13l77-155 77-156c66 199.333 139 419.667\n219 661 l218 661zM702 " + t + "H400000v" + (40 + e) + "H742z";
                    }(t, 80, r);
                }
                return n;
              }(e, n, r),
              o = new K(e, i),
              s = new Z([o], {
                width: "400em",
                height: F(t),
                viewBox: "0 0 400000 " + r,
                preserveAspectRatio: "xMinYMin slice"
              });
            return Ve.makeSvgSpan(["hide-tail"], [s], a);
          },
          nr = ["(", "\\lparen", ")", "\\rparen", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", "⌊", "⌋", "\\lceil", "\\rceil", "⌈", "⌉", "\\surd"],
          ar = ["\\uparrow", "\\downarrow", "\\updownarrow", "\\Uparrow", "\\Downarrow", "\\Updownarrow", "|", "\\|", "\\vert", "\\Vert", "\\lvert", "\\rvert", "\\lVert", "\\rVert", "\\lgroup", "\\rgroup", "⟮", "⟯", "\\lmoustache", "\\rmoustache", "⎰", "⎱"],
          ir = ["<", ">", "\\langle", "\\rangle", "/", "\\backslash", "\\lt", "\\gt"],
          or = [0, 1.2, 1.8, 2.4, 3],
          sr = [{
            type: "small",
            style: x.SCRIPTSCRIPT
          }, {
            type: "small",
            style: x.SCRIPT
          }, {
            type: "small",
            style: x.TEXT
          }, {
            type: "large",
            size: 1
          }, {
            type: "large",
            size: 2
          }, {
            type: "large",
            size: 3
          }, {
            type: "large",
            size: 4
          }],
          lr = [{
            type: "small",
            style: x.SCRIPTSCRIPT
          }, {
            type: "small",
            style: x.SCRIPT
          }, {
            type: "small",
            style: x.TEXT
          }, {
            type: "stack"
          }],
          hr = [{
            type: "small",
            style: x.SCRIPTSCRIPT
          }, {
            type: "small",
            style: x.SCRIPT
          }, {
            type: "small",
            style: x.TEXT
          }, {
            type: "large",
            size: 1
          }, {
            type: "large",
            size: 2
          }, {
            type: "large",
            size: 3
          }, {
            type: "large",
            size: 4
          }, {
            type: "stack"
          }],
          cr = function cr(e) {
            if ("small" === e.type) return "Main-Regular";
            if ("large" === e.type) return "Size" + e.size + "-Regular";
            if ("stack" === e.type) return "Size4-Regular";
            throw new Error("Add support for delim type '" + e.type + "' here.");
          },
          mr = function mr(e, t, r, n) {
            for (var a = Math.min(2, 3 - n.style.size); a < r.length && "stack" !== r[a].type; a++) {
              var i = Xt(e, cr(r[a]), "math"),
                o = i.height + i.depth;
              if ("small" === r[a].type && (o *= n.havingBaseStyle(r[a].style).sizeMultiplier), o > t) return r[a];
            }
            return r[r.length - 1];
          },
          ur = function ur(e, t, r, n, a, i) {
            var o;
            "<" === e || "\\lt" === e || "⟨" === e ? e = "\\langle" : ">" !== e && "\\gt" !== e && "⟩" !== e || (e = "\\rangle"), o = l.contains(ir, e) ? sr : l.contains(nr, e) ? hr : lr;
            var s = mr(e, t, o, n);
            return "small" === s.type ? function (e, t, r, n, a, i) {
              var o = Ve.makeSymbol(e, "Main-Regular", a, n),
                s = Wt(o, t, n, i);
              return r && jt(s, n, t), s;
            }(e, s.style, r, n, a, i) : "large" === s.type ? $t(e, s.size, r, n, a, i) : tr(e, t, r, n, a, i);
          },
          pr = {
            sqrtImage: function sqrtImage(e, t) {
              var r,
                n,
                a = t.havingBaseSizing(),
                i = mr("\\surd", e * a.sizeMultiplier, hr, a),
                o = a.sizeMultiplier,
                s = Math.max(0, t.minRuleThickness - t.fontMetrics().sqrtRuleThickness),
                l = 0,
                h = 0,
                c = 0;
              return "small" === i.type ? (e < 1 ? o = 1 : e < 1.4 && (o = .7), h = (1 + s) / o, (r = rr("sqrtMain", l = (1 + s + .08) / o, c = 1e3 + 1e3 * s + 80, s, t)).style.minWidth = "0.853em", n = .833 / o) : "large" === i.type ? (c = 1080 * or[i.size], h = (or[i.size] + s) / o, l = (or[i.size] + s + .08) / o, (r = rr("sqrtSize" + i.size, l, c, s, t)).style.minWidth = "1.02em", n = 1 / o) : (l = e + s + .08, h = e + s, c = Math.floor(1e3 * e + s) + 80, (r = rr("sqrtTall", l, c, s, t)).style.minWidth = "0.742em", n = 1.056), r.height = h, r.style.height = F(l), {
                span: r,
                advanceWidth: n,
                ruleWidth: (t.fontMetrics().sqrtRuleThickness + s) * o
              };
            },
            sizedDelim: function sizedDelim(e, t, r, a, i) {
              if ("<" === e || "\\lt" === e || "⟨" === e ? e = "\\langle" : ">" !== e && "\\gt" !== e && "⟩" !== e || (e = "\\rangle"), l.contains(nr, e) || l.contains(ir, e)) return $t(e, t, !1, r, a, i);
              if (l.contains(ar, e)) return tr(e, or[t], !1, r, a, i);
              throw new n("Illegal delimiter: '" + e + "'");
            },
            sizeToMaxHeight: or,
            customSizedDelim: ur,
            leftRightDelim: function leftRightDelim(e, t, r, n, a, i) {
              var o = n.fontMetrics().axisHeight * n.sizeMultiplier,
                s = 5 / n.fontMetrics().ptPerEm,
                l = Math.max(t - o, r + o),
                h = Math.max(l / 500 * 901, 2 * l - s);
              return ur(e, h, !0, n, a, i);
            }
          },
          dr = {
            "\\bigl": {
              mclass: "mopen",
              size: 1
            },
            "\\Bigl": {
              mclass: "mopen",
              size: 2
            },
            "\\biggl": {
              mclass: "mopen",
              size: 3
            },
            "\\Biggl": {
              mclass: "mopen",
              size: 4
            },
            "\\bigr": {
              mclass: "mclose",
              size: 1
            },
            "\\Bigr": {
              mclass: "mclose",
              size: 2
            },
            "\\biggr": {
              mclass: "mclose",
              size: 3
            },
            "\\Biggr": {
              mclass: "mclose",
              size: 4
            },
            "\\bigm": {
              mclass: "mrel",
              size: 1
            },
            "\\Bigm": {
              mclass: "mrel",
              size: 2
            },
            "\\biggm": {
              mclass: "mrel",
              size: 3
            },
            "\\Biggm": {
              mclass: "mrel",
              size: 4
            },
            "\\big": {
              mclass: "mord",
              size: 1
            },
            "\\Big": {
              mclass: "mord",
              size: 2
            },
            "\\bigg": {
              mclass: "mord",
              size: 3
            },
            "\\Bigg": {
              mclass: "mord",
              size: 4
            }
          },
          fr = ["(", "\\lparen", ")", "\\rparen", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", "⌊", "⌋", "\\lceil", "\\rceil", "⌈", "⌉", "<", ">", "\\langle", "⟨", "\\rangle", "⟩", "\\lt", "\\gt", "\\lvert", "\\rvert", "\\lVert", "\\rVert", "\\lgroup", "\\rgroup", "⟮", "⟯", "\\lmoustache", "\\rmoustache", "⎰", "⎱", "/", "\\backslash", "|", "\\vert", "\\|", "\\Vert", "\\uparrow", "\\Uparrow", "\\downarrow", "\\Downarrow", "\\updownarrow", "\\Updownarrow", "."];
        function gr(e, t) {
          var r = Ot(e);
          if (r && l.contains(fr, r.text)) return r;
          throw new n(r ? "Invalid delimiter '" + r.text + "' after '" + t.funcName + "'" : "Invalid delimiter type '" + e.type + "'", e);
        }
        function vr(e) {
          if (!e.body) throw new Error("Bug: The leftright ParseNode wasn't fully parsed.");
        }
        Ze({
          type: "delimsizing",
          names: ["\\bigl", "\\Bigl", "\\biggl", "\\Biggl", "\\bigr", "\\Bigr", "\\biggr", "\\Biggr", "\\bigm", "\\Bigm", "\\biggm", "\\Biggm", "\\big", "\\Big", "\\bigg", "\\Bigg"],
          props: {
            numArgs: 1,
            argTypes: ["primitive"]
          },
          handler: function handler(e, t) {
            var r = gr(t[0], e);
            return {
              type: "delimsizing",
              mode: e.parser.mode,
              size: dr[e.funcName].size,
              mclass: dr[e.funcName].mclass,
              delim: r.text
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            return "." === e.delim ? Ve.makeSpan([e.mclass]) : pr.sizedDelim(e.delim, e.size, t, e.mode, [e.mclass]);
          },
          mathmlBuilder: function mathmlBuilder(e) {
            var t = [];
            "." !== e.delim && t.push(vt(e.delim, e.mode));
            var r = new gt.MathNode("mo", t);
            "mopen" === e.mclass || "mclose" === e.mclass ? r.setAttribute("fence", "true") : r.setAttribute("fence", "false"), r.setAttribute("stretchy", "true");
            var n = F(pr.sizeToMaxHeight[e.size]);
            return r.setAttribute("minsize", n), r.setAttribute("maxsize", n), r;
          }
        }), Ze({
          type: "leftright-right",
          names: ["\\right"],
          props: {
            numArgs: 1,
            primitive: !0
          },
          handler: function handler(e, t) {
            var r = e.parser.gullet.macros.get("\\current@color");
            if (r && "string" != typeof r) throw new n("\\current@color set to non-string in \\right");
            return {
              type: "leftright-right",
              mode: e.parser.mode,
              delim: gr(t[0], e).text,
              color: r
            };
          }
        }), Ze({
          type: "leftright",
          names: ["\\left"],
          props: {
            numArgs: 1,
            primitive: !0
          },
          handler: function handler(e, t) {
            var r = gr(t[0], e),
              n = e.parser;
            ++n.leftrightDepth;
            var a = n.parseExpression(!1);
            --n.leftrightDepth, n.expect("\\right", !1);
            var i = qt(n.parseFunction(), "leftright-right");
            return {
              type: "leftright",
              mode: n.mode,
              body: a,
              left: r.text,
              right: i.delim,
              rightColor: i.color
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            vr(e);
            for (var r, n, a = it(e.body, t, !0, ["mopen", "mclose"]), i = 0, o = 0, s = !1, l = 0; l < a.length; l++) {
              a[l].isMiddle ? s = !0 : (i = Math.max(a[l].height, i), o = Math.max(a[l].depth, o));
            }
            if (i *= t.sizeMultiplier, o *= t.sizeMultiplier, r = "." === e.left ? ht(t, ["mopen"]) : pr.leftRightDelim(e.left, i, o, t, e.mode, ["mopen"]), a.unshift(r), s) for (var h = 1; h < a.length; h++) {
              var c = a[h].isMiddle;
              c && (a[h] = pr.leftRightDelim(c.delim, i, o, c.options, e.mode, []));
            }
            if ("." === e.right) n = ht(t, ["mclose"]);else {
              var m = e.rightColor ? t.withColor(e.rightColor) : t;
              n = pr.leftRightDelim(e.right, i, o, m, e.mode, ["mclose"]);
            }
            return a.push(n), Ve.makeSpan(["minner"], a, t);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            vr(e);
            var r = xt(e.body, t);
            if ("." !== e.left) {
              var n = new gt.MathNode("mo", [vt(e.left, e.mode)]);
              n.setAttribute("fence", "true"), r.unshift(n);
            }
            if ("." !== e.right) {
              var a = new gt.MathNode("mo", [vt(e.right, e.mode)]);
              a.setAttribute("fence", "true"), e.rightColor && a.setAttribute("mathcolor", e.rightColor), r.push(a);
            }
            return yt(r);
          }
        }), Ze({
          type: "middle",
          names: ["\\middle"],
          props: {
            numArgs: 1,
            primitive: !0
          },
          handler: function handler(e, t) {
            var r = gr(t[0], e);
            if (!e.parser.leftrightDepth) throw new n("\\middle without preceding \\left", r);
            return {
              type: "middle",
              mode: e.parser.mode,
              delim: r.text
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r;
            if ("." === e.delim) r = ht(t, []);else {
              r = pr.sizedDelim(e.delim, 1, t, e.mode, []);
              var n = {
                delim: e.delim,
                options: t
              };
              r.isMiddle = n;
            }
            return r;
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = "\\vert" === e.delim || "|" === e.delim ? vt("|", "text") : vt(e.delim, e.mode),
              n = new gt.MathNode("mo", [r]);
            return n.setAttribute("fence", "true"), n.setAttribute("lspace", "0.05em"), n.setAttribute("rspace", "0.05em"), n;
          }
        });
        var yr = function yr(e, t) {
            var r,
              n,
              a,
              i = Ve.wrapFragment(ct(e.body, t), t),
              o = e.label.substr(1),
              s = t.sizeMultiplier,
              h = 0,
              c = l.isCharacterBox(e.body);
            if ("sout" === o) (r = Ve.makeSpan(["stretchy", "sout"])).height = t.fontMetrics().defaultRuleThickness / s, h = -.5 * t.fontMetrics().xHeight;else if ("phase" === o) {
              var m = P({
                  number: .6,
                  unit: "pt"
                }, t),
                u = P({
                  number: .35,
                  unit: "ex"
                }, t);
              s /= t.havingBaseSizing().sizeMultiplier;
              var p = i.height + i.depth + m + u;
              i.style.paddingLeft = F(p / 2 + m);
              var d = Math.floor(1e3 * p * s),
                f = "M400000 " + (n = d) + " H0 L" + n / 2 + " 0 l65 45 L145 " + (n - 80) + " H400000z",
                g = new Z([new K("phase", f)], {
                  width: "400em",
                  height: F(d / 1e3),
                  viewBox: "0 0 400000 " + d,
                  preserveAspectRatio: "xMinYMin slice"
                });
              (r = Ve.makeSvgSpan(["hide-tail"], [g], t)).style.height = F(p), h = i.depth + m + u;
            } else {
              /cancel/.test(o) ? c || i.classes.push("cancel-pad") : "angl" === o ? i.classes.push("anglpad") : i.classes.push("boxpad");
              var v = 0,
                y = 0,
                b = 0;
              /box/.test(o) ? (b = Math.max(t.fontMetrics().fboxrule, t.minRuleThickness), y = v = t.fontMetrics().fboxsep + ("colorbox" === o ? 0 : b)) : "angl" === o ? (v = 4 * (b = Math.max(t.fontMetrics().defaultRuleThickness, t.minRuleThickness)), y = Math.max(0, .25 - i.depth)) : y = v = c ? .2 : 0, r = Bt(i, o, v, y, t), /fbox|boxed|fcolorbox/.test(o) ? (r.style.borderStyle = "solid", r.style.borderWidth = F(b)) : "angl" === o && .049 !== b && (r.style.borderTopWidth = F(b), r.style.borderRightWidth = F(b)), h = i.depth + y, e.backgroundColor && (r.style.backgroundColor = e.backgroundColor, e.borderColor && (r.style.borderColor = e.borderColor));
            }
            if (e.backgroundColor) a = Ve.makeVList({
              positionType: "individualShift",
              children: [{
                type: "elem",
                elem: r,
                shift: h
              }, {
                type: "elem",
                elem: i,
                shift: 0
              }]
            }, t);else {
              var x = /cancel|phase/.test(o) ? ["svg-align"] : [];
              a = Ve.makeVList({
                positionType: "individualShift",
                children: [{
                  type: "elem",
                  elem: i,
                  shift: 0
                }, {
                  type: "elem",
                  elem: r,
                  shift: h,
                  wrapperClasses: x
                }]
              }, t);
            }
            return /cancel/.test(o) && (a.height = i.height, a.depth = i.depth), /cancel/.test(o) && !c ? Ve.makeSpan(["mord", "cancel-lap"], [a], t) : Ve.makeSpan(["mord"], [a], t);
          },
          br = function br(e, t) {
            var r = 0,
              n = new gt.MathNode(e.label.indexOf("colorbox") > -1 ? "mpadded" : "menclose", [kt(e.body, t)]);
            switch (e.label) {
              case "\\cancel":
                n.setAttribute("notation", "updiagonalstrike");
                break;
              case "\\bcancel":
                n.setAttribute("notation", "downdiagonalstrike");
                break;
              case "\\phase":
                n.setAttribute("notation", "phasorangle");
                break;
              case "\\sout":
                n.setAttribute("notation", "horizontalstrike");
                break;
              case "\\fbox":
                n.setAttribute("notation", "box");
                break;
              case "\\angl":
                n.setAttribute("notation", "actuarial");
                break;
              case "\\fcolorbox":
              case "\\colorbox":
                if (r = t.fontMetrics().fboxsep * t.fontMetrics().ptPerEm, n.setAttribute("width", "+" + 2 * r + "pt"), n.setAttribute("height", "+" + 2 * r + "pt"), n.setAttribute("lspace", r + "pt"), n.setAttribute("voffset", r + "pt"), "\\fcolorbox" === e.label) {
                  var a = Math.max(t.fontMetrics().fboxrule, t.minRuleThickness);
                  n.setAttribute("style", "border: " + a + "em solid " + String(e.borderColor));
                }
                break;
              case "\\xcancel":
                n.setAttribute("notation", "updiagonalstrike downdiagonalstrike");
            }
            return e.backgroundColor && n.setAttribute("mathbackground", e.backgroundColor), n;
          };
        Ze({
          type: "enclose",
          names: ["\\colorbox"],
          props: {
            numArgs: 2,
            allowedInText: !0,
            argTypes: ["color", "text"]
          },
          handler: function handler(e, t, r) {
            var n = e.parser,
              a = e.funcName,
              i = qt(t[0], "color-token").color,
              o = t[1];
            return {
              type: "enclose",
              mode: n.mode,
              label: a,
              backgroundColor: i,
              body: o
            };
          },
          htmlBuilder: yr,
          mathmlBuilder: br
        }), Ze({
          type: "enclose",
          names: ["\\fcolorbox"],
          props: {
            numArgs: 3,
            allowedInText: !0,
            argTypes: ["color", "color", "text"]
          },
          handler: function handler(e, t, r) {
            var n = e.parser,
              a = e.funcName,
              i = qt(t[0], "color-token").color,
              o = qt(t[1], "color-token").color,
              s = t[2];
            return {
              type: "enclose",
              mode: n.mode,
              label: a,
              backgroundColor: o,
              borderColor: i,
              body: s
            };
          },
          htmlBuilder: yr,
          mathmlBuilder: br
        }), Ze({
          type: "enclose",
          names: ["\\fbox"],
          props: {
            numArgs: 1,
            argTypes: ["hbox"],
            allowedInText: !0
          },
          handler: function handler(e, t) {
            return {
              type: "enclose",
              mode: e.parser.mode,
              label: "\\fbox",
              body: t[0]
            };
          }
        }), Ze({
          type: "enclose",
          names: ["\\cancel", "\\bcancel", "\\xcancel", "\\sout", "\\phase"],
          props: {
            numArgs: 1
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = e.funcName,
              a = t[0];
            return {
              type: "enclose",
              mode: r.mode,
              label: n,
              body: a
            };
          },
          htmlBuilder: yr,
          mathmlBuilder: br
        }), Ze({
          type: "enclose",
          names: ["\\angl"],
          props: {
            numArgs: 1,
            argTypes: ["hbox"],
            allowedInText: !1
          },
          handler: function handler(e, t) {
            return {
              type: "enclose",
              mode: e.parser.mode,
              label: "\\angl",
              body: t[0]
            };
          }
        });
        var xr = {};
        function wr(e) {
          for (var t = e.type, r = e.names, n = e.props, a = e.handler, i = e.htmlBuilder, o = e.mathmlBuilder, s = {
              type: t,
              numArgs: n.numArgs || 0,
              allowedInText: !1,
              numOptionalArgs: 0,
              handler: a
            }, l = 0; l < r.length; ++l) {
            xr[r[l]] = s;
          }
          i && (je[t] = i), o && ($e[t] = o);
        }
        var kr = {};
        function Sr(e, t) {
          kr[e] = t;
        }
        var Mr = function () {
            function e(e, t, r) {
              this.lexer = void 0, this.start = void 0, this.end = void 0, this.lexer = e, this.start = t, this.end = r;
            }
            return e.range = function (t, r) {
              return r ? t && t.loc && r.loc && t.loc.lexer === r.loc.lexer ? new e(t.loc.lexer, t.loc.start, r.loc.end) : null : t && t.loc;
            }, e;
          }(),
          zr = function () {
            function e(e, t) {
              this.text = void 0, this.loc = void 0, this.noexpand = void 0, this.treatAsRelax = void 0, this.text = e, this.loc = t;
            }
            return e.prototype.range = function (t, r) {
              return new e(r, Mr.range(this, t));
            }, e;
          }();
        function Ar(e) {
          var t = [];
          e.consumeSpaces();
          for (var r = e.fetch().text; "\\hline" === r || "\\hdashline" === r;) {
            e.consume(), t.push("\\hdashline" === r), e.consumeSpaces(), r = e.fetch().text;
          }
          return t;
        }
        var Tr = function Tr(e) {
          if (!e.parser.settings.displayMode) throw new n("{" + e.envName + "} can be used only in display mode.");
        };
        function Br(e) {
          if (-1 === e.indexOf("ed")) return -1 === e.indexOf("*");
        }
        function Cr(e, t, r) {
          var a = t.hskipBeforeAndAfter,
            i = t.addJot,
            o = t.cols,
            s = t.arraystretch,
            l = t.colSeparationType,
            h = t.autoTag,
            c = t.singleRow,
            m = t.emptySingleRow,
            u = t.maxNumCols,
            p = t.leqno;
          if (e.gullet.beginGroup(), c || e.gullet.macros.set("\\cr", "\\\\\\relax"), !s) {
            var d = e.gullet.expandMacroAsText("\\arraystretch");
            if (null == d) s = 1;else if (!(s = parseFloat(d)) || s < 0) throw new n("Invalid \\arraystretch: " + d);
          }
          e.gullet.beginGroup();
          var f = [],
            g = [f],
            v = [],
            y = [],
            b = null != h ? [] : void 0;
          function x() {
            h && e.gullet.macros.set("\\@eqnsw", "1", !0);
          }
          function w() {
            b && (e.gullet.macros.get("\\df@tag") ? (b.push(e.subparse([new zr("\\df@tag")])), e.gullet.macros.set("\\df@tag", void 0, !0)) : b.push(Boolean(h) && "1" === e.gullet.macros.get("\\@eqnsw")));
          }
          for (x(), y.push(Ar(e));;) {
            var k = e.parseExpression(!1, c ? "\\end" : "\\\\");
            e.gullet.endGroup(), e.gullet.beginGroup(), k = {
              type: "ordgroup",
              mode: e.mode,
              body: k
            }, r && (k = {
              type: "styling",
              mode: e.mode,
              style: r,
              body: [k]
            }), f.push(k);
            var S = e.fetch().text;
            if ("&" === S) {
              if (u && f.length === u) {
                if (c || l) throw new n("Too many tab characters: &", e.nextToken);
                e.settings.reportNonstrict("textEnv", "Too few columns specified in the {array} column argument.");
              }
              e.consume();
            } else {
              if ("\\end" === S) {
                w(), 1 === f.length && "styling" === k.type && 0 === k.body[0].body.length && (g.length > 1 || !m) && g.pop(), y.length < g.length + 1 && y.push([]);
                break;
              }
              if ("\\\\" !== S) throw new n("Expected & or \\\\ or \\cr or \\end", e.nextToken);
              e.consume();
              var M = void 0;
              " " !== e.gullet.future().text && (M = e.parseSizeGroup(!0)), v.push(M ? M.value : null), w(), y.push(Ar(e)), f = [], g.push(f), x();
            }
          }
          return e.gullet.endGroup(), e.gullet.endGroup(), {
            type: "array",
            mode: e.mode,
            addJot: i,
            arraystretch: s,
            body: g,
            cols: o,
            rowGaps: v,
            hskipBeforeAndAfter: a,
            hLinesBeforeRow: y,
            colSeparationType: l,
            tags: b,
            leqno: p
          };
        }
        function Nr(e) {
          return "d" === e.substr(0, 1) ? "display" : "text";
        }
        var qr = function qr(e, t) {
            var r,
              a,
              i = e.body.length,
              o = e.hLinesBeforeRow,
              s = 0,
              h = new Array(i),
              c = [],
              m = Math.max(t.fontMetrics().arrayRuleWidth, t.minRuleThickness),
              u = 1 / t.fontMetrics().ptPerEm,
              p = 5 * u;
            e.colSeparationType && "small" === e.colSeparationType && (p = t.havingStyle(x.SCRIPT).sizeMultiplier / t.sizeMultiplier * .2778);
            var d = "CD" === e.colSeparationType ? P({
                number: 3,
                unit: "ex"
              }, t) : 12 * u,
              f = 3 * u,
              g = e.arraystretch * d,
              v = .7 * g,
              y = .3 * g,
              b = 0;
            function w(e) {
              for (var t = 0; t < e.length; ++t) {
                t > 0 && (b += .25), c.push({
                  pos: b,
                  isDashed: e[t]
                });
              }
            }
            for (w(o[0]), r = 0; r < e.body.length; ++r) {
              var k = e.body[r],
                S = v,
                M = y;
              s < k.length && (s = k.length);
              var z = new Array(k.length);
              for (a = 0; a < k.length; ++a) {
                var A = ct(k[a], t);
                M < A.depth && (M = A.depth), S < A.height && (S = A.height), z[a] = A;
              }
              var T = e.rowGaps[r],
                B = 0;
              T && (B = P(T, t)) > 0 && (M < (B += y) && (M = B), B = 0), e.addJot && (M += f), z.height = S, z.depth = M, b += S, z.pos = b, b += M + B, h[r] = z, w(o[r + 1]);
            }
            var C,
              N,
              q = b / 2 + t.fontMetrics().axisHeight,
              I = e.cols || [],
              O = [],
              R = [];
            if (e.tags && e.tags.some(function (e) {
              return e;
            })) for (r = 0; r < i; ++r) {
              var H = h[r],
                E = H.pos - q,
                L = e.tags[r],
                D = void 0;
              (D = !0 === L ? Ve.makeSpan(["eqn-num"], [], t) : !1 === L ? Ve.makeSpan([], [], t) : Ve.makeSpan([], it(L, t, !0), t)).depth = H.depth, D.height = H.height, R.push({
                type: "elem",
                elem: D,
                shift: E
              });
            }
            for (a = 0, N = 0; a < s || N < I.length; ++a, ++N) {
              for (var V = I[N] || {}, G = !0; "separator" === V.type;) {
                if (G || ((C = Ve.makeSpan(["arraycolsep"], [])).style.width = F(t.fontMetrics().doubleRuleSep), O.push(C)), "|" !== V.separator && ":" !== V.separator) throw new n("Invalid separator type: " + V.separator);
                var U = "|" === V.separator ? "solid" : "dashed",
                  _ = Ve.makeSpan(["vertical-separator"], [], t);
                _.style.height = F(b), _.style.borderRightWidth = F(m), _.style.borderRightStyle = U, _.style.margin = "0 " + F(-m / 2);
                var Y = b - q;
                Y && (_.style.verticalAlign = F(-Y)), O.push(_), V = I[++N] || {}, G = !1;
              }
              if (!(a >= s)) {
                var X = void 0;
                (a > 0 || e.hskipBeforeAndAfter) && 0 !== (X = l.deflt(V.pregap, p)) && ((C = Ve.makeSpan(["arraycolsep"], [])).style.width = F(X), O.push(C));
                var W = [];
                for (r = 0; r < i; ++r) {
                  var j = h[r],
                    $ = j[a];
                  if ($) {
                    var Z = j.pos - q;
                    $.depth = j.depth, $.height = j.height, W.push({
                      type: "elem",
                      elem: $,
                      shift: Z
                    });
                  }
                }
                W = Ve.makeVList({
                  positionType: "individualShift",
                  children: W
                }, t), W = Ve.makeSpan(["col-align-" + (V.align || "c")], [W]), O.push(W), (a < s - 1 || e.hskipBeforeAndAfter) && 0 !== (X = l.deflt(V.postgap, p)) && ((C = Ve.makeSpan(["arraycolsep"], [])).style.width = F(X), O.push(C));
              }
            }
            if (h = Ve.makeSpan(["mtable"], O), c.length > 0) {
              for (var K = Ve.makeLineSpan("hline", t, m), J = Ve.makeLineSpan("hdashline", t, m), Q = [{
                  type: "elem",
                  elem: h,
                  shift: 0
                }]; c.length > 0;) {
                var ee = c.pop(),
                  te = ee.pos - q;
                ee.isDashed ? Q.push({
                  type: "elem",
                  elem: J,
                  shift: te
                }) : Q.push({
                  type: "elem",
                  elem: K,
                  shift: te
                });
              }
              h = Ve.makeVList({
                positionType: "individualShift",
                children: Q
              }, t);
            }
            if (0 === R.length) return Ve.makeSpan(["mord"], [h], t);
            var re = Ve.makeVList({
              positionType: "individualShift",
              children: R
            }, t);
            return re = Ve.makeSpan(["tag"], [re], t), Ve.makeFragment([h, re]);
          },
          Ir = {
            c: "center ",
            l: "left ",
            r: "right "
          },
          Or = function Or(e, t) {
            for (var r = [], n = new gt.MathNode("mtd", [], ["mtr-glue"]), a = new gt.MathNode("mtd", [], ["mml-eqn-num"]), i = 0; i < e.body.length; i++) {
              for (var o = e.body[i], s = [], l = 0; l < o.length; l++) {
                s.push(new gt.MathNode("mtd", [kt(o[l], t)]));
              }
              e.tags && e.tags[i] && (s.unshift(n), s.push(n), e.leqno ? s.unshift(a) : s.push(a)), r.push(new gt.MathNode("mtr", s));
            }
            var h = new gt.MathNode("mtable", r),
              c = .5 === e.arraystretch ? .1 : .16 + e.arraystretch - 1 + (e.addJot ? .09 : 0);
            h.setAttribute("rowspacing", F(c));
            var m = "",
              u = "";
            if (e.cols && e.cols.length > 0) {
              var p = e.cols,
                d = "",
                f = !1,
                g = 0,
                v = p.length;
              "separator" === p[0].type && (m += "top ", g = 1), "separator" === p[p.length - 1].type && (m += "bottom ", v -= 1);
              for (var y = g; y < v; y++) {
                "align" === p[y].type ? (u += Ir[p[y].align], f && (d += "none "), f = !0) : "separator" === p[y].type && f && (d += "|" === p[y].separator ? "solid " : "dashed ", f = !1);
              }
              h.setAttribute("columnalign", u.trim()), /[sd]/.test(d) && h.setAttribute("columnlines", d.trim());
            }
            if ("align" === e.colSeparationType) {
              for (var b = e.cols || [], x = "", w = 1; w < b.length; w++) {
                x += w % 2 ? "0em " : "1em ";
              }
              h.setAttribute("columnspacing", x.trim());
            } else "alignat" === e.colSeparationType || "gather" === e.colSeparationType ? h.setAttribute("columnspacing", "0em") : "small" === e.colSeparationType ? h.setAttribute("columnspacing", "0.2778em") : "CD" === e.colSeparationType ? h.setAttribute("columnspacing", "0.5em") : h.setAttribute("columnspacing", "1em");
            var k = "",
              S = e.hLinesBeforeRow;
            m += S[0].length > 0 ? "left " : "", m += S[S.length - 1].length > 0 ? "right " : "";
            for (var M = 1; M < S.length - 1; M++) {
              k += 0 === S[M].length ? "none " : S[M][0] ? "dashed " : "solid ";
            }
            return /[sd]/.test(k) && h.setAttribute("rowlines", k.trim()), "" !== m && (h = new gt.MathNode("menclose", [h])).setAttribute("notation", m.trim()), e.arraystretch && e.arraystretch < 1 && (h = new gt.MathNode("mstyle", [h])).setAttribute("scriptlevel", "1"), h;
          },
          Rr = function Rr(e, t) {
            -1 === e.envName.indexOf("ed") && Tr(e);
            var r,
              a = [],
              i = e.envName.indexOf("at") > -1 ? "alignat" : "align",
              o = "split" === e.envName,
              s = Cr(e.parser, {
                cols: a,
                addJot: !0,
                autoTag: o ? void 0 : Br(e.envName),
                emptySingleRow: !0,
                colSeparationType: i,
                maxNumCols: o ? 2 : void 0,
                leqno: e.parser.settings.leqno
              }, "display"),
              l = 0,
              h = {
                type: "ordgroup",
                mode: e.mode,
                body: []
              };
            if (t[0] && "ordgroup" === t[0].type) {
              for (var c = "", m = 0; m < t[0].body.length; m++) {
                c += qt(t[0].body[m], "textord").text;
              }
              r = Number(c), l = 2 * r;
            }
            var u = !l;
            s.body.forEach(function (e) {
              for (var t = 1; t < e.length; t += 2) {
                var a = qt(e[t], "styling");
                qt(a.body[0], "ordgroup").body.unshift(h);
              }
              if (u) l < e.length && (l = e.length);else {
                var i = e.length / 2;
                if (r < i) throw new n("Too many math in a row: expected " + r + ", but got " + i, e[0]);
              }
            });
            for (var p = 0; p < l; ++p) {
              var d = "r",
                f = 0;
              p % 2 == 1 ? d = "l" : p > 0 && u && (f = 1), a[p] = {
                type: "align",
                align: d,
                pregap: f,
                postgap: 0
              };
            }
            return s.colSeparationType = u ? "align" : "alignat", s;
          };
        wr({
          type: "array",
          names: ["array", "darray"],
          props: {
            numArgs: 1
          },
          handler: function handler(e, t) {
            var r = (Ot(t[0]) ? [t[0]] : qt(t[0], "ordgroup").body).map(function (e) {
                var t = It(e).text;
                if (-1 !== "lcr".indexOf(t)) return {
                  type: "align",
                  align: t
                };
                if ("|" === t) return {
                  type: "separator",
                  separator: "|"
                };
                if (":" === t) return {
                  type: "separator",
                  separator: ":"
                };
                throw new n("Unknown column alignment: " + t, e);
              }),
              a = {
                cols: r,
                hskipBeforeAndAfter: !0,
                maxNumCols: r.length
              };
            return Cr(e.parser, a, Nr(e.envName));
          },
          htmlBuilder: qr,
          mathmlBuilder: Or
        }), wr({
          type: "array",
          names: ["matrix", "pmatrix", "bmatrix", "Bmatrix", "vmatrix", "Vmatrix", "matrix*", "pmatrix*", "bmatrix*", "Bmatrix*", "vmatrix*", "Vmatrix*"],
          props: {
            numArgs: 0
          },
          handler: function handler(e) {
            var t = {
                matrix: null,
                pmatrix: ["(", ")"],
                bmatrix: ["[", "]"],
                Bmatrix: ["\\{", "\\}"],
                vmatrix: ["|", "|"],
                Vmatrix: ["\\Vert", "\\Vert"]
              }[e.envName.replace("*", "")],
              r = "c",
              a = {
                hskipBeforeAndAfter: !1,
                cols: [{
                  type: "align",
                  align: r
                }]
              };
            if ("*" === e.envName.charAt(e.envName.length - 1)) {
              var i = e.parser;
              if (i.consumeSpaces(), "[" === i.fetch().text) {
                if (i.consume(), i.consumeSpaces(), r = i.fetch().text, -1 === "lcr".indexOf(r)) throw new n("Expected l or c or r", i.nextToken);
                i.consume(), i.consumeSpaces(), i.expect("]"), i.consume(), a.cols = [{
                  type: "align",
                  align: r
                }];
              }
            }
            var o = Cr(e.parser, a, Nr(e.envName)),
              s = Math.max.apply(Math, [0].concat(o.body.map(function (e) {
                return e.length;
              })));
            return o.cols = new Array(s).fill({
              type: "align",
              align: r
            }), t ? {
              type: "leftright",
              mode: e.mode,
              body: [o],
              left: t[0],
              right: t[1],
              rightColor: void 0
            } : o;
          },
          htmlBuilder: qr,
          mathmlBuilder: Or
        }), wr({
          type: "array",
          names: ["smallmatrix"],
          props: {
            numArgs: 0
          },
          handler: function handler(e) {
            var t = Cr(e.parser, {
              arraystretch: .5
            }, "script");
            return t.colSeparationType = "small", t;
          },
          htmlBuilder: qr,
          mathmlBuilder: Or
        }), wr({
          type: "array",
          names: ["subarray"],
          props: {
            numArgs: 1
          },
          handler: function handler(e, t) {
            var r = (Ot(t[0]) ? [t[0]] : qt(t[0], "ordgroup").body).map(function (e) {
              var t = It(e).text;
              if (-1 !== "lc".indexOf(t)) return {
                type: "align",
                align: t
              };
              throw new n("Unknown column alignment: " + t, e);
            });
            if (r.length > 1) throw new n("{subarray} can contain only one column");
            var a = {
              cols: r,
              hskipBeforeAndAfter: !1,
              arraystretch: .5
            };
            if ((a = Cr(e.parser, a, "script")).body.length > 0 && a.body[0].length > 1) throw new n("{subarray} can contain only one column");
            return a;
          },
          htmlBuilder: qr,
          mathmlBuilder: Or
        }), wr({
          type: "array",
          names: ["cases", "dcases", "rcases", "drcases"],
          props: {
            numArgs: 0
          },
          handler: function handler(e) {
            var t = Cr(e.parser, {
              arraystretch: 1.2,
              cols: [{
                type: "align",
                align: "l",
                pregap: 0,
                postgap: 1
              }, {
                type: "align",
                align: "l",
                pregap: 0,
                postgap: 0
              }]
            }, Nr(e.envName));
            return {
              type: "leftright",
              mode: e.mode,
              body: [t],
              left: e.envName.indexOf("r") > -1 ? "." : "\\{",
              right: e.envName.indexOf("r") > -1 ? "\\}" : ".",
              rightColor: void 0
            };
          },
          htmlBuilder: qr,
          mathmlBuilder: Or
        }), wr({
          type: "array",
          names: ["align", "align*", "aligned", "split"],
          props: {
            numArgs: 0
          },
          handler: Rr,
          htmlBuilder: qr,
          mathmlBuilder: Or
        }), wr({
          type: "array",
          names: ["gathered", "gather", "gather*"],
          props: {
            numArgs: 0
          },
          handler: function handler(e) {
            l.contains(["gather", "gather*"], e.envName) && Tr(e);
            var t = {
              cols: [{
                type: "align",
                align: "c"
              }],
              addJot: !0,
              colSeparationType: "gather",
              autoTag: Br(e.envName),
              emptySingleRow: !0,
              leqno: e.parser.settings.leqno
            };
            return Cr(e.parser, t, "display");
          },
          htmlBuilder: qr,
          mathmlBuilder: Or
        }), wr({
          type: "array",
          names: ["alignat", "alignat*", "alignedat"],
          props: {
            numArgs: 1
          },
          handler: Rr,
          htmlBuilder: qr,
          mathmlBuilder: Or
        }), wr({
          type: "array",
          names: ["equation", "equation*"],
          props: {
            numArgs: 0
          },
          handler: function handler(e) {
            Tr(e);
            var t = {
              autoTag: Br(e.envName),
              emptySingleRow: !0,
              singleRow: !0,
              maxNumCols: 1,
              leqno: e.parser.settings.leqno
            };
            return Cr(e.parser, t, "display");
          },
          htmlBuilder: qr,
          mathmlBuilder: Or
        }), wr({
          type: "array",
          names: ["CD"],
          props: {
            numArgs: 0
          },
          handler: function handler(e) {
            return Tr(e), function (e) {
              var t = [];
              for (e.gullet.beginGroup(), e.gullet.macros.set("\\cr", "\\\\\\relax"), e.gullet.beginGroup();;) {
                t.push(e.parseExpression(!1, "\\\\")), e.gullet.endGroup(), e.gullet.beginGroup();
                var r = e.fetch().text;
                if ("&" !== r && "\\\\" !== r) {
                  if ("\\end" === r) {
                    0 === t[t.length - 1].length && t.pop();
                    break;
                  }
                  throw new n("Expected \\\\ or \\cr or \\end", e.nextToken);
                }
                e.consume();
              }
              for (var a, i, o = [], s = [o], l = 0; l < t.length; l++) {
                for (var h = t[l], c = {
                    type: "styling",
                    body: [],
                    mode: "math",
                    style: "display"
                  }, m = 0; m < h.length; m++) {
                  if (Pt(h[m])) {
                    o.push(c);
                    var u = It(h[m += 1]).text,
                      p = new Array(2);
                    if (p[0] = {
                      type: "ordgroup",
                      mode: "math",
                      body: []
                    }, p[1] = {
                      type: "ordgroup",
                      mode: "math",
                      body: []
                    }, "=|.".indexOf(u) > -1) ;else {
                      if (!("<>AV".indexOf(u) > -1)) throw new n('Expected one of "<>AV=|." after @', h[m]);
                      for (var d = 0; d < 2; d++) {
                        for (var f = !0, g = m + 1; g < h.length; g++) {
                          if (a = h[g], i = u, ("mathord" === a.type || "atom" === a.type) && a.text === i) {
                            f = !1, m = g;
                            break;
                          }
                          if (Pt(h[g])) throw new n("Missing a " + u + " character to complete a CD arrow.", h[g]);
                          p[d].body.push(h[g]);
                        }
                        if (f) throw new n("Missing a " + u + " character to complete a CD arrow.", h[m]);
                      }
                    }
                    var v = {
                      type: "styling",
                      body: [Ft(u, p, e)],
                      mode: "math",
                      style: "display"
                    };
                    o.push(v), c = {
                      type: "styling",
                      body: [],
                      mode: "math",
                      style: "display"
                    };
                  } else c.body.push(h[m]);
                }
                l % 2 == 0 ? o.push(c) : o.shift(), o = [], s.push(o);
              }
              return e.gullet.endGroup(), e.gullet.endGroup(), {
                type: "array",
                mode: "math",
                body: s,
                arraystretch: 1,
                addJot: !0,
                rowGaps: [null],
                cols: new Array(s[0].length).fill({
                  type: "align",
                  align: "c",
                  pregap: .25,
                  postgap: .25
                }),
                colSeparationType: "CD",
                hLinesBeforeRow: new Array(s.length + 1).fill([])
              };
            }(e.parser);
          },
          htmlBuilder: qr,
          mathmlBuilder: Or
        }), Sr("\\nonumber", "\\gdef\\@eqnsw{0}"), Sr("\\notag", "\\nonumber"), Ze({
          type: "text",
          names: ["\\hline", "\\hdashline"],
          props: {
            numArgs: 0,
            allowedInText: !0,
            allowedInMath: !0
          },
          handler: function handler(e, t) {
            throw new n(e.funcName + " valid only within array environment");
          }
        });
        var Hr = xr;
        Ze({
          type: "environment",
          names: ["\\begin", "\\end"],
          props: {
            numArgs: 1,
            argTypes: ["text"]
          },
          handler: function handler(e, t) {
            var r = e.parser,
              a = e.funcName,
              i = t[0];
            if ("ordgroup" !== i.type) throw new n("Invalid environment name", i);
            for (var o = "", s = 0; s < i.body.length; ++s) {
              o += qt(i.body[s], "textord").text;
            }
            if ("\\begin" === a) {
              if (!Hr.hasOwnProperty(o)) throw new n("No such environment: " + o, i);
              var l = Hr[o],
                h = r.parseArguments("\\begin{" + o + "}", l),
                c = h.args,
                m = h.optArgs,
                u = {
                  mode: r.mode,
                  envName: o,
                  parser: r
                },
                p = l.handler(u, c, m);
              r.expect("\\end", !1);
              var d = r.nextToken,
                f = qt(r.parseFunction(), "environment");
              if (f.name !== o) throw new n("Mismatch: \\begin{" + o + "} matched by \\end{" + f.name + "}", d);
              return p;
            }
            return {
              type: "environment",
              mode: r.mode,
              name: o,
              nameGroup: i
            };
          }
        });
        var Er = Ve.makeSpan;
        function Lr(e, t) {
          var r = it(e.body, t, !0);
          return Er([e.mclass], r, t);
        }
        function Dr(e, t) {
          var r,
            n = xt(e.body, t);
          return "minner" === e.mclass ? r = new gt.MathNode("mpadded", n) : "mord" === e.mclass ? e.isCharacterBox ? (r = n[0]).type = "mi" : r = new gt.MathNode("mi", n) : (e.isCharacterBox ? (r = n[0]).type = "mo" : r = new gt.MathNode("mo", n), "mbin" === e.mclass ? (r.attributes.lspace = "0.22em", r.attributes.rspace = "0.22em") : "mpunct" === e.mclass ? (r.attributes.lspace = "0em", r.attributes.rspace = "0.17em") : "mopen" === e.mclass || "mclose" === e.mclass ? (r.attributes.lspace = "0em", r.attributes.rspace = "0em") : "minner" === e.mclass && (r.attributes.lspace = "0.0556em", r.attributes.width = "+0.1111em")), r;
        }
        Ze({
          type: "mclass",
          names: ["\\mathord", "\\mathbin", "\\mathrel", "\\mathopen", "\\mathclose", "\\mathpunct", "\\mathinner"],
          props: {
            numArgs: 1,
            primitive: !0
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = e.funcName,
              a = t[0];
            return {
              type: "mclass",
              mode: r.mode,
              mclass: "m" + n.substr(5),
              body: Qe(a),
              isCharacterBox: l.isCharacterBox(a)
            };
          },
          htmlBuilder: Lr,
          mathmlBuilder: Dr
        });
        var Pr = function Pr(e) {
          var t = "ordgroup" === e.type && e.body.length ? e.body[0] : e;
          return "atom" !== t.type || "bin" !== t.family && "rel" !== t.family ? "mord" : "m" + t.family;
        };
        Ze({
          type: "mclass",
          names: ["\\@binrel"],
          props: {
            numArgs: 2
          },
          handler: function handler(e, t) {
            return {
              type: "mclass",
              mode: e.parser.mode,
              mclass: Pr(t[0]),
              body: Qe(t[1]),
              isCharacterBox: l.isCharacterBox(t[1])
            };
          }
        }), Ze({
          type: "mclass",
          names: ["\\stackrel", "\\overset", "\\underset"],
          props: {
            numArgs: 2
          },
          handler: function handler(e, t) {
            var r,
              n = e.parser,
              a = e.funcName,
              i = t[1],
              o = t[0];
            r = "\\stackrel" !== a ? Pr(i) : "mrel";
            var s = {
                type: "op",
                mode: i.mode,
                limits: !0,
                alwaysHandleSupSub: !0,
                parentIsSupSub: !1,
                symbol: !1,
                suppressBaseShift: "\\stackrel" !== a,
                body: Qe(i)
              },
              h = {
                type: "supsub",
                mode: o.mode,
                base: s,
                sup: "\\underset" === a ? null : o,
                sub: "\\underset" === a ? o : null
              };
            return {
              type: "mclass",
              mode: n.mode,
              mclass: r,
              body: [h],
              isCharacterBox: l.isCharacterBox(h)
            };
          },
          htmlBuilder: Lr,
          mathmlBuilder: Dr
        });
        var Fr = function Fr(e, t) {
            var r = e.font,
              n = t.withFont(r);
            return ct(e.body, n);
          },
          Vr = function Vr(e, t) {
            var r = e.font,
              n = t.withFont(r);
            return kt(e.body, n);
          },
          Gr = {
            "\\Bbb": "\\mathbb",
            "\\bold": "\\mathbf",
            "\\frak": "\\mathfrak",
            "\\bm": "\\boldsymbol"
          };
        Ze({
          type: "font",
          names: ["\\mathrm", "\\mathit", "\\mathbf", "\\mathnormal", "\\mathbb", "\\mathcal", "\\mathfrak", "\\mathscr", "\\mathsf", "\\mathtt", "\\Bbb", "\\bold", "\\frak"],
          props: {
            numArgs: 1,
            allowedInArgument: !0
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = e.funcName,
              a = Je(t[0]),
              i = n;
            return i in Gr && (i = Gr[i]), {
              type: "font",
              mode: r.mode,
              font: i.slice(1),
              body: a
            };
          },
          htmlBuilder: Fr,
          mathmlBuilder: Vr
        }), Ze({
          type: "mclass",
          names: ["\\boldsymbol", "\\bm"],
          props: {
            numArgs: 1
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = t[0],
              a = l.isCharacterBox(n);
            return {
              type: "mclass",
              mode: r.mode,
              mclass: Pr(n),
              body: [{
                type: "font",
                mode: r.mode,
                font: "boldsymbol",
                body: n
              }],
              isCharacterBox: a
            };
          }
        }), Ze({
          type: "font",
          names: ["\\rm", "\\sf", "\\tt", "\\bf", "\\it", "\\cal"],
          props: {
            numArgs: 0,
            allowedInText: !0
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = e.funcName,
              a = e.breakOnTokenText,
              i = r.mode,
              o = r.parseExpression(!0, a);
            return {
              type: "font",
              mode: i,
              font: "math" + n.slice(1),
              body: {
                type: "ordgroup",
                mode: r.mode,
                body: o
              }
            };
          },
          htmlBuilder: Fr,
          mathmlBuilder: Vr
        });
        var Ur = function Ur(e, t) {
            var r = t;
            return "display" === e ? r = r.id >= x.SCRIPT.id ? r.text() : x.DISPLAY : "text" === e && r.size === x.DISPLAY.size ? r = x.TEXT : "script" === e ? r = x.SCRIPT : "scriptscript" === e && (r = x.SCRIPTSCRIPT), r;
          },
          _r = function _r(e, t) {
            var r,
              n = Ur(e.size, t.style),
              a = n.fracNum(),
              i = n.fracDen();
            r = t.havingStyle(a);
            var o = ct(e.numer, r, t);
            if (e.continued) {
              var s = 8.5 / t.fontMetrics().ptPerEm,
                l = 3.5 / t.fontMetrics().ptPerEm;
              o.height = o.height < s ? s : o.height, o.depth = o.depth < l ? l : o.depth;
            }
            r = t.havingStyle(i);
            var h,
              c,
              m,
              u,
              p,
              d,
              f,
              g,
              v,
              y,
              b = ct(e.denom, r, t);
            if (e.hasBarLine ? (e.barSize ? (c = P(e.barSize, t), h = Ve.makeLineSpan("frac-line", t, c)) : h = Ve.makeLineSpan("frac-line", t), c = h.height, m = h.height) : (h = null, c = 0, m = t.fontMetrics().defaultRuleThickness), n.size === x.DISPLAY.size || "display" === e.size ? (u = t.fontMetrics().num1, p = c > 0 ? 3 * m : 7 * m, d = t.fontMetrics().denom1) : (c > 0 ? (u = t.fontMetrics().num2, p = m) : (u = t.fontMetrics().num3, p = 3 * m), d = t.fontMetrics().denom2), h) {
              var w = t.fontMetrics().axisHeight;
              u - o.depth - (w + .5 * c) < p && (u += p - (u - o.depth - (w + .5 * c))), w - .5 * c - (b.height - d) < p && (d += p - (w - .5 * c - (b.height - d)));
              var k = -(w - .5 * c);
              f = Ve.makeVList({
                positionType: "individualShift",
                children: [{
                  type: "elem",
                  elem: b,
                  shift: d
                }, {
                  type: "elem",
                  elem: h,
                  shift: k
                }, {
                  type: "elem",
                  elem: o,
                  shift: -u
                }]
              }, t);
            } else {
              var S = u - o.depth - (b.height - d);
              S < p && (u += .5 * (p - S), d += .5 * (p - S)), f = Ve.makeVList({
                positionType: "individualShift",
                children: [{
                  type: "elem",
                  elem: b,
                  shift: d
                }, {
                  type: "elem",
                  elem: o,
                  shift: -u
                }]
              }, t);
            }
            return r = t.havingStyle(n), f.height *= r.sizeMultiplier / t.sizeMultiplier, f.depth *= r.sizeMultiplier / t.sizeMultiplier, g = n.size === x.DISPLAY.size ? t.fontMetrics().delim1 : n.size === x.SCRIPTSCRIPT.size ? t.havingStyle(x.SCRIPT).fontMetrics().delim2 : t.fontMetrics().delim2, v = null == e.leftDelim ? ht(t, ["mopen"]) : pr.customSizedDelim(e.leftDelim, g, !0, t.havingStyle(n), e.mode, ["mopen"]), y = e.continued ? Ve.makeSpan([]) : null == e.rightDelim ? ht(t, ["mclose"]) : pr.customSizedDelim(e.rightDelim, g, !0, t.havingStyle(n), e.mode, ["mclose"]), Ve.makeSpan(["mord"].concat(r.sizingClasses(t)), [v, Ve.makeSpan(["mfrac"], [f]), y], t);
          },
          Yr = function Yr(e, t) {
            var r = new gt.MathNode("mfrac", [kt(e.numer, t), kt(e.denom, t)]);
            if (e.hasBarLine) {
              if (e.barSize) {
                var n = P(e.barSize, t);
                r.setAttribute("linethickness", F(n));
              }
            } else r.setAttribute("linethickness", "0px");
            var a = Ur(e.size, t.style);
            if (a.size !== t.style.size) {
              r = new gt.MathNode("mstyle", [r]);
              var i = a.size === x.DISPLAY.size ? "true" : "false";
              r.setAttribute("displaystyle", i), r.setAttribute("scriptlevel", "0");
            }
            if (null != e.leftDelim || null != e.rightDelim) {
              var o = [];
              if (null != e.leftDelim) {
                var s = new gt.MathNode("mo", [new gt.TextNode(e.leftDelim.replace("\\", ""))]);
                s.setAttribute("fence", "true"), o.push(s);
              }
              if (o.push(r), null != e.rightDelim) {
                var l = new gt.MathNode("mo", [new gt.TextNode(e.rightDelim.replace("\\", ""))]);
                l.setAttribute("fence", "true"), o.push(l);
              }
              return yt(o);
            }
            return r;
          };
        Ze({
          type: "genfrac",
          names: ["\\dfrac", "\\frac", "\\tfrac", "\\dbinom", "\\binom", "\\tbinom", "\\\\atopfrac", "\\\\bracefrac", "\\\\brackfrac"],
          props: {
            numArgs: 2,
            allowedInArgument: !0
          },
          handler: function handler(e, t) {
            var r,
              n = e.parser,
              a = e.funcName,
              i = t[0],
              o = t[1],
              s = null,
              l = null,
              h = "auto";
            switch (a) {
              case "\\dfrac":
              case "\\frac":
              case "\\tfrac":
                r = !0;
                break;
              case "\\\\atopfrac":
                r = !1;
                break;
              case "\\dbinom":
              case "\\binom":
              case "\\tbinom":
                r = !1, s = "(", l = ")";
                break;
              case "\\\\bracefrac":
                r = !1, s = "\\{", l = "\\}";
                break;
              case "\\\\brackfrac":
                r = !1, s = "[", l = "]";
                break;
              default:
                throw new Error("Unrecognized genfrac command");
            }
            switch (a) {
              case "\\dfrac":
              case "\\dbinom":
                h = "display";
                break;
              case "\\tfrac":
              case "\\tbinom":
                h = "text";
            }
            return {
              type: "genfrac",
              mode: n.mode,
              continued: !1,
              numer: i,
              denom: o,
              hasBarLine: r,
              leftDelim: s,
              rightDelim: l,
              size: h,
              barSize: null
            };
          },
          htmlBuilder: _r,
          mathmlBuilder: Yr
        }), Ze({
          type: "genfrac",
          names: ["\\cfrac"],
          props: {
            numArgs: 2
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = (e.funcName, t[0]),
              a = t[1];
            return {
              type: "genfrac",
              mode: r.mode,
              continued: !0,
              numer: n,
              denom: a,
              hasBarLine: !0,
              leftDelim: null,
              rightDelim: null,
              size: "display",
              barSize: null
            };
          }
        }), Ze({
          type: "infix",
          names: ["\\over", "\\choose", "\\atop", "\\brace", "\\brack"],
          props: {
            numArgs: 0,
            infix: !0
          },
          handler: function handler(e) {
            var t,
              r = e.parser,
              n = e.funcName,
              a = e.token;
            switch (n) {
              case "\\over":
                t = "\\frac";
                break;
              case "\\choose":
                t = "\\binom";
                break;
              case "\\atop":
                t = "\\\\atopfrac";
                break;
              case "\\brace":
                t = "\\\\bracefrac";
                break;
              case "\\brack":
                t = "\\\\brackfrac";
                break;
              default:
                throw new Error("Unrecognized infix genfrac command");
            }
            return {
              type: "infix",
              mode: r.mode,
              replaceWith: t,
              token: a
            };
          }
        });
        var Xr = ["display", "text", "script", "scriptscript"],
          Wr = function Wr(e) {
            var t = null;
            return e.length > 0 && (t = "." === (t = e) ? null : t), t;
          };
        Ze({
          type: "genfrac",
          names: ["\\genfrac"],
          props: {
            numArgs: 6,
            allowedInArgument: !0,
            argTypes: ["math", "math", "size", "text", "math", "math"]
          },
          handler: function handler(e, t) {
            var r,
              n = e.parser,
              a = t[4],
              i = t[5],
              o = Je(t[0]),
              s = "atom" === o.type && "open" === o.family ? Wr(o.text) : null,
              l = Je(t[1]),
              h = "atom" === l.type && "close" === l.family ? Wr(l.text) : null,
              c = qt(t[2], "size"),
              m = null;
            r = !!c.isBlank || (m = c.value).number > 0;
            var u = "auto",
              p = t[3];
            if ("ordgroup" === p.type) {
              if (p.body.length > 0) {
                var d = qt(p.body[0], "textord");
                u = Xr[Number(d.text)];
              }
            } else p = qt(p, "textord"), u = Xr[Number(p.text)];
            return {
              type: "genfrac",
              mode: n.mode,
              numer: a,
              denom: i,
              continued: !1,
              hasBarLine: r,
              barSize: m,
              leftDelim: s,
              rightDelim: h,
              size: u
            };
          },
          htmlBuilder: _r,
          mathmlBuilder: Yr
        }), Ze({
          type: "infix",
          names: ["\\above"],
          props: {
            numArgs: 1,
            argTypes: ["size"],
            infix: !0
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = (e.funcName, e.token);
            return {
              type: "infix",
              mode: r.mode,
              replaceWith: "\\\\abovefrac",
              size: qt(t[0], "size").value,
              token: n
            };
          }
        }), Ze({
          type: "genfrac",
          names: ["\\\\abovefrac"],
          props: {
            numArgs: 3,
            argTypes: ["math", "size", "math"]
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = (e.funcName, t[0]),
              a = function (e) {
                if (!e) throw new Error("Expected non-null, but got " + String(e));
                return e;
              }(qt(t[1], "infix").size),
              i = t[2],
              o = a.number > 0;
            return {
              type: "genfrac",
              mode: r.mode,
              numer: n,
              denom: i,
              continued: !1,
              hasBarLine: o,
              barSize: a,
              leftDelim: null,
              rightDelim: null,
              size: "auto"
            };
          },
          htmlBuilder: _r,
          mathmlBuilder: Yr
        });
        var jr = function jr(e, t) {
          var r,
            n,
            a = t.style;
          "supsub" === e.type ? (r = e.sup ? ct(e.sup, t.havingStyle(a.sup()), t) : ct(e.sub, t.havingStyle(a.sub()), t), n = qt(e.base, "horizBrace")) : n = qt(e, "horizBrace");
          var i,
            o = ct(n.base, t.havingBaseStyle(x.DISPLAY)),
            s = Nt(n, t);
          if (n.isOver ? (i = Ve.makeVList({
            positionType: "firstBaseline",
            children: [{
              type: "elem",
              elem: o
            }, {
              type: "kern",
              size: .1
            }, {
              type: "elem",
              elem: s
            }]
          }, t)).children[0].children[0].children[1].classes.push("svg-align") : (i = Ve.makeVList({
            positionType: "bottom",
            positionData: o.depth + .1 + s.height,
            children: [{
              type: "elem",
              elem: s
            }, {
              type: "kern",
              size: .1
            }, {
              type: "elem",
              elem: o
            }]
          }, t)).children[0].children[0].children[0].classes.push("svg-align"), r) {
            var l = Ve.makeSpan(["mord", n.isOver ? "mover" : "munder"], [i], t);
            i = n.isOver ? Ve.makeVList({
              positionType: "firstBaseline",
              children: [{
                type: "elem",
                elem: l
              }, {
                type: "kern",
                size: .2
              }, {
                type: "elem",
                elem: r
              }]
            }, t) : Ve.makeVList({
              positionType: "bottom",
              positionData: l.depth + .2 + r.height + r.depth,
              children: [{
                type: "elem",
                elem: r
              }, {
                type: "kern",
                size: .2
              }, {
                type: "elem",
                elem: l
              }]
            }, t);
          }
          return Ve.makeSpan(["mord", n.isOver ? "mover" : "munder"], [i], t);
        };
        Ze({
          type: "horizBrace",
          names: ["\\overbrace", "\\underbrace"],
          props: {
            numArgs: 1
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = e.funcName;
            return {
              type: "horizBrace",
              mode: r.mode,
              label: n,
              isOver: /^\\over/.test(n),
              base: t[0]
            };
          },
          htmlBuilder: jr,
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = Ct(e.label);
            return new gt.MathNode(e.isOver ? "mover" : "munder", [kt(e.base, t), r]);
          }
        }), Ze({
          type: "href",
          names: ["\\href"],
          props: {
            numArgs: 2,
            argTypes: ["url", "original"],
            allowedInText: !0
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = t[1],
              a = qt(t[0], "url").url;
            return r.settings.isTrusted({
              command: "\\href",
              url: a
            }) ? {
              type: "href",
              mode: r.mode,
              href: a,
              body: Qe(n)
            } : r.formatUnsupportedCmd("\\href");
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r = it(e.body, t, !1);
            return Ve.makeAnchor(e.href, [], r, t);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = wt(e.body, t);
            return r instanceof dt || (r = new dt("mrow", [r])), r.setAttribute("href", e.href), r;
          }
        }), Ze({
          type: "href",
          names: ["\\url"],
          props: {
            numArgs: 1,
            argTypes: ["url"],
            allowedInText: !0
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = qt(t[0], "url").url;
            if (!r.settings.isTrusted({
              command: "\\url",
              url: n
            })) return r.formatUnsupportedCmd("\\url");
            for (var a = [], i = 0; i < n.length; i++) {
              var o = n[i];
              "~" === o && (o = "\\textasciitilde"), a.push({
                type: "textord",
                mode: "text",
                text: o
              });
            }
            var s = {
              type: "text",
              mode: r.mode,
              font: "\\texttt",
              body: a
            };
            return {
              type: "href",
              mode: r.mode,
              href: n,
              body: Qe(s)
            };
          }
        }), Ze({
          type: "hbox",
          names: ["\\hbox"],
          props: {
            numArgs: 1,
            argTypes: ["text"],
            allowedInText: !0,
            primitive: !0
          },
          handler: function handler(e, t) {
            return {
              type: "hbox",
              mode: e.parser.mode,
              body: Qe(t[0])
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r = it(e.body, t, !1);
            return Ve.makeFragment(r);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            return new gt.MathNode("mrow", xt(e.body, t));
          }
        }), Ze({
          type: "html",
          names: ["\\htmlClass", "\\htmlId", "\\htmlStyle", "\\htmlData"],
          props: {
            numArgs: 2,
            argTypes: ["raw", "original"],
            allowedInText: !0
          },
          handler: function handler(e, t) {
            var r,
              a = e.parser,
              i = e.funcName,
              o = (e.token, qt(t[0], "raw").string),
              s = t[1];
            a.settings.strict && a.settings.reportNonstrict("htmlExtension", "HTML extension is disabled on strict mode");
            var l = {};
            switch (i) {
              case "\\htmlClass":
                l.class = o, r = {
                  command: "\\htmlClass",
                  class: o
                };
                break;
              case "\\htmlId":
                l.id = o, r = {
                  command: "\\htmlId",
                  id: o
                };
                break;
              case "\\htmlStyle":
                l.style = o, r = {
                  command: "\\htmlStyle",
                  style: o
                };
                break;
              case "\\htmlData":
                for (var h = o.split(","), c = 0; c < h.length; c++) {
                  var m = h[c].split("=");
                  if (2 !== m.length) throw new n("Error parsing key-value for \\htmlData");
                  l["data-" + m[0].trim()] = m[1].trim();
                }
                r = {
                  command: "\\htmlData",
                  attributes: l
                };
                break;
              default:
                throw new Error("Unrecognized html command");
            }
            return a.settings.isTrusted(r) ? {
              type: "html",
              mode: a.mode,
              attributes: l,
              body: Qe(s)
            } : a.formatUnsupportedCmd(i);
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r = it(e.body, t, !1),
              n = ["enclosing"];
            e.attributes.class && n.push.apply(n, e.attributes.class.trim().split(/\s+/));
            var a = Ve.makeSpan(n, r, t);
            for (var i in e.attributes) {
              "class" !== i && e.attributes.hasOwnProperty(i) && a.setAttribute(i, e.attributes[i]);
            }
            return a;
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            return wt(e.body, t);
          }
        }), Ze({
          type: "htmlmathml",
          names: ["\\html@mathml"],
          props: {
            numArgs: 2,
            allowedInText: !0
          },
          handler: function handler(e, t) {
            return {
              type: "htmlmathml",
              mode: e.parser.mode,
              html: Qe(t[0]),
              mathml: Qe(t[1])
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r = it(e.html, t, !1);
            return Ve.makeFragment(r);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            return wt(e.mathml, t);
          }
        });
        var $r = function $r(e) {
          if (/^[-+]? *(\d+(\.\d*)?|\.\d+)$/.test(e)) return {
            number: +e,
            unit: "bp"
          };
          var t = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(e);
          if (!t) throw new n("Invalid size: '" + e + "' in \\includegraphics");
          var r = {
            number: +(t[1] + t[2]),
            unit: t[3]
          };
          if (!D(r)) throw new n("Invalid unit: '" + r.unit + "' in \\includegraphics.");
          return r;
        };
        Ze({
          type: "includegraphics",
          names: ["\\includegraphics"],
          props: {
            numArgs: 1,
            numOptionalArgs: 1,
            argTypes: ["raw", "url"],
            allowedInText: !1
          },
          handler: function handler(e, t, r) {
            var a = e.parser,
              i = {
                number: 0,
                unit: "em"
              },
              o = {
                number: .9,
                unit: "em"
              },
              s = {
                number: 0,
                unit: "em"
              },
              l = "";
            if (r[0]) for (var h = qt(r[0], "raw").string.split(","), c = 0; c < h.length; c++) {
              var m = h[c].split("=");
              if (2 === m.length) {
                var u = m[1].trim();
                switch (m[0].trim()) {
                  case "alt":
                    l = u;
                    break;
                  case "width":
                    i = $r(u);
                    break;
                  case "height":
                    o = $r(u);
                    break;
                  case "totalheight":
                    s = $r(u);
                    break;
                  default:
                    throw new n("Invalid key: '" + m[0] + "' in \\includegraphics.");
                }
              }
            }
            var p = qt(t[0], "url").url;
            return "" === l && (l = (l = (l = p).replace(/^.*[\\/]/, "")).substring(0, l.lastIndexOf("."))), a.settings.isTrusted({
              command: "\\includegraphics",
              url: p
            }) ? {
              type: "includegraphics",
              mode: a.mode,
              alt: l,
              width: i,
              height: o,
              totalheight: s,
              src: p
            } : a.formatUnsupportedCmd("\\includegraphics");
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r = P(e.height, t),
              n = 0;
            e.totalheight.number > 0 && (n = P(e.totalheight, t) - r);
            var a = 0;
            e.width.number > 0 && (a = P(e.width, t));
            var i = {
              height: F(r + n)
            };
            a > 0 && (i.width = F(a)), n > 0 && (i.verticalAlign = F(-n));
            var o = new W(e.src, e.alt, i);
            return o.height = r, o.depth = n, o;
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = new gt.MathNode("mglyph", []);
            r.setAttribute("alt", e.alt);
            var n = P(e.height, t),
              a = 0;
            if (e.totalheight.number > 0 && (a = P(e.totalheight, t) - n, r.setAttribute("valign", F(-a))), r.setAttribute("height", F(n + a)), e.width.number > 0) {
              var i = P(e.width, t);
              r.setAttribute("width", F(i));
            }
            return r.setAttribute("src", e.src), r;
          }
        }), Ze({
          type: "kern",
          names: ["\\kern", "\\mkern", "\\hskip", "\\mskip"],
          props: {
            numArgs: 1,
            argTypes: ["size"],
            primitive: !0,
            allowedInText: !0
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = e.funcName,
              a = qt(t[0], "size");
            if (r.settings.strict) {
              var i = "m" === n[1],
                o = "mu" === a.value.unit;
              i ? (o || r.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + n + " supports only mu units, not " + a.value.unit + " units"), "math" !== r.mode && r.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + n + " works only in math mode")) : o && r.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + n + " doesn't support mu units");
            }
            return {
              type: "kern",
              mode: r.mode,
              dimension: a.value
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            return Ve.makeGlue(e.dimension, t);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = P(e.dimension, t);
            return new gt.SpaceNode(r);
          }
        }), Ze({
          type: "lap",
          names: ["\\mathllap", "\\mathrlap", "\\mathclap"],
          props: {
            numArgs: 1,
            allowedInText: !0
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = e.funcName,
              a = t[0];
            return {
              type: "lap",
              mode: r.mode,
              alignment: n.slice(5),
              body: a
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r;
            "clap" === e.alignment ? (r = Ve.makeSpan([], [ct(e.body, t)]), r = Ve.makeSpan(["inner"], [r], t)) : r = Ve.makeSpan(["inner"], [ct(e.body, t)]);
            var n = Ve.makeSpan(["fix"], []),
              a = Ve.makeSpan([e.alignment], [r, n], t),
              i = Ve.makeSpan(["strut"]);
            return i.style.height = F(a.height + a.depth), a.depth && (i.style.verticalAlign = F(-a.depth)), a.children.unshift(i), a = Ve.makeSpan(["thinbox"], [a], t), Ve.makeSpan(["mord", "vbox"], [a], t);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = new gt.MathNode("mpadded", [kt(e.body, t)]);
            if ("rlap" !== e.alignment) {
              var n = "llap" === e.alignment ? "-1" : "-0.5";
              r.setAttribute("lspace", n + "width");
            }
            return r.setAttribute("width", "0px"), r;
          }
        }), Ze({
          type: "styling",
          names: ["\\(", "$"],
          props: {
            numArgs: 0,
            allowedInText: !0,
            allowedInMath: !1
          },
          handler: function handler(e, t) {
            var r = e.funcName,
              n = e.parser,
              a = n.mode;
            n.switchMode("math");
            var i = "\\(" === r ? "\\)" : "$",
              o = n.parseExpression(!1, i);
            return n.expect(i), n.switchMode(a), {
              type: "styling",
              mode: n.mode,
              style: "text",
              body: o
            };
          }
        }), Ze({
          type: "text",
          names: ["\\)", "\\]"],
          props: {
            numArgs: 0,
            allowedInText: !0,
            allowedInMath: !1
          },
          handler: function handler(e, t) {
            throw new n("Mismatched " + e.funcName);
          }
        });
        var Zr = function Zr(e, t) {
          switch (t.style.size) {
            case x.DISPLAY.size:
              return e.display;
            case x.TEXT.size:
              return e.text;
            case x.SCRIPT.size:
              return e.script;
            case x.SCRIPTSCRIPT.size:
              return e.scriptscript;
            default:
              return e.text;
          }
        };
        Ze({
          type: "mathchoice",
          names: ["\\mathchoice"],
          props: {
            numArgs: 4,
            primitive: !0
          },
          handler: function handler(e, t) {
            return {
              type: "mathchoice",
              mode: e.parser.mode,
              display: Qe(t[0]),
              text: Qe(t[1]),
              script: Qe(t[2]),
              scriptscript: Qe(t[3])
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r = Zr(e, t),
              n = it(r, t, !1);
            return Ve.makeFragment(n);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = Zr(e, t);
            return wt(r, t);
          }
        });
        var Kr = function Kr(e, t, r, n, a, i, o) {
            e = Ve.makeSpan([], [e]);
            var s,
              h,
              c,
              m = r && l.isCharacterBox(r);
            if (t) {
              var u = ct(t, n.havingStyle(a.sup()), n);
              h = {
                elem: u,
                kern: Math.max(n.fontMetrics().bigOpSpacing1, n.fontMetrics().bigOpSpacing3 - u.depth)
              };
            }
            if (r) {
              var p = ct(r, n.havingStyle(a.sub()), n);
              s = {
                elem: p,
                kern: Math.max(n.fontMetrics().bigOpSpacing2, n.fontMetrics().bigOpSpacing4 - p.height)
              };
            }
            if (h && s) {
              var d = n.fontMetrics().bigOpSpacing5 + s.elem.height + s.elem.depth + s.kern + e.depth + o;
              c = Ve.makeVList({
                positionType: "bottom",
                positionData: d,
                children: [{
                  type: "kern",
                  size: n.fontMetrics().bigOpSpacing5
                }, {
                  type: "elem",
                  elem: s.elem,
                  marginLeft: F(-i)
                }, {
                  type: "kern",
                  size: s.kern
                }, {
                  type: "elem",
                  elem: e
                }, {
                  type: "kern",
                  size: h.kern
                }, {
                  type: "elem",
                  elem: h.elem,
                  marginLeft: F(i)
                }, {
                  type: "kern",
                  size: n.fontMetrics().bigOpSpacing5
                }]
              }, n);
            } else if (s) {
              var f = e.height - o;
              c = Ve.makeVList({
                positionType: "top",
                positionData: f,
                children: [{
                  type: "kern",
                  size: n.fontMetrics().bigOpSpacing5
                }, {
                  type: "elem",
                  elem: s.elem,
                  marginLeft: F(-i)
                }, {
                  type: "kern",
                  size: s.kern
                }, {
                  type: "elem",
                  elem: e
                }]
              }, n);
            } else {
              if (!h) return e;
              var g = e.depth + o;
              c = Ve.makeVList({
                positionType: "bottom",
                positionData: g,
                children: [{
                  type: "elem",
                  elem: e
                }, {
                  type: "kern",
                  size: h.kern
                }, {
                  type: "elem",
                  elem: h.elem,
                  marginLeft: F(i)
                }, {
                  type: "kern",
                  size: n.fontMetrics().bigOpSpacing5
                }]
              }, n);
            }
            var v = [c];
            if (s && 0 !== i && !m) {
              var y = Ve.makeSpan(["mspace"], [], n);
              y.style.marginRight = F(i), v.unshift(y);
            }
            return Ve.makeSpan(["mop", "op-limits"], v, n);
          },
          Jr = ["\\smallint"],
          Qr = function Qr(e, t) {
            var r,
              n,
              a,
              i = !1;
            "supsub" === e.type ? (r = e.sup, n = e.sub, a = qt(e.base, "op"), i = !0) : a = qt(e, "op");
            var o,
              s = t.style,
              h = !1;
            if (s.size === x.DISPLAY.size && a.symbol && !l.contains(Jr, a.name) && (h = !0), a.symbol) {
              var c = h ? "Size2-Regular" : "Size1-Regular",
                m = "";
              if ("\\oiint" !== a.name && "\\oiiint" !== a.name || (m = a.name.substr(1), a.name = "oiint" === m ? "\\iint" : "\\iiint"), o = Ve.makeSymbol(a.name, c, "math", t, ["mop", "op-symbol", h ? "large-op" : "small-op"]), m.length > 0) {
                var u = o.italic,
                  p = Ve.staticSvg(m + "Size" + (h ? "2" : "1"), t);
                o = Ve.makeVList({
                  positionType: "individualShift",
                  children: [{
                    type: "elem",
                    elem: o,
                    shift: 0
                  }, {
                    type: "elem",
                    elem: p,
                    shift: h ? .08 : 0
                  }]
                }, t), a.name = "\\" + m, o.classes.unshift("mop"), o.italic = u;
              }
            } else if (a.body) {
              var d = it(a.body, t, !0);
              1 === d.length && d[0] instanceof $ ? (o = d[0]).classes[0] = "mop" : o = Ve.makeSpan(["mop"], d, t);
            } else {
              for (var f = [], g = 1; g < a.name.length; g++) {
                f.push(Ve.mathsym(a.name[g], a.mode, t));
              }
              o = Ve.makeSpan(["mop"], f, t);
            }
            var v = 0,
              y = 0;
            return (o instanceof $ || "\\oiint" === a.name || "\\oiiint" === a.name) && !a.suppressBaseShift && (v = (o.height - o.depth) / 2 - t.fontMetrics().axisHeight, y = o.italic), i ? Kr(o, r, n, t, s, y, v) : (v && (o.style.position = "relative", o.style.top = F(v)), o);
          },
          en = function en(e, t) {
            var r;
            if (e.symbol) r = new dt("mo", [vt(e.name, e.mode)]), l.contains(Jr, e.name) && r.setAttribute("largeop", "false");else if (e.body) r = new dt("mo", xt(e.body, t));else {
              r = new dt("mi", [new ft(e.name.slice(1))]);
              var n = new dt("mo", [vt("⁡", "text")]);
              r = e.parentIsSupSub ? new dt("mrow", [r, n]) : pt([r, n]);
            }
            return r;
          },
          tn = {
            "∏": "\\prod",
            "∐": "\\coprod",
            "∑": "\\sum",
            "⋀": "\\bigwedge",
            "⋁": "\\bigvee",
            "⋂": "\\bigcap",
            "⋃": "\\bigcup",
            "⨀": "\\bigodot",
            "⨁": "\\bigoplus",
            "⨂": "\\bigotimes",
            "⨄": "\\biguplus",
            "⨆": "\\bigsqcup"
          };
        Ze({
          type: "op",
          names: ["\\coprod", "\\bigvee", "\\bigwedge", "\\biguplus", "\\bigcap", "\\bigcup", "\\intop", "\\prod", "\\sum", "\\bigotimes", "\\bigoplus", "\\bigodot", "\\bigsqcup", "\\smallint", "∏", "∐", "∑", "⋀", "⋁", "⋂", "⋃", "⨀", "⨁", "⨂", "⨄", "⨆"],
          props: {
            numArgs: 0
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = e.funcName;
            return 1 === n.length && (n = tn[n]), {
              type: "op",
              mode: r.mode,
              limits: !0,
              parentIsSupSub: !1,
              symbol: !0,
              name: n
            };
          },
          htmlBuilder: Qr,
          mathmlBuilder: en
        }), Ze({
          type: "op",
          names: ["\\mathop"],
          props: {
            numArgs: 1,
            primitive: !0
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = t[0];
            return {
              type: "op",
              mode: r.mode,
              limits: !1,
              parentIsSupSub: !1,
              symbol: !1,
              body: Qe(n)
            };
          },
          htmlBuilder: Qr,
          mathmlBuilder: en
        });
        var rn = {
          "∫": "\\int",
          "∬": "\\iint",
          "∭": "\\iiint",
          "∮": "\\oint",
          "∯": "\\oiint",
          "∰": "\\oiiint"
        };
        Ze({
          type: "op",
          names: ["\\arcsin", "\\arccos", "\\arctan", "\\arctg", "\\arcctg", "\\arg", "\\ch", "\\cos", "\\cosec", "\\cosh", "\\cot", "\\cotg", "\\coth", "\\csc", "\\ctg", "\\cth", "\\deg", "\\dim", "\\exp", "\\hom", "\\ker", "\\lg", "\\ln", "\\log", "\\sec", "\\sin", "\\sinh", "\\sh", "\\tan", "\\tanh", "\\tg", "\\th"],
          props: {
            numArgs: 0
          },
          handler: function handler(e) {
            var t = e.parser,
              r = e.funcName;
            return {
              type: "op",
              mode: t.mode,
              limits: !1,
              parentIsSupSub: !1,
              symbol: !1,
              name: r
            };
          },
          htmlBuilder: Qr,
          mathmlBuilder: en
        }), Ze({
          type: "op",
          names: ["\\det", "\\gcd", "\\inf", "\\lim", "\\max", "\\min", "\\Pr", "\\sup"],
          props: {
            numArgs: 0
          },
          handler: function handler(e) {
            var t = e.parser,
              r = e.funcName;
            return {
              type: "op",
              mode: t.mode,
              limits: !0,
              parentIsSupSub: !1,
              symbol: !1,
              name: r
            };
          },
          htmlBuilder: Qr,
          mathmlBuilder: en
        }), Ze({
          type: "op",
          names: ["\\int", "\\iint", "\\iiint", "\\oint", "\\oiint", "\\oiiint", "∫", "∬", "∭", "∮", "∯", "∰"],
          props: {
            numArgs: 0
          },
          handler: function handler(e) {
            var t = e.parser,
              r = e.funcName;
            return 1 === r.length && (r = rn[r]), {
              type: "op",
              mode: t.mode,
              limits: !1,
              parentIsSupSub: !1,
              symbol: !0,
              name: r
            };
          },
          htmlBuilder: Qr,
          mathmlBuilder: en
        });
        var nn = function nn(e, t) {
          var r,
            n,
            a,
            i,
            o = !1;
          if ("supsub" === e.type ? (r = e.sup, n = e.sub, a = qt(e.base, "operatorname"), o = !0) : a = qt(e, "operatorname"), a.body.length > 0) {
            for (var s = a.body.map(function (e) {
                var t = e.text;
                return "string" == typeof t ? {
                  type: "textord",
                  mode: e.mode,
                  text: t
                } : e;
              }), l = it(s, t.withFont("mathrm"), !0), h = 0; h < l.length; h++) {
              var c = l[h];
              c instanceof $ && (c.text = c.text.replace(/\u2212/, "-").replace(/\u2217/, "*"));
            }
            i = Ve.makeSpan(["mop"], l, t);
          } else i = Ve.makeSpan(["mop"], [], t);
          return o ? Kr(i, r, n, t, t.style, 0, 0) : i;
        };
        function an(e, t, r) {
          for (var n = it(e, t, !1), a = t.sizeMultiplier / r.sizeMultiplier, i = 0; i < n.length; i++) {
            var o = n[i].classes.indexOf("sizing");
            o < 0 ? Array.prototype.push.apply(n[i].classes, t.sizingClasses(r)) : n[i].classes[o + 1] === "reset-size" + t.size && (n[i].classes[o + 1] = "reset-size" + r.size), n[i].height *= a, n[i].depth *= a;
          }
          return Ve.makeFragment(n);
        }
        Ze({
          type: "operatorname",
          names: ["\\operatorname@", "\\operatornamewithlimits"],
          props: {
            numArgs: 1
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = e.funcName,
              a = t[0];
            return {
              type: "operatorname",
              mode: r.mode,
              body: Qe(a),
              alwaysHandleSupSub: "\\operatornamewithlimits" === n,
              limits: !1,
              parentIsSupSub: !1
            };
          },
          htmlBuilder: nn,
          mathmlBuilder: function mathmlBuilder(e, t) {
            for (var r = xt(e.body, t.withFont("mathrm")), n = !0, a = 0; a < r.length; a++) {
              var i = r[a];
              if (i instanceof gt.SpaceNode) ;else if (i instanceof gt.MathNode) switch (i.type) {
                case "mi":
                case "mn":
                case "ms":
                case "mspace":
                case "mtext":
                  break;
                case "mo":
                  var o = i.children[0];
                  1 === i.children.length && o instanceof gt.TextNode ? o.text = o.text.replace(/\u2212/, "-").replace(/\u2217/, "*") : n = !1;
                  break;
                default:
                  n = !1;
              } else n = !1;
            }
            if (n) {
              var s = r.map(function (e) {
                return e.toText();
              }).join("");
              r = [new gt.TextNode(s)];
            }
            var l = new gt.MathNode("mi", r);
            l.setAttribute("mathvariant", "normal");
            var h = new gt.MathNode("mo", [vt("⁡", "text")]);
            return e.parentIsSupSub ? new gt.MathNode("mrow", [l, h]) : gt.newDocumentFragment([l, h]);
          }
        }), Sr("\\operatorname", "\\@ifstar\\operatornamewithlimits\\operatorname@"), Ke({
          type: "ordgroup",
          htmlBuilder: function htmlBuilder(e, t) {
            return e.semisimple ? Ve.makeFragment(it(e.body, t, !1)) : Ve.makeSpan(["mord"], it(e.body, t, !0), t);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            return wt(e.body, t, !0);
          }
        }), Ze({
          type: "overline",
          names: ["\\overline"],
          props: {
            numArgs: 1
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = t[0];
            return {
              type: "overline",
              mode: r.mode,
              body: n
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r = ct(e.body, t.havingCrampedStyle()),
              n = Ve.makeLineSpan("overline-line", t),
              a = t.fontMetrics().defaultRuleThickness,
              i = Ve.makeVList({
                positionType: "firstBaseline",
                children: [{
                  type: "elem",
                  elem: r
                }, {
                  type: "kern",
                  size: 3 * a
                }, {
                  type: "elem",
                  elem: n
                }, {
                  type: "kern",
                  size: a
                }]
              }, t);
            return Ve.makeSpan(["mord", "overline"], [i], t);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = new gt.MathNode("mo", [new gt.TextNode("‾")]);
            r.setAttribute("stretchy", "true");
            var n = new gt.MathNode("mover", [kt(e.body, t), r]);
            return n.setAttribute("accent", "true"), n;
          }
        }), Ze({
          type: "phantom",
          names: ["\\phantom"],
          props: {
            numArgs: 1,
            allowedInText: !0
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = t[0];
            return {
              type: "phantom",
              mode: r.mode,
              body: Qe(n)
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r = it(e.body, t.withPhantom(), !1);
            return Ve.makeFragment(r);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = xt(e.body, t);
            return new gt.MathNode("mphantom", r);
          }
        }), Ze({
          type: "hphantom",
          names: ["\\hphantom"],
          props: {
            numArgs: 1,
            allowedInText: !0
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = t[0];
            return {
              type: "hphantom",
              mode: r.mode,
              body: n
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r = Ve.makeSpan([], [ct(e.body, t.withPhantom())]);
            if (r.height = 0, r.depth = 0, r.children) for (var n = 0; n < r.children.length; n++) {
              r.children[n].height = 0, r.children[n].depth = 0;
            }
            return r = Ve.makeVList({
              positionType: "firstBaseline",
              children: [{
                type: "elem",
                elem: r
              }]
            }, t), Ve.makeSpan(["mord"], [r], t);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = xt(Qe(e.body), t),
              n = new gt.MathNode("mphantom", r),
              a = new gt.MathNode("mpadded", [n]);
            return a.setAttribute("height", "0px"), a.setAttribute("depth", "0px"), a;
          }
        }), Ze({
          type: "vphantom",
          names: ["\\vphantom"],
          props: {
            numArgs: 1,
            allowedInText: !0
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = t[0];
            return {
              type: "vphantom",
              mode: r.mode,
              body: n
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r = Ve.makeSpan(["inner"], [ct(e.body, t.withPhantom())]),
              n = Ve.makeSpan(["fix"], []);
            return Ve.makeSpan(["mord", "rlap"], [r, n], t);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = xt(Qe(e.body), t),
              n = new gt.MathNode("mphantom", r),
              a = new gt.MathNode("mpadded", [n]);
            return a.setAttribute("width", "0px"), a;
          }
        }), Ze({
          type: "raisebox",
          names: ["\\raisebox"],
          props: {
            numArgs: 2,
            argTypes: ["size", "hbox"],
            allowedInText: !0
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = qt(t[0], "size").value,
              a = t[1];
            return {
              type: "raisebox",
              mode: r.mode,
              dy: n,
              body: a
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r = ct(e.body, t),
              n = P(e.dy, t);
            return Ve.makeVList({
              positionType: "shift",
              positionData: -n,
              children: [{
                type: "elem",
                elem: r
              }]
            }, t);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = new gt.MathNode("mpadded", [kt(e.body, t)]),
              n = e.dy.number + e.dy.unit;
            return r.setAttribute("voffset", n), r;
          }
        }), Ze({
          type: "internal",
          names: ["\\relax"],
          props: {
            numArgs: 0,
            allowedInText: !0
          },
          handler: function handler(e) {
            return {
              type: "internal",
              mode: e.parser.mode
            };
          }
        }), Ze({
          type: "rule",
          names: ["\\rule"],
          props: {
            numArgs: 2,
            numOptionalArgs: 1,
            argTypes: ["size", "size", "size"]
          },
          handler: function handler(e, t, r) {
            var n = e.parser,
              a = r[0],
              i = qt(t[0], "size"),
              o = qt(t[1], "size");
            return {
              type: "rule",
              mode: n.mode,
              shift: a && qt(a, "size").value,
              width: i.value,
              height: o.value
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r = Ve.makeSpan(["mord", "rule"], [], t),
              n = P(e.width, t),
              a = P(e.height, t),
              i = e.shift ? P(e.shift, t) : 0;
            return r.style.borderRightWidth = F(n), r.style.borderTopWidth = F(a), r.style.bottom = F(i), r.width = n, r.height = a + i, r.depth = -i, r.maxFontSize = 1.125 * a * t.sizeMultiplier, r;
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = P(e.width, t),
              n = P(e.height, t),
              a = e.shift ? P(e.shift, t) : 0,
              i = t.color && t.getColor() || "black",
              o = new gt.MathNode("mspace");
            o.setAttribute("mathbackground", i), o.setAttribute("width", F(r)), o.setAttribute("height", F(n));
            var s = new gt.MathNode("mpadded", [o]);
            return a >= 0 ? s.setAttribute("height", F(a)) : (s.setAttribute("height", F(a)), s.setAttribute("depth", F(-a))), s.setAttribute("voffset", F(a)), s;
          }
        });
        var on = ["\\tiny", "\\sixptsize", "\\scriptsize", "\\footnotesize", "\\small", "\\normalsize", "\\large", "\\Large", "\\LARGE", "\\huge", "\\Huge"];
        Ze({
          type: "sizing",
          names: on,
          props: {
            numArgs: 0,
            allowedInText: !0
          },
          handler: function handler(e, t) {
            var r = e.breakOnTokenText,
              n = e.funcName,
              a = e.parser,
              i = a.parseExpression(!1, r);
            return {
              type: "sizing",
              mode: a.mode,
              size: on.indexOf(n) + 1,
              body: i
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r = t.havingSize(e.size);
            return an(e.body, r, t);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = t.havingSize(e.size),
              n = xt(e.body, r),
              a = new gt.MathNode("mstyle", n);
            return a.setAttribute("mathsize", F(r.sizeMultiplier)), a;
          }
        }), Ze({
          type: "smash",
          names: ["\\smash"],
          props: {
            numArgs: 1,
            numOptionalArgs: 1,
            allowedInText: !0
          },
          handler: function handler(e, t, r) {
            var n = e.parser,
              a = !1,
              i = !1,
              o = r[0] && qt(r[0], "ordgroup");
            if (o) for (var s = "", l = 0; l < o.body.length; ++l) {
              if ("t" === (s = o.body[l].text)) a = !0;else {
                if ("b" !== s) {
                  a = !1, i = !1;
                  break;
                }
                i = !0;
              }
            } else a = !0, i = !0;
            var h = t[0];
            return {
              type: "smash",
              mode: n.mode,
              body: h,
              smashHeight: a,
              smashDepth: i
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r = Ve.makeSpan([], [ct(e.body, t)]);
            if (!e.smashHeight && !e.smashDepth) return r;
            if (e.smashHeight && (r.height = 0, r.children)) for (var n = 0; n < r.children.length; n++) {
              r.children[n].height = 0;
            }
            if (e.smashDepth && (r.depth = 0, r.children)) for (var a = 0; a < r.children.length; a++) {
              r.children[a].depth = 0;
            }
            var i = Ve.makeVList({
              positionType: "firstBaseline",
              children: [{
                type: "elem",
                elem: r
              }]
            }, t);
            return Ve.makeSpan(["mord"], [i], t);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = new gt.MathNode("mpadded", [kt(e.body, t)]);
            return e.smashHeight && r.setAttribute("height", "0px"), e.smashDepth && r.setAttribute("depth", "0px"), r;
          }
        }), Ze({
          type: "sqrt",
          names: ["\\sqrt"],
          props: {
            numArgs: 1,
            numOptionalArgs: 1
          },
          handler: function handler(e, t, r) {
            var n = e.parser,
              a = r[0],
              i = t[0];
            return {
              type: "sqrt",
              mode: n.mode,
              body: i,
              index: a
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r = ct(e.body, t.havingCrampedStyle());
            0 === r.height && (r.height = t.fontMetrics().xHeight), r = Ve.wrapFragment(r, t);
            var n = t.fontMetrics().defaultRuleThickness,
              a = n;
            t.style.id < x.TEXT.id && (a = t.fontMetrics().xHeight);
            var i = n + a / 4,
              o = r.height + r.depth + i + n,
              s = pr.sqrtImage(o, t),
              l = s.span,
              h = s.ruleWidth,
              c = s.advanceWidth,
              m = l.height - h;
            m > r.height + r.depth + i && (i = (i + m - r.height - r.depth) / 2);
            var u = l.height - r.height - i - h;
            r.style.paddingLeft = F(c);
            var p = Ve.makeVList({
              positionType: "firstBaseline",
              children: [{
                type: "elem",
                elem: r,
                wrapperClasses: ["svg-align"]
              }, {
                type: "kern",
                size: -(r.height + u)
              }, {
                type: "elem",
                elem: l
              }, {
                type: "kern",
                size: h
              }]
            }, t);
            if (e.index) {
              var d = t.havingStyle(x.SCRIPTSCRIPT),
                f = ct(e.index, d, t),
                g = .6 * (p.height - p.depth),
                v = Ve.makeVList({
                  positionType: "shift",
                  positionData: -g,
                  children: [{
                    type: "elem",
                    elem: f
                  }]
                }, t),
                y = Ve.makeSpan(["root"], [v]);
              return Ve.makeSpan(["mord", "sqrt"], [y, p], t);
            }
            return Ve.makeSpan(["mord", "sqrt"], [p], t);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = e.body,
              n = e.index;
            return n ? new gt.MathNode("mroot", [kt(r, t), kt(n, t)]) : new gt.MathNode("msqrt", [kt(r, t)]);
          }
        });
        var sn = {
          display: x.DISPLAY,
          text: x.TEXT,
          script: x.SCRIPT,
          scriptscript: x.SCRIPTSCRIPT
        };
        Ze({
          type: "styling",
          names: ["\\displaystyle", "\\textstyle", "\\scriptstyle", "\\scriptscriptstyle"],
          props: {
            numArgs: 0,
            allowedInText: !0,
            primitive: !0
          },
          handler: function handler(e, t) {
            var r = e.breakOnTokenText,
              n = e.funcName,
              a = e.parser,
              i = a.parseExpression(!0, r),
              o = n.slice(1, n.length - 5);
            return {
              type: "styling",
              mode: a.mode,
              style: o,
              body: i
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r = sn[e.style],
              n = t.havingStyle(r).withFont("");
            return an(e.body, n, t);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = sn[e.style],
              n = t.havingStyle(r),
              a = xt(e.body, n),
              i = new gt.MathNode("mstyle", a),
              o = {
                display: ["0", "true"],
                text: ["0", "false"],
                script: ["1", "false"],
                scriptscript: ["2", "false"]
              }[e.style];
            return i.setAttribute("scriptlevel", o[0]), i.setAttribute("displaystyle", o[1]), i;
          }
        });
        var ln = function ln(e, t) {
          var r = e.base;
          return r ? "op" === r.type ? r.limits && (t.style.size === x.DISPLAY.size || r.alwaysHandleSupSub) ? Qr : null : "operatorname" === r.type ? r.alwaysHandleSupSub && (t.style.size === x.DISPLAY.size || r.limits) ? nn : null : "accent" === r.type ? l.isCharacterBox(r.base) ? Rt : null : "horizBrace" === r.type && !e.sub === r.isOver ? jr : null : null;
        };
        Ke({
          type: "supsub",
          htmlBuilder: function htmlBuilder(e, t) {
            var r = ln(e, t);
            if (r) return r(e, t);
            var n,
              a,
              i,
              o = e.base,
              s = e.sup,
              h = e.sub,
              c = ct(o, t),
              m = t.fontMetrics(),
              u = 0,
              p = 0,
              d = o && l.isCharacterBox(o);
            if (s) {
              var f = t.havingStyle(t.style.sup());
              n = ct(s, f, t), d || (u = c.height - f.fontMetrics().supDrop * f.sizeMultiplier / t.sizeMultiplier);
            }
            if (h) {
              var g = t.havingStyle(t.style.sub());
              a = ct(h, g, t), d || (p = c.depth + g.fontMetrics().subDrop * g.sizeMultiplier / t.sizeMultiplier);
            }
            i = t.style === x.DISPLAY ? m.sup1 : t.style.cramped ? m.sup3 : m.sup2;
            var v,
              y = t.sizeMultiplier,
              b = F(.5 / m.ptPerEm / y),
              w = null;
            if (a) {
              var k = e.base && "op" === e.base.type && e.base.name && ("\\oiint" === e.base.name || "\\oiiint" === e.base.name);
              (c instanceof $ || k) && (w = F(-c.italic));
            }
            if (n && a) {
              u = Math.max(u, i, n.depth + .25 * m.xHeight), p = Math.max(p, m.sub2);
              var S = 4 * m.defaultRuleThickness;
              if (u - n.depth - (a.height - p) < S) {
                p = S - (u - n.depth) + a.height;
                var M = .8 * m.xHeight - (u - n.depth);
                M > 0 && (u += M, p -= M);
              }
              var z = [{
                type: "elem",
                elem: a,
                shift: p,
                marginRight: b,
                marginLeft: w
              }, {
                type: "elem",
                elem: n,
                shift: -u,
                marginRight: b
              }];
              v = Ve.makeVList({
                positionType: "individualShift",
                children: z
              }, t);
            } else if (a) {
              p = Math.max(p, m.sub1, a.height - .8 * m.xHeight);
              var A = [{
                type: "elem",
                elem: a,
                marginLeft: w,
                marginRight: b
              }];
              v = Ve.makeVList({
                positionType: "shift",
                positionData: p,
                children: A
              }, t);
            } else {
              if (!n) throw new Error("supsub must have either sup or sub.");
              u = Math.max(u, i, n.depth + .25 * m.xHeight), v = Ve.makeVList({
                positionType: "shift",
                positionData: -u,
                children: [{
                  type: "elem",
                  elem: n,
                  marginRight: b
                }]
              }, t);
            }
            var T = lt(c, "right") || "mord";
            return Ve.makeSpan([T], [c, Ve.makeSpan(["msupsub"], [v])], t);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r,
              n = !1;
            e.base && "horizBrace" === e.base.type && !!e.sup === e.base.isOver && (n = !0, r = e.base.isOver), !e.base || "op" !== e.base.type && "operatorname" !== e.base.type || (e.base.parentIsSupSub = !0);
            var a,
              i = [kt(e.base, t)];
            if (e.sub && i.push(kt(e.sub, t)), e.sup && i.push(kt(e.sup, t)), n) a = r ? "mover" : "munder";else if (e.sub) {
              if (e.sup) {
                var o = e.base;
                a = o && "op" === o.type && o.limits && t.style === x.DISPLAY || o && "operatorname" === o.type && o.alwaysHandleSupSub && (t.style === x.DISPLAY || o.limits) ? "munderover" : "msubsup";
              } else {
                var s = e.base;
                a = s && "op" === s.type && s.limits && (t.style === x.DISPLAY || s.alwaysHandleSupSub) || s && "operatorname" === s.type && s.alwaysHandleSupSub && (s.limits || t.style === x.DISPLAY) ? "munder" : "msub";
              }
            } else {
              var l = e.base;
              a = l && "op" === l.type && l.limits && (t.style === x.DISPLAY || l.alwaysHandleSupSub) || l && "operatorname" === l.type && l.alwaysHandleSupSub && (l.limits || t.style === x.DISPLAY) ? "mover" : "msup";
            }
            return new gt.MathNode(a, i);
          }
        }), Ke({
          type: "atom",
          htmlBuilder: function htmlBuilder(e, t) {
            return Ve.mathsym(e.text, e.mode, t, ["m" + e.family]);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = new gt.MathNode("mo", [vt(e.text, e.mode)]);
            if ("bin" === e.family) {
              var n = bt(e, t);
              "bold-italic" === n && r.setAttribute("mathvariant", n);
            } else "punct" === e.family ? r.setAttribute("separator", "true") : "open" !== e.family && "close" !== e.family || r.setAttribute("stretchy", "false");
            return r;
          }
        });
        var hn = {
          mi: "italic",
          mn: "normal",
          mtext: "normal"
        };
        Ke({
          type: "mathord",
          htmlBuilder: function htmlBuilder(e, t) {
            return Ve.makeOrd(e, t, "mathord");
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = new gt.MathNode("mi", [vt(e.text, e.mode, t)]),
              n = bt(e, t) || "italic";
            return n !== hn[r.type] && r.setAttribute("mathvariant", n), r;
          }
        }), Ke({
          type: "textord",
          htmlBuilder: function htmlBuilder(e, t) {
            return Ve.makeOrd(e, t, "textord");
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r,
              n = vt(e.text, e.mode, t),
              a = bt(e, t) || "normal";
            return r = "text" === e.mode ? new gt.MathNode("mtext", [n]) : /[0-9]/.test(e.text) ? new gt.MathNode("mn", [n]) : "\\prime" === e.text ? new gt.MathNode("mo", [n]) : new gt.MathNode("mi", [n]), a !== hn[r.type] && r.setAttribute("mathvariant", a), r;
          }
        });
        var cn = {
            "\\nobreak": "nobreak",
            "\\allowbreak": "allowbreak"
          },
          mn = {
            " ": {},
            "\\ ": {},
            "~": {
              className: "nobreak"
            },
            "\\space": {},
            "\\nobreakspace": {
              className: "nobreak"
            }
          };
        Ke({
          type: "spacing",
          htmlBuilder: function htmlBuilder(e, t) {
            if (mn.hasOwnProperty(e.text)) {
              var r = mn[e.text].className || "";
              if ("text" === e.mode) {
                var a = Ve.makeOrd(e, t, "textord");
                return a.classes.push(r), a;
              }
              return Ve.makeSpan(["mspace", r], [Ve.mathsym(e.text, e.mode, t)], t);
            }
            if (cn.hasOwnProperty(e.text)) return Ve.makeSpan(["mspace", cn[e.text]], [], t);
            throw new n('Unknown type of space "' + e.text + '"');
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            if (!mn.hasOwnProperty(e.text)) {
              if (cn.hasOwnProperty(e.text)) return new gt.MathNode("mspace");
              throw new n('Unknown type of space "' + e.text + '"');
            }
            return new gt.MathNode("mtext", [new gt.TextNode(" ")]);
          }
        });
        var un = function un() {
          var e = new gt.MathNode("mtd", []);
          return e.setAttribute("width", "50%"), e;
        };
        Ke({
          type: "tag",
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = new gt.MathNode("mtable", [new gt.MathNode("mtr", [un(), new gt.MathNode("mtd", [wt(e.body, t)]), un(), new gt.MathNode("mtd", [wt(e.tag, t)])])]);
            return r.setAttribute("width", "100%"), r;
          }
        });
        var pn = {
            "\\text": void 0,
            "\\textrm": "textrm",
            "\\textsf": "textsf",
            "\\texttt": "texttt",
            "\\textnormal": "textrm"
          },
          dn = {
            "\\textbf": "textbf",
            "\\textmd": "textmd"
          },
          fn = {
            "\\textit": "textit",
            "\\textup": "textup"
          },
          gn = function gn(e, t) {
            var r = e.font;
            return r ? pn[r] ? t.withTextFontFamily(pn[r]) : dn[r] ? t.withTextFontWeight(dn[r]) : t.withTextFontShape(fn[r]) : t;
          };
        Ze({
          type: "text",
          names: ["\\text", "\\textrm", "\\textsf", "\\texttt", "\\textnormal", "\\textbf", "\\textmd", "\\textit", "\\textup"],
          props: {
            numArgs: 1,
            argTypes: ["text"],
            allowedInArgument: !0,
            allowedInText: !0
          },
          handler: function handler(e, t) {
            var r = e.parser,
              n = e.funcName,
              a = t[0];
            return {
              type: "text",
              mode: r.mode,
              body: Qe(a),
              font: n
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r = gn(e, t),
              n = it(e.body, r, !0);
            return Ve.makeSpan(["mord", "text"], n, r);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = gn(e, t);
            return wt(e.body, r);
          }
        }), Ze({
          type: "underline",
          names: ["\\underline"],
          props: {
            numArgs: 1,
            allowedInText: !0
          },
          handler: function handler(e, t) {
            return {
              type: "underline",
              mode: e.parser.mode,
              body: t[0]
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r = ct(e.body, t),
              n = Ve.makeLineSpan("underline-line", t),
              a = t.fontMetrics().defaultRuleThickness,
              i = Ve.makeVList({
                positionType: "top",
                positionData: r.height,
                children: [{
                  type: "kern",
                  size: a
                }, {
                  type: "elem",
                  elem: n
                }, {
                  type: "kern",
                  size: 3 * a
                }, {
                  type: "elem",
                  elem: r
                }]
              }, t);
            return Ve.makeSpan(["mord", "underline"], [i], t);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = new gt.MathNode("mo", [new gt.TextNode("‾")]);
            r.setAttribute("stretchy", "true");
            var n = new gt.MathNode("munder", [kt(e.body, t), r]);
            return n.setAttribute("accentunder", "true"), n;
          }
        }), Ze({
          type: "vcenter",
          names: ["\\vcenter"],
          props: {
            numArgs: 1,
            argTypes: ["original"],
            allowedInText: !1
          },
          handler: function handler(e, t) {
            return {
              type: "vcenter",
              mode: e.parser.mode,
              body: t[0]
            };
          },
          htmlBuilder: function htmlBuilder(e, t) {
            var r = ct(e.body, t),
              n = t.fontMetrics().axisHeight,
              a = .5 * (r.height - n - (r.depth + n));
            return Ve.makeVList({
              positionType: "shift",
              positionData: a,
              children: [{
                type: "elem",
                elem: r
              }]
            }, t);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            return new gt.MathNode("mpadded", [kt(e.body, t)], ["vcenter"]);
          }
        }), Ze({
          type: "verb",
          names: ["\\verb"],
          props: {
            numArgs: 0,
            allowedInText: !0
          },
          handler: function handler(e, t, r) {
            throw new n("\\verb ended by end of line instead of matching delimiter");
          },
          htmlBuilder: function htmlBuilder(e, t) {
            for (var r = vn(e), n = [], a = t.havingStyle(t.style.text()), i = 0; i < r.length; i++) {
              var o = r[i];
              "~" === o && (o = "\\textasciitilde"), n.push(Ve.makeSymbol(o, "Typewriter-Regular", e.mode, a, ["mord", "texttt"]));
            }
            return Ve.makeSpan(["mord", "text"].concat(a.sizingClasses(t)), Ve.tryCombineChars(n), a);
          },
          mathmlBuilder: function mathmlBuilder(e, t) {
            var r = new gt.TextNode(vn(e)),
              n = new gt.MathNode("mtext", [r]);
            return n.setAttribute("mathvariant", "monospace"), n;
          }
        });
        var vn = function vn(e) {
            return e.body.replace(/ /g, e.star ? "␣" : " ");
          },
          yn = We,
          bn = new RegExp("[̀-ͯ]+$"),
          xn = function () {
            function e(e, t) {
              this.input = void 0, this.settings = void 0, this.tokenRegex = void 0, this.catcodes = void 0, this.input = e, this.settings = t, this.tokenRegex = new RegExp("([ \r\n\t]+)|\\\\(\n|[ \r\t]+\n?)[ \r\t]*|([!-\\[\\]-\u2027\u202A-\uD7FF\uF900-\uFFFF][\u0300-\u036F]*|[\uD800-\uDBFF][\uDC00-\uDFFF][\u0300-\u036F]*|\\\\verb\\*([^]).*?\\4|\\\\verb([^*a-zA-Z]).*?\\5|(\\\\[a-zA-Z@]+)[ \r\n\t]*|\\\\[^\uD800-\uDFFF])", "g"), this.catcodes = {
                "%": 14,
                "~": 13
              };
            }
            var t = e.prototype;
            return t.setCatcode = function (e, t) {
              this.catcodes[e] = t;
            }, t.lex = function () {
              var e = this.input,
                t = this.tokenRegex.lastIndex;
              if (t === e.length) return new zr("EOF", new Mr(this, t, t));
              var r = this.tokenRegex.exec(e);
              if (null === r || r.index !== t) throw new n("Unexpected character: '" + e[t] + "'", new zr(e[t], new Mr(this, t, t + 1)));
              var a = r[6] || r[3] || (r[2] ? "\\ " : " ");
              if (14 === this.catcodes[a]) {
                var i = e.indexOf("\n", this.tokenRegex.lastIndex);
                return -1 === i ? (this.tokenRegex.lastIndex = e.length, this.settings.reportNonstrict("commentAtEnd", "% comment has no terminating newline; LaTeX would fail because of commenting the end of math mode (e.g. $)")) : this.tokenRegex.lastIndex = i + 1, this.lex();
              }
              return new zr(a, new Mr(this, t, this.tokenRegex.lastIndex));
            }, e;
          }(),
          wn = function () {
            function e(e, t) {
              void 0 === e && (e = {}), void 0 === t && (t = {}), this.current = void 0, this.builtins = void 0, this.undefStack = void 0, this.current = t, this.builtins = e, this.undefStack = [];
            }
            var t = e.prototype;
            return t.beginGroup = function () {
              this.undefStack.push({});
            }, t.endGroup = function () {
              if (0 === this.undefStack.length) throw new n("Unbalanced namespace destruction: attempt to pop global namespace; please report this as a bug");
              var e = this.undefStack.pop();
              for (var t in e) {
                e.hasOwnProperty(t) && (null == e[t] ? delete this.current[t] : this.current[t] = e[t]);
              }
            }, t.endGroups = function () {
              for (; this.undefStack.length > 0;) {
                this.endGroup();
              }
            }, t.has = function (e) {
              return this.current.hasOwnProperty(e) || this.builtins.hasOwnProperty(e);
            }, t.get = function (e) {
              return this.current.hasOwnProperty(e) ? this.current[e] : this.builtins[e];
            }, t.set = function (e, t, r) {
              if (void 0 === r && (r = !1), r) {
                for (var n = 0; n < this.undefStack.length; n++) {
                  delete this.undefStack[n][e];
                }
                this.undefStack.length > 0 && (this.undefStack[this.undefStack.length - 1][e] = t);
              } else {
                var a = this.undefStack[this.undefStack.length - 1];
                a && !a.hasOwnProperty(e) && (a[e] = this.current[e]);
              }
              null == t ? delete this.current[e] : this.current[e] = t;
            }, e;
          }(),
          kn = kr;
        Sr("\\noexpand", function (e) {
          var t = e.popToken();
          return e.isExpandable(t.text) && (t.noexpand = !0, t.treatAsRelax = !0), {
            tokens: [t],
            numArgs: 0
          };
        }), Sr("\\expandafter", function (e) {
          var t = e.popToken();
          return e.expandOnce(!0), {
            tokens: [t],
            numArgs: 0
          };
        }), Sr("\\@firstoftwo", function (e) {
          return {
            tokens: e.consumeArgs(2)[0],
            numArgs: 0
          };
        }), Sr("\\@secondoftwo", function (e) {
          return {
            tokens: e.consumeArgs(2)[1],
            numArgs: 0
          };
        }), Sr("\\@ifnextchar", function (e) {
          var t = e.consumeArgs(3);
          e.consumeSpaces();
          var r = e.future();
          return 1 === t[0].length && t[0][0].text === r.text ? {
            tokens: t[1],
            numArgs: 0
          } : {
            tokens: t[2],
            numArgs: 0
          };
        }), Sr("\\@ifstar", "\\@ifnextchar *{\\@firstoftwo{#1}}"), Sr("\\TextOrMath", function (e) {
          var t = e.consumeArgs(2);
          return "text" === e.mode ? {
            tokens: t[0],
            numArgs: 0
          } : {
            tokens: t[1],
            numArgs: 0
          };
        });
        var Sn = {
          0: 0,
          1: 1,
          2: 2,
          3: 3,
          4: 4,
          5: 5,
          6: 6,
          7: 7,
          8: 8,
          9: 9,
          a: 10,
          A: 10,
          b: 11,
          B: 11,
          c: 12,
          C: 12,
          d: 13,
          D: 13,
          e: 14,
          E: 14,
          f: 15,
          F: 15
        };
        Sr("\\char", function (e) {
          var t,
            r = e.popToken(),
            a = "";
          if ("'" === r.text) t = 8, r = e.popToken();else if ('"' === r.text) t = 16, r = e.popToken();else if ("`" === r.text) {
            if ("\\" === (r = e.popToken()).text[0]) a = r.text.charCodeAt(1);else {
              if ("EOF" === r.text) throw new n("\\char` missing argument");
              a = r.text.charCodeAt(0);
            }
          } else t = 10;
          if (t) {
            if (null == (a = Sn[r.text]) || a >= t) throw new n("Invalid base-" + t + " digit " + r.text);
            for (var i; null != (i = Sn[e.future().text]) && i < t;) {
              a *= t, a += i, e.popToken();
            }
          }
          return "\\@char{" + a + "}";
        });
        var Mn = function Mn(e, t, r) {
          var a = e.consumeArg().tokens;
          if (1 !== a.length) throw new n("\\newcommand's first argument must be a macro name");
          var i = a[0].text,
            o = e.isDefined(i);
          if (o && !t) throw new n("\\newcommand{" + i + "} attempting to redefine " + i + "; use \\renewcommand");
          if (!o && !r) throw new n("\\renewcommand{" + i + "} when command " + i + " does not yet exist; use \\newcommand");
          var s = 0;
          if (1 === (a = e.consumeArg().tokens).length && "[" === a[0].text) {
            for (var l = "", h = e.expandNextToken(); "]" !== h.text && "EOF" !== h.text;) {
              l += h.text, h = e.expandNextToken();
            }
            if (!l.match(/^\s*[0-9]+\s*$/)) throw new n("Invalid number of arguments: " + l);
            s = parseInt(l), a = e.consumeArg().tokens;
          }
          return e.macros.set(i, {
            tokens: a,
            numArgs: s
          }), "";
        };
        Sr("\\newcommand", function (e) {
          return Mn(e, !1, !0);
        }), Sr("\\renewcommand", function (e) {
          return Mn(e, !0, !1);
        }), Sr("\\providecommand", function (e) {
          return Mn(e, !0, !0);
        }), Sr("\\message", function (e) {
          var t = e.consumeArgs(1)[0];
          return console.log(t.reverse().map(function (e) {
            return e.text;
          }).join("")), "";
        }), Sr("\\errmessage", function (e) {
          var t = e.consumeArgs(1)[0];
          return console.error(t.reverse().map(function (e) {
            return e.text;
          }).join("")), "";
        }), Sr("\\show", function (e) {
          var t = e.popToken(),
            r = t.text;
          return console.log(t, e.macros.get(r), yn[r], ne.math[r], ne.text[r]), "";
        }), Sr("\\bgroup", "{"), Sr("\\egroup", "}"), Sr("~", "\\nobreakspace"), Sr("\\lq", "`"), Sr("\\rq", "'"), Sr("\\aa", "\\r a"), Sr("\\AA", "\\r A"), Sr("\\textcopyright", "\\html@mathml{\\textcircled{c}}{\\char`©}"), Sr("\\copyright", "\\TextOrMath{\\textcopyright}{\\text{\\textcopyright}}"), Sr("\\textregistered", "\\html@mathml{\\textcircled{\\scriptsize R}}{\\char`®}"), Sr("ℬ", "\\mathscr{B}"), Sr("ℰ", "\\mathscr{E}"), Sr("ℱ", "\\mathscr{F}"), Sr("ℋ", "\\mathscr{H}"), Sr("ℐ", "\\mathscr{I}"), Sr("ℒ", "\\mathscr{L}"), Sr("ℳ", "\\mathscr{M}"), Sr("ℛ", "\\mathscr{R}"), Sr("ℭ", "\\mathfrak{C}"), Sr("ℌ", "\\mathfrak{H}"), Sr("ℨ", "\\mathfrak{Z}"), Sr("\\Bbbk", "\\Bbb{k}"), Sr("·", "\\cdotp"), Sr("\\llap", "\\mathllap{\\textrm{#1}}"), Sr("\\rlap", "\\mathrlap{\\textrm{#1}}"), Sr("\\clap", "\\mathclap{\\textrm{#1}}"), Sr("\\mathstrut", "\\vphantom{(}"), Sr("\\underbar", "\\underline{\\text{#1}}"), Sr("\\not", '\\html@mathml{\\mathrel{\\mathrlap\\@not}}{\\char"338}'), Sr("\\neq", "\\html@mathml{\\mathrel{\\not=}}{\\mathrel{\\char`≠}}"), Sr("\\ne", "\\neq"), Sr("≠", "\\neq"), Sr("\\notin", "\\html@mathml{\\mathrel{{\\in}\\mathllap{/\\mskip1mu}}}{\\mathrel{\\char`∉}}"), Sr("∉", "\\notin"), Sr("≘", "\\html@mathml{\\mathrel{=\\kern{-1em}\\raisebox{0.4em}{$\\scriptsize\\frown$}}}{\\mathrel{\\char`≘}}"), Sr("≙", "\\html@mathml{\\stackrel{\\tiny\\wedge}{=}}{\\mathrel{\\char`≘}}"), Sr("≚", "\\html@mathml{\\stackrel{\\tiny\\vee}{=}}{\\mathrel{\\char`≚}}"), Sr("≛", "\\html@mathml{\\stackrel{\\scriptsize\\star}{=}}{\\mathrel{\\char`≛}}"), Sr("≝", "\\html@mathml{\\stackrel{\\tiny\\mathrm{def}}{=}}{\\mathrel{\\char`≝}}"), Sr("≞", "\\html@mathml{\\stackrel{\\tiny\\mathrm{m}}{=}}{\\mathrel{\\char`≞}}"), Sr("≟", "\\html@mathml{\\stackrel{\\tiny?}{=}}{\\mathrel{\\char`≟}}"), Sr("⟂", "\\perp"), Sr("‼", "\\mathclose{!\\mkern-0.8mu!}"), Sr("∌", "\\notni"), Sr("⌜", "\\ulcorner"), Sr("⌝", "\\urcorner"), Sr("⌞", "\\llcorner"), Sr("⌟", "\\lrcorner"), Sr("©", "\\copyright"), Sr("®", "\\textregistered"), Sr("️", "\\textregistered"), Sr("\\ulcorner", '\\html@mathml{\\@ulcorner}{\\mathop{\\char"231c}}'), Sr("\\urcorner", '\\html@mathml{\\@urcorner}{\\mathop{\\char"231d}}'), Sr("\\llcorner", '\\html@mathml{\\@llcorner}{\\mathop{\\char"231e}}'), Sr("\\lrcorner", '\\html@mathml{\\@lrcorner}{\\mathop{\\char"231f}}'), Sr("\\vdots", "\\mathord{\\varvdots\\rule{0pt}{15pt}}"), Sr("⋮", "\\vdots"), Sr("\\varGamma", "\\mathit{\\Gamma}"), Sr("\\varDelta", "\\mathit{\\Delta}"), Sr("\\varTheta", "\\mathit{\\Theta}"), Sr("\\varLambda", "\\mathit{\\Lambda}"), Sr("\\varXi", "\\mathit{\\Xi}"), Sr("\\varPi", "\\mathit{\\Pi}"), Sr("\\varSigma", "\\mathit{\\Sigma}"), Sr("\\varUpsilon", "\\mathit{\\Upsilon}"), Sr("\\varPhi", "\\mathit{\\Phi}"), Sr("\\varPsi", "\\mathit{\\Psi}"), Sr("\\varOmega", "\\mathit{\\Omega}"), Sr("\\substack", "\\begin{subarray}{c}#1\\end{subarray}"), Sr("\\colon", "\\nobreak\\mskip2mu\\mathpunct{}\\mathchoice{\\mkern-3mu}{\\mkern-3mu}{}{}{:}\\mskip6mu\\relax"), Sr("\\boxed", "\\fbox{$\\displaystyle{#1}$}"), Sr("\\iff", "\\DOTSB\\;\\Longleftrightarrow\\;"), Sr("\\implies", "\\DOTSB\\;\\Longrightarrow\\;"), Sr("\\impliedby", "\\DOTSB\\;\\Longleftarrow\\;");
        var zn = {
          ",": "\\dotsc",
          "\\not": "\\dotsb",
          "+": "\\dotsb",
          "=": "\\dotsb",
          "<": "\\dotsb",
          ">": "\\dotsb",
          "-": "\\dotsb",
          "*": "\\dotsb",
          ":": "\\dotsb",
          "\\DOTSB": "\\dotsb",
          "\\coprod": "\\dotsb",
          "\\bigvee": "\\dotsb",
          "\\bigwedge": "\\dotsb",
          "\\biguplus": "\\dotsb",
          "\\bigcap": "\\dotsb",
          "\\bigcup": "\\dotsb",
          "\\prod": "\\dotsb",
          "\\sum": "\\dotsb",
          "\\bigotimes": "\\dotsb",
          "\\bigoplus": "\\dotsb",
          "\\bigodot": "\\dotsb",
          "\\bigsqcup": "\\dotsb",
          "\\And": "\\dotsb",
          "\\longrightarrow": "\\dotsb",
          "\\Longrightarrow": "\\dotsb",
          "\\longleftarrow": "\\dotsb",
          "\\Longleftarrow": "\\dotsb",
          "\\longleftrightarrow": "\\dotsb",
          "\\Longleftrightarrow": "\\dotsb",
          "\\mapsto": "\\dotsb",
          "\\longmapsto": "\\dotsb",
          "\\hookrightarrow": "\\dotsb",
          "\\doteq": "\\dotsb",
          "\\mathbin": "\\dotsb",
          "\\mathrel": "\\dotsb",
          "\\relbar": "\\dotsb",
          "\\Relbar": "\\dotsb",
          "\\xrightarrow": "\\dotsb",
          "\\xleftarrow": "\\dotsb",
          "\\DOTSI": "\\dotsi",
          "\\int": "\\dotsi",
          "\\oint": "\\dotsi",
          "\\iint": "\\dotsi",
          "\\iiint": "\\dotsi",
          "\\iiiint": "\\dotsi",
          "\\idotsint": "\\dotsi",
          "\\DOTSX": "\\dotsx"
        };
        Sr("\\dots", function (e) {
          var t = "\\dotso",
            r = e.expandAfterFuture().text;
          return r in zn ? t = zn[r] : ("\\not" === r.substr(0, 4) || r in ne.math && l.contains(["bin", "rel"], ne.math[r].group)) && (t = "\\dotsb"), t;
        });
        var An = {
          ")": !0,
          "]": !0,
          "\\rbrack": !0,
          "\\}": !0,
          "\\rbrace": !0,
          "\\rangle": !0,
          "\\rceil": !0,
          "\\rfloor": !0,
          "\\rgroup": !0,
          "\\rmoustache": !0,
          "\\right": !0,
          "\\bigr": !0,
          "\\biggr": !0,
          "\\Bigr": !0,
          "\\Biggr": !0,
          $: !0,
          ";": !0,
          ".": !0,
          ",": !0
        };
        Sr("\\dotso", function (e) {
          return e.future().text in An ? "\\ldots\\," : "\\ldots";
        }), Sr("\\dotsc", function (e) {
          var t = e.future().text;
          return t in An && "," !== t ? "\\ldots\\," : "\\ldots";
        }), Sr("\\cdots", function (e) {
          return e.future().text in An ? "\\@cdots\\," : "\\@cdots";
        }), Sr("\\dotsb", "\\cdots"), Sr("\\dotsm", "\\cdots"), Sr("\\dotsi", "\\!\\cdots"), Sr("\\dotsx", "\\ldots\\,"), Sr("\\DOTSI", "\\relax"), Sr("\\DOTSB", "\\relax"), Sr("\\DOTSX", "\\relax"), Sr("\\tmspace", "\\TextOrMath{\\kern#1#3}{\\mskip#1#2}\\relax"), Sr("\\,", "\\tmspace+{3mu}{.1667em}"), Sr("\\thinspace", "\\,"), Sr("\\>", "\\mskip{4mu}"), Sr("\\:", "\\tmspace+{4mu}{.2222em}"), Sr("\\medspace", "\\:"), Sr("\\;", "\\tmspace+{5mu}{.2777em}"), Sr("\\thickspace", "\\;"), Sr("\\!", "\\tmspace-{3mu}{.1667em}"), Sr("\\negthinspace", "\\!"), Sr("\\negmedspace", "\\tmspace-{4mu}{.2222em}"), Sr("\\negthickspace", "\\tmspace-{5mu}{.277em}"), Sr("\\enspace", "\\kern.5em "), Sr("\\enskip", "\\hskip.5em\\relax"), Sr("\\quad", "\\hskip1em\\relax"), Sr("\\qquad", "\\hskip2em\\relax"), Sr("\\tag", "\\@ifstar\\tag@literal\\tag@paren"), Sr("\\tag@paren", "\\tag@literal{({#1})}"), Sr("\\tag@literal", function (e) {
          if (e.macros.get("\\df@tag")) throw new n("Multiple \\tag");
          return "\\gdef\\df@tag{\\text{#1}}";
        }), Sr("\\bmod", "\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}\\mathbin{\\rm mod}\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}"), Sr("\\pod", "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern8mu}{\\mkern8mu}{\\mkern8mu}(#1)"), Sr("\\pmod", "\\pod{{\\rm mod}\\mkern6mu#1}"), Sr("\\mod", "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern12mu}{\\mkern12mu}{\\mkern12mu}{\\rm mod}\\,\\,#1"), Sr("\\pmb", "\\html@mathml{\\@binrel{#1}{\\mathrlap{#1}\\kern0.5px#1}}{\\mathbf{#1}}"), Sr("\\newline", "\\\\\\relax"), Sr("\\TeX", "\\textrm{\\html@mathml{T\\kern-.1667em\\raisebox{-.5ex}{E}\\kern-.125emX}{TeX}}");
        var Tn = F(A["Main-Regular"]["T".charCodeAt(0)][1] - .7 * A["Main-Regular"]["A".charCodeAt(0)][1]);
        Sr("\\LaTeX", "\\textrm{\\html@mathml{L\\kern-.36em\\raisebox{" + Tn + "}{\\scriptstyle A}\\kern-.15em\\TeX}{LaTeX}}"), Sr("\\KaTeX", "\\textrm{\\html@mathml{K\\kern-.17em\\raisebox{" + Tn + "}{\\scriptstyle A}\\kern-.15em\\TeX}{KaTeX}}"), Sr("\\hspace", "\\@ifstar\\@hspacer\\@hspace"), Sr("\\@hspace", "\\hskip #1\\relax"), Sr("\\@hspacer", "\\rule{0pt}{0pt}\\hskip #1\\relax"), Sr("\\ordinarycolon", ":"), Sr("\\vcentcolon", "\\mathrel{\\mathop\\ordinarycolon}"), Sr("\\dblcolon", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-.9mu}\\vcentcolon}}{\\mathop{\\char"2237}}'), Sr("\\coloneqq", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2254}}'), Sr("\\Coloneqq", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2237\\char"3d}}'), Sr("\\coloneq", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"3a\\char"2212}}'), Sr("\\Coloneq", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"2237\\char"2212}}'), Sr("\\eqqcolon", '\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2255}}'), Sr("\\Eqqcolon", '\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"3d\\char"2237}}'), Sr("\\eqcolon", '\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2239}}'), Sr("\\Eqcolon", '\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"2212\\char"2237}}'), Sr("\\colonapprox", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"3a\\char"2248}}'), Sr("\\Colonapprox", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"2237\\char"2248}}'), Sr("\\colonsim", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"3a\\char"223c}}'), Sr("\\Colonsim", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"2237\\char"223c}}'), Sr("∷", "\\dblcolon"), Sr("∹", "\\eqcolon"), Sr("≔", "\\coloneqq"), Sr("≕", "\\eqqcolon"), Sr("⩴", "\\Coloneqq"), Sr("\\ratio", "\\vcentcolon"), Sr("\\coloncolon", "\\dblcolon"), Sr("\\colonequals", "\\coloneqq"), Sr("\\coloncolonequals", "\\Coloneqq"), Sr("\\equalscolon", "\\eqqcolon"), Sr("\\equalscoloncolon", "\\Eqqcolon"), Sr("\\colonminus", "\\coloneq"), Sr("\\coloncolonminus", "\\Coloneq"), Sr("\\minuscolon", "\\eqcolon"), Sr("\\minuscoloncolon", "\\Eqcolon"), Sr("\\coloncolonapprox", "\\Colonapprox"), Sr("\\coloncolonsim", "\\Colonsim"), Sr("\\simcolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\vcentcolon}"), Sr("\\simcoloncolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\dblcolon}"), Sr("\\approxcolon", "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\vcentcolon}"), Sr("\\approxcoloncolon", "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\dblcolon}"), Sr("\\notni", "\\html@mathml{\\not\\ni}{\\mathrel{\\char`∌}}"), Sr("\\limsup", "\\DOTSB\\operatorname*{lim\\,sup}"), Sr("\\liminf", "\\DOTSB\\operatorname*{lim\\,inf}"), Sr("\\injlim", "\\DOTSB\\operatorname*{inj\\,lim}"), Sr("\\projlim", "\\DOTSB\\operatorname*{proj\\,lim}"), Sr("\\varlimsup", "\\DOTSB\\operatorname*{\\overline{lim}}"), Sr("\\varliminf", "\\DOTSB\\operatorname*{\\underline{lim}}"), Sr("\\varinjlim", "\\DOTSB\\operatorname*{\\underrightarrow{lim}}"), Sr("\\varprojlim", "\\DOTSB\\operatorname*{\\underleftarrow{lim}}"), Sr("\\gvertneqq", "\\html@mathml{\\@gvertneqq}{≩}"), Sr("\\lvertneqq", "\\html@mathml{\\@lvertneqq}{≨}"), Sr("\\ngeqq", "\\html@mathml{\\@ngeqq}{≱}"), Sr("\\ngeqslant", "\\html@mathml{\\@ngeqslant}{≱}"), Sr("\\nleqq", "\\html@mathml{\\@nleqq}{≰}"), Sr("\\nleqslant", "\\html@mathml{\\@nleqslant}{≰}"), Sr("\\nshortmid", "\\html@mathml{\\@nshortmid}{∤}"), Sr("\\nshortparallel", "\\html@mathml{\\@nshortparallel}{∦}"), Sr("\\nsubseteqq", "\\html@mathml{\\@nsubseteqq}{⊈}"), Sr("\\nsupseteqq", "\\html@mathml{\\@nsupseteqq}{⊉}"), Sr("\\varsubsetneq", "\\html@mathml{\\@varsubsetneq}{⊊}"), Sr("\\varsubsetneqq", "\\html@mathml{\\@varsubsetneqq}{⫋}"), Sr("\\varsupsetneq", "\\html@mathml{\\@varsupsetneq}{⊋}"), Sr("\\varsupsetneqq", "\\html@mathml{\\@varsupsetneqq}{⫌}"), Sr("\\imath", "\\html@mathml{\\@imath}{ı}"), Sr("\\jmath", "\\html@mathml{\\@jmath}{ȷ}"), Sr("\\llbracket", "\\html@mathml{\\mathopen{[\\mkern-3.2mu[}}{\\mathopen{\\char`⟦}}"), Sr("\\rrbracket", "\\html@mathml{\\mathclose{]\\mkern-3.2mu]}}{\\mathclose{\\char`⟧}}"), Sr("⟦", "\\llbracket"), Sr("⟧", "\\rrbracket"), Sr("\\lBrace", "\\html@mathml{\\mathopen{\\{\\mkern-3.2mu[}}{\\mathopen{\\char`⦃}}"), Sr("\\rBrace", "\\html@mathml{\\mathclose{]\\mkern-3.2mu\\}}}{\\mathclose{\\char`⦄}}"), Sr("⦃", "\\lBrace"), Sr("⦄", "\\rBrace"), Sr("\\minuso", "\\mathbin{\\html@mathml{{\\mathrlap{\\mathchoice{\\kern{0.145em}}{\\kern{0.145em}}{\\kern{0.1015em}}{\\kern{0.0725em}}\\circ}{-}}}{\\char`⦵}}"), Sr("⦵", "\\minuso"), Sr("\\darr", "\\downarrow"), Sr("\\dArr", "\\Downarrow"), Sr("\\Darr", "\\Downarrow"), Sr("\\lang", "\\langle"), Sr("\\rang", "\\rangle"), Sr("\\uarr", "\\uparrow"), Sr("\\uArr", "\\Uparrow"), Sr("\\Uarr", "\\Uparrow"), Sr("\\N", "\\mathbb{N}"), Sr("\\R", "\\mathbb{R}"), Sr("\\Z", "\\mathbb{Z}"), Sr("\\alef", "\\aleph"), Sr("\\alefsym", "\\aleph"), Sr("\\Alpha", "\\mathrm{A}"), Sr("\\Beta", "\\mathrm{B}"), Sr("\\bull", "\\bullet"), Sr("\\Chi", "\\mathrm{X}"), Sr("\\clubs", "\\clubsuit"), Sr("\\cnums", "\\mathbb{C}"), Sr("\\Complex", "\\mathbb{C}"), Sr("\\Dagger", "\\ddagger"), Sr("\\diamonds", "\\diamondsuit"), Sr("\\empty", "\\emptyset"), Sr("\\Epsilon", "\\mathrm{E}"), Sr("\\Eta", "\\mathrm{H}"), Sr("\\exist", "\\exists"), Sr("\\harr", "\\leftrightarrow"), Sr("\\hArr", "\\Leftrightarrow"), Sr("\\Harr", "\\Leftrightarrow"), Sr("\\hearts", "\\heartsuit"), Sr("\\image", "\\Im"), Sr("\\infin", "\\infty"), Sr("\\Iota", "\\mathrm{I}"), Sr("\\isin", "\\in"), Sr("\\Kappa", "\\mathrm{K}"), Sr("\\larr", "\\leftarrow"), Sr("\\lArr", "\\Leftarrow"), Sr("\\Larr", "\\Leftarrow"), Sr("\\lrarr", "\\leftrightarrow"), Sr("\\lrArr", "\\Leftrightarrow"), Sr("\\Lrarr", "\\Leftrightarrow"), Sr("\\Mu", "\\mathrm{M}"), Sr("\\natnums", "\\mathbb{N}"), Sr("\\Nu", "\\mathrm{N}"), Sr("\\Omicron", "\\mathrm{O}"), Sr("\\plusmn", "\\pm"), Sr("\\rarr", "\\rightarrow"), Sr("\\rArr", "\\Rightarrow"), Sr("\\Rarr", "\\Rightarrow"), Sr("\\real", "\\Re"), Sr("\\reals", "\\mathbb{R}"), Sr("\\Reals", "\\mathbb{R}"), Sr("\\Rho", "\\mathrm{P}"), Sr("\\sdot", "\\cdot"), Sr("\\sect", "\\S"), Sr("\\spades", "\\spadesuit"), Sr("\\sub", "\\subset"), Sr("\\sube", "\\subseteq"), Sr("\\supe", "\\supseteq"), Sr("\\Tau", "\\mathrm{T}"), Sr("\\thetasym", "\\vartheta"), Sr("\\weierp", "\\wp"), Sr("\\Zeta", "\\mathrm{Z}"), Sr("\\argmin", "\\DOTSB\\operatorname*{arg\\,min}"), Sr("\\argmax", "\\DOTSB\\operatorname*{arg\\,max}"), Sr("\\plim", "\\DOTSB\\mathop{\\operatorname{plim}}\\limits"), Sr("\\bra", "\\mathinner{\\langle{#1}|}"), Sr("\\ket", "\\mathinner{|{#1}\\rangle}"), Sr("\\braket", "\\mathinner{\\langle{#1}\\rangle}"), Sr("\\Bra", "\\left\\langle#1\\right|"), Sr("\\Ket", "\\left|#1\\right\\rangle");
        var Bn = function Bn(e) {
          return function (t) {
            var r = t.consumeArg().tokens,
              n = t.consumeArg().tokens,
              a = t.consumeArg().tokens,
              i = t.consumeArg().tokens,
              o = t.macros.get("|"),
              s = t.macros.get("\\|");
            t.macros.beginGroup();
            var l = function l(t) {
              return function (r) {
                e && (r.macros.set("|", o), a.length && r.macros.set("\\|", s));
                var i = t;
                return !t && a.length && "|" === r.future().text && (r.popToken(), i = !0), {
                  tokens: i ? a : n,
                  numArgs: 0
                };
              };
            };
            t.macros.set("|", l(!1)), a.length && t.macros.set("\\|", l(!0));
            var h = t.consumeArg().tokens,
              c = t.expandTokens([].concat(i, h, r));
            return t.macros.endGroup(), {
              tokens: c.reverse(),
              numArgs: 0
            };
          };
        };
        Sr("\\bra@ket", Bn(!1)), Sr("\\bra@set", Bn(!0)), Sr("\\Braket", "\\bra@ket{\\left\\langle}{\\,\\middle\\vert\\,}{\\,\\middle\\vert\\,}{\\right\\rangle}"), Sr("\\Set", "\\bra@set{\\left\\{\\:}{\\;\\middle\\vert\\;}{\\;\\middle\\Vert\\;}{\\:\\right\\}}"), Sr("\\set", "\\bra@set{\\{\\,}{\\mid}{}{\\,\\}}"), Sr("\\angln", "{\\angl n}"), Sr("\\blue", "\\textcolor{##6495ed}{#1}"), Sr("\\orange", "\\textcolor{##ffa500}{#1}"), Sr("\\pink", "\\textcolor{##ff00af}{#1}"), Sr("\\red", "\\textcolor{##df0030}{#1}"), Sr("\\green", "\\textcolor{##28ae7b}{#1}"), Sr("\\gray", "\\textcolor{gray}{#1}"), Sr("\\purple", "\\textcolor{##9d38bd}{#1}"), Sr("\\blueA", "\\textcolor{##ccfaff}{#1}"), Sr("\\blueB", "\\textcolor{##80f6ff}{#1}"), Sr("\\blueC", "\\textcolor{##63d9ea}{#1}"), Sr("\\blueD", "\\textcolor{##11accd}{#1}"), Sr("\\blueE", "\\textcolor{##0c7f99}{#1}"), Sr("\\tealA", "\\textcolor{##94fff5}{#1}"), Sr("\\tealB", "\\textcolor{##26edd5}{#1}"), Sr("\\tealC", "\\textcolor{##01d1c1}{#1}"), Sr("\\tealD", "\\textcolor{##01a995}{#1}"), Sr("\\tealE", "\\textcolor{##208170}{#1}"), Sr("\\greenA", "\\textcolor{##b6ffb0}{#1}"), Sr("\\greenB", "\\textcolor{##8af281}{#1}"), Sr("\\greenC", "\\textcolor{##74cf70}{#1}"), Sr("\\greenD", "\\textcolor{##1fab54}{#1}"), Sr("\\greenE", "\\textcolor{##0d923f}{#1}"), Sr("\\goldA", "\\textcolor{##ffd0a9}{#1}"), Sr("\\goldB", "\\textcolor{##ffbb71}{#1}"), Sr("\\goldC", "\\textcolor{##ff9c39}{#1}"), Sr("\\goldD", "\\textcolor{##e07d10}{#1}"), Sr("\\goldE", "\\textcolor{##a75a05}{#1}"), Sr("\\redA", "\\textcolor{##fca9a9}{#1}"), Sr("\\redB", "\\textcolor{##ff8482}{#1}"), Sr("\\redC", "\\textcolor{##f9685d}{#1}"), Sr("\\redD", "\\textcolor{##e84d39}{#1}"), Sr("\\redE", "\\textcolor{##bc2612}{#1}"), Sr("\\maroonA", "\\textcolor{##ffbde0}{#1}"), Sr("\\maroonB", "\\textcolor{##ff92c6}{#1}"), Sr("\\maroonC", "\\textcolor{##ed5fa6}{#1}"), Sr("\\maroonD", "\\textcolor{##ca337c}{#1}"), Sr("\\maroonE", "\\textcolor{##9e034e}{#1}"), Sr("\\purpleA", "\\textcolor{##ddd7ff}{#1}"), Sr("\\purpleB", "\\textcolor{##c6b9fc}{#1}"), Sr("\\purpleC", "\\textcolor{##aa87ff}{#1}"), Sr("\\purpleD", "\\textcolor{##7854ab}{#1}"), Sr("\\purpleE", "\\textcolor{##543b78}{#1}"), Sr("\\mintA", "\\textcolor{##f5f9e8}{#1}"), Sr("\\mintB", "\\textcolor{##edf2df}{#1}"), Sr("\\mintC", "\\textcolor{##e0e5cc}{#1}"), Sr("\\grayA", "\\textcolor{##f6f7f7}{#1}"), Sr("\\grayB", "\\textcolor{##f0f1f2}{#1}"), Sr("\\grayC", "\\textcolor{##e3e5e6}{#1}"), Sr("\\grayD", "\\textcolor{##d6d8da}{#1}"), Sr("\\grayE", "\\textcolor{##babec2}{#1}"), Sr("\\grayF", "\\textcolor{##888d93}{#1}"), Sr("\\grayG", "\\textcolor{##626569}{#1}"), Sr("\\grayH", "\\textcolor{##3b3e40}{#1}"), Sr("\\grayI", "\\textcolor{##21242c}{#1}"), Sr("\\kaBlue", "\\textcolor{##314453}{#1}"), Sr("\\kaGreen", "\\textcolor{##71B307}{#1}");
        var Cn = {
            "^": !0,
            _: !0,
            "\\limits": !0,
            "\\nolimits": !0
          },
          Nn = function () {
            function e(e, t, r) {
              this.settings = void 0, this.expansionCount = void 0, this.lexer = void 0, this.macros = void 0, this.stack = void 0, this.mode = void 0, this.settings = t, this.expansionCount = 0, this.feed(e), this.macros = new wn(kn, t.macros), this.mode = r, this.stack = [];
            }
            var t = e.prototype;
            return t.feed = function (e) {
              this.lexer = new xn(e, this.settings);
            }, t.switchMode = function (e) {
              this.mode = e;
            }, t.beginGroup = function () {
              this.macros.beginGroup();
            }, t.endGroup = function () {
              this.macros.endGroup();
            }, t.endGroups = function () {
              this.macros.endGroups();
            }, t.future = function () {
              return 0 === this.stack.length && this.pushToken(this.lexer.lex()), this.stack[this.stack.length - 1];
            }, t.popToken = function () {
              return this.future(), this.stack.pop();
            }, t.pushToken = function (e) {
              this.stack.push(e);
            }, t.pushTokens = function (e) {
              var t;
              (t = this.stack).push.apply(t, e);
            }, t.scanArgument = function (e) {
              var t, r, n;
              if (e) {
                if (this.consumeSpaces(), "[" !== this.future().text) return null;
                t = this.popToken();
                var a = this.consumeArg(["]"]);
                n = a.tokens, r = a.end;
              } else {
                var i = this.consumeArg();
                n = i.tokens, t = i.start, r = i.end;
              }
              return this.pushToken(new zr("EOF", r.loc)), this.pushTokens(n), t.range(r, "");
            }, t.consumeSpaces = function () {
              for (; " " === this.future().text;) {
                this.stack.pop();
              }
            }, t.consumeArg = function (e) {
              var t = [],
                r = e && e.length > 0;
              r || this.consumeSpaces();
              var a,
                i = this.future(),
                o = 0,
                s = 0;
              do {
                if (a = this.popToken(), t.push(a), "{" === a.text) ++o;else if ("}" === a.text) {
                  if (-1 == --o) throw new n("Extra }", a);
                } else if ("EOF" === a.text) throw new n("Unexpected end of input in a macro argument, expected '" + (e && r ? e[s] : "}") + "'", a);
                if (e && r) if ((0 === o || 1 === o && "{" === e[s]) && a.text === e[s]) {
                  if (++s === e.length) {
                    t.splice(-s, s);
                    break;
                  }
                } else s = 0;
              } while (0 !== o || r);
              return "{" === i.text && "}" === t[t.length - 1].text && (t.pop(), t.shift()), t.reverse(), {
                tokens: t,
                start: i,
                end: a
              };
            }, t.consumeArgs = function (e, t) {
              if (t) {
                if (t.length !== e + 1) throw new n("The length of delimiters doesn't match the number of args!");
                for (var r = t[0], a = 0; a < r.length; a++) {
                  var i = this.popToken();
                  if (r[a] !== i.text) throw new n("Use of the macro doesn't match its definition", i);
                }
              }
              for (var o = [], s = 0; s < e; s++) {
                o.push(this.consumeArg(t && t[s + 1]).tokens);
              }
              return o;
            }, t.expandOnce = function (e) {
              var t = this.popToken(),
                r = t.text,
                a = t.noexpand ? null : this._getExpansion(r);
              if (null == a || e && a.unexpandable) {
                if (e && null == a && "\\" === r[0] && !this.isDefined(r)) throw new n("Undefined control sequence: " + r);
                return this.pushToken(t), t;
              }
              if (this.expansionCount++, this.expansionCount > this.settings.maxExpand) throw new n("Too many expansions: infinite loop or need to increase maxExpand setting");
              var i = a.tokens,
                o = this.consumeArgs(a.numArgs, a.delimiters);
              if (a.numArgs) for (var s = (i = i.slice()).length - 1; s >= 0; --s) {
                var l = i[s];
                if ("#" === l.text) {
                  if (0 === s) throw new n("Incomplete placeholder at end of macro body", l);
                  if ("#" === (l = i[--s]).text) i.splice(s + 1, 1);else {
                    if (!/^[1-9]$/.test(l.text)) throw new n("Not a valid argument number", l);
                    var h;
                    (h = i).splice.apply(h, [s, 2].concat(o[+l.text - 1]));
                  }
                }
              }
              return this.pushTokens(i), i;
            }, t.expandAfterFuture = function () {
              return this.expandOnce(), this.future();
            }, t.expandNextToken = function () {
              for (;;) {
                var e = this.expandOnce();
                if (e instanceof zr) return e.treatAsRelax && (e.text = "\\relax"), this.stack.pop();
              }
              throw new Error();
            }, t.expandMacro = function (e) {
              return this.macros.has(e) ? this.expandTokens([new zr(e)]) : void 0;
            }, t.expandTokens = function (e) {
              var t = [],
                r = this.stack.length;
              for (this.pushTokens(e); this.stack.length > r;) {
                var n = this.expandOnce(!0);
                n instanceof zr && (n.treatAsRelax && (n.noexpand = !1, n.treatAsRelax = !1), t.push(this.stack.pop()));
              }
              return t;
            }, t.expandMacroAsText = function (e) {
              var t = this.expandMacro(e);
              return t ? t.map(function (e) {
                return e.text;
              }).join("") : t;
            }, t._getExpansion = function (e) {
              var t = this.macros.get(e);
              if (null == t) return t;
              if (1 === e.length) {
                var r = this.lexer.catcodes[e];
                if (null != r && 13 !== r) return;
              }
              var n = "function" == typeof t ? t(this) : t;
              if ("string" == typeof n) {
                var a = 0;
                if (-1 !== n.indexOf("#")) for (var i = n.replace(/##/g, ""); -1 !== i.indexOf("#" + (a + 1));) {
                  ++a;
                }
                for (var o = new xn(n, this.settings), s = [], l = o.lex(); "EOF" !== l.text;) {
                  s.push(l), l = o.lex();
                }
                return s.reverse(), {
                  tokens: s,
                  numArgs: a
                };
              }
              return n;
            }, t.isDefined = function (e) {
              return this.macros.has(e) || yn.hasOwnProperty(e) || ne.math.hasOwnProperty(e) || ne.text.hasOwnProperty(e) || Cn.hasOwnProperty(e);
            }, t.isExpandable = function (e) {
              var t = this.macros.get(e);
              return null != t ? "string" == typeof t || "function" == typeof t || !t.unexpandable : yn.hasOwnProperty(e) && !yn[e].primitive;
            }, e;
          }(),
          qn = /^[₊₋₌₍₎₀₁₂₃₄₅₆₇₈₉ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵦᵧᵨᵩᵪ]/,
          In = Object.freeze({
            "₊": "+",
            "₋": "-",
            "₌": "=",
            "₍": "(",
            "₎": ")",
            "₀": "0",
            "₁": "1",
            "₂": "2",
            "₃": "3",
            "₄": "4",
            "₅": "5",
            "₆": "6",
            "₇": "7",
            "₈": "8",
            "₉": "9",
            "ₐ": "a",
            "ₑ": "e",
            "ₕ": "h",
            "ᵢ": "i",
            "ⱼ": "j",
            "ₖ": "k",
            "ₗ": "l",
            "ₘ": "m",
            "ₙ": "n",
            "ₒ": "o",
            "ₚ": "p",
            "ᵣ": "r",
            "ₛ": "s",
            "ₜ": "t",
            "ᵤ": "u",
            "ᵥ": "v",
            "ₓ": "x",
            "ᵦ": "β",
            "ᵧ": "γ",
            "ᵨ": "ρ",
            "ᵩ": "ϕ",
            "ᵪ": "χ",
            "⁺": "+",
            "⁻": "-",
            "⁼": "=",
            "⁽": "(",
            "⁾": ")",
            "⁰": "0",
            "¹": "1",
            "²": "2",
            "³": "3",
            "⁴": "4",
            "⁵": "5",
            "⁶": "6",
            "⁷": "7",
            "⁸": "8",
            "⁹": "9",
            "ᴬ": "A",
            "ᴮ": "B",
            "ᴰ": "D",
            "ᴱ": "E",
            "ᴳ": "G",
            "ᴴ": "H",
            "ᴵ": "I",
            "ᴶ": "J",
            "ᴷ": "K",
            "ᴸ": "L",
            "ᴹ": "M",
            "ᴺ": "N",
            "ᴼ": "O",
            "ᴾ": "P",
            "ᴿ": "R",
            "ᵀ": "T",
            "ᵁ": "U",
            "ⱽ": "V",
            "ᵂ": "W",
            "ᵃ": "a",
            "ᵇ": "b",
            "ᶜ": "c",
            "ᵈ": "d",
            "ᵉ": "e",
            "ᶠ": "f",
            "ᵍ": "g",
            "ʰ": "h",
            "ⁱ": "i",
            "ʲ": "j",
            "ᵏ": "k",
            "ˡ": "l",
            "ᵐ": "m",
            "ⁿ": "n",
            "ᵒ": "o",
            "ᵖ": "p",
            "ʳ": "r",
            "ˢ": "s",
            "ᵗ": "t",
            "ᵘ": "u",
            "ᵛ": "v",
            "ʷ": "w",
            "ˣ": "x",
            "ʸ": "y",
            "ᶻ": "z",
            "ᵝ": "β",
            "ᵞ": "γ",
            "ᵟ": "δ",
            "ᵠ": "ϕ",
            "ᵡ": "χ",
            "ᶿ": "θ"
          }),
          On = {
            "́": {
              text: "\\'",
              math: "\\acute"
            },
            "̀": {
              text: "\\`",
              math: "\\grave"
            },
            "̈": {
              text: '\\"',
              math: "\\ddot"
            },
            "̃": {
              text: "\\~",
              math: "\\tilde"
            },
            "̄": {
              text: "\\=",
              math: "\\bar"
            },
            "̆": {
              text: "\\u",
              math: "\\breve"
            },
            "̌": {
              text: "\\v",
              math: "\\check"
            },
            "̂": {
              text: "\\^",
              math: "\\hat"
            },
            "̇": {
              text: "\\.",
              math: "\\dot"
            },
            "̊": {
              text: "\\r",
              math: "\\mathring"
            },
            "̋": {
              text: "\\H"
            },
            "̧": {
              text: "\\c"
            }
          },
          Rn = {
            "á": "á",
            "à": "à",
            "ä": "ä",
            "ǟ": "ǟ",
            "ã": "ã",
            "ā": "ā",
            "ă": "ă",
            "ắ": "ắ",
            "ằ": "ằ",
            "ẵ": "ẵ",
            "ǎ": "ǎ",
            "â": "â",
            "ấ": "ấ",
            "ầ": "ầ",
            "ẫ": "ẫ",
            "ȧ": "ȧ",
            "ǡ": "ǡ",
            "å": "å",
            "ǻ": "ǻ",
            "ḃ": "ḃ",
            "ć": "ć",
            "ḉ": "ḉ",
            "č": "č",
            "ĉ": "ĉ",
            "ċ": "ċ",
            "ç": "ç",
            "ď": "ď",
            "ḋ": "ḋ",
            "ḑ": "ḑ",
            "é": "é",
            "è": "è",
            "ë": "ë",
            "ẽ": "ẽ",
            "ē": "ē",
            "ḗ": "ḗ",
            "ḕ": "ḕ",
            "ĕ": "ĕ",
            "ḝ": "ḝ",
            "ě": "ě",
            "ê": "ê",
            "ế": "ế",
            "ề": "ề",
            "ễ": "ễ",
            "ė": "ė",
            "ȩ": "ȩ",
            "ḟ": "ḟ",
            "ǵ": "ǵ",
            "ḡ": "ḡ",
            "ğ": "ğ",
            "ǧ": "ǧ",
            "ĝ": "ĝ",
            "ġ": "ġ",
            "ģ": "ģ",
            "ḧ": "ḧ",
            "ȟ": "ȟ",
            "ĥ": "ĥ",
            "ḣ": "ḣ",
            "ḩ": "ḩ",
            "í": "í",
            "ì": "ì",
            "ï": "ï",
            "ḯ": "ḯ",
            "ĩ": "ĩ",
            "ī": "ī",
            "ĭ": "ĭ",
            "ǐ": "ǐ",
            "î": "î",
            "ǰ": "ǰ",
            "ĵ": "ĵ",
            "ḱ": "ḱ",
            "ǩ": "ǩ",
            "ķ": "ķ",
            "ĺ": "ĺ",
            "ľ": "ľ",
            "ļ": "ļ",
            "ḿ": "ḿ",
            "ṁ": "ṁ",
            "ń": "ń",
            "ǹ": "ǹ",
            "ñ": "ñ",
            "ň": "ň",
            "ṅ": "ṅ",
            "ņ": "ņ",
            "ó": "ó",
            "ò": "ò",
            "ö": "ö",
            "ȫ": "ȫ",
            "õ": "õ",
            "ṍ": "ṍ",
            "ṏ": "ṏ",
            "ȭ": "ȭ",
            "ō": "ō",
            "ṓ": "ṓ",
            "ṑ": "ṑ",
            "ŏ": "ŏ",
            "ǒ": "ǒ",
            "ô": "ô",
            "ố": "ố",
            "ồ": "ồ",
            "ỗ": "ỗ",
            "ȯ": "ȯ",
            "ȱ": "ȱ",
            "ő": "ő",
            "ṕ": "ṕ",
            "ṗ": "ṗ",
            "ŕ": "ŕ",
            "ř": "ř",
            "ṙ": "ṙ",
            "ŗ": "ŗ",
            "ś": "ś",
            "ṥ": "ṥ",
            "š": "š",
            "ṧ": "ṧ",
            "ŝ": "ŝ",
            "ṡ": "ṡ",
            "ş": "ş",
            "ẗ": "ẗ",
            "ť": "ť",
            "ṫ": "ṫ",
            "ţ": "ţ",
            "ú": "ú",
            "ù": "ù",
            "ü": "ü",
            "ǘ": "ǘ",
            "ǜ": "ǜ",
            "ǖ": "ǖ",
            "ǚ": "ǚ",
            "ũ": "ũ",
            "ṹ": "ṹ",
            "ū": "ū",
            "ṻ": "ṻ",
            "ŭ": "ŭ",
            "ǔ": "ǔ",
            "û": "û",
            "ů": "ů",
            "ű": "ű",
            "ṽ": "ṽ",
            "ẃ": "ẃ",
            "ẁ": "ẁ",
            "ẅ": "ẅ",
            "ŵ": "ŵ",
            "ẇ": "ẇ",
            "ẘ": "ẘ",
            "ẍ": "ẍ",
            "ẋ": "ẋ",
            "ý": "ý",
            "ỳ": "ỳ",
            "ÿ": "ÿ",
            "ỹ": "ỹ",
            "ȳ": "ȳ",
            "ŷ": "ŷ",
            "ẏ": "ẏ",
            "ẙ": "ẙ",
            "ź": "ź",
            "ž": "ž",
            "ẑ": "ẑ",
            "ż": "ż",
            "Á": "Á",
            "À": "À",
            "Ä": "Ä",
            "Ǟ": "Ǟ",
            "Ã": "Ã",
            "Ā": "Ā",
            "Ă": "Ă",
            "Ắ": "Ắ",
            "Ằ": "Ằ",
            "Ẵ": "Ẵ",
            "Ǎ": "Ǎ",
            "Â": "Â",
            "Ấ": "Ấ",
            "Ầ": "Ầ",
            "Ẫ": "Ẫ",
            "Ȧ": "Ȧ",
            "Ǡ": "Ǡ",
            "Å": "Å",
            "Ǻ": "Ǻ",
            "Ḃ": "Ḃ",
            "Ć": "Ć",
            "Ḉ": "Ḉ",
            "Č": "Č",
            "Ĉ": "Ĉ",
            "Ċ": "Ċ",
            "Ç": "Ç",
            "Ď": "Ď",
            "Ḋ": "Ḋ",
            "Ḑ": "Ḑ",
            "É": "É",
            "È": "È",
            "Ë": "Ë",
            "Ẽ": "Ẽ",
            "Ē": "Ē",
            "Ḗ": "Ḗ",
            "Ḕ": "Ḕ",
            "Ĕ": "Ĕ",
            "Ḝ": "Ḝ",
            "Ě": "Ě",
            "Ê": "Ê",
            "Ế": "Ế",
            "Ề": "Ề",
            "Ễ": "Ễ",
            "Ė": "Ė",
            "Ȩ": "Ȩ",
            "Ḟ": "Ḟ",
            "Ǵ": "Ǵ",
            "Ḡ": "Ḡ",
            "Ğ": "Ğ",
            "Ǧ": "Ǧ",
            "Ĝ": "Ĝ",
            "Ġ": "Ġ",
            "Ģ": "Ģ",
            "Ḧ": "Ḧ",
            "Ȟ": "Ȟ",
            "Ĥ": "Ĥ",
            "Ḣ": "Ḣ",
            "Ḩ": "Ḩ",
            "Í": "Í",
            "Ì": "Ì",
            "Ï": "Ï",
            "Ḯ": "Ḯ",
            "Ĩ": "Ĩ",
            "Ī": "Ī",
            "Ĭ": "Ĭ",
            "Ǐ": "Ǐ",
            "Î": "Î",
            "İ": "İ",
            "Ĵ": "Ĵ",
            "Ḱ": "Ḱ",
            "Ǩ": "Ǩ",
            "Ķ": "Ķ",
            "Ĺ": "Ĺ",
            "Ľ": "Ľ",
            "Ļ": "Ļ",
            "Ḿ": "Ḿ",
            "Ṁ": "Ṁ",
            "Ń": "Ń",
            "Ǹ": "Ǹ",
            "Ñ": "Ñ",
            "Ň": "Ň",
            "Ṅ": "Ṅ",
            "Ņ": "Ņ",
            "Ó": "Ó",
            "Ò": "Ò",
            "Ö": "Ö",
            "Ȫ": "Ȫ",
            "Õ": "Õ",
            "Ṍ": "Ṍ",
            "Ṏ": "Ṏ",
            "Ȭ": "Ȭ",
            "Ō": "Ō",
            "Ṓ": "Ṓ",
            "Ṑ": "Ṑ",
            "Ŏ": "Ŏ",
            "Ǒ": "Ǒ",
            "Ô": "Ô",
            "Ố": "Ố",
            "Ồ": "Ồ",
            "Ỗ": "Ỗ",
            "Ȯ": "Ȯ",
            "Ȱ": "Ȱ",
            "Ő": "Ő",
            "Ṕ": "Ṕ",
            "Ṗ": "Ṗ",
            "Ŕ": "Ŕ",
            "Ř": "Ř",
            "Ṙ": "Ṙ",
            "Ŗ": "Ŗ",
            "Ś": "Ś",
            "Ṥ": "Ṥ",
            "Š": "Š",
            "Ṧ": "Ṧ",
            "Ŝ": "Ŝ",
            "Ṡ": "Ṡ",
            "Ş": "Ş",
            "Ť": "Ť",
            "Ṫ": "Ṫ",
            "Ţ": "Ţ",
            "Ú": "Ú",
            "Ù": "Ù",
            "Ü": "Ü",
            "Ǘ": "Ǘ",
            "Ǜ": "Ǜ",
            "Ǖ": "Ǖ",
            "Ǚ": "Ǚ",
            "Ũ": "Ũ",
            "Ṹ": "Ṹ",
            "Ū": "Ū",
            "Ṻ": "Ṻ",
            "Ŭ": "Ŭ",
            "Ǔ": "Ǔ",
            "Û": "Û",
            "Ů": "Ů",
            "Ű": "Ű",
            "Ṽ": "Ṽ",
            "Ẃ": "Ẃ",
            "Ẁ": "Ẁ",
            "Ẅ": "Ẅ",
            "Ŵ": "Ŵ",
            "Ẇ": "Ẇ",
            "Ẍ": "Ẍ",
            "Ẋ": "Ẋ",
            "Ý": "Ý",
            "Ỳ": "Ỳ",
            "Ÿ": "Ÿ",
            "Ỹ": "Ỹ",
            "Ȳ": "Ȳ",
            "Ŷ": "Ŷ",
            "Ẏ": "Ẏ",
            "Ź": "Ź",
            "Ž": "Ž",
            "Ẑ": "Ẑ",
            "Ż": "Ż",
            "ά": "ά",
            "ὰ": "ὰ",
            "ᾱ": "ᾱ",
            "ᾰ": "ᾰ",
            "έ": "έ",
            "ὲ": "ὲ",
            "ή": "ή",
            "ὴ": "ὴ",
            "ί": "ί",
            "ὶ": "ὶ",
            "ϊ": "ϊ",
            "ΐ": "ΐ",
            "ῒ": "ῒ",
            "ῑ": "ῑ",
            "ῐ": "ῐ",
            "ό": "ό",
            "ὸ": "ὸ",
            "ύ": "ύ",
            "ὺ": "ὺ",
            "ϋ": "ϋ",
            "ΰ": "ΰ",
            "ῢ": "ῢ",
            "ῡ": "ῡ",
            "ῠ": "ῠ",
            "ώ": "ώ",
            "ὼ": "ὼ",
            "Ύ": "Ύ",
            "Ὺ": "Ὺ",
            "Ϋ": "Ϋ",
            "Ῡ": "Ῡ",
            "Ῠ": "Ῠ",
            "Ώ": "Ώ",
            "Ὼ": "Ὼ"
          },
          Hn = function () {
            function e(e, t) {
              this.mode = void 0, this.gullet = void 0, this.settings = void 0, this.leftrightDepth = void 0, this.nextToken = void 0, this.mode = "math", this.gullet = new Nn(e, t, this.mode), this.settings = t, this.leftrightDepth = 0;
            }
            var t = e.prototype;
            return t.expect = function (e, t) {
              if (void 0 === t && (t = !0), this.fetch().text !== e) throw new n("Expected '" + e + "', got '" + this.fetch().text + "'", this.fetch());
              t && this.consume();
            }, t.consume = function () {
              this.nextToken = null;
            }, t.fetch = function () {
              return null == this.nextToken && (this.nextToken = this.gullet.expandNextToken()), this.nextToken;
            }, t.switchMode = function (e) {
              this.mode = e, this.gullet.switchMode(e);
            }, t.parse = function () {
              this.settings.globalGroup || this.gullet.beginGroup(), this.settings.colorIsTextColor && this.gullet.macros.set("\\color", "\\textcolor");
              try {
                var e = this.parseExpression(!1);
                return this.expect("EOF"), this.settings.globalGroup || this.gullet.endGroup(), e;
              } finally {
                this.gullet.endGroups();
              }
            }, t.subparse = function (e) {
              var t = this.nextToken;
              this.consume(), this.gullet.pushToken(new zr("}")), this.gullet.pushTokens(e);
              var r = this.parseExpression(!1);
              return this.expect("}"), this.nextToken = t, r;
            }, t.parseExpression = function (t, r) {
              for (var n = [];;) {
                "math" === this.mode && this.consumeSpaces();
                var a = this.fetch();
                if (-1 !== e.endOfExpression.indexOf(a.text)) break;
                if (r && a.text === r) break;
                if (t && yn[a.text] && yn[a.text].infix) break;
                var i = this.parseAtom(r);
                if (!i) break;
                "internal" !== i.type && n.push(i);
              }
              return "text" === this.mode && this.formLigatures(n), this.handleInfixNodes(n);
            }, t.handleInfixNodes = function (e) {
              for (var t, r = -1, a = 0; a < e.length; a++) {
                if ("infix" === e[a].type) {
                  if (-1 !== r) throw new n("only one infix operator per group", e[a].token);
                  r = a, t = e[a].replaceWith;
                }
              }
              if (-1 !== r && t) {
                var i,
                  o,
                  s = e.slice(0, r),
                  l = e.slice(r + 1);
                return i = 1 === s.length && "ordgroup" === s[0].type ? s[0] : {
                  type: "ordgroup",
                  mode: this.mode,
                  body: s
                }, o = 1 === l.length && "ordgroup" === l[0].type ? l[0] : {
                  type: "ordgroup",
                  mode: this.mode,
                  body: l
                }, ["\\\\abovefrac" === t ? this.callFunction(t, [i, e[r], o], []) : this.callFunction(t, [i, o], [])];
              }
              return e;
            }, t.handleSupSubscript = function (e) {
              var t = this.fetch(),
                r = t.text;
              this.consume(), this.consumeSpaces();
              var a = this.parseGroup(e);
              if (!a) throw new n("Expected group after '" + r + "'", t);
              return a;
            }, t.formatUnsupportedCmd = function (e) {
              for (var t = [], r = 0; r < e.length; r++) {
                t.push({
                  type: "textord",
                  mode: "text",
                  text: e[r]
                });
              }
              var n = {
                type: "text",
                mode: this.mode,
                body: t
              };
              return {
                type: "color",
                mode: this.mode,
                color: this.settings.errorColor,
                body: [n]
              };
            }, t.parseAtom = function (t) {
              var r,
                a,
                i = this.parseGroup("atom", t);
              if ("text" === this.mode) return i;
              for (;;) {
                this.consumeSpaces();
                var o = this.fetch();
                if ("\\limits" === o.text || "\\nolimits" === o.text) {
                  if (i && "op" === i.type) {
                    var s = "\\limits" === o.text;
                    i.limits = s, i.alwaysHandleSupSub = !0;
                  } else {
                    if (!i || "operatorname" !== i.type) throw new n("Limit controls must follow a math operator", o);
                    i.alwaysHandleSupSub && (i.limits = "\\limits" === o.text);
                  }
                  this.consume();
                } else if ("^" === o.text) {
                  if (r) throw new n("Double superscript", o);
                  r = this.handleSupSubscript("superscript");
                } else if ("_" === o.text) {
                  if (a) throw new n("Double subscript", o);
                  a = this.handleSupSubscript("subscript");
                } else if ("'" === o.text) {
                  if (r) throw new n("Double superscript", o);
                  var l = {
                      type: "textord",
                      mode: this.mode,
                      text: "\\prime"
                    },
                    h = [l];
                  for (this.consume(); "'" === this.fetch().text;) {
                    h.push(l), this.consume();
                  }
                  "^" === this.fetch().text && h.push(this.handleSupSubscript("superscript")), r = {
                    type: "ordgroup",
                    mode: this.mode,
                    body: h
                  };
                } else {
                  if (!In[o.text]) break;
                  var c = In[o.text],
                    m = qn.test(o.text);
                  for (this.consume();;) {
                    var u = this.fetch().text;
                    if (!In[u]) break;
                    if (qn.test(u) !== m) break;
                    this.consume(), c += In[u];
                  }
                  var p = new e(c, this.settings).parse();
                  m ? a = {
                    type: "ordgroup",
                    mode: "math",
                    body: p
                  } : r = {
                    type: "ordgroup",
                    mode: "math",
                    body: p
                  };
                }
              }
              return r || a ? {
                type: "supsub",
                mode: this.mode,
                base: i,
                sup: r,
                sub: a
              } : i;
            }, t.parseFunction = function (e, t) {
              var r = this.fetch(),
                a = r.text,
                i = yn[a];
              if (!i) return null;
              if (this.consume(), t && "atom" !== t && !i.allowedInArgument) throw new n("Got function '" + a + "' with no arguments" + (t ? " as " + t : ""), r);
              if ("text" === this.mode && !i.allowedInText) throw new n("Can't use function '" + a + "' in text mode", r);
              if ("math" === this.mode && !1 === i.allowedInMath) throw new n("Can't use function '" + a + "' in math mode", r);
              var o = this.parseArguments(a, i),
                s = o.args,
                l = o.optArgs;
              return this.callFunction(a, s, l, r, e);
            }, t.callFunction = function (e, t, r, a, i) {
              var o = {
                  funcName: e,
                  parser: this,
                  token: a,
                  breakOnTokenText: i
                },
                s = yn[e];
              if (s && s.handler) return s.handler(o, t, r);
              throw new n("No function handler for " + e);
            }, t.parseArguments = function (e, t) {
              var r = t.numArgs + t.numOptionalArgs;
              if (0 === r) return {
                args: [],
                optArgs: []
              };
              for (var a = [], i = [], o = 0; o < r; o++) {
                var s = t.argTypes && t.argTypes[o],
                  l = o < t.numOptionalArgs;
                (t.primitive && null == s || "sqrt" === t.type && 1 === o && null == i[0]) && (s = "primitive");
                var h = this.parseGroupOfType("argument to '" + e + "'", s, l);
                if (l) i.push(h);else {
                  if (null == h) throw new n("Null argument, please report this as a bug");
                  a.push(h);
                }
              }
              return {
                args: a,
                optArgs: i
              };
            }, t.parseGroupOfType = function (e, t, r) {
              switch (t) {
                case "color":
                  return this.parseColorGroup(r);
                case "size":
                  return this.parseSizeGroup(r);
                case "url":
                  return this.parseUrlGroup(r);
                case "math":
                case "text":
                  return this.parseArgumentGroup(r, t);
                case "hbox":
                  var a = this.parseArgumentGroup(r, "text");
                  return null != a ? {
                    type: "styling",
                    mode: a.mode,
                    body: [a],
                    style: "text"
                  } : null;
                case "raw":
                  var i = this.parseStringGroup("raw", r);
                  return null != i ? {
                    type: "raw",
                    mode: "text",
                    string: i.text
                  } : null;
                case "primitive":
                  if (r) throw new n("A primitive argument cannot be optional");
                  var o = this.parseGroup(e);
                  if (null == o) throw new n("Expected group as " + e, this.fetch());
                  return o;
                case "original":
                case null:
                case void 0:
                  return this.parseArgumentGroup(r);
                default:
                  throw new n("Unknown group type as " + e, this.fetch());
              }
            }, t.consumeSpaces = function () {
              for (; " " === this.fetch().text;) {
                this.consume();
              }
            }, t.parseStringGroup = function (e, t) {
              var r = this.gullet.scanArgument(t);
              if (null == r) return null;
              for (var n, a = ""; "EOF" !== (n = this.fetch()).text;) {
                a += n.text, this.consume();
              }
              return this.consume(), r.text = a, r;
            }, t.parseRegexGroup = function (e, t) {
              for (var r, a = this.fetch(), i = a, o = ""; "EOF" !== (r = this.fetch()).text && e.test(o + r.text);) {
                o += (i = r).text, this.consume();
              }
              if ("" === o) throw new n("Invalid " + t + ": '" + a.text + "'", a);
              return a.range(i, o);
            }, t.parseColorGroup = function (e) {
              var t = this.parseStringGroup("color", e);
              if (null == t) return null;
              var r = /^(#[a-f0-9]{3}|#?[a-f0-9]{6}|[a-z]+)$/i.exec(t.text);
              if (!r) throw new n("Invalid color: '" + t.text + "'", t);
              var a = r[0];
              return /^[0-9a-f]{6}$/i.test(a) && (a = "#" + a), {
                type: "color-token",
                mode: this.mode,
                color: a
              };
            }, t.parseSizeGroup = function (e) {
              var t,
                r = !1;
              if (this.gullet.consumeSpaces(), !(t = e || "{" === this.gullet.future().text ? this.parseStringGroup("size", e) : this.parseRegexGroup(/^[-+]? *(?:$|\d+|\d+\.\d*|\.\d*) *[a-z]{0,2} *$/, "size"))) return null;
              e || 0 !== t.text.length || (t.text = "0pt", r = !0);
              var a = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(t.text);
              if (!a) throw new n("Invalid size: '" + t.text + "'", t);
              var i = {
                number: +(a[1] + a[2]),
                unit: a[3]
              };
              if (!D(i)) throw new n("Invalid unit: '" + i.unit + "'", t);
              return {
                type: "size",
                mode: this.mode,
                value: i,
                isBlank: r
              };
            }, t.parseUrlGroup = function (e) {
              this.gullet.lexer.setCatcode("%", 13), this.gullet.lexer.setCatcode("~", 12);
              var t = this.parseStringGroup("url", e);
              if (this.gullet.lexer.setCatcode("%", 14), this.gullet.lexer.setCatcode("~", 13), null == t) return null;
              var r = t.text.replace(/\\([#$%&~_^{}])/g, "$1");
              return {
                type: "url",
                mode: this.mode,
                url: r
              };
            }, t.parseArgumentGroup = function (e, t) {
              var r = this.gullet.scanArgument(e);
              if (null == r) return null;
              var n = this.mode;
              t && this.switchMode(t), this.gullet.beginGroup();
              var a = this.parseExpression(!1, "EOF");
              this.expect("EOF"), this.gullet.endGroup();
              var i = {
                type: "ordgroup",
                mode: this.mode,
                loc: r.loc,
                body: a
              };
              return t && this.switchMode(n), i;
            }, t.parseGroup = function (e, t) {
              var r,
                a = this.fetch(),
                i = a.text;
              if ("{" === i || "\\begingroup" === i) {
                this.consume();
                var o = "{" === i ? "}" : "\\endgroup";
                this.gullet.beginGroup();
                var s = this.parseExpression(!1, o),
                  l = this.fetch();
                this.expect(o), this.gullet.endGroup(), r = {
                  type: "ordgroup",
                  mode: this.mode,
                  loc: Mr.range(a, l),
                  body: s,
                  semisimple: "\\begingroup" === i || void 0
                };
              } else if (null == (r = this.parseFunction(t, e) || this.parseSymbol()) && "\\" === i[0] && !Cn.hasOwnProperty(i)) {
                if (this.settings.throwOnError) throw new n("Undefined control sequence: " + i, a);
                r = this.formatUnsupportedCmd(i), this.consume();
              }
              return r;
            }, t.formLigatures = function (e) {
              for (var t = e.length - 1, r = 0; r < t; ++r) {
                var n = e[r],
                  a = n.text;
                "-" === a && "-" === e[r + 1].text && (r + 1 < t && "-" === e[r + 2].text ? (e.splice(r, 3, {
                  type: "textord",
                  mode: "text",
                  loc: Mr.range(n, e[r + 2]),
                  text: "---"
                }), t -= 2) : (e.splice(r, 2, {
                  type: "textord",
                  mode: "text",
                  loc: Mr.range(n, e[r + 1]),
                  text: "--"
                }), t -= 1)), "'" !== a && "`" !== a || e[r + 1].text !== a || (e.splice(r, 2, {
                  type: "textord",
                  mode: "text",
                  loc: Mr.range(n, e[r + 1]),
                  text: a + a
                }), t -= 1);
              }
            }, t.parseSymbol = function () {
              var e = this.fetch(),
                t = e.text;
              if (/^\\verb[^a-zA-Z]/.test(t)) {
                this.consume();
                var r = t.slice(5),
                  a = "*" === r.charAt(0);
                if (a && (r = r.slice(1)), r.length < 2 || r.charAt(0) !== r.slice(-1)) throw new n("\\verb assertion failed --\n                    please report what input caused this bug");
                return {
                  type: "verb",
                  mode: "text",
                  body: r = r.slice(1, -1),
                  star: a
                };
              }
              Rn.hasOwnProperty(t[0]) && !ne[this.mode][t[0]] && (this.settings.strict && "math" === this.mode && this.settings.reportNonstrict("unicodeTextInMathMode", 'Accented Unicode text character "' + t[0] + '" used in math mode', e), t = Rn[t[0]] + t.substr(1));
              var i,
                o = bn.exec(t);
              if (o && ("i" === (t = t.substring(0, o.index)) ? t = "ı" : "j" === t && (t = "ȷ")), ne[this.mode][t]) {
                this.settings.strict && "math" === this.mode && "ÐÞþ".indexOf(t) >= 0 && this.settings.reportNonstrict("unicodeTextInMathMode", 'Latin-1/Unicode text character "' + t[0] + '" used in math mode', e);
                var s,
                  l = ne[this.mode][t].group,
                  h = Mr.range(e);
                if (ee.hasOwnProperty(l)) {
                  var c = l;
                  s = {
                    type: "atom",
                    mode: this.mode,
                    family: c,
                    loc: h,
                    text: t
                  };
                } else s = {
                  type: l,
                  mode: this.mode,
                  loc: h,
                  text: t
                };
                i = s;
              } else {
                if (!(t.charCodeAt(0) >= 128)) return null;
                this.settings.strict && (S(t.charCodeAt(0)) ? "math" === this.mode && this.settings.reportNonstrict("unicodeTextInMathMode", 'Unicode text character "' + t[0] + '" used in math mode', e) : this.settings.reportNonstrict("unknownSymbol", 'Unrecognized Unicode character "' + t[0] + '" (' + t.charCodeAt(0) + ")", e)), i = {
                  type: "textord",
                  mode: "text",
                  loc: Mr.range(e),
                  text: t
                };
              }
              if (this.consume(), o) for (var m = 0; m < o[0].length; m++) {
                var u = o[0][m];
                if (!On[u]) throw new n("Unknown accent ' " + u + "'", e);
                var p = On[u][this.mode] || On[u].text;
                if (!p) throw new n("Accent " + u + " unsupported in " + this.mode + " mode", e);
                i = {
                  type: "accent",
                  mode: this.mode,
                  loc: Mr.range(e),
                  label: p,
                  isStretchy: !1,
                  isShifty: !0,
                  base: i
                };
              }
              return i;
            }, e;
          }();
        Hn.endOfExpression = ["}", "\\endgroup", "\\end", "\\right", "&"];
        var En = function En(e, t) {
            if (!("string" == typeof e || e instanceof String)) throw new TypeError("KaTeX can only parse string typed expression");
            var r = new Hn(e, t);
            delete r.gullet.macros.current["\\df@tag"];
            var a = r.parse();
            if (delete r.gullet.macros.current["\\current@color"], delete r.gullet.macros.current["\\color"], r.gullet.macros.get("\\df@tag")) {
              if (!t.displayMode) throw new n("\\tag works only in display equations");
              a = [{
                type: "tag",
                mode: "text",
                body: a,
                tag: r.subparse([new zr("\\df@tag")])
              }];
            }
            return a;
          },
          Ln = function Ln(e, t, r) {
            t.textContent = "";
            var n = Pn(e, r).toNode();
            t.appendChild(n);
          };
        "undefined" != typeof document && "CSS1Compat" !== document.compatMode && ("undefined" != typeof console && console.warn("Warning: KaTeX doesn't work in quirks mode. Make sure your website has a suitable doctype."), Ln = function Ln() {
          throw new n("KaTeX doesn't work in quirks mode.");
        });
        var Dn = function Dn(e, t, r) {
            if (r.throwOnError || !(e instanceof n)) throw e;
            var a = Ve.makeSpan(["katex-error"], [new $(t)]);
            return a.setAttribute("title", e.toString()), a.setAttribute("style", "color:" + r.errorColor), a;
          },
          Pn = function Pn(e, t) {
            var r = new m(t);
            try {
              return function (e, t, r) {
                var n,
                  a = Mt(r);
                if ("mathml" === r.output) return St(e, t, a, r.displayMode, !0);
                if ("html" === r.output) {
                  var i = ut(e, a);
                  n = Ve.makeSpan(["katex"], [i]);
                } else {
                  var o = St(e, t, a, r.displayMode, !1),
                    s = ut(e, a);
                  n = Ve.makeSpan(["katex"], [o, s]);
                }
                return zt(n, r);
              }(En(e, r), e, r);
            } catch (t) {
              return Dn(t, e, r);
            }
          },
          Fn = {
            version: "0.16.0",
            render: Ln,
            renderToString: function renderToString(e, t) {
              return Pn(e, t).toMarkup();
            },
            ParseError: n,
            SETTINGS_SCHEMA: h,
            __parse: function __parse(e, t) {
              var r = new m(t);
              return En(e, r);
            },
            __renderToDomTree: Pn,
            __renderToHTMLTree: function __renderToHTMLTree(e, t) {
              var r = new m(t);
              try {
                return function (e, t, r) {
                  var n = ut(e, Mt(r)),
                    a = Ve.makeSpan(["katex"], [n]);
                  return zt(a, r);
                }(En(e, r), 0, r);
              } catch (t) {
                return Dn(t, e, r);
              }
            },
            __setFontMetrics: function __setFontMetrics(e, t) {
              A[e] = t;
            },
            __defineSymbol: ae,
            __defineMacro: Sr,
            __domTree: {
              Span: Y,
              Anchor: X,
              SymbolNode: $,
              SvgNode: Z,
              PathNode: K,
              LineNode: J
            }
          };
        return t = t.default;
      }();
    }, e.exports = n();
  }, function (e, t, r) {}]);
}
;
var _default2 = t();
exports.default = _default2;

/***/ }),

/***/ 512:
/*!********************************************************************************************************************************************!*\
  !*** /Users/zhangzhenfeng/Documents/duyi/project/mysite-uni-app/packageA/uni_modules/zero-markdown-view/components/mp-html/style/index.js ***!
  \********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _parser = _interopRequireDefault(__webpack_require__(/*! ./parser */ 513));
/**
 * @fileoverview style 插件
 */

function Style() {
  this.styles = [];
}
Style.prototype.onParse = function (node, vm) {
  // 获取样式
  if (node.name === 'style' && node.children.length && node.children[0].type === 'text') {
    this.styles = this.styles.concat(new _parser.default().parse(node.children[0].text));
  } else if (node.name) {
    // 匹配样式（对非文本标签）
    // 存储不同优先级的样式 name < class < id < 后代
    var matched = ['', '', '', ''];
    for (var i = 0, len = this.styles.length; i < len; i++) {
      var item = this.styles[i];
      var res = match(node, item.key || item.list[item.list.length - 1]);
      var j = void 0;
      if (res) {
        // 后代选择器
        if (!item.key) {
          j = item.list.length - 2;
          for (var k = vm.stack.length; j >= 0 && k--;) {
            // 子选择器
            if (item.list[j] === '>') {
              // 错误情况
              if (j < 1 || j > item.list.length - 2) break;
              if (match(vm.stack[k], item.list[j - 1])) {
                j -= 2;
              } else {
                j++;
              }
            } else if (match(vm.stack[k], item.list[j])) {
              j--;
            }
          }
          res = 4;
        }
        if (item.key || j < 0) {
          // 添加伪类
          if (item.pseudo && node.children) {
            var text = void 0;
            item.style = item.style.replace(/content:([^;]+)/, function (_, $1) {
              text = $1.replace(/['"]/g, '')
              // 处理 attr 函数
              .replace(/attr\((.+?)\)/, function (_, $1) {
                return node.attrs[$1.trim()] || '';
              })
              // 编码 \xxx
              .replace(/\\(\w{4})/, function (_, $1) {
                return String.fromCharCode(parseInt($1, 16));
              });
              return '';
            });
            var pseudo = {
              name: 'span',
              attrs: {
                style: item.style
              },
              children: [{
                type: 'text',
                text: text
              }]
            };
            if (item.pseudo === 'before') {
              node.children.unshift(pseudo);
            } else {
              node.children.push(pseudo);
            }
          } else {
            matched[res - 1] += item.style + (item.style[item.style.length - 1] === ';' ? '' : ';');
          }
        }
      }
    }
    matched = matched.join('');
    if (matched.length > 2) {
      node.attrs.style = matched + (node.attrs.style || '');
    }
  }
};

/**
 * @description 匹配样式
 * @param {object} node 要匹配的标签
 * @param {string|string[]} keys 选择器
 * @returns {number} 0：不匹配；1：name 匹配；2：class 匹配；3：id 匹配
 */
function match(node, keys) {
  function matchItem(key) {
    if (key[0] === '#') {
      // 匹配 id
      if (node.attrs.id && node.attrs.id.trim() === key.substr(1)) return 3;
    } else if (key[0] === '.') {
      // 匹配 class
      key = key.substr(1);
      var selectors = (node.attrs.class || '').split(' ');
      for (var i = 0; i < selectors.length; i++) {
        if (selectors[i].trim() === key) return 2;
      }
    } else if (node.name === key) {
      // 匹配 name
      return 1;
    }
    return 0;
  }

  // 多选择器交集
  if (keys instanceof Array) {
    var res = 0;
    for (var j = 0; j < keys.length; j++) {
      var tmp = matchItem(keys[j]);
      // 任意一个不匹配就失败
      if (!tmp) return 0;
      // 优先级最大的一个作为最终优先级
      if (tmp > res) {
        res = tmp;
      }
    }
    return res;
  }
  return matchItem(keys);
}
var _default = Style;
exports.default = _default;

/***/ }),

/***/ 513:
/*!*********************************************************************************************************************************************!*\
  !*** /Users/zhangzhenfeng/Documents/duyi/project/mysite-uni-app/packageA/uni_modules/zero-markdown-view/components/mp-html/style/parser.js ***!
  \*********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var blank = {
  ' ': true,
  '\n': true,
  '\t': true,
  '\r': true,
  '\f': true
};
function Parser() {
  this.styles = [];
  this.selectors = [];
}

/**
 * @description 解析 css 字符串
 * @param {string} content css 内容
 */
Parser.prototype.parse = function (content) {
  new Lexer(this).parse(content);
  return this.styles;
};

/**
 * @description 解析到一个选择器
 * @param {string} name 名称
 */
Parser.prototype.onSelector = function (name) {
  // 不支持的选择器
  if (name.includes('[') || name.includes('*') || name.includes('@')) return;
  var selector = {};
  // 伪类
  if (name.includes(':')) {
    var info = name.split(':');
    var pseudo = info.pop();
    if (pseudo === 'before' || pseudo === 'after') {
      selector.pseudo = pseudo;
      name = info[0];
    } else return;
  }

  // 分割交集选择器
  function splitItem(str) {
    var arr = [];
    var i, start;
    for (i = 1, start = 0; i < str.length; i++) {
      if (str[i] === '.' || str[i] === '#') {
        arr.push(str.substring(start, i));
        start = i;
      }
    }
    if (!arr.length) {
      return str;
    } else {
      arr.push(str.substring(start, i));
      return arr;
    }
  }

  // 后代选择器
  if (name.includes(' ')) {
    selector.list = [];
    var list = name.split(' ');
    for (var i = 0; i < list.length; i++) {
      if (list[i].length) {
        // 拆分子选择器
        var arr = list[i].split('>');
        for (var j = 0; j < arr.length; j++) {
          selector.list.push(splitItem(arr[j]));
          if (j < arr.length - 1) {
            selector.list.push('>');
          }
        }
      }
    }
  } else {
    selector.key = splitItem(name);
  }
  this.selectors.push(selector);
};

/**
 * @description 解析到选择器内容
 * @param {string} content 内容
 */
Parser.prototype.onContent = function (content) {
  // 并集选择器
  for (var i = 0; i < this.selectors.length; i++) {
    this.selectors[i].style = content;
  }
  this.styles = this.styles.concat(this.selectors);
  this.selectors = [];
};

/**
 * @description css 词法分析器
 * @param {object} handler 高层处理器
 */
function Lexer(handler) {
  this.selector = '';
  this.style = '';
  this.handler = handler;
}
Lexer.prototype.parse = function (content) {
  this.i = 0;
  this.content = content;
  this.state = this.blank;
  for (var len = content.length; this.i < len; this.i++) {
    this.state(content[this.i]);
  }
};
Lexer.prototype.comment = function () {
  this.i = this.content.indexOf('*/', this.i) + 1;
  if (!this.i) {
    this.i = this.content.length;
  }
};
Lexer.prototype.blank = function (c) {
  if (!blank[c]) {
    if (c === '/' && this.content[this.i + 1] === '*') {
      this.comment();
      return;
    }
    this.selector += c;
    this.state = this.name;
  }
};
Lexer.prototype.name = function (c) {
  if (c === '/' && this.content[this.i + 1] === '*') {
    this.comment();
    return;
  }
  if (c === '{' || c === ',' || c === ';') {
    this.handler.onSelector(this.selector.trimEnd());
    this.selector = '';
    if (c !== '{') {
      while (blank[this.content[++this.i]]) {
        ;
      }
    }
    if (this.content[this.i] === '{') {
      this.floor = 1;
      this.state = this.val;
    } else {
      this.selector += this.content[this.i];
    }
  } else if (blank[c]) {
    this.selector += ' ';
  } else {
    this.selector += c;
  }
};
Lexer.prototype.val = function (c) {
  if (c === '/' && this.content[this.i + 1] === '*') {
    this.comment();
    return;
  }
  if (c === '{') {
    this.floor++;
  } else if (c === '}') {
    this.floor--;
    if (!this.floor) {
      this.handler.onContent(this.style);
      this.style = '';
      this.state = this.blank;
      return;
    }
  }
  this.style += c;
};
var _default = Parser;
exports.default = _default;

/***/ })

}]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/packageA/common/vendor.js.map