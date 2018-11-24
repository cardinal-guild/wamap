export const state = () => ({
  sidebar: true,
  loading: false,
  boundariesLoading: false,
  boundaryData: null,
  islandData: null,
  islandsLoading: false,
  lat: -4750,
  lng: 4750,
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

  islandsLoading (state, loading) {
    state.islandsLoading = loading
  },
  boundaryData (state, data) {
    if (console.log) {
      console.log('Map boundaries loaded')
    }
    state.boundaryData = data
  },
  islandData (state, data) {
    if (console.log) {
      console.log('Island data loaded')
    }
    state.islandData = data
  },
  updateMapOptions (state, options) {
    state.mapOptions = options
  },
  setLatLng (state, latLng) {
    let { lat, lng } = latLng;
    state.lat = Math.round(lat);
    state.lng = Math.round(lng);
  }
}

export const actions = {
  async loadIslands ({
    commit,
    app
  }) {
    if (!this.state.islandData) {
      if (console.log) {
        console.log('Loading islands from surveyor.cardinalguild')
      }
      commit('islandsLoading', true)
      const data = await this.$axios.$get('https://surveyor.cardinalguild.com/api/islands.json')
      commit('islandData', data)
      commit('islandsLoading', false)
    }
  },
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