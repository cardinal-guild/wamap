export const state = () => ({
  sidebar: true,
  loading: false,
  boundariesLoading: false,
  boundaryData: null,
  zoomLevel: 0
})

export const mutations = {
  toggleSidebar (state) {
    state.sidebar = !state.sidebar
  },
  setZoomLevel (state, value) {
    state.zoomLevel = value
  },
  boundariesLoading (state, loading) {
    state.boundariesLoading = loading
  },
  boundaryData (state, data) {
    if (console.log) {
      console.log('Map boundaries loaded')
    }
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
        console.log('Loading map boundaries')
      }
      commit('boundariesLoading', true)
      const data = await this.$axios.$get('https://data.cardinalguild.com/wamap.geojson')
      commit('boundaryData', data)
      commit('boundariesLoading', false)
    }
  }
}
