import _ from "lodash";

export const state = () => ({
  showAccountDialog: false,
  loggedIn: false,
  data: {},
  apiToken: '',
  characters: null,
  selectedChar: null
})

export const mutations = {
  logout (state) {
    state.apiKey = ''; 
    state.loggedIn = false;
    this.$cookies.remove('api-token');
    this.$axios.$get(process.env.API_URL + '/api/account/logout', { progress: false }).catch(e => { });
    if (console.log) {
      console.log("Loaded character data")
    }
  },
  setApiToken (state, data) {
    state.apiToken = data;
    state.loggedIn = true;
    this.$cookies.set('api-token', data);
    this.$axios.setToken(data);
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
  setLoggedIn (state, value) {
    state.loggedIn = value;
  },
  showAccountDialog (state, value) {
    state.showAccountDialog = value;
  }
}