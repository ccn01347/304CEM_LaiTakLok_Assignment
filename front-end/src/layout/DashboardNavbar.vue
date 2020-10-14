<template>
    <base-nav class="navbar-top navbar-dark"
              id="navbar-main"
              :show-toggle-button="false"
              expand>
        <form class="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <div class="form-group mb-0" v-if="showSearch">
                <base-input placeholder="Search"
                            class="input-group-alternative"
                            alternative=""
                            addon-right-icon="fas fa-search"
                            v-model="inputText"
                            @keyup="$emit('onSearch', inputText)">
                </base-input>
            </div>
        </form>
        <ul class="navbar-nav align-items-center d-none d-md-flex">
            <li class="nav-item dropdown">
                <base-dropdown class="nav-link pr-0">
                    <div class="media align-items-center" slot="title">
                <span class="avatar avatar-sm rounded-circle">
                  <img alt="Image placeholder" v-bind:src="avatarURL ? avatarURL : 'img/icons/account_circle-24px.svg'">
                </span>
                        <div class="media-body ml-2 d-none d-lg-block">
                            <span class="mb-0 text-sm  font-weight-bold">{{this.username}}</span>
                        </div>
                    </div>

                    <template>
                        <div class=" dropdown-header noti-title">
                            <h6 class="text-overflow m-0">Welcome!</h6>
                        </div>
                        <router-link to="/profile" class="dropdown-item">
                            <i class="ni ni-single-02"></i>
                            <span>My profile</span>
                        </router-link>
                        <div class="dropdown-divider"></div>
                        <router-link to="/logout" class="dropdown-item">
                            <i class="ni ni-user-run"></i>
                            <span>Logout</span>
                        </router-link>
                    </template>
                </base-dropdown>
            </li>
        </ul>
    </base-nav>
</template>
<script>
import Cookies from 'js-cookie'
  export default {
    props:{
      showSearch: {
        type: Boolean,
        default: false
      }
    
    },
    data() {
      return {
        activeNotifications: false,
        showMenu: false,
        inputText: ''
      };
    },
    methods: {
      toggleSidebar() {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
      },
      hideSidebar() {
        this.$sidebar.displaySidebar(false);
      },
      toggleMenu() {
        this.showMenu = !this.showMenu;
      }
    },
    computed:{
      username(){
        var username = Cookies.get("username");
        return username;
      },
      avatarURL(){
        return Cookies.get("avatarURL");
      }
    }
  };
</script>
