/**
 *
 */
;(function(global, factory) {
  var hasDefine = typeof define === 'function',
      hasExports = typeof module !== 'undefined' && module.exports
  if (hasDefine) {
    define(factory)
  } else if (hasExports) {
    module.exports = factory()
  } else {
    global.InputColor = factory()
  }
})(this, (function() {
  'use strict'

  function ColorPickerElement() {
    let element = {}
    let arr = ['color', 'color_picker', 'color_mask', 'hue_picker', 'hue_mask', 'transparent', 'transparent_mask', 'transparent_picker', 'preview', 'now', 'determine', 'cancel', 'mask']

    arr.forEach(key => {
      return element[key] = createElement('', {
        className: key
      })
    })
  }

  var createElement = function createElement(HTMLElementTagName, attribute, childs) {
    let el = document.createElement(HTMLElementTagName || 'div')
  }

  var ColorPicker = function() {
    function ColorPicker(color) {
      let _this = this
      // maybe missing callcheckclass!
      let element = ColorPickerElement()
      this.element = element
    }
    return ColorPicker
  }();
  var _createClass = function() {
    /**
     * [defineProperties description]
     * @param  {[type]} target [defineProperty object]
     * @param  {[type]} props  [array event]
     */
    function defineProperties(target, props) {
      for (let i = 0; i < props.length; i++) {
        let desc = props[i]
        /**
         * [desc description]
         * @type {[type]} enumerable [default false,]
         * 当且仅当该属性的enumerable为true时，该属性才能够出现在对象的枚举属性中。默认为 false
         * @type {[type]} configurable [default false]
         * 当且仅当该属性的 configurable 为 true时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为 false
         * @type {[type]} configurable [writable false]
         * 当且仅当该属性的writable为true时，value才能被赋值运算符改变。默认为 false。
         */
        desc.enumerable = desc.enumerable || false
        desc.configurable = true
        if('value' in desc) desc.writable = true
        Object.defineProperty(target, desc.key, desc)
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps)
      if (staticProps) defineProperties(Constructor, staticProps)
        return Constructor
    }
  }()
  var InputColor = function() {
    /**
     * [InputColor description]
     * @param {[type]} el     [HTMLElement]
     * @param {[type]} color  [r,g,b]
     * @param {[type]} option [shared:Boolean]
     */
    function InputColor(el, color, option) {
      this.el = el
      el.addEventListener(`click`, () => {
        this.showPicker()
      })
    }

    _createClass(InputColor, [
        {
          key: 'showPicker',
          value: function showPicker() {
          }
        },
        {}
      ])
    return InputColor
  }()
  return InputColor
}))
