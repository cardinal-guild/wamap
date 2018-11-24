export const state = () => ({
  sidebar: true,
  loading: false,
  boundariesLoading: false,
  boundaryData: null
})

export const mutations = {
  toggleSidebar (state) {
    state.sidebar = !state.sidebar
  },
  boundariesLoading (state, loading) {
    state.boundariesLoading = loading
  },
  boundaryData (state, data) {
    state.boundaryData = data
  },
  updateMapOptions (state, options) {
    state.mapOptions = options
  }
}

export const actions = {
  async loadBoundaries ({
    commit,
    app
  }) {
    if (!this.state.boundaryData) {
      if (console.log) {
        console.log('Map boundaries are loading')
      }
      commit('boundariesLoading', true)
      const data = await this.$axios.$get('https://data.cardinalguild.com/wamap.geojson')
      commit('boundaryData', data)
      commit('boundariesLoading', false)
    }
  }
}
