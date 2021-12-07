(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.MoveAble = mod.exports.default;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = void 0;

  function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

  var MoveAble = /*#__PURE__*/function () {
    function MoveAble(ele) {
      var _this = this;

      this.moveTarget = ele;
      this.lastX = undefined;
      this.lastY = undefined;

      if (getComputedStyle(ele).display === 'inline' && ['IMG', 'VIDEO'].indexOf(ele.tagName) === -1) {
        throw 'Opps, is that target a transformable element?';
      }

      this._move = function (e) {
        var _this$lastX, _this$lastY;

        _newArrowCheck(this, _this);

        e.preventDefault();
        this.lastX = (_this$lastX = this.lastX) !== null && _this$lastX !== void 0 ? _this$lastX : e.clientX;
        this.lastY = (_this$lastY = this.lastY) !== null && _this$lastY !== void 0 ? _this$lastY : e.clientY;
        var dx = e.clientX - this.lastX;
        var dy = e.clientY - this.lastY;
        var style = getComputedStyle(this.moveTarget);

        if (style.transform === 'none') {
          this.moveTarget.style.transform = "matrix(1,0,0,1," + dx + "," + dy + ")";
        } else {
          var matrix = this.moveTarget.style.transform;
          var matrixArr = matrix.replace('matrix(', '').replace(')', '').split(',');
          matrixArr[4] = Number(matrixArr[4]) + dx;
          matrixArr[5] = Number(matrixArr[5]) + dy;
          this.moveTarget.style.transform = "matrix(" + matrixArr.join() + ")";
        }

        this.lastX = e.clientX;
        this.lastY = e.clientY;
      }.bind(this);

      this._init();
    }

    var _proto = MoveAble.prototype;

    _proto._init = function _init() {
      var _this2 = this;

      this.moveTarget.addEventListener('mousedown', function (e) {
        _newArrowCheck(this, _this2);

        window.addEventListener('mousemove', this._move, true);
      }.bind(this), true);
      window.addEventListener('mouseup', function (e) {
        _newArrowCheck(this, _this2);

        window.removeEventListener('mousemove', this._move, true);
        this.lastX = undefined;
        this.lastY = undefined;
      }.bind(this), true);
    };

    return MoveAble;
  }();

  _exports["default"] = MoveAble;
});
