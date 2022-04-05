/*!
 * @splidejs/splide-extension-intersection
 * Version  : 0.2.0
 * License  : MIT
 * Copyright: 2022 Naotoshi Fujita
 */
(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) : factory();
})(function () {
  'use strict';

  function empty(array) {
    array.length = 0;
  }

  function slice$1(arrayLike, start, end) {
    return Array.prototype.slice.call(arrayLike, start, end);
  }

  function apply$1(func) {
    return func.bind.apply(func, [null].concat(slice$1(arguments, 1)));
  }

  function typeOf$1(type, subject) {
    return typeof subject === type;
  }

  var isArray = Array.isArray;
  apply$1(typeOf$1, "function");
  apply$1(typeOf$1, "string");
  apply$1(typeOf$1, "undefined");

  function toArray(value) {
    return isArray(value) ? value : [value];
  }

  function forEach(values, iteratee) {
    toArray(values).forEach(iteratee);
  }

  var ownKeys$1 = Object.keys;

  function forOwn$1(object, iteratee, right) {
    if (object) {
      var keys = ownKeys$1(object);
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

  function assign(object) {
    slice$1(arguments, 1).forEach(function (source) {
      forOwn$1(source, function (value, key) {
        object[key] = source[key];
      });
    });
    return object;
  }

  function EventBinder() {
    var listeners = [];

    function bind(targets, events, callback, options) {
      forEachEvent(targets, events, function (target, event, namespace) {
        var isEventTarget = ("addEventListener" in target);
        var remover = isEventTarget ? target.removeEventListener.bind(target, event, callback, options) : target["removeListener"].bind(target, callback);
        isEventTarget ? target.addEventListener(event, callback, options) : target["addListener"](callback);
        listeners.push([target, event, namespace, callback, remover]);
      });
    }

    function unbind(targets, events, callback) {
      forEachEvent(targets, events, function (target, event, namespace) {
        listeners = listeners.filter(function (listener) {
          if (listener[0] === target && listener[1] === event && listener[2] === namespace && (!callback || listener[3] === callback)) {
            listener[4]();
            return false;
          }

          return true;
        });
      });
    }

    function dispatch(target, type, detail) {
      var e;
      var bubbles = true;

      if (typeof CustomEvent === "function") {
        e = new CustomEvent(type, {
          bubbles: bubbles,
          detail: detail
        });
      } else {
        e = document.createEvent("CustomEvent");
        e.initCustomEvent(type, bubbles, false, detail);
      }

      target.dispatchEvent(e);
      return e;
    }

    function forEachEvent(targets, events, iteratee) {
      forEach(targets, function (target) {
        target && forEach(events, function (events2) {
          events2.split(" ").forEach(function (eventNS) {
            var fragment = eventNS.split(".");
            iteratee(target, fragment[0], fragment[1]);
          });
        });
      });
    }

    function destroy() {
      listeners.forEach(function (data) {
        data[4]();
      });
      empty(listeners);
    }

    return {
      bind: bind,
      unbind: unbind,
      dispatch: dispatch,
      destroy: destroy
    };
  }

  var EVENT_DESTROY = "destroy";

  function EventInterface(Splide2) {
    var bus = Splide2 ? Splide2.event.bus : document.createDocumentFragment();
    var binder = EventBinder();

    function on(events, callback) {
      binder.bind(bus, toArray(events).join(" "), function (e) {
        callback.apply(callback, isArray(e.detail) ? e.detail : []);
      });
    }

    function emit(event) {
      binder.dispatch(bus, event, slice$1(arguments, 1));
    }

    if (Splide2) {
      Splide2.event.on(EVENT_DESTROY, binder.destroy);
    }

    return assign(binder, {
      bus: bus,
      on: on,
      off: apply$1(binder.unbind, bus),
      emit: emit
    });
  }

  function slice(arrayLike, start, end) {
    return Array.prototype.slice.call(arrayLike, start, end);
  }

  function apply(func) {
    return func.bind.apply(func, [null].concat(slice(arguments, 1)));
  }

  function typeOf(type, subject) {
    return typeof subject === type;
  }

  apply(typeOf, "function");
  apply(typeOf, "string");
  var isUndefined = apply(typeOf, "undefined");
  var ownKeys = Object.keys;

  function forOwn(object, iteratee, right) {
    if (object) {
      var keys = ownKeys(object);
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

  function Handlers(Splide2) {
    var Components = Splide2.Components;
    return {
      keyboard: {
        enable: function enable() {
          Components.Keyboard.disable(false);
        },
        disable: function disable() {
          Components.Keyboard.disable(true);
        }
      },
      autoplay: {
        enable: function enable() {
          if (Splide2.options.autoplay) {
            Components.Autoplay.play();
          }
        },
        disable: function disable() {
          Components.Autoplay.pause();
        }
      },
      autoScroll: {
        enable: function enable() {
          var AutoScroll = Components.AutoScroll;
          AutoScroll && AutoScroll.play();
        },
        disable: function disable() {
          var AutoScroll = Components.AutoScroll;
          AutoScroll && AutoScroll.pause();
        }
      },
      video: {
        enable: function enable() {
          var Video = Components.Video;
          Video && Video.play();
        },
        disable: function disable() {
          var Video = Components.Video;
          Video && Video.pause();
        }
      }
    };
  }

  function Intersection(Splide2, Components2, options) {
    var _EventInterface = EventInterface(Splide2),
        emit = _EventInterface.emit;

    var intersectionOptions = options.intersection || {};
    var handlers = Handlers(Splide2);
    var observer;

    function mount() {
      if (window.IntersectionObserver) {
        observer = new IntersectionObserver(onIntersect, {
          root: intersectionOptions.root,
          rootMargin: intersectionOptions.rootMargin,
          threshold: intersectionOptions.threshold
        });
        observer.observe(Splide2.root);
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
      forOwn(options2, function (value, key) {
        if (!isUndefined(value)) {
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
});
//# sourceMappingURL=splide-extension-intersection.js.map
