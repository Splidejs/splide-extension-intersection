<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width,initial-scale=1">
	<title>Intersection</title>

	<link rel="stylesheet" href="../../../../node_modules/@splidejs/splide/dist/css/themes/splide-default.min.css">
	<script type="text/javascript" src="../../../../node_modules/@splidejs/splide/dist/js/splide.js"></script>
	<script type="text/javascript" src="../../../../dist/js/splide-extension-intersection.js"></script>
  <script type="text/javascript" src="../../../../node_modules/@splidejs/splide-extension-auto-scroll/dist/js/splide-extension-auto-scroll.min.js"></script>

	<script>
		document.addEventListener( 'DOMContentLoaded', function () {
			var splide01 = new Splide( '#splide01', {
        height: 300,
        autoplay: true,
        intersection: {
          // once: true,
          inView: {
            autoplay: true,
            keyboard: true,
          },
          outView: {
            autoplay: false,
            keyboard: false,
          },
        }
			} );

      splide01.mount( { Intersection: window.splide.Extensions.Intersection } );

      splide01.on( 'intersection:in', () => console.log( 'splide01 in' ) );
      splide01.on( 'intersection:out', () => console.log( 'splide01 out' ) );

      var splide02 = new Splide( '#splide02', {
        type: 'loop',
        height: 400,
        intersection: {
          inView: {
            autoScroll: true,
            keyboard: true,
          },
          outView: {
            autoScroll: false,
            keyboard: false,
          },
        }
      } );

      splide02.mount( window.splide.Extensions );

      splide02.on( 'intersection:in', entry => console.log( 'splide02 in', entry.target ) );
      splide02.on( 'intersection:out', entry => console.log( 'splide02 out', entry.target ) );
		} );
	</script>

	<style>
    .splide {
      margin: 150vh 0;
    }

		.splide__slide {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 4rem;
      background: #eee;
      border: 2px solid transparent;
		}

    .splide__slide.is-active {
      border: 2px solid skyblue;
    }
	</style>
</head>
<body>

<div id="splide01" class="splide">
	<div class="splide__track">
		<ul class="splide__list">
			<?php
			for ( $i = 0; $i < 10; $i ++ ) {
				echo '<li class="splide__slide">' . PHP_EOL;
				echo $i + 1;
				echo '</li>' . PHP_EOL;
			}
			echo '</ul>';
			?>
		</ul>
	</div>

  <div class="splide__progress">
    <div class="splide__progress__bar">
    </div>
  </div>
</div>

<div id="splide02" class="splide">
  <div class="splide__track">
    <ul class="splide__list">
			<?php
			for ( $i = 0; $i < 10; $i ++ ) {
				echo '<li class="splide__slide">' . PHP_EOL;
				echo $i + 1;
				echo '</li>' . PHP_EOL;
			}
			echo '</ul>';
			?>
    </ul>
  </div>

  <div class="splide__progress">
    <div class="splide__progress__bar">
    </div>
  </div>
</div>


</body>
</html>
