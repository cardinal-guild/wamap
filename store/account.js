import _ from "lodash";

export const state = () => ({
  showAccountDialog: false,
  loggedIn: false,
  data: {},
  apiToken: '',
  characters: [],
  showAddCharacter: false,
  charactersLoading: false,
  currentCharacter: ''
})

export const mutations = {
  logout (state) {
    state.apiKey = ''; 
    state.loggedIn = false;
    this.$cookies.remove('api-token');
    this.$axios.$get(process.env.API_URL + '/api/account/logout', { progress: false }).catch(e => { });
    if (console.log) {
      console.log("Account logged out")
    }
  },
  setShowAddCharacter (state, value) {
    state.showAddCharacter = value;
  },
  setCharactersLoading (state, value) {
    state.charactersLoading = value;
  },
  setCharacters (state, characters) {
    state.characters = characters;
  },
  setApiToken (state, data) {
    state.apiToken = data;
    state.loggedIn = true;
    this.$cookies.set('api-token', data);
    this.$axios.setToken(data);
  },
  addCharacter (state, char) {
    state.characters.push(char);
  },
  deleteCharacter (state, deleteGuid) {
    _.remove(state.characters, {
      guid: deleteGuid
    });
  },
  setCurrentCharacter (state, guid) {
    state.currentCharacter = guid;
    if(guid === '') {
      this.$cookies.remove('current-character');
    } else {
      this.$cookies.set('current-character', guid);
    }
  },
  setLoggedIn (state, value) {
    state.loggedIn = value;
  },
  showAccountDialog (state, value) {
    state.showAccountDialog = value;
  }
}

export const actions = {
  async loadCharacters ({ state, commit }) {
    commit('setCharactersLoading', true);
    let apiToken = this.$cookies.get('api-token');
    if (typeof apiToken !== 'undefined' && apiToken !== null && apiToken !== '') {
      commit(
        'setApiToken',
        apiToken
      );
      try {
        await this.$axios.$get(process.env.API_URL + '/api/account/validate', { progress: false });
      } catch(e) {
        commit('setCharactersLoading', false);
        commit('logout');
        return false;
      };
      try {
        const characters = await this.$axios.$get(process.env.API_URL + '/api/account/characters', { progress: false });
        commit('setCharacters', characters);
      } catch(e) {
        commit('setCharactersLoading', false);
        return false;
      };
      let currentCharacter = this.$cookies.get('current-character');
      if (typeof currentCharacter !== 'undefined' && currentCharacter !== null && currentCharacter !== '') {
        commit('setCurrentCharacter', currentCharacter);
      }
    }

    commit('setCharactersLoading', false);
     
  } 
}