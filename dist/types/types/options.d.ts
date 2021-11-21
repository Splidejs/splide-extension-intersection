/**
 * The interface for options of the IntersectionOptions component.
 *
 * @since 0.1.0
 */
export interface IntersectionOptions {
    /**
     * The element that is used as a viewport.
     */
    root?: Element | Document | null;
    /**
     * Margin around the root element.
     */
    rootMargin?: string;
    /**
     * A threshold or an array with thresholds for percentage when the IntersectionObserver callback is executed.
     */
    threshold?: number | number[];
    /**
     * If `true`, deactivates the observer once the slider is in the viewport.
     */
    once?: boolean;
    /**
     * Options used when the slider is in the viewport.
     */
    inView?: IntersectionViewOptions;
    /**
     * Options used when the slider is out of the viewport.
     */
    outView?: IntersectionViewOptions;
}
/**
 * The interface for options used when the intersection changes.
 *
 * @since 0.1.0
 */
export interface IntersectionViewOptions {
    autoplay?: boolean;
    keyboard?: boolean;
    autoScroll?: boolean;
    video?: boolean;
}
//# sourceMappingURL=../../../src/js/types/options.d.ts.map