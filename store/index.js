import _ from "lodash";

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
  overlayLoaded: false,
  boundaryData: null,
  islandData: null,
  zonenamesData: null,
  metalTypes: null,
  characters: null,
  selectedChar: null,
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
  metalTypes (state, data) {
    if (console.log) {
      console.log("Metal types loaded")
    }
    state.metalTypes = data
  },
  characters (state, data) {
    state.characters = data;
    window.localStorage.setItem("characters", JSON.stringify(data));
    if (console.log) {
      console.log("Loaded character data")
    }
  },
  addCharacter (state, char) {
    state.characters.push(char);
    window.localStorage.setItem("characters", JSON.stringify(state.characters));
  },
  delCharacter (state, name) {
    state.characters = state.characters.filter(o => o.name !== name)
    window.localStorage.setItem("characters", JSON.stringify(state.characters));
    if (window.localStorage.getItem(name)) {
      window.localStorage.removeItem(name);
    }
    if (state.selectedChar === name) {
      state.selectedChar = null;
    }
  },
  setSelected (state, name) {
    if (state.selectedChar === name) {
      state.selectedChar = null;
    }
    else state.selectedChar = name;
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
  setOverlayLoaded (state, loaded) {
    state.overlayLoaded = loaded;
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

      const metalTypes = await this.$axios.$get("https://surveyor.cardinalguild.com/api/metaltypes.json")
      commit("metalTypes", metalTypes)

      const islandData = await this.$axios.$get('https://surveyor.cardinalguild.com/api/islands.json')
      commit('islandData', islandData)
      if (console.log) {
        console.log('Loading map boundaries')
      }
      const boundaryData = await this.$axios.$get('https://map.cardinalguild.com/data/wamap.geojson')
      commit('boundaryData', boundaryData)
      if (console.log) {
        console.log('Loading zone name overlay')
      }
      const zonenamesData = await this.$axios.$get('https://map.cardinalguild.com/data/zonenames.svg')
      commit('zonenamesData', svgToDataURL(zonenamesData))

      if (window.localStorage.getItem("characters")) {
        commit("characters", JSON.parse(window.localStorage.getItem("characters")))
      }
      else {
        commit("characters", [])
      }

      commit('loading', false)
    }
  }
}
