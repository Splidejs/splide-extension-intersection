/*!
 * @splidejs/splide-extension-intersection
 * Version  : 0.1.0
 * License  : MIT
 * Copyright: 2021 Naotoshi Fujita
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

  var EVENT_INTERSECTION = "intersection";
  var EVENT_INTERSECTION_IN = "intersection:in";
  var EVENT_INTERSECTION_OUT = "intersection:out";

  function Intersection(Splide3, Components2, options) {
    var _EventInterface = EventInterface(Splide3),
        emit = _EventInterface.emit;

    var intersectionOptions = options.intersection || {};
    var observer;

    function mount() {
      observer = new IntersectionObserver(onIntersect, {
        root: intersectionOptions.root,
        rootMargin: intersectionOptions.rootMargin,
        threshold: intersectionOptions.threshold
      });
      observer.observe(Splide3.root);
    }

    function destroy() {
      observer.disconnect();
      observer = null;
    }

    function onIntersect(entries) {
      var entry = entries[0];

      if (entry) {
        entry.isIntersecting ? inView(entry) : outView(entry);
        emit(EVENT_INTERSECTION, entry);
      }
    }

    function inView(entry) {
      var _a, _b;

      var inOptions = intersectionOptions.inView || {};

      if (inOptions.keyboard === true) {
        Components2.Keyboard.disable(false);
      }

      if (options.autoplay && inOptions.autoplay === true) {
        Components2.Autoplay.play();
      }

      if (inOptions.autoScroll === true) {
        (_a = Components2.AutoScroll) == null ? void 0 : _a.play();
      }

      if (inOptions.video === true) {
        (_b = Components2.Video) == null ? void 0 : _b.play();
      }

      emit(EVENT_INTERSECTION_IN, entry);
    }

    function outView(entry) {
      var _a, _b;

      var outOptions = intersectionOptions.outView || {};

      if (outOptions.keyboard === false) {
        Components2.Keyboard.disable(true);
      }

      if (outOptions.autoplay === false) {
        Components2.Autoplay.pause();
      }

      if (outOptions.autoScroll === false) {
        (_a = Components2.AutoScroll) == null ? void 0 : _a.pause();
      }

      if (outOptions.video === false) {
        (_b = Components2.Video) == null ? void 0 : _b.pause();
      }

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
   * Version  : 3.6.0
   * License  : MIT
   * Copyright: 2021 Naotoshi Fujita
   */

});
//# sourceMappingURL=splide-extension-intersection.js.map
