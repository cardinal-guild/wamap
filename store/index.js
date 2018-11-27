const svgToDataURL = svgStr => {
  const encoded = encodeURIComponent(svgStr)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  const header = 'data:image/svg+xml,';
  const dataUrl = header + encoded;

  return dataUrl;
}

export const state = () => ({
  sidebar: true,
  loading: true,
  boundaryData: null,
  islandData: null,
  zonenamesData: null,
  showMapControls: false,
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
  toggleSidebar (state) {
    state.sidebar = !state.sidebar
  },
  setZoomPercentage (state, value) {
    state.zoomPercentage = value
  },
  loading (state, loading) {
    state.loading = loading
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
  zonenamesData (state, data) {
    if (console.log) {
      console.log('Zone names data loaded')
    }
    state.zonenamesData = data
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
    state.highlightedCoords = payload;
  },
  addHighlight (state, payload) {
    state.highlightedCoords.push(payload);
  },
  addHighlights (state, payload) {
    if(payload && payload.coords && payload.coords.constructor === Array) {
      state.highlightedCoords.push(...payload);
    }
  }
}

export const actions = {
  async loadAll ({
    commit,
    app
  }) {
    if (!this.state.islandData || !this.state.boundaryData) {
      if (console.log) {
        console.log('Loading islands from surveyor.cardinalguild')
      }
      commit('loading', true)
      const islandData = await this.$axios.$get('https://surveyor.cardinalguild.com/api/islands.json')
      commit('islandData', islandData)
      if (console.log) {
        console.log('Loading map boundaries')
      }
      const boundaryData = await this.$axios.$get('https://data.cardinalguild.com/wamap.geojson')
      commit('boundaryData', boundaryData)
      if (console.log) {
        console.log('Loading zone name overlay')
      }
      const zonenamesData = await this.$axios.$get('https://data.cardinalguild.com/zonenames.svg')
      commit('zonenamesData', svgToDataURL(zonenamesData))
      
      commit('loading', false)
    }
  }
}
