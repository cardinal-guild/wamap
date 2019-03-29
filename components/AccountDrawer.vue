<template>
  <v-navigation-drawer v-model="opened" 
                       :mini-variant="false" 
                       :width="320" 
                       right 
                       fixed 
                       app>
    <v-toolbar flat dense>
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="title">Characters</v-list-tile-title>
          <v-spacer/>
        </v-list-tile>
      </v-list>
      <v-btn icon @click="opened = false">
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-toolbar>

    <v-divider/>

    <v-list>
      <v-list-tile>
        <v-layout row>
          <v-flex xs10>
            <v-text-field
              v-model="characterName"
              placeholder="Add a new character"
              single-line
              hide-details
            />
          </v-flex>
          <v-flex xs2>
            <v-btn fab small @click="addCharacter">Add</v-btn>
          </v-flex>
        </v-layout>
      </v-list-tile>
      <v-data-table
        v-if="$store.state.characters"
        :headers="headers"
        :items="$store.state.characters"
      >
        <template slot="items" slot-scope="props">
          <tr :class="{selected: selectedChar === props.item.name}" @click="selectChar(props.item.name)">
            <td class="character character-name">{{ props.item.name }}</td>
            <td class="character character-created">{{ props.item.created }}</td>
            <td class="pl-0 character character-delete">
              <v-btn center fab small @click="$store.commit('delCharacter', props.item.name)">
                <v-icon>delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-list>
    <v-snackbar v-model="snackbar" :color="snackColor" :timeout="3000" bottom right>{{ snackText }}</v-snackbar>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';
import _ from "lodash";
export default {
  methods: {
    selectChar (name) {
      this.$store.commit("setSelected", name);
      if (this.selectedChar === name) {
        this.selectedChar = '';
        window.localStorage.removeItem("selectedChar");
      }
      else {
        this.selectedChar = name;
        window.localStorage.setItem("selectedChar", name);
      }
    },
    addCharacter () {
      if (this.characterName) {
        if(!_.find(this.$store.state.characters, {name: this.characterName}) || this.characterName === "characters" || this.characterName === "selectedChar") {
          let date = new Date();
          this.$store.commit("addCharacter", {
            name: this.characterName,
            created: date.getMonth()+1+"/"+date.getDate()+"/"+date.getFullYear()
          });
        }
        else {
          this.showBar("There is already a character with this name!")
        }
        this.characterName = "";
      }
      else {
        this.showBar("You must input a name!")
      }
    },
    showBar (text) {
      this.snackText = text;
      this.snackbar = true;
    }
  },
  mounted () {
    if (window.localStorage.getItem("selectedChar")) {
      this.selectedChar = window.localStorage.getItem("selectedChar");
      this.$store.commit("setSelected", window.localStorage.getItem("selectedChar"));
    }

    this.$bus.$on('openFilterDrawer', e => {
      this.opened = false;
    });
    this.$bus.$on('openSearchDrawer', e => {
      this.opened = false;
    });
    this.$bus.$on('openAccountDrawer', e => {
      this.opened = true;
    });
  },
  computed: {
    ...mapState(["characters"])
  },
  data () {
    return {
      characterName: "",
      opened: false,
      snackbar: false,
      snackColor: '#FF4F4F',
      selectedChar: '',
      snackText: '',
      headers: [
        {
          text: 'Name',
          align: 'center',
          value: 'name',
          width: "140px"
        },
        {
          text: 'Created',
          align: 'center',
          value: 'created',
          sortable: false,
          width: "80px"
        },
        {
          text: ' ',
          sortable: false,
        }
      ]
    }
  }
};
</script>
<style lang="scss">
tr.selected {
  background: #bbff9955;

  &:hover {
    background: #bbff99aa !important;
  }
}

table.v-table {
  thead {
    th.column {
      padding: 0 12px;
    }

    tr {
      height: 40px;
    }
  }
  tbody td.character {
    &.character-name {
      width: 150px;
      margin: 0;
      padding: 0;
      text-align: center;
      cursor: pointer;
    }

    &.character-created {
      width: 80px;
      margin: 0;
      padding: 0;
      text-align: center;
      cursor: pointer;
    }

    &.character-delete {
      width: 50px;
      margin: 0;
      padding: 0;
      text-align: center;
      cursor: pointer;
      button {
        margin: auto;
      }
    }
  }
}
</style>
