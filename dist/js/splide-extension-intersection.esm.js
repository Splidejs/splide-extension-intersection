/*!
 * @splidejs/splide-extension-intersection
 * Version  : 0.1.6
 * License  : MIT
 * Copyright: 2022 Naotoshi Fujita
 */
// node_modules/@splidejs/splide/dist/js/splide.esm.js
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
  const { event } = Splide22;
  const key = {};
  let listeners = [];
  function on(events, callback, priority) {
    event.on(events, callback, key, priority);
  }
  function off(events) {
    event.off(events, key);
  }
  function bind(targets, events, callback, options) {
    forEachEvent(targets, events, (target, event2) => {
      listeners.push([target, event2, callback, options]);
      target.addEventListener(event2, callback, options);
    });
  }
  function unbind(targets, events, callback) {
    forEachEvent(targets, events, (target, event2) => {
      listeners = listeners.filter((listener) => {
        if (listener[0] === target && listener[1] === event2 && (!callback || listener[2] === callback)) {
          target.removeEventListener(event2, listener[2], listener[3]);
          return false;
        }
        return true;
      });
    });
  }
  function forEachEvent(targets, events, iteratee) {
    forEach(targets, (target) => {
      if (target) {
        events.split(" ").forEach(iteratee.bind(null, target));
      }
    });
  }
  function destroy() {
    listeners = listeners.filter((data) => unbind(data[0], data[1]));
    event.offBy(key);
  }
  event.on(EVENT_DESTROY, destroy, key);
  return {
    on,
    off,
    emit: event.emit,
    bind,
    unbind,
    destroy
  };
}

// node_modules/@splidejs/splide/src/js/utils/type/type.ts
function isUndefined2(subject) {
  return typeof subject === "undefined";
}

// node_modules/@splidejs/splide/src/js/utils/object/forOwn/forOwn.ts
function forOwn2(object, iteratee, right) {
  if (object) {
    let keys = Object.keys(object);
    keys = right ? keys.reverse() : keys;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key !== "__proto__") {
        if (iteratee(object[key], key) === false) {
          break;
        }
      }
    }
  }
  return object;
}

// src/js/constants/events.ts
var EVENT_INTERSECTION = "intersection";
var EVENT_INTERSECTION_IN = "intersection:in";
var EVENT_INTERSECTION_OUT = "intersection:out";

// src/js/extensions/Intersection/Handlers.ts
function Handlers(Splide3) {
  const { Components: Components2 } = Splide3;
  return {
    keyboard: {
      enable() {
        Components2.Keyboard.disable(false);
      },
      disable() {
        Components2.Keyboard.disable(true);
      }
    },
    autoplay: {
      enable() {
        if (Splide3.options.autoplay) {
          Components2.Autoplay.play();
        }
      },
      disable() {
        Components2.Autoplay.pause();
      }
    },
    autoScroll: {
      enable() {
        const AutoScroll = Components2.AutoScroll;
        AutoScroll && AutoScroll.play();
      },
      disable() {
        const AutoScroll = Components2.AutoScroll;
        AutoScroll && AutoScroll.pause();
      }
    },
    video: {
      enable() {
        const Video = Components2.Video;
        Video && Video.play();
      },
      disable() {
        const Video = Components2.Video;
        Video && Video.pause();
      }
    }
  };
}

// src/js/extensions/Intersection/Intersection.ts
function Intersection(Splide3, Components2, options) {
  const { emit } = EventInterface(Splide3);
  const intersectionOptions = options.intersection || {};
  const handlers = Handlers(Splide3);
  let observer;
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
  function onIntersect([entry]) {
    if (entry) {
      entry.isIntersecting ? inView(entry) : outView(entry);
      emit(EVENT_INTERSECTION, entry);
    }
  }
  function handle(options2) {
    forOwn2(options2, (value, key) => {
      if (!isUndefined2(value)) {
        const handler = handlers[key];
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
    mount,
    destroy
  };
}
/*!
 * Splide.js
 * Version  : 3.6.11
 * License  : MIT
 * Copyright: 2022 Naotoshi Fujita
 */

export { Intersection };
