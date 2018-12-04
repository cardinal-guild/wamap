require("core-js/modules/es6.promise")
require("core-js/modules/es6.array.iterator")
require("core-js/modules/es6.array.from")
require("whatwg-fetch/fetch")
require("es6-map/implement")
require('babel-polyfill')

if (!Math.cbrt) {
  Math.cbrt = (function (pow) {
    return function cbrt (){ 
      // ensure negative numbers remain negative:
      return x < 0 ? -pow(-x, 1/3) : pow(x, 1/3);
    };
  })(Math.pow); // localize Math.pow to increase efficiency
}