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

  var ColorPicker = function() {
    function ColorPicker(el, color, option) {
      this.el = el
      this.color = color
      this.option = option
    }
    return ColorPicker
  }()
  return ColorPicker
}))
