<template>
  <v-app dark>
    <v-navigation-drawer
      fixed
      app
      :mini-variant="miniVariant"
      v-model="drawer"
    >
      <v-list>
        <v-list-tile
          router
          :to="item.to"
          :key="i"
          v-for="(item, i) in items"
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-toolbar-title>Cardinal Guild - {{ $store.state.pageTitle }}</v-toolbar-title>
    </v-toolbar>
    <v-content>
        <nuxt />
    </v-content>
    <v-navigation-drawer
      temporary
      right
      v-model="searchDrawer"
      fixed
    >
      <v-list>
       <v-list-tile-title class="headline">Search</v-list-tile-title>
      </v-list>
    </v-navigation-drawer>

     <v-navigation-drawer
      temporary
      right
      v-model="accountDrawer"
      fixed
    >
      <v-list>
       <v-list-tile-title class="headline">Account</v-list-tile-title>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  head () {
    return { title: 'Cardinal Guild - ' + this.$store.state.pageTitle };
  },
  data () {
    return {
      drawer: false,
      fixed: false,
      items: [
        { icon: 'apps', title: 'Welcome', to: '/' },
        { icon: 'explore', title: 'PVE Map', to: '/pve' },
        { icon: 'explore', title: 'PVP Map', to: '/pvp' },
        { icon: 'people', title: 'Credits', to: '/credits' }
      ],
      miniVariant: false,
      searchDrawer: false,
      accountDrawer: false
    };
  }
};
</script>
