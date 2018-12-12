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
    state.currentCharacter = '';
    state.characters = [];
    state.loggedIn = false;
    this.$cookies.remove('api-token');
    this.$axios.$get(process.env.API_URL + '/api/account/logout', { progress: false }).catch(e => { });
    if (console.log) {
      console.log("Account logged out")
    }
  },
  logoutAll (state) {
    state.apiKey = ''; 
    state.currentCharacter = '';
    state.characters = [];
    state.loggedIn = false;
    this.$cookies.remove('api-token');
    this.$axios.$get(process.env.API_URL + '/api/account/logout?all=true', { progress: false }).catch(e => { });
    if (console.log) {
      console.log("Account logged out on all devices")
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
    if(state.currentCharacter === deleteGuid) {
      state.currentCharacter = '';
    }
  },
  setCurrentCharacter (state, guid) {
    state.currentCharacter = guid;
    if(guid === '') {
      this.$cookies.remove('current-character');
    } else {
      this.$cookies.set('current-character', guid, {
        path: '/',
        maxAge: 60 * 60 * 24 * 31
      });
    }
  },
  addIslandVisited (state, id) {
    if(state.currentCharacter !== '') {
      this.$axios.$post(process.env.API_URL + '/api/account/character/visit', {
        guid: state.currentCharacter,
        id: id
      }, { progress: false });

      let filterGuid = state.currentCharacter;
      let characterData = _.chain(state.characters).filter(function (x) { return x.guid === filterGuid; }).first().value();
      if(characterData && characterData.visited_islands) {
        let updateIndex = _.findIndex(state.characters, function (character) { return character.guid === filterGuid });
        characterData.visited_islands.push(id.toString());
        if(updateIndex >= 0) {
          state.characters[updateIndex].visited_islands = characterData.visited_islands;
          this.$bus.$emit('updateCheckmarks');
        }
      }
    }
  },
  removeIslandVisited (state, id) {
    if(state.currentCharacter !== '') {
      this.$axios.$post(process.env.API_URL + '/api/account/character/unvisit', {
        guid: state.currentCharacter,
        id: id
      }, { progress: false });
      let filterGuid = state.currentCharacter;
      let characterData = _.chain(state.characters).filter(function (x) { return x.guid === filterGuid; }).first().value();
      if(characterData && characterData.visited_islands) {
        let updateIndex = _.findIndex(state.characters, function (character) { return character.guid === filterGuid });
        let updatedVisitedIslands = _.filter(characterData.visited_islands, item => {
          return item !== id.toString();
        });
        if(updateIndex >= 0) {
          state.characters[updateIndex].visited_islands = updatedVisitedIslands;
          this.$bus.$emit('updateCheckmarks');
        }
      }
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
