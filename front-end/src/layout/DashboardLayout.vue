<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar
      :background-color="sidebarBackground"
      short-title="IM Stickers"
      title="IM Stickers"
    >
      <template slot="links">
        <sidebar-item
          :link="{
            name: 'Public Stickers',
            icon: 'ni ni-tv-2 text-primary',
            path: '/publicstickers'
          }"
        />

        <sidebar-item :link="{name: 'My Favorite', icon: 'ni ni-planet text-blue', path: '/myfavorite'}"/>
        <sidebar-item :link="{name: 'User Profile', icon: 'ni ni-single-02 text-yellow', path: '/profile'}"/>
      </template>
    </side-bar>
    <div class="main-content" :data="sidebarBackground">
<!--       <dashboard-navbar></dashboard-navbar>
 -->
      <div @click="toggleSidebar">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </fade-transition>
        <content-footer v-if="!$route.meta.hideFooter"></content-footer>
      </div>
    </div>
  </div>
</template>
<script>
  // import DashboardNavbar from './DashboardNavbar.vue';
  import ContentFooter from './ContentFooter.vue';
  import { FadeTransition } from 'vue2-transitions';

  export default {
    components: {
      // DashboardNavbar,
      ContentFooter,
      FadeTransition
    },
    data() {
      return {
        sidebarBackground: 'vue' //vue|blue|orange|green|red|primary
      };
    },
    methods: {
      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false);
        }
      }
    }
  };
</script>
<style lang="scss">
</style>
