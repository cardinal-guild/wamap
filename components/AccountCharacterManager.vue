<template>
  <div>
      <v-dialog
      v-model="confirmDeleteDialog"
      max-width="340"
    >
   
      <v-card>
        <v-card-text v-if="deletingCharacter">Deleting character ...
            <v-progress-linear indeterminate color="red darken-3" class="mb-0"></v-progress-linear>
        </v-card-text>
        <template v-else>
            <v-card-text class="text-xs-center title">Deleted character '{{ deleteName }}'?</v-card-text>

            <v-card-actions>

            <v-btn
                color="grey darken-1"
                @click="confirmDeleteDialog = false"
            >
                Cancel
            </v-btn>

            <v-spacer></v-spacer>
            <v-btn
                color="red darken-1"
                @click="confirmDelete"
            >
                <v-icon color="white darken-2">delete_forever</v-icon> Confirm delete
            </v-btn>
            </v-card-actions>
        </template>
      </v-card>
    </v-dialog>
    <div v-if="!showAddCharacter">
      
      <v-card-actions>
        <v-btn color="success" block @click="showAddCharacter = true">
          <v-icon>add_circle</v-icon>Add character
        </v-btn>
      </v-card-actions>
      <v-card-title class="text-xs-center">
        <v-flex xs12>Your characters:</v-flex>
      </v-card-title>
      
      <v-list>
          <v-list-tile
            v-for="character in characters"
            :key="character.guid"
          >
            <v-list-tile-action>
                <v-checkbox
                    :key="character.guid"
                    :value="character.guid"
                    v-model="currentCharacter"
                ></v-checkbox>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title v-text="character.name"></v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action right>
              <v-tooltip left>
                    <v-btn icon right slot="activator" @click="deleteCharacter(character.guid, character.name)">
                        <v-icon color="red darken-2">delete</v-icon>
                    </v-btn>
                    <span>Delete character {{ character.name }}</span>
                </v-tooltip>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
        <v-card-text>These all your characters stored in the database, click the checkmark to load the character on the map interface. This character stays loaded everytime you load in the map. Uncheck all to disable characters on the map. There is a limit of 10 characters per steam account.</v-card-text>
    </div>
    <v-card v-else color="green darken-4">
      <v-card-text v-if="creatingCharacter">Creating character ...
        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
      </v-card-text>
      <v-form ref="characterCreateForm" v-model="valid" lazy-validation v-if="!creatingCharacter">
        <v-toolbar dark>
          <v-btn icon dark @click="showAddCharacter = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Create new character</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-layout pa-4>
          <v-flex xs12 sm7 pr-2>
            <v-text-field
              label="Name"
              v-model="name"
              placeholder="Your character name"
              :counter="24"
              :rules="nameRules"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm5>
            <v-btn color="success" :disabled="!valid" submit block @click="createCharacter">
              <v-icon pr-1>person_add</v-icon>
              <span>create character</span>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-form>
    </v-card>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data: () => ({
    fab: false,
    valid: false,
    creatingCharacter: false,
    deletingCharacter: false,
    name: '',
    deleteGuid: '',
    deleteName: '',
    confirmDeleteDialog: false,
    currentSelectedGuid: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => v.length >= 3 || 'Name must be at least 3 characters',
      v => v.length <= 16 || 'Name must be less than 24 characters'
    ],
    pagination: {
      sortBy: 'name'
    },
    headers: [{ text: 'Name', value: 'name' }]
  }),
  mounted () {
    this.name = '';
    this.showAddCharacter = false;
    this.creatingCharacter = false;
  },
  methods: {
    deleteCharacter(guid, name) {
        this.deleteGuid = guid;
        this.deleteName = name;
        this.confirmDeleteDialog = true;
    },
    async confirmDelete () {
        this.deletingCharacter = true;
        try {
            await this.$axios.$delete(process.env.API_URL + '/api/account/character/delete/'+this.deleteGuid);
            this.$store.commit('account/deleteCharacter', this.deleteGuid);
            this.confirmDeleteDialog = false;
         } catch (err) { }
        this.deletingCharacter = false;
    },
    async createCharacter () {
      if (this.$refs.characterCreateForm.validate()) {
        this.creatingCharacter = true;
        try {
            const characterGuid = await this.$axios
            .$post(process.env.API_URL + '/api/account/character/create', {
                name: this.name
            })
            this.$store.commit('account/addCharacter', {
            guid: characterGuid,
            name: this.name,
            visited_islands: []
            });
            this.showAddCharacter = false;
        } catch (err) { }
        this.name = '';
        this.creatingCharacter = false;
      }
    }
  },
  computed: {
    ...mapState('account', {
      loggedIn: 'loggedIn',
      characters: 'characters'
      
    }),
    currentCharacter: {
      get () {
        return this.$store.state.account.currentCharacter;
      },
      set (value) {
        this.$store.commit('account/setCurrentCharacter', value);
      }
    },
    showAddCharacter: {
      get () {
        return this.$store.state.account.showAddCharacter;
      },
      set (value) {
        this.$store.commit('account/setShowAddCharacter', value);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

