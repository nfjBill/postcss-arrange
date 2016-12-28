/**
 * Created by ningfujun on 16/12/28.
 */
let postcss = require('postcss');
// let _ = require('lodash');

module.exports = postcss.plugin('postcss-opacity', function (opts) {
  opts = opts || {};

  let PROP = 'opacity';
  let PROP_REPLACE = '-ms-filter';
  let PROP_FILTER = 'filter';

  return function (css) {
    css.walkRules((rule) => {

      // find if a filter opacity is already present
      let isFilterAlreadyPresent = false;
      rule.walkDecls(PROP_REPLACE, function () {
        isFilterAlreadyPresent = true;
      });

      if (!isFilterAlreadyPresent) {
        rule.walkDecls(PROP, (decl) => {
          // get amount and create value
          let amount = Math.floor(decl.value * 100);
          let VAL_REPLACE = '"progid:DXImageTransform.Microsoft.Alpha(Opacity=' + amount + ')"';
          let VAL_FILTER = 'alpha(opacity=' + amount + ')';

          // adds new property only if it's not present yet
          rule.insertAfter(decl, {prop: PROP_FILTER, value: VAL_FILTER});

          let kf = decl.parent.parent.name || '';

          //keyframe就不加了 因为加了也没用
          if(kf.indexOf('keyframes') == -1){
            rule.insertAfter(decl, {prop: PROP_REPLACE, value: VAL_REPLACE});
          }
        });
      }
    });
  };
});
