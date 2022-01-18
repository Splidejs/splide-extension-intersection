/*!
 * @splidejs/splide-extension-intersection
 * Version  : 0.1.4
 * License  : MIT
 * Copyright: 2022 Naotoshi Fujita
 */
(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) : factory();
})(function () {
  'use strict';

  function isArray(subject) {
    return Array.isArray(subject);
  }

  function toArray(value) {
    return isArray(value) ? value : [value];
  }

  function forEach(values, iteratee) {
    toArray(values).forEach(iteratee);
  }

  var EVENT_DESTROY = "destroy";

  function EventInterface(Splide22) {
    var event = Splide22.event;
    var key = {};
    var listeners = [];

    function on(events, callback, priority) {
      event.on(events, callback, key, priority);
    }

    function off(events) {
      event.off(events, key);
    }

    function bind(targets, events, callback, options) {
      forEachEvent(targets, events, function (target, event2) {
        listeners.push([target, event2, callback, options]);
        target.addEventListener(event2, callback, options);
      });
    }

    function unbind(targets, events, callback) {
      forEachEvent(targets, events, function (target, event2) {
        listeners = listeners.filter(function (listener) {
          if (listener[0] === target && listener[1] === event2 && (!callback || listener[2] === callback)) {
            target.removeEventListener(event2, listener[2], listener[3]);
            return false;
          }

          return true;
        });
      });
    }

    function forEachEvent(targets, events, iteratee) {
      forEach(targets, function (target) {
        if (target) {
          events.split(" ").forEach(iteratee.bind(null, target));
        }
      });
    }

    function destroy() {
      listeners = listeners.filter(function (data) {
        return unbind(data[0], data[1]);
      });
      event.offBy(key);
    }

    event.on(EVENT_DESTROY, destroy, key);
    return {
      on: on,
      off: off,
      emit: event.emit,
      bind: bind,
      unbind: unbind,
      destroy: destroy
    };
  }

  function isUndefined2(subject) {
    return typeof subject === "undefined";
  }

  function forOwn2(object, iteratee, right) {
    if (object) {
      var keys = Object.keys(object);
      keys = right ? keys.reverse() : keys;

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];

        if (key !== "__proto__") {
          if (iteratee(object[key], key) === false) {
            break;
          }
        }
      }
    }

    return object;
  }

  var EVENT_INTERSECTION = "intersection";
  var EVENT_INTERSECTION_IN = "intersection:in";
  var EVENT_INTERSECTION_OUT = "intersection:out";

  function Handlers(Splide3) {
    var Components2 = Splide3.Components;
    return {
      keyboard: {
        enable: function enable() {
          Components2.Keyboard.disable(false);
        },
        disable: function disable() {
          Components2.Keyboard.disable(true);
        }
      },
      autoplay: {
        enable: function enable() {
          if (Splide3.options.autoplay) {
            Components2.Autoplay.play();
          }
        },
        disable: function disable() {
          Components2.Autoplay.pause();
        }
      },
      autoScroll: {
        enable: function enable() {
          var _a;

          (_a = Components2.AutoScroll) == null ? void 0 : _a.play();
        },
        disable: function disable() {
          var _a;

          (_a = Components2.AutoScroll) == null ? void 0 : _a.pause();
        }
      },
      video: {
        enable: function enable() {
          var _a;

          (_a = Components2.Video) == null ? void 0 : _a.play();
        },
        disable: function disable() {
          var _a;

          (_a = Components2.Video) == null ? void 0 : _a.pause();
        }
      }
    };
  }

  function Intersection(Splide3, Components2, options) {
    var _EventInterface = EventInterface(Splide3),
        emit = _EventInterface.emit;

    var intersectionOptions = options.intersection || {};
    var handlers = Handlers(Splide3);
    var observer;

    function mount() {
      if (window.IntersectionObserver) {
        observer = new IntersectionObserver(onIntersect, {
          root: intersectionOptions.root,
          rootMargin: intersectionOptions.rootMargin,
          threshold: intersectionOptions.threshold
        });
        observer.observe(Splide3.root);
      }
    }

    function destroy() {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    }

    function onIntersect(_ref) {
      var entry = _ref[0];

      if (entry) {
        entry.isIntersecting ? inView(entry) : outView(entry);
        emit(EVENT_INTERSECTION, entry);
      }
    }

    function handle(options2) {
      forOwn2(options2, function (value, key) {
        if (!isUndefined2(value)) {
          var handler = handlers[key];
          value ? handler.enable() : handler.disable();
        }
      });
    }

    function inView(entry) {
      handle(intersectionOptions.inView || {});
      emit(EVENT_INTERSECTION_IN, entry);

      if (intersectionOptions.once) {
        destroy();
      }
    }

    function outView(entry) {
      handle(intersectionOptions.outView || {});
      emit(EVENT_INTERSECTION_OUT, entry);
    }

    return {
      mount: mount,
      destroy: destroy
    };
  }

  if (typeof window !== "undefined") {
    window.splide = window.splide || {};
    window.splide.Extensions = window.splide.Extensions || {};
    window.splide.Extensions.Intersection = Intersection;
  }
  /*!
   * Splide.js
   * Version  : 3.6.10
   * License  : MIT
   * Copyright: 2022 Naotoshi Fujita
   */

});
//# sourceMappingURL=splide-extension-intersection.js.map
