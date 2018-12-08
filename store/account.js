import _ from "lodash";

export const state = () => ({
  showAccountDialog: false,
  loggedIn: false,
  data: {},
  charKey: '',
  characters: null,
  selectedChar: null
})

export const mutations = {
  logout (state) {
    state.charKey = ''; 
    state.loggedIn = false;
    this.$cookies.remove('account-char-key');
  },
  setCharKey (state, data) {
    state.charKey = data;
    state.loggedIn = true;
    this.$cookies.set('account-char-key', data);
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
  },
}

export const actions = {
  async loadAll ({
    commit,
    app
  }) {
    
  }
}
