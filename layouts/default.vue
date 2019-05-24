<template>
  <v-app dark class="secondary">
    <v-toolbar color="primary" fixed app>
      <v-btn color="accent" icon>
        <v-icon>settings</v-icon>
      </v-btn>
      <v-toolbar-title class="info--text">Cardinal Guild</v-toolbar-title>
      <v-spacer />
      <v-btn color="success primary--text" small>Kubo (PvE)</v-btn>
      <v-btn color="success primary--text" small to="/pvp" nuxt>
        Driss (PvP)
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer height="auto" color="primary" fixed app>
      <v-layout row wrap justify-center>
        <div style="position: absolute; right: 0; bottom: 0;" class="mr-2">
          &copy; 2019 Cardinal Guild
        </div>
        <v-flex shrink>
          <v-btn color="success primary--text">Credits</v-btn>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>
