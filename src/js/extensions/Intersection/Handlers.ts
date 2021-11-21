import { Splide } from '@splidejs/splide';
import { AutoScrollComponent } from '@splidejs/splide-extension-auto-scroll';
import { VideoComponent } from '@splidejs/splide-extension-video/dist/types/extensions/Video/Video';
import { IntersectionViewOptions, ViewOptionHandler } from '../../types';


/**
 * Generate handlers.
 *
 * @param Splide - A Splide instance.
 *
 * @return A collection of handlers.
 */
export function Handlers( Splide: Splide ): Record<keyof IntersectionViewOptions, ViewOptionHandler> {
  const { Components } = Splide;

  return {
    keyboard: {
      enable(): void {
        Components.Keyboard.disable( false );
      },
      disable(): void {
        Components.Keyboard.disable( true );
      },
    },

    autoplay: {
      enable(): void {
        if ( Splide.options.autoplay ) {
          Components.Autoplay.play();
        }
      },
      disable(): void {
        Components.Autoplay.pause();
      },
    },

    autoScroll: {
      enable(): void {
        ( Components.AutoScroll as AutoScrollComponent )?.play();
      },
      disable(): void {
        ( Components.AutoScroll as AutoScrollComponent )?.pause();
      },
    },

    video: {
      enable(): void {
        ( Components.Video as VideoComponent )?.play();
      },
      disable(): void {
        ( Components.Video as VideoComponent )?.pause();
      },
    },
  };
}