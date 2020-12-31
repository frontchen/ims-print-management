<template>
  <v-list-item class="sidebar-profile">
    <v-list-item-avatar>
      <img
        src="/static/img/user-13.jpg"
        alt="avatar"
        height="40"
        width="40"
        class="img-responsive"
      />
    </v-list-item-avatar>
    <v-list-item-content class="ml-3">
      <v-list-item-title>
        <span>{{ userInfo.phone || userInfo.userName }}</span>
      </v-list-item-title>
    </v-list-item-content>
    <v-menu
      bottom
      offset-y
      left
      content-class="userblock-dropdown"
      nudge-top="-10"
      nudge-right="0"
      transition="slide-y-transition"
    >
      <template v-slot:activator="{ on }">
        <v-btn dark icon v-on="on" class="ma-0">
          <v-icon>more_vert</v-icon>
        </v-btn>
      </template>
      <div class="dropdown-content">
        <div class="dropdown-top white--text primary">
          <span class="white--text fs-14 fw-bold d-block">{{
            userInfo.phone || userInfo.userName
          }}</span>
        </div>
        <v-list class="dropdown-list">
          <template v-for="userLink in userLinks">
            <v-list-item
              :to="getMenuLink(userLink.path)"
              :key="userLink.id"
              v-if="userLink.id !== 4"
            >
              <i :class="userLink.icon"></i>
              <span>{{ userLink.title }}</span>
            </v-list-item>
            <v-list-item v-else @click="logoutUser" :key="userLink.id">
              <i :class="userLink.icon"></i>
              <span>{{ userLink.title }}</span>
            </v-list-item>
          </template>
        </v-list>
      </div>
    </v-menu>
  </v-list-item>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      userLinks: [
        // {
        //   id: 1,
        //   title: 'message.userProfile',
        //   icon: 'ti-user mr-3 primary--text',
        //   path: '/users/user-profile'
        // },
        // {
        //   id: 2,
        //   title: 'message.inbox',
        //   icon: 'ti-email mr-3 success--text',
        //   path: '/inbox'
        // },
        // {
        //   id: 3,
        //   title: 'message.usersList',
        //   icon: 'ti-bell mr-3 info--text',
        //   path: '/users/users-list'
        // },
        {
          id: 4,
          title: '退出登录',
          icon: 'ti-power-off mr-3 error--text'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.account.userInfo
    })
  },
  methods: {
    logoutUser() {
      let vm = this
      console.log('user logout...')
      vm.api.account.loginOut({ bizContent: {} }).then(
        res => {
          console.log(['res', res])
          vm.$store.dispatch('account/token', '')
          vm.$store.dispatch('account/userInfo', {})
          vm.$router.push({ path: '/login' })
        },
        err => {
          vm.$message.error(err)
        }
      )
    },
    getMenuLink(path) {
      return '/' + path
    }
  }
}
</script>
