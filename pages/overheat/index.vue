<template>
  <div class="overheat-page">
    <no-ssr>
      <v-container>
        <v-layout column justify-center align-center>
          <v-alert :value="true" type="info" xs12 sm7>
            This is very experimental, but based upon the post of
            <a
              href="https://www.worldsadrift.com/forums/topic/overheat-equation/"
            >overheat equation</a> on the worlds adrift forums.
            With the chart below you can pinpoint how good or bad your engine is and which throttle is best to use with it.
          </v-alert>
          <v-card color="#4f4141" xs12 sm7>
            <v-card-actions>
              <table>
                <tr>
                  <th colspan="2" style="align-text:center">Please fill in your engine properties</th>
                </tr>
                <tr>
                  <td>
                    <v-form ref="overheatCalculationForm" lazy-validation>
                      <v-list>
                        <v-list-tile>
                          <v-list-tile-title>Cooling Factor</v-list-tile-title>
                          <v-list-tile-action>
                            <v-input-number
                              label="Your engine Cooling Factor"
                              v-model="coolingFactor"
                              :outline="false"
                              :min="0"
                              :max="100"
                              @input="calculateOverheat"
                            ></v-input-number>
                          </v-list-tile-action>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-title>Power</v-list-tile-title>
                          <v-list-tile-action>
                            <v-input-number
                              label="Your engine Power"
                              v-model="power"
                              :outline="false"
                              :min="0"
                              :max="100"
                              @input="calculateOverheat"
                            ></v-input-number>
                          </v-list-tile-action>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-title>Overheat Limit</v-list-tile-title>
                          <v-list-tile-action>
                            <v-input-number
                              label="Your engine Overheat Limit"
                              v-model="overheatLimit"
                              :outline="false"
                              :min="0"
                              :max="100"
                              @input="calculateOverheat"
                            ></v-input-number>
                          </v-list-tile-action>
                        </v-list-tile>
                        <!-- <v-list-tile>
                        <v-list-tile-title>
                          Current ship weight
                          <small>(check shipyard)</small>
                        </v-list-tile-title>
                        <v-list-tile-action>
                          <v-input-number
                            label="Your ship weight"
                            v-model="shipWeight"
                            :outline="false"
                            :min="0"
                            :max="100"
                          ></v-input-number>
                        </v-list-tile-action>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-title>
                          Current ship speed in knots
                          <small>(if already engines on)</small>
                        </v-list-tile-title>
                        <v-list-tile-action>
                          <v-input-number
                            label="Your ship weight"
                            v-model="shipWeight"
                            :outline="false"
                            :min="0"
                            :max="100"
                          ></v-input-number>
                        </v-list-tile-action>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-title>Amount of this type engine</v-list-tile-title>
                        <v-list-tile-action>
                          <v-input-number
                            label="Amount of this type engine"
                            v-model="shipWeight"
                            :outline="false"
                            :min="1"
                            :max="10"
                          ></v-input-number>
                        </v-list-tile-action>
                        </v-list-tile>-->
                      </v-list>
                    </v-form>
                  </td>
                </tr>
              </table>
            </v-card-actions>
          </v-card>
          <br>
          <v-flex xs12 sm7>
            <h3
              class="subheading text-xs-center"
            >Your engine will not overheat when throttled below or equal to {{ maxThrottlePercentage }} %</h3>
            <br>
            <graph-bar
              class="graph-bar"
              :width="800"
              :height="400"
              :axis-min="axisMin"
              :axis-max="axisMax"
              :labels="labels"
              :values="values"
              :colors="[ '#3333FF', '#FF3333' ]"
              v-if="showGraph"
            >
              <note :text="'Overheat throttle chart (Higher is worse)'"></note>
              <tooltip :names="['Freezing factor','Overheating factor']" :position="'left'"></tooltip>
            </graph-bar>
          </v-flex>
          <!-- <graph-line-timerange
            :width="600"
            :height="200"
            :axis-min="0"
            :axis-max="100"
            :axis-reverse="false"
            :axis-format="'HH:mm'"
            :axis-interval="1000 * 60"
            :labels="labels"
            :values="values"
          >
            <note :text="'Overheat increase over time'"></note>
            <guideline :tooltip-x="true" :tooltip-y="true"></guideline>
          </graph-line-timerange>
          <graph-line-timerange
            :width="600"
            :height="200"
            :axis-min="0"
            :axis-max="100"
            :axis-reverse="false"
            :axis-format="'HH:mm'"
            :axis-interval="1000 * 60"
            :labels="labels"
            :values="values"
          >
            <note :text="'Throttle sweetspot to keep engine from overheating'"></note>
            <guideline :tooltip-x="true" :tooltip-y="true"></guideline>
          </graph-line-timerange>
          <graph-line-timerange
            :width="600"
            :height="200"
            :axis-min="0"
            :axis-max="100"
            :axis-reverse="false"
            :axis-format="'HH:mm'"
            :axis-interval="1000 * 60"
            :labels="labels"
            :values="values"
          >
            <note :text="'Travel distance before overheating'"></note>
            <guideline :tooltip-x="true" :tooltip-y="true"></guideline>
          </graph-line-timerange>-->
        </v-layout>
      </v-container>
    </no-ssr>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  mounted () {
    this.$store.commit('setShowMapControls', false);
    this.$store.commit('setPageTitle', this.title);
    this.calculateOverheat();
  },
  methods: {
    calculateOverheat () {
      let setLabels = [];
      let setFreezings = [];
      let setOverheats = [];
      let coolingFactorPercentage = this.coolingFactor / 100;
      this.maxThrottlePercentage = parseInt(
        100 -
          ((1 - coolingFactorPercentage) * this.power * 2 - this.overheatLimit)
      );
      let i;
      for (i = 0; i < 20; i++) {
        let calculatedOverheat =
          (1 - coolingFactorPercentage) * this.power * (i * 0.05) -
          this.overheatLimit / 2;
        setLabels.push(i * 5 + '%');
        if (calculatedOverheat < 0) {
          setFreezings.push(parseFloat(calculatedOverheat).toFixed(2));
          setOverheats.push(0);
        } else {
          setFreezings.push(0);
          setOverheats.push(parseFloat(calculatedOverheat).toFixed(2));
        }
      }
      this.axisMin = setFreezings[0];
      this.axisMax = setOverheats[19];
      this.labels = setLabels;
      this.values = [setFreezings, setOverheats];
      this.showGraph = true;
    }
  },
  head () {
    return { title: 'Cardinal Guild - ' + this.title };
  },
  data () {
    return {
      showGraph: false,
      title: 'Overheat calculator',
      coolingFactor: 25,
      power: 50,
      overheatLimit: 50,
      maxThrottlePercentage: 0,
      axisMin: -50,
      axisMax: 50,
      shipWeight: 0,
      labels: null,
      values: null
    };
  }
};
</script>
<style lang="scss" scoped>
.graph-bar {
  width: 100%;
  height: auto;
  display: block;
  svg {
    width: 100%;
    height: auto;
    display: block;
  }
}
</style>

