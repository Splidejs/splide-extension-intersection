import { BaseComponent, Components, EventInterface, Options, Splide } from '@splidejs/splide';
import { forOwn, isUndefined } from '@splidejs/splide/src/js/utils';
import { EVENT_INTERSECTION, EVENT_INTERSECTION_IN, EVENT_INTERSECTION_OUT } from '../../constants/events';
import { IntersectionOptions, IntersectionViewOptions } from '../../types';
import { Handlers } from './Handlers';


/**
 * Lets the compiler know this component.
 */
declare module '@splidejs/splide' {
  interface Options {
    intersection?: IntersectionOptions;
  }

  interface Components {
    Intersection?: IntersectionComponent;
  }

  interface EventMap {
    'intersection': ( entry: IntersectionObserverEntry ) => void;
    'intersection:in': ( entry: IntersectionObserverEntry ) => void;
    'intersection:out': ( entry: IntersectionObserverEntry ) => void;
  }
}

/**
 * The interface for the Intersection component.
 *
 * @since 0.1.0
 */
export interface IntersectionComponent extends BaseComponent {
}

/**
 * The extension for adding Intersection Observer to the slider.
 *
 * @since 0.1.0
 *
 * @param Splide     - A Splide instance.
 * @param Components - A collection of components.
 * @param options    - Options.
 *
 * @return An Intersection component object.
 */
export function Intersection( Splide: Splide, Components: Components, options: Options ): IntersectionComponent {
  const { emit } = EventInterface( Splide );
  const intersectionOptions = options.intersection || {};
  const handlers = Handlers( Splide );

  /**
   * Holds the active IntersectionObserver instance.
   */
  let observer: IntersectionObserver;

  /**
   * Called when the component is mounted.
   */
  function mount(): void {
    if ( window.IntersectionObserver ) {
      observer = new IntersectionObserver( onIntersect, {
        root      : intersectionOptions.root,
        rootMargin: intersectionOptions.rootMargin,
        threshold : intersectionOptions.threshold,
      } );

      observer.observe( Splide.root );
    }
  }

  /**
   * Called when the Splide instance is destroyed.
   */
  function destroy(): void {
    if ( observer ) {
      observer.disconnect();
      observer = null;
    }
  }

  /**
   * The callback function of the Intersection Observer.
   *
   * @param entries - An array with entries.
   */
  function onIntersect( [ entry ]: IntersectionObserverEntry[] ): void {
    if ( entry ) {
      entry.isIntersecting ? inView( entry ) : outView( entry );
      emit( EVENT_INTERSECTION, entry );
    }
  }

  /**
   * According to the provided view options, call the proper hanlder function.
   *
   * @param options - View options.
   */
  function handle( options: IntersectionViewOptions ): void {
    forOwn( options, ( value, key ) => {
      if ( ! isUndefined( value ) ) {
        const handler = handlers[ key ];
        value ? handler.enable() : handler.disable();
      }
    } );
  }

  /**
   * Called when the slider goes inside the viewport.
   *
   * @param entry - An IntersectionObserverEntry object.
   */
  function inView( entry: IntersectionObserverEntry ): void {
    handle( intersectionOptions.inView || {} );
    emit( EVENT_INTERSECTION_IN, entry );

    if ( intersectionOptions.once ) {
      destroy();
    }
  }

  /**
   * Called when the slider goes out of the viewport.
   *
   * @param entry - An IntersectionObserverEntry object.
   */
  function outView( entry: IntersectionObserverEntry ): void {
    handle( intersectionOptions.outView || {} );
    emit( EVENT_INTERSECTION_OUT, entry );
  }

  return {
    mount,
    destroy,
  };
}
