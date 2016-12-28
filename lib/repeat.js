/**
 * Created by ningfujun on 16/12/28.
 */
let postcss = require('postcss');
let _ = require('underscore');
let __ = require('lodash');

class remove {
  constructor(rule) {
    let that = this;

    let rn = rule.nodes.concat();


    that.init(rn);
  }

  init(rn) {
    let that = this;
    // let ie = that.ieHack(rn);

    // that.loop(ie);
    _.compose(that.loop, that.ieHack)(rn);
  }

  ieHack(rn) {
    return _.filter(rn, (val) => {
      var vl = val.value || '\\';

      return vl.indexOf('\\') == -1;
    });
  }

  loop(nn) {
    let that = this;
    //开始迭代
    var l = 0, rl = nn.length;

    while (l < rl) {
      filter(nn);

      nn = _.rest(nn);

      l++;
    }

    function filter(arr) {
      let that = this;

      let now = arr[0], ns, ss;

      _.map(arr, (value, key) => {
        if (key > 0) {
          ns = 0;
          ss = 1;

          switch (now.prop) {
            case 'background':
              break;
            case 'cursor':
              break;
            default:
              ns = __.trim(now.raws.before) + now.prop;
              ss = __.trim(value.raws.before) + value.prop;
          }

          if (ns == ss) {
            now.remove();
          }
        }
      });
    }
  }
}

module.exports = postcss.plugin('postcss-repeat', function (opts) {
  opts = opts || {};

  return function (css) {
    css.walkRules((rule) => {
      new remove(rule);
  });
  };
});
