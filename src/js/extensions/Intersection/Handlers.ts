import { Splide } from '@splidejs/splide';
import { AutoScrollComponent } from '@splidejs/splide-extension-auto-scroll';
import { VideoComponent } from '@splidejs/splide-extension-video';
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
        const AutoScroll = Components.AutoScroll as AutoScrollComponent;
        AutoScroll && AutoScroll.play();
      },
      disable(): void {
        const AutoScroll = Components.AutoScroll as AutoScrollComponent;
        AutoScroll && AutoScroll.pause();
      },
    },

    video: {
      enable(): void {
        const Video = Components.Video as VideoComponent;
        Video && Video.play();
      },
      disable(): void {
        const Video = Components.Video as VideoComponent;
        Video && Video.pause();
      },
    },
  };
}