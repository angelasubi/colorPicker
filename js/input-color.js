(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.InputColor = factory());
}(this, (function () { 'use strict';

    var ADD_ATTRIBUTE_FILTER = ['style', 'className', 'value', 'id'];

    var element_attr_add = {
        style: function style(el, list) {
            return Object.keys(list).forEach(function (key) {
                return el.style[key] = list[key];
            });
        },
        className: function className(el, name) {
            return el.className = name;
        },
        value: function value(el, val) {
            return el.value = val;
        },
        id: function id(el, idName) {
            return el.id = idName;
        }

        /**
         *
         * @param {Element} element
         * @param {object} attribute
         */
    };
    var attr = function attr(element, attribute) {
        var keys = Object.keys(attribute);
        keys.forEach(function (key) {
            return ADD_ATTRIBUTE_FILTER.indexOf(key) > -1 ? element_attr_add[key](element, attribute[key]) : element.setAttribute(key, attribute[key]);
        });
    };
    /**
     * 添加节点
     * @param {HTMLElement} element
     * @param {Array<HTMLElement> | String | HTMLElement} childs
     */
    var appendChilds = function appendChilds(element, childs) {
        if (childs instanceof Array) {
            childs.forEach(function (child) {
                return element.appendChild(child);
            });
        } else if (typeof childs === 'string') {
            element.appendChild(document.createTextNode(childs));
        } else if (childs instanceof HTMLElement) {
            element.appendChild(childs);
        } else {
            console.info('传入的不是HTMLElement数组或字符串或HTMLElement');
        }
    };

    /**
     * 创建DOM结构
     * @param {string} elementType
     * @param {Object=} attribute
     * @param {Array<HTMLElement> | String | HTMLElement=} childs
     */
    var createElement = function createElement(htmlElementTagName, attribute, childs) {
        var el = document.createElement(htmlElementTagName || 'div');
        var argLen = arguments.length;
        if (argLen === 3) {
            attr(el, attribute);
            appendChilds(el, childs);
        } else if (argLen === 2) {
            var arg = arguments[1];
            if (arg instanceof Array || arg instanceof HTMLElement || typeof childs === 'string') {

                appendChilds(el, arg);
            } else if (typeof arg === 'string') {
                el.appendChild(document.createTextNode(arg));
            } else {
                attr(el, arg);
            }
        }
        return el;
    };

    function ColorPickerElement() {

        var element = {};
        ['color', 'color_picker', 'color_mask', 'hue_picker', 'hue_mask', 'transparent', 'transparent_mask', 'transparent_picker', 'preview', 'now', 'determine', 'cancel', 'mask'].forEach(function (key) {
            return element[key] = createElement('', { className: key });
        });
        var inputs = [];
        ["rgb", "hex", "hsv"].forEach(function (key, i) {
            var ele = createElement("", { className: key }, key);
            ele.onclick = function () {
                temp[0].className = '';
                temp[1].style.display = 'none';
                inputList["input_" + key].style.display = 'block';
                this.className = "select";
                temp[0] = this;
                temp[1] = inputList["input_" + key];
            };
            inputs[i] = ele;
        });

        'rgbhsve'.split('').forEach(function (key) {
            return element[key] = createElement('input', { className: key });
        });
        element.rgba = createElement('input');
        element.hsva = createElement('input');
        element.hexa = createElement('input');
        element.transparent.appendChild(element.transparent_picker);
        element.transparent.appendChild(element.transparent_mask);
        element.color.appendChild(element.color_picker);
        element.color.appendChild(element.color_mask);

        var input_rgb = createElement('', { className: 'input_rgb', style: { display: 'block' } }, [createElement('span', 'R'), element.r, createElement('span', 'G'), element.g, createElement('span', 'B'), element.b, createElement('p', [createElement('span', '透明度'), element.rgba])]);

        var input_hex = createElement('', { className: 'input_hex' }, [createElement('span', 'HEX'), element.e, createElement('p', [createElement('span', '透明度'), element.hexa])]);

        var input_hsv = createElement('', { className: 'input_hsv' }, [createElement('span', 'H'), element.h, createElement('span', 'S'), element.s, createElement('span', 'V'), element.v, createElement('p', [createElement('span', '透明度'), element.hsva])]);

        var inputList = {
            input_rgb: input_rgb, input_hex: input_hex, input_hsv: input_hsv
        };
        element.all = createElement('button', { className: 'color_panel' }, [element.mask, element.color, createElement('', { className: 'hue' }, [element.hue_picker, element.hue_mask]), element.transparent, createElement('', { className: 'other' }, [createElement('', { className: 'color_contrast' }, [element.now, element.preview]), createElement('', { className: 'btns' }, inputs)]), createElement('', { className: 'inputs' }, [input_rgb, input_hex, input_hsv]), createElement('', { className: 'submit' }, [element.determine, element.cancel])]);
        element.determine.innerText = '确定';
        element.cancel.innerText = '取消';

        var temp = [inputs[0], input_rgb];
        inputs[0].className = 'select';
        element.inputs = inputs;
        return element;
    }

    var colorTypeToRGB = function colorTypeToRGB(color) {

        if (typeof color === "string") {
            var reg = /^#[0-9a-fA-F]{6}$/g;
            if (reg.test(color)) {
                var rgb = {
                    r: parseInt("0x" + color.slice(1, 3)),
                    g: parseInt("0x" + color.slice(3, 5)),
                    b: parseInt("0x" + color.slice(5, 7))
                };
                return rgb;
            } else {
                if (reg.test(/rgb\([0-9]{1-3}\,[0-9]{1-3}\,[0-9]{1-3}\)|rgba\([0-9]{1-3}\,[0-9]{1-3}\,[0-9]{1-3}\,[\d\.]+\)/)) return { r: 0, g: 0, b: 0 };
                var list = color.match(/[0-9]+/g);
                var r = ~~list[0],
                    g = ~~list[1],
                    b = ~~list[2];
                return list.length === 4 ? { r: r, g: g, b: b, a: ~~list[3] } : { r: r, g: g, b: b };
            }
        }

        return color.r === undefined ? hsl2rgb(color) : color;
    };

    var hsv2rgb = function hsv2rgb(hsv) {

        var rgb = {},
            h = hsv.h,
            s = hsv.s,
            v = hsv.v,
            hi = Math.floor(h / 60),
            f = h / 60 - hi,
            p = v * (1 - s),
            q = v * (1 - s * f),
            t = v * (1 - (1 - f) * s);

        switch (hi) {
            case 0:
                rgb = {
                    r: v,
                    g: t,
                    b: p
                };break;
            case 1:
                rgb = {
                    r: q,
                    g: v,
                    b: p
                };break;
            case 2:
                rgb = {
                    r: p,
                    g: v,
                    b: t
                };break;
            case 3:
                rgb = {
                    r: p,
                    g: q,
                    b: v
                };break;
            case 4:
                rgb = {
                    r: t,
                    g: p,
                    b: v
                };break;
            case 5:
                rgb = {
                    r: v,
                    g: p,
                    b: q
                };break;
            default:
                break;
        }

        rgb.r = Math.round(rgb.r * 255);
        rgb.g = Math.round(rgb.g * 255);
        rgb.b = Math.round(rgb.b * 255);

        return rgb;
    };

    var rgb2hsv = function rgb2hsv(rgb) {
        var rr = void 0,
            gg = void 0,
            bb = void 0,
            r = rgb.r / 255,
            g = rgb.g / 255,
            b = rgb.b / 255,
            h = void 0,
            s = void 0,
            v = Math.max(r, g, b),
            diff = v - Math.min(r, g, b),
            diffc = function diffc(c) {
            return (v - c) / 6 / diff + 1 / 2;
        };
        if (diff == 0) {
            h = s = 0;
        } else {
            s = diff / v;
            rr = diffc(r);
            gg = diffc(g);
            bb = diffc(b);

            if (r === v) {
                h = bb - gg;
            } else if (g === v) {
                h = 1 / 3 + rr - bb;
            } else if (b === v) {
                h = 2 / 3 + gg - rr;
            }
            if (h < 0) {
                h += 1;
            } else if (h > 1) {
                h -= 1;
            }
        }
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100) / 100,
            v: Math.round(v * 100) / 100
        };
    };

    var rgba2string = function rgba2string(_ref2, o) {
        var r = _ref2.r,
            g = _ref2.g,
            b = _ref2.b,
            a = _ref2.a;

        if (o !== undefined && o !== 1) return "rgba(" + r + "," + g + "," + b + "," + o + ")";else if (o !== undefined && o === 1) return "rgb(" + r + "," + g + "," + b + ")";
        if (a !== undefined && a !== 1) return "rgba(" + r + "," + g + "," + b + "," + a + ")";
        return "rgb(" + r + "," + g + "," + b + ")";
    };

    var rgb2hex = function rgb2hex(_ref3) {
        var r = _ref3.r,
            g = _ref3.g,
            b = _ref3.b;

        return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    var _createClass = function () {
        function defineProperties(target, props) {
             for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var oninput = function oninput(input, min, max, fn, context) {

        input.oninput = function (e) {

            var value = this.value;
            value = parseInt(value);
            if (isNaN(value)) value = 0;else if (value < min) value = 0;else if (value > max) value = max;
            this.value = value;
            fn(value, context);
        };

        input.onblur = function () {
            return context.isMouseOut && context.hide();
        };
    };
    var on = function on(el, fn, context) {
        el.onmousedown = function (e) {
            var doc = document,
                body = doc.body;
            body.className = 'user-select-none';
            body.unselectable = "on";
            body.onselectstart = function () {
                return false;
            };
            var rect = this.getBoundingClientRect(),
                me = context,
                x = e.clientX - rect.left,
                y = e.clientY - rect.top;
            fn(x, y, me);
            doc.onmousemove = function (e) {
                var x = e.clientX - rect.left,
                    y = e.clientY - rect.top;
                x = x < 0 ? 0 : x > rect.right - rect.left ? rect.right - rect.left : x;
                y = y < 0 ? 0 : y > rect.bottom - rect.top ? rect.bottom - rect.top : y;
                fn(x, y, me);
            };
            doc.onmouseup = function () {
                body.className = body.unselectable = '';
                doc.onmousemove = body.onselectstar = doc.onmouseup = null;
            };
        };
    };
    var setBgColor = function setBgColor(el, _ref, opacity) {
        var r = _ref.r,
            g = _ref.g,
            b = _ref.b;

        el.style.backgroundColor = opacity === undefined || opacity === 1 ? 'rgb(' + r + ',' + g + ',' + b + ')' : 'rgb(' + r + ',' + g + ',' + b + ',' + opacity + ')';
    };

    var ColorPicker = function () {
        function ColorPicker(color) {
            var _this = this;

            _classCallCheck(this, ColorPicker);

            var element = ColorPickerElement();
            this.element = element;
            this.onDetermine = this.onCancel = this.onColorChange = null;
            this.width = 222;
            on(element.color_mask, function (x, y, me) {
                element.color_picker.style.left = x / 2 + "%";
                element.color_picker.style.top = y + '%';
                me.setSV(x / 200, (100 - y) / 100);
            }, this);

            on(element.transparent_mask, function (x, y, me) {
                element.transparent_picker.style.left = x / 2 + '%';
                me.setOpacity(x / 200);
            }, this);

            on(element.hue_mask, function (x, y, me) {
                element.hue_picker.style.left = x / 2 + '%';
                me.setHue(x / 20 * 36);
            }, this);

            element.all.onblur = function () {
                return _this.isMouseOut && _this.hide();
            };
            this.isMouseOut = false;
            element.all.onmouseenter = function () {
                return _this.isMouseOut = false;
            };
            element.all.onmouseleave = function () {
                return _this.isMouseOut = true;
            };
            element.mask.onclick = function () {
                return _this.hide();
            };
            oninput(element.h, 0, 359, function (value, me) {
                return me.setHSV_H(value);
            }, this);
            oninput(element.s, 0, 100, function (value, me) {
                return me.setHSV_S(value / 100);
            }, this);
            oninput(element.v, 0, 100, function (value, me) {
                return me.setHSV_V(value / 100);
            }, this);

            ['r', 'g', 'b'].forEach(function (key) {
                return oninput(element[key], 0, 255, function (value, me) {
                    return me.setRGB_unit(key, value);
                }, _this);
            });
            ['rgba', 'hsva', 'hexa'].forEach(function (key) {
                return oninput(element[key], 0, 100, function (value, me) {
                    return me.setOpacity(value / 100, true);
                }, _this);
            });
            var me = this;
            element.e.oninput = function () {
                var value = this.value;
                var reg = /^[0-9A-Fa-f]{6}$/g;
                if (reg.test(value)) me.initColor('#' + value);
            };
            element.determine.onclick = function () {
                _this.onCancel = null;
                _this.onDetermine && _this.onDetermine(_this.getData());
                _this.hide();
            };

            element.cancel.onclick = function () {
                _this.onCancel && _this.onCancel(_this.getData());
                _this.hide();
            };
            document.body.appendChild(element.all);
            this.initColor(color);
        }

        _createClass(ColorPicker, [{
            key: 'show',
            value: function show(rect, color, callback) {
                var width = rect.right - rect.left;
                var height = rect.bottom - rect.top + 10;
                if (window.innerWidth - rect.left < this.width) {
                    this.element.all.style.marginLeft = -(this.width - (window.innerWidth - rect.left)) + 'px';
                    this.element.mask.style.marginLeft = this.width - (window.innerWidth - rect.left) + 'px';
                } else {
                    this.element.mask.style.marginLeft = this.element.all.style.marginLeft = 0;
                }

                this.element.mask.style.width = width + 'px';
                this.element.mask.style.height = height + 'px';
                this.element.mask.style.top = -height + 'px';
                this.element.mask.style.left = 0 + 'px';
                this.element.all.style.left = rect.left + 'px';
                this.element.all.style.top = rect.bottom + 'px';

                this.element.all.className = 'color_panel show';

                this.isMouseOut = true;
                this.initColor(color);

                this.callback = callback;
                this.element.all.focus();
            }
        }, {
            key: 'hide',
            value: function hide() {
                this.element.all.className = 'color_panel';
                this.onCancel && this.onCancel(this.getData());
            }
        }, {
            key: 'initColor',
            value: function initColor(color) {
                if (color !== undefined) {
                    this.rgb = colorTypeToRGB(color);
                    this.hsv = rgb2hsv(this.rgb);
                    this.opacity = this.rgb.a === undefined ? 1 : this.rgb.a;
                } else {
                    this.rgb = { r: 0, g: 0, b: 0 };
                    this.hsv = { h: 0, s: 0, v: 0 };
                    this.opacity = 1;
                }

                var hue = hsv2rgb({ h: this.hsv.h, s: 1, v: 1 });
                this.element.color_picker.style.borderColor = this.hsv.v < 0.5 ? "#fff" : "#000";
                setBgColor(this.element.color, hue);
                setBgColor(this.element.transparent, this.rgb);
                setBgColor(this.element.now, this.rgb, this.opacity);
                this.setPreviewColor();
                this.element.color_picker.style.top = 100 - this.hsv.v * 100 + "%";
                this.element.color_picker.style.left = this.hsv.s * 100 + "%";
                this.element.hue_picker.style.left = this.hsv.h / 36 * 10 + "%";
                this.element.transparent_picker.style.left = this.opacity * 100 + "%";
                this.element.r.value = this.rgb.r;
                this.setRGB_value();
                this.element.h.value = this.hsv.h;
                this.element.s.value = this.hsv.s * 100;
                this.element.v.value = this.hsv.v * 100;
                this.element.e.value = rgb2hex(this.rgb);
                this.element.rgba.value = this.element.hexa.value = this.element.hsva.value = this.opacity * 100;
            }
        }, {
            key: 'getData',
            value: function getData() {
                return {
                    rgb: this.rgb,
                    hex: this.hex,
                    rgbStr: rgba2string(this.rgb, this.opacity),
                    opacity: this.opacity
                };
            }
        }, {
            key: 'setPreviewColor',
            value: function setPreviewColor() {
                setBgColor(this.element.preview, this.rgb, this.opacity);
                this.onColorChange && this.onColorChange({
                    rgb: this.rgb,
                    hex: rgb2hex(this.rgb),
                    rgbStr: rgba2string(this.rgb, this.opacity),
                    opacity: this.opacity
                });
            }
        }, {
            key: 'setHue',
            value: function setHue(x) {
                x = Math.round(x);
                if (x === 360) x = 0;
                this.hsv.h = Math.round(x);

                this.rgb = hsv2rgb(this.hsv);
                var hue = hsv2rgb({ h: this.hsv.h, s: 1, v: 1 });
                setBgColor(this.element.color, hue);
                setBgColor(this.element.transparent, this.rgb);
                this.setPreviewColor();
                this.setRGB_value();
                this.element.h.value = this.hsv.h;
                this.element.e.value = rgb2hex(this.rgb);
            }
        }, {
            key: 'setSV',
            value: function setSV(s, v) {
                this.hsv.s = s;
                this.hsv.v = v;
                this.element.color_picker.style.borderColor = v < 0.5 ? "#fff" : "#000";
                this.rgb = hsv2rgb(this.hsv);
                setBgColor(this.element.transparent, this.rgb);
                this.setPreviewColor();
                this.setRGB_value();
                this.element.s.value = Math.round(this.hsv.s * 100);
                this.element.v.value = Math.round(this.hsv.v * 100);
                this.element.e.value = rgb2hex(this.rgb);
            }
        }, {
            key: 'setOpacity',
            value: function setOpacity(opacity, isinput) {
                this.opacity = opacity;
                this.setPreviewColor();
                this.element.rgba.value = this.element.hexa.value = this.element.hsva.value = Math.round(this.opacity * 100);
                if (isinput) this.element.transparent_picker.style.left = this.opacity * 100 + "%";
            }
        }, {
            key: 'setRGB_unit',
            value: function setRGB_unit(type, value) {
                if (this.rgb[type] === value) return;
                this.rgb[type] = value;
                this.hsv = rgb2hsv(this.rgb);
                var hue = hsv2rgb({ h: this.hsv.h, s: 1, v: 1 });
                setBgColor(this.element.color, hue);
                setBgColor(this.element.transparent, this.rgb);
                this.setPreviewColor();
                this.element.color_picker.style.borderColor = this.hsv.v < 0.5 ? "#fff" : "#000";
                this.element.color_picker.style.top = 100 - this.hsv.v * 100 + "%";
                this.element.color_picker.style.left = this.hsv.s * 100 + "%";
                this.element.hue_picker.style.left = this.hsv.h / 36 * 10 + "%";
                this.element.h.value = this.hsv.h;
                this.element.s.value = this.hsv.s * 100;
                this.element.v.value = this.hsv.v * 100;
                this.element.e.value = rgb2hex(this.rgb);
            }
        }, {
            key: 'setHSV_H',
            value: function setHSV_H(h) {
                if (this.hsv.h === h) return;
                this.hsv.h = h;
                this.rgb = hsv2rgb(this.hsv);

                setBgColor(this.element.color, this.rgb);
                setBgColor(this.element.transparent, this.rgb);
                this.setPreviewColor();

                this.setRGB_value();
                this.element.hue_picker.style.left = this.hsv.h / 36 * 10 + "%";
                this.element.e.value = rgb2hex(this.rgb);
            }
        }, {
            key: 'setHSV_S',
            value: function setHSV_S(s) {
                if (this.hsv.s === s) return;
                this.hsv.s = s;
                this.rgb = hsv2rgb(this.hsv);
                setBgColor(this.element.transparent, this.rgb);
                this.setPreviewColor();
                this.setRGB_value();
                this.element.color_picker.style.left = this.hsv.s * 100 + "%";
                this.element.e.value = rgb2hex(this.rgb);
            }
        }, {
            key: 'setHSV_V',
            value: function setHSV_V(v) {
                if (this.hsv.v === v) return;
                this.hsv.v = v;
                this.rgb = hsv2rgb(this.hsv);
                this.element.color_picker.style.borderColor = this.hsv.v < 0.5 ? "#fff" : "#000";
                setBgColor(this.element.transparent, this.rgb);
                this.setPreviewColor();
                this.setRGB_value();
                this.element.color_picker.style.top = 100 - this.hsv.v * 100 + "%";
                this.element.e.value = rgb2hex(this.rgb);
            }
        }, {
            key: 'setRGB_value',
            value: function setRGB_value() {
                this.element.r.value = this.rgb.r;
                this.element.g.value = this.rgb.g;
                this.element.b.value = this.rgb.b;
            }
        }]);

        return ColorPicker;
    }();

    var colorPicker = null;

    var InputColor = function () {
        /**
         *
         * @param {HTMLElement} el
         * @param {String | {r:Number,g:Number,b:Number}} color
         * @param {{shared:Boolean}} option
         */
        function InputColor(el, color, option) {
            var _this2 = this;

            _classCallCheck(this, InputColor);

            this.shared = option && option.shared === true;
            if (this.shared) {
                this.colorPicker = new ColorPicker(color);
            } else {
                if (colorPicker === null) colorPicker = new ColorPicker(color);
                this.colorPicker = colorPicker;
            }
            this.styleColorType = option && option.styleColorType ? option.styleColorType : 'backgroundColor';

            this.color = color ? colorTypeToRGB(color) : { r: 0, g: 0, b: 0 };
            this.el = el;
            var me = this;
            this.setBgColor(this.color);
            this.onPopup = option && option.onPopup ? option.onPopup : null;
            el.addEventListener('click', function () {
                me.showPicker();
            });
            this.onColorChange = function (color) {
                _this2.el.style[_this2.styleColorType] = color.rgbStr;
                option && option.onChange && option.onChange(color);
            };
            this.onDetermine = function (color) {
                _this2.backgroundColor = _this2.el.style[_this2.styleColorType] = color.rgbStr;
                option && option.onDetermine && option.onDetermine(color);
            };
            this.onCancel = function (color) {
                _this2.el.style[_this2.styleColorType] = _this2.backgroundColor;
                option && option.onCancel && option.onCancel(_this2.backgroundColor);
            };
            this.backgroundColor = '';
        }

        _createClass(InputColor, [{
            key: 'showPicker',
            value: function showPicker() {
                this.backgroundColor = this.el.style[this.styleColorType];
                var rect = this.el.getBoundingClientRect();
                this.colorPicker.onColorChange = this.onColorChange;
                this.colorPicker.onDetermine = this.onDetermine;
                this.colorPicker.onCancel = this.onCancel;
                this.onPopup && this.onPopup();
                console.log(this.el.style[this.styleColorType]);
                this.colorPicker.show(rect, this.el.style[this.styleColorType]);
            }
        }, {
            key: 'setBgColor',
            value: function setBgColor(color, opacity) {
                this.el.style[this.styleColorType] = rgba2string(color, opacity);
            }
        }]);

        return InputColor;
    }();

    return InputColor;

})));
