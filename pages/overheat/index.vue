<template>
  <div class="configuration-page">
    <v-container>
      <v-layout column justify-center align-center>
        <v-alert
          :value="true"
          type="error"
        >We are currently implementing the system for overheat calculation, not finished yet!</v-alert>
        <v-card color="#4f4141">
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
                          ></v-input-number>
                        </v-list-tile-action>
                      </v-list-tile>
                      <v-list-tile>
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
                      </v-list-tile>
                    </v-list>
                    <v-btn block>Calculate overheat graph</v-btn>
                  </v-form>
                </td>
              </tr>
            </table>
          </v-card-actions>
        </v-card>
        <no-ssr>
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
          </graph-line-timerange>
        </no-ssr>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  mounted () {
    this.$store.commit('setShowMapControls', false);
    this.$store.commit('setPageTitle', this.title);
  },
  head () {
    return { title: 'Cardinal Guild - ' + this.title };
  },
  data () {
    return {
      title: 'Overheat calculator',
      coolingFactor: 0,
      overheatLimit: 0,
      power: 0,
      shipWeight: 0,
      labels: [new Date('2018-1-1 00:00:00'), new Date('2018-1-1 00:05:00')],
      values: [
        [new Date('2018-1-1 00:00:00'), 55],
        [new Date('2018-1-1 00:01:00'), 30],
        [new Date('2018-1-1 00:02:00'), 25],
        [new Date('2018-1-1 00:03:00'), 40],
        [new Date('2018-1-1 00:04:00'), 45],
        [new Date('2018-1-1 00:05:00'), 70]
      ]
    };
  }
};
</script>
<style lang="scss">
</style>

