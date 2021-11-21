/*!
 * @splidejs/splide-extension-intersection
 * Version  : 0.1.0
 * License  : MIT
 * Copyright: 2021 Naotoshi Fujita
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

// src/js/constants/events.ts
var EVENT_INTERSECTION = "intersection";
var EVENT_INTERSECTION_IN = "intersection:in";
var EVENT_INTERSECTION_OUT = "intersection:out";

// src/js/extensions/Intersection/Intersection.ts
function Intersection(Splide3, Components2, options) {
  const { emit } = EventInterface(Splide3);
  const intersectionOptions = options.intersection || {};
  let observer;
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
    const [entry] = entries;
    if (entry) {
      entry.isIntersecting ? inView(entry) : outView(entry);
      emit(EVENT_INTERSECTION, entry);
    }
  }
  function inView(entry) {
    const inOptions = intersectionOptions.inView || {};
    if (inOptions.keyboard === true) {
      Components2.Keyboard.disable(false);
    }
    if (options.autoplay && inOptions.autoplay === true) {
      Components2.Autoplay.play();
    }
    if (inOptions.autoScroll === true) {
      Components2.AutoScroll?.play();
    }
    if (inOptions.video === true) {
      Components2.Video?.play();
    }
    emit(EVENT_INTERSECTION_IN, entry);
  }
  function outView(entry) {
    const outOptions = intersectionOptions.outView || {};
    if (outOptions.keyboard === false) {
      Components2.Keyboard.disable(true);
    }
    if (outOptions.autoplay === false) {
      Components2.Autoplay.pause();
    }
    if (outOptions.autoScroll === false) {
      Components2.AutoScroll?.pause();
    }
    if (outOptions.video === false) {
      Components2.Video?.pause();
    }
    emit(EVENT_INTERSECTION_OUT, entry);
  }
  return {
    mount,
    destroy
  };
}
/*!
 * Splide.js
 * Version  : 3.6.0
 * License  : MIT
 * Copyright: 2021 Naotoshi Fujita
 */

export { Intersection };
