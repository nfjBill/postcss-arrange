/**
 * Created by ningfujun on 16/12/28.
 */
'use strict';

let postcss = require('postcss');
let _ = require('underscore');

function replace(content, conf) {
  let setting = {};

  _.extend(setting, {
    compress: true,

    'autoprefixer': {browsers: ['> 0%']},
    'cssnext': {
      features: {}
    },
    // 'customStr': {
    //   'aaa': 'bbb'
    // },
    'pxtorem': {
      // rootValue: 10,
      // propWhiteList:[]
    },
    'unused':{
      fontFace:false
    },
    flexbox:false
  }, conf);

  //对mobile文件名的样式文件进行rem特殊处理 用于自适应
  // if(file){
  //   if (file.filename.indexOf('mobile') != -1) {
  //     setting.pxtorem = {
  //       rootValue: 20,
  //       propWhiteList: [],
  //     };
  //   }
  // }

  let auto = [
    /**
     * 这部分主要针对css进行自动化设置
     */
    // //自制 针对sprite设置根路径
    // require('postcss-rootsprite'),
    //自制 去重复插件
    require('./lib/repeat'),

    //autoprefixer
    require('autoprefixer')(setting.autoprefixer),
    //透明度兼容
    require('./lib/opacity'),
    //针对rgba进行兼容16位判断
    require('postcss-color-rgba-fallback'),
    //简化写法
    // require('postcss-cssnext')(setting['cssnext']),
    //自定义替换字符串
    // require('postcss-customStr')(setting['customStr']),
    //filter 模糊之类的
    require('pleeease-filters'),
    //any-link
    require('postcss-pseudo-class-any-link'),
    //match
    require("postcss-selector-matches"),
    //pxtorem
    require("postcss-pxtorem")(setting.pxtorem)
  ];

  if(setting.flexbox){
    auto = auto.concat([require('postcss-flexbox')]);
  }

  let compress = [
    /**
     * 这部分主要针对css进行优化技术压缩
     */
    //颜色压缩
    require('postcss-colormin'),
    //无用数值删除
    require('postcss-convert-values'),
    //内嵌注释删除
    require('postcss-discard-comments'),
    //无用语句删除
    require('postcss-discard-empty'),
    //未使用keyframe删除
    require('postcss-discard-unused')(setting.unused),
    //合并相同的keyframe
    require('postcss-merge-idents'),
    //合并过长的margin
    require('postcss-merge-longhand'),
    //合并同属性css 当使用hack的时候回出现bug 暂时不用
    require('postcss-merge-rules'),
    //缩减字体的长度
    require('postcss-minify-font-values'),
    //简写gradients属性
    require('postcss-minify-gradients'),
    //缩短选择器之间的空格
    require('postcss-minify-selectors'),
    //整理css顺序的不规范行为
    require('postcss-ordered-values'),
    //缩短keyframe名称
    require('postcss-reduce-idents'),
    //缩短css3动画属性
    require('postcss-reduce-transforms'),
    // //svg替代base64 ie9不支持base64 这个东西只支持异步 暂时不用了
    // require('postcss-svgo'),
    //选择器去重复
    require('postcss-unique-selectors'),
    //优化zindex输出
    // require('postcss-zindex'),
    //优化css排列顺序
    require("postcss-sorting")
  ];

  if (setting.compress) {
    auto = auto.concat(compress);
  }

  return postcss(auto).process(content).css;
}


module.exports = replace;