<template>
    <div class="credits-page">
        <no-ssr>
            <vue-particles
            class="particles"
            color="#668"
            :particlesNumber="120"
            shapeType="star"
            :particleSize="4"
            :moveSpeed=".6"
            :lineOpacity="0.1"
            />
            <article class="starwars">
                <audio preload="auto" ref="audio" autoplay="true" @playing="startAnimation=true" @ended="startAnimation=false" play="true">
                    <source src="https://s.cdpn.io/1202/Star_Wars_original_opening_crawl_1977.ogg" type="audio/ogg" />
                    <source src="https://s.cdpn.io/1202/Star_Wars_original_opening_crawl_1977.mp3" type="audio/mpeg" />
                </audio>

                <div class="start" @click="$refs.audio.play()" v-show="!startAnimation">
                    <h1><v-icon>play_arrow</v-icon> Click here to play the credits</h1>
                </div>

                <div class="animation" v-if="startAnimation">

                    <section class="intro">
                        A long time ago, in a adrift world,<br>
                        far, far away....
                    </section>

                    <section class="titles">
                        <div contenteditable="true" spellcheck="false">
                        <p>
                           Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </p>

                        <p>
                            Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor.
                        </p>

                        <p>
                            Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                        </p>
                        </div>
                    </section>

                    <section class="logo">
                        <img src="~/assets/logo_credits.png" />
                    </section>
                </div>
            </article>
        </no-ssr>
    </div>
</template>

<script>
export default {
  data () {
    return {
      startAnimation: false,
      title: 'Cardinal Guild Credits'
    };
  },
  mounted () {}
};
</script>

<style lang="scss" scoped>
.credits-page {
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: block;
  background: #111;
  overflow: hidden;
  .particles {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
  }
}
.starwars {
  font: 700 1em 'News Cycle', sans-serif;
  letter-spacing: 0.15em;
  color: #ff6;
  overflow: hidden;
  margin: 0;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  section {
    position: absolute;
    top: 45%;
    left: 50%;
    z-index: 1;
  }

  .start {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 200%;
    text-align: center;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    .v-icon {
      font-size: 1.5em;
      color: #ff6;
    }
  }

  .intro {
    $intro-width: 18em;
    width: $intro-width;
    margin: 0 0 0 (-$intro-width / 2);
    font-size: 200%;
    font-weight: 400;
    color: rgb(75, 213, 238);
    opacity: 0;
    animation: intro 6s ease-out 1s;
  }

  .logo {
    opacity: 0;
    animation: logo 9s ease-out 9s;
  }

  .titles {
    $titles-width: 24em;
    width: $titles-width;
    margin: 0 0 0 (-$titles-width / 2);
    top: auto;
    bottom: 0;
    height: 40em;
    font-size: 550%;
    text-align: justify;
    overflow: hidden;
    transform-origin: 50% 100%;
    transform: perspective(300px) rotateX(15deg);

    > div {
      position: absolute;
      top: 100%;
      animation: titles 81s linear 13s;

      > p {
        margin: 1.35em 0 1.85em 0;
        line-height: 1.35em;
        backface-visibility: hidden;
      }
    }
  }
}

@keyframes intro {
  0% {
    opacity: 0;
  }

  20% {
    opacity: 1;
  }

  90% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes logo {
  0% {
    $logo-width: 400px;
    width: $logo-width;
    margin: (-$logo-width / 2) 0 0 (-$logo-width / 2);
    transform: scale(1);
    opacity: 1;
  }

  50% {
    opacity: 1;
    $logo-width: 400px;
    width: $logo-width;
    margin: (-$logo-width / 2) 0 0 (-$logo-width / 2);
  }

  100% {
    transform: scale(0.05);
    opacity: 0;
    $logo-width: 400px;
    width: $logo-width;
    margin: (-$logo-width / 2) 0 0 (-$logo-width / 2);
  }
}

@keyframes titles {
  0% {
    top: 100%;
    opacity: 1;
  }

  95% {
    opacity: 1;
  }

  100% {
    top: 20%;
    opacity: 0;
  }
}
</style>
