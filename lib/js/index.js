;(function(global, factory) {
  var hasDefine = typeof define === 'function',
      hasExports = typeof module !== 'undefined' && module.exports
  if (hasDefine) {
    define(factory)
  } else if (hasExports) {
    module.exports = factory()
  } else {
    global.ColorPicker = factory()
  }
})(this, (function() {
  'use strict'

  function classCallCheck(instance, Constructor) {
    // 是否不是特定构造函数的实例
    if (!(instance instanceof Constructor)) {
      throw new TypeError(`
          Cannot call a class as function!!!
        `)
    }
  }
  var ColorPicker = function() {
    function ColorPicker(el, color, option) {
      var _that = this
      console.log(ColorPicker)
      console.log(this instanceof ColorPicker)

      classCallCheck(this, ColorPicker)

    }
    return ColorPicker
  }()
  return ColorPicker
}))
