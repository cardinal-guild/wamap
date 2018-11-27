export const state = () => ({
  sidebar: true,
  loading: false,
  boundariesLoading: false,
  boundaryData: null,
  islandData: null,
  islandsLoading: false,
  zoneNamesLoaded: false,
  showMapControls: false,
  showAuthorSearch: false,
  highlightedCoords: [],
  mapMode: 'pve',
  snackColor: 'info',
  snackText: '',
  pageTitle: 'Welcome',
  hilites: [],
  lat: -4750,
  lng: 4750,
  zoomPercentage: 0
})

export const mutations = {
  toggleSearch (state) {
    console.log("toggled");
    state.showAuthorSearch = !state.showAuthorSearch;
  },
  toggleSidebar (state) {
    state.sidebar = !state.sidebar
  },
  setZoomPercentage (state, value) {
    state.zoomPercentage = value
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
  },
  setPageTitle (state, title) {
    state.pageTitle = title;
  },
  setMapMode (state, mode) {
    state.mapMode = mode;
  },
  setZoneNamesLoaded (state, loaded) {
    state.zoneNamesLoaded = loaded;
  },
  setShowMapControls (state, show) {
    state.showMapControls = show;
  },
  setSnack (state, payload) {
    state.snackText = payload.text;
    state.snackColor = payload.color;
  },
  clearHighlights (state) {
    state.highlightedCoords = [];
  },
  setHighlights (state, payload) {
    if(payload && payload.coords && payload.coords.constructor === Array) {
      state.highlightedCoords = payload;
    }
  },
  addHighlight (state, payload) {
      if(payload && payload.constructor === Array) {
        state.highlightedCoords.push(payload);
      }
  },
  addHighlights (state, payload) {
    if(payload && payload.coords && payload.coords.constructor === Array) {
      state.highlightedCoords.push(...payload);
    }
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
  async clearHighlights ({
    commit,
    app
  }) {
    if (this.state.highlightedCoords) {
      if (console.log) {
        console.log('Clearing map highlights')
      }
      commit('clearHighlights')
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
