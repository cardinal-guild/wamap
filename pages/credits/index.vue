<template>
  <div class="credits-page">
    <no-ssr>
      <vue-particles
        :particles-number="120"
        :particle-size="4"
        :move-speed=".8"
        :line-opacity="0.1"
        class="particles"
        color="#668"
        shape-type="star"
      />
      <article class="starwars">
        <audio
          ref="audio"
          preload="auto"
          autoplay="true"
          play="true"
          @playing="startAnimation=true"
          @ended="startAnimation=false"
        >
          <source
            src="https://s.cdpn.io/1202/Star_Wars_original_opening_crawl_1977.ogg"
            type="audio/ogg"
          >
          <source
            src="https://s.cdpn.io/1202/Star_Wars_original_opening_crawl_1977.mp3"
            type="audio/mpeg"
          >
        </audio>

        <div
          v-show="!startAnimation"
          class="start"
          @click="$refs.audio.play()"
        >
          <h1>
            <v-icon>play_arrow</v-icon>Click here to play the credits
          </h1>
        </div>

        <div
          v-if="startAnimation"
          class="animation"
        >
          <section class="intro">
            <span>A long time ago, in a world adrift,
              <br>far, far away....
            </span>
          </section>

          <section class="titles">
            <div
              contenteditable="false"
              spellcheck="false"
            >
              <p>Lead programming: FearlessJake and Machine_Maker</p>

              <p>Additional styling and programming: JeremyKerman</p>

              <p>Island surveyors: SquinkyDinky, JC, Davemane42, JeremyKerman, lavayar, Wise_Mule</p>
              <p>And all the people that i forgot to mention in the discord group :-)</p>
            </div>
          </section>

          <section class="logo">
            <img src="~/static/assets/logo_credits.png">
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
      title: 'Credits'
    };
  },
  head () {
    return { title: 'Cardinal Guild - ' + this.title };
  },
  mounted () {
    this.$store.commit('setShowMapControls', false);
    this.$store.commit('setPageTitle', this.title);
  }
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
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .animation {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
  }
  section {
    position: absolute;
    top: 50%;
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
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    font-size: 2rem;
    font-weight: 400;
    color: rgb(75, 213, 238);
    opacity: 0;
    animation: intro 6s ease-out 1s;
    justify-content: center;
    align-items: center;
  }

  .logo {
    opacity: 0;
    animation: logo 9s ease-out 9s;
  }

  .titles {
    $titles-width: 75vw;
    width: $titles-width;
    margin: 0 0 0 (-$titles-width / 2);
    top: auto;
    bottom: 0;
    height: 40em;
    font-size: 3rem;
    text-align: center;
    overflow: hidden;
    transform-origin: 50% 100%;
    transform: perspective(300px) rotateX(15deg);

    > div {
      position: absolute;
      top: 100%;
      animation: titles 30s linear 13s;

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
