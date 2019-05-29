export const state = () => ({
  loading: 0,
  mapGeoJson: null
})

export const mutations = {
  incrementLoading(state, value = 10) {
    if (state.loading + value > 100) state.loading = 100
    else state.loading += value
  },
  setMapData(state, { p, v }) {
    if (p && v) state[p] = v
  }
}

export const actions = {
  async nuxtClientInit({ state, commit, dispatch }, { req }) {
    if (!state.mapGeoJson || !state.islandData) {
      const mapGeoJson = await this.$axios.$get('/data/wamap.geojson')
      commit('setMapData', { p: 'mapGeoJson', v: mapGeoJson })
      commit('incrementLoading')
      const islandData = await this.$axios.$get(
        process.env.API_URL + '/api/islands.json'
      )
      for (const island of islandData.features) {
        island.geometry.coordinates[0] *= 0.00021
        island.geometry.coordinates[1] *= 0.00021
        island.geometry.coordinates = island.geometry.coordinates.reverse()
      }
      commit('setMapData', { p: 'islandData', v: islandData })
    }
    commit('incrementLoading', 100)
  }
}
