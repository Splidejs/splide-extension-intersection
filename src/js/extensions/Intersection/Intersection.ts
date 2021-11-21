import { BaseComponent, Components, EventInterface, Options, Splide } from '@splidejs/splide';
import { AutoScrollComponent } from '@splidejs/splide-extension-auto-scroll';
import { VideoComponent } from '@splidejs/splide-extension-video/dist/types/extensions/Video/Video';
import { EVENT_INTERSECTION, EVENT_INTERSECTION_IN, EVENT_INTERSECTION_OUT } from '../../constants/events';
import { IntersectionOptions } from '../../types/options';


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
 * @return An AutoScroll component object.
 */
export function Intersection( Splide: Splide, Components: Components, options: Options ): IntersectionComponent {
  const { emit } = EventInterface( Splide );
  const intersectionOptions = options.intersection || {};

  /**
   * Holds the active IntersectionObserver instance.
   */
  let observer: IntersectionObserver;

  /**
   * Called when the component is mounted.
   */
  function mount(): void {
    observer = new IntersectionObserver( onIntersect, {
      root      : intersectionOptions.root,
      rootMargin: intersectionOptions.rootMargin,
      threshold : intersectionOptions.threshold,
    } );

    observer.observe( Splide.root );
  }

  /**
   * Called when the Splide instance is destroyed.
   */
  function destroy(): void {
    observer.disconnect();
    observer = null;
  }

  /**
   * The callback function of the Intersection Observer.
   *
   * @param entries - An array with entries.
   */
  function onIntersect( entries: IntersectionObserverEntry[] ): void {
    const [ entry ] = entries;

    if ( entry ) {
      entry.isIntersecting ? inView( entry ) : outView( entry );
      emit( EVENT_INTERSECTION, entry );
    }
  }

  /**
   * Called when the slider goes inside the viewport.
   *
   * @param entry - An IntersectionObserverEntry object.
   */
  function inView( entry: IntersectionObserverEntry ): void {
    const inOptions = intersectionOptions.inView || {};

    if ( inOptions.keyboard === true ) {
      Components.Keyboard.disable( false );
    }

    if ( options.autoplay && inOptions.autoplay === true ) {
      Components.Autoplay.play();
    }

    if ( inOptions.autoScroll === true ) {
      ( Components.AutoScroll as AutoScrollComponent )?.play();
    }

    if ( inOptions.video === true ) {
      ( Components.Video as VideoComponent )?.play();
    }

    emit( EVENT_INTERSECTION_IN, entry );
  }

  /**
   * Called when the slider goes out of the viewport.
   *
   * @param entry - An IntersectionObserverEntry object.
   */
  function outView( entry: IntersectionObserverEntry ): void {
    const outOptions = intersectionOptions.outView || {};

    if ( outOptions.keyboard === false ) {
      Components.Keyboard.disable( true );
    }

    if ( outOptions.autoplay === false ) {
      Components.Autoplay.pause();
    }

    if ( outOptions.autoScroll === false ) {
      ( Components.AutoScroll as AutoScrollComponent )?.pause();
    }

    if ( outOptions.video === false ) {
      ( Components.Video as VideoComponent )?.pause();
    }

    emit( EVENT_INTERSECTION_OUT, entry );
  }

  return {
    mount,
    destroy,
  };
}
