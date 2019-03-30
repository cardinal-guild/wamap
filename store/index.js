import _ from "lodash";
import moment from "moment";

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
  config: {
    showEdit: false,
    showAllMetals: false,
  },
  islandPopupId: 0,
  overlayLoaded: false,
  boundaryData: null,
  islandData: null,
  zonenamesData: null,
  metalTypes: null,
  showMarker: false,
  showMapControls: false,
  highlightedCoords: [],
  mapMode: 'pve',
  snackColor: 'info',
  snackText: '',
  pageTitle: '',
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
  toggleMarker (state) {
    state.showMarker = !state.showMarker;
  },
  setShowReportMessage (state, payload) {
     state.showReportMessage = payload;
  },
  setIslandPopupId (state, islandId) {
    state.islandPopupId = islandId;
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
  setConfigOption (state, obj) {
    state.config[obj.option] = obj.value;
    this.$cookies.set(obj.option, obj.value, {
      expires: moment().add(1, 'y').toDate()
    });
    // make sure the cookie option matches the config object property
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
  async nuxtClientInit ({ state, commit, dispatch }, { req }) {
    commit('loading', true);
    if (
      this.$router.currentRoute &&
      this.$router.currentRoute.query &&
      this.$router.currentRoute.query.api_token
    ) {
      commit(
        'account/setApiToken',
        this.$router.currentRoute.query.api_token
      );
      commit('account/showAccountDialog', true);
      this.$router.replace({ name: this.$router.currentRoute.name });
    }
   
    if (!state.islandData || !state.boundaryData) {
      dispatch('account/loadCharacters');
      if (console.log) {
        console.log('Loading islands from '+process.env.API_URL)
      }

      const metalTypes = await this.$axios.$get( process.env.API_URL+'/api/metaltypes.json')
      commit("metalTypes", metalTypes)

      const islandData = await this.$axios.$get(process.env.API_URL+'/api/islands.json')
      commit('islandData', islandData)
      if (console.log) {
        console.log('Loading map boundaries')
      }
      const boundaryData = await this.$axios.$get('/data/wamap.geojson')
      commit('boundaryData', boundaryData)
      if (console.log) {
        console.log('Loading zone name overlay')
      }
      const zonenamesData = await this.$axios.$get('/data/zonenames.svg')
      commit('zonenamesData', svgToDataURL(zonenamesData))

      // if (window.localStorage.getItem("characters")) {
      //   commit("characters", JSON.parse(window.localStorage.getItem("characters")))
      // }
      // else {
      //   commit("characters", [])
      // }

      


      commit('loading', false)
    }
  }
}
