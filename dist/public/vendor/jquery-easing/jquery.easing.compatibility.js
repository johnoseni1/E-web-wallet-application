"use strict";

/*
 * Easing Compatibility v1 - http://gsgd.co.uk/sandbox/jquery/easing
 *
 * Adds compatibility for applications that use the pre 1.2 easing names
 *
 * Copyright (c) 2007 George Smith
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 */
(function ($) {
  $.extend($.easing, {
    easeIn: function easeIn(x, t, b, c, d) {
      return $.easing.easeInQuad(x, t, b, c, d);
    },
    easeOut: function easeOut(x, t, b, c, d) {
      return $.easing.easeOutQuad(x, t, b, c, d);
    },
    easeInOut: function easeInOut(x, t, b, c, d) {
      return $.easing.easeInOutQuad(x, t, b, c, d);
    },
    expoin: function expoin(x, t, b, c, d) {
      return $.easing.easeInExpo(x, t, b, c, d);
    },
    expoout: function expoout(x, t, b, c, d) {
      return $.easing.easeOutExpo(x, t, b, c, d);
    },
    expoinout: function expoinout(x, t, b, c, d) {
      return $.easing.easeInOutExpo(x, t, b, c, d);
    },
    bouncein: function bouncein(x, t, b, c, d) {
      return $.easing.easeInBounce(x, t, b, c, d);
    },
    bounceout: function bounceout(x, t, b, c, d) {
      return $.easing.easeOutBounce(x, t, b, c, d);
    },
    bounceinout: function bounceinout(x, t, b, c, d) {
      return $.easing.easeInOutBounce(x, t, b, c, d);
    },
    elasin: function elasin(x, t, b, c, d) {
      return $.easing.easeInElastic(x, t, b, c, d);
    },
    elasout: function elasout(x, t, b, c, d) {
      return $.easing.easeOutElastic(x, t, b, c, d);
    },
    elasinout: function elasinout(x, t, b, c, d) {
      return $.easing.easeInOutElastic(x, t, b, c, d);
    },
    backin: function backin(x, t, b, c, d) {
      return $.easing.easeInBack(x, t, b, c, d);
    },
    backout: function backout(x, t, b, c, d) {
      return $.easing.easeOutBack(x, t, b, c, d);
    },
    backinout: function backinout(x, t, b, c, d) {
      return $.easing.easeInOutBack(x, t, b, c, d);
    }
  });
})(jQuery);