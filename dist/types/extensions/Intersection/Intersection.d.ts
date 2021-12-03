import { BaseComponent, Components, Options, Splide } from '@splidejs/splide';
import { IntersectionOptions } from '../../types';
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
        'intersection': (entry: IntersectionObserverEntry) => void;
        'intersection:in': (entry: IntersectionObserverEntry) => void;
        'intersection:out': (entry: IntersectionObserverEntry) => void;
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
export declare function Intersection(Splide: Splide, Components: Components, options: Options): IntersectionComponent;
//# sourceMappingURL=../../../../src/js/extensions/Intersection/Intersection.d.ts.map