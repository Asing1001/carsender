<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-tile
          v-for="(item, i) in menuItems"
          :key="i"
          router
          :to="item.to"
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="$store.state.authUser" @click="logout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>登出</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app :clipped-left="clipped" color="primary" dark>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <!-- <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn> -->
      <!-- <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>web</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>remove</v-icon>
      </v-btn> -->
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <v-container :class="{ 'pa-1': $vuetify.breakpoint.xsOnly }">
        <nuxt />
      </v-container>
    </v-content>
    <!-- <v-footer :fixed="fixed" app>
      <span>&copy; 2018</span>
    </v-footer> -->
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        { icon: 'add', title: '新增預約', to: '/order/create' }
        // { icon: 'edit', title: '修改預約', to: '/order/edit' }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: '凡亨接送機預約系統'
    }
  },
  computed: {
    menuItems() {
      const menuItems = this.items.slice()
      if (this.$store.state.authUser) {
        menuItems.push({
          icon: 'view_list',
          title: '訂單管理',
          to: '/order/list'
        })
        menuItems.push({
          icon: 'account_circle',
          title: this.$store.state.authUser.username,
          to: ''
        })
      } else {
        menuItems.push({
          icon: 'supervisor_account',
          title: '後台登入',
          to: '/login'
        })
      }
      return menuItems
    }
  },
  methods: {
    async logout() {
      try {
        await this.$store.dispatch('logout')
        this.$router.push('/')
      } catch (e) {
        this.formError = e.message
      }
    }
  }
}
</script>
