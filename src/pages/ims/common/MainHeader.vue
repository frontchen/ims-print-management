<!-- Header Structure -->
<template>
	<div>
		<v-navigation-drawer
			v-if="!horizontal"
			app
			fixed
			v-model="drawer"
			:mini-variant="false"
			mini-variant-width="70"
			:width="250"
			class="Vuely-sidebar"
			:style="{ backgroundImage: 'none' }"
			:class="{ 'background-none': true }"
			:right="false"
		>
			<app-sidebar></app-sidebar>
		</v-navigation-drawer>

		<v-app-bar class="Vuely-toolbar" app color="#f5f5f5" fixed>
			<div class="d-custom-flex align-items-center navbar-left">
				<div v-if="!horizontal">
					<v-app-bar-nav-icon
						@click.stop="drawer = !drawer"
						class="v-step-0"
					></v-app-bar-nav-icon>
				</div>
				<!-- <v-btn icon large class="mx-2 quick-link">
          <i class="zmdi grey--text zmdi-hc-fw font-lg zmdi-apps"></i>
        </v-btn>
        <v-text-field
          text
          solo
          prepend-icon="search"
          :placeholder="'搜索'"
          class="search-bar"
        ></v-text-field>
        <div class="mobile-search d-none">
          <v-btn
            text
            icon
            small
            class="mobile-search-btn"
            @click="toggleSearchForm"
          >
            <v-icon class="font-md">search</v-icon>
          </v-btn>
        </div>-->
			</div>
			<div class="navbar-right">
				<!-- <v-btn icon large @click="toggleFullScreen" class="full-screen ma-0">
          <v-icon color="grey">fullscreen</v-icon>
        </v-btn>
        <v-btn class="ma-0" icon large @click.stop="chatSidebar = !chatSidebar">
          <v-icon color="grey">forum</v-icon>
        </v-btn>
        <v-btn class="notification-icon ma-0" icon large>
          <i
            class="zmdi grey--text zmdi-notifications-active animated infinite wobble zmdi-hc-fw font-lg"
          ></i>
        </v-btn>-->
				<!-- <v-btn text icon>
          <v-badge right overlap>
            <span slot="badge">1</span>
            <i
              class="zmdi grey--text zmdi-shopping-cart zmdi-hc-fw font-lg"
            ></i>
          </v-badge>
        </v-btn>-->
			</div>
		</v-app-bar>
	</div>
</template>

<script>
import MainMenu from './MainMenu'

export default {
	components: {
		appSidebar: MainMenu,
	},
	props: {
		horizontal: {
			default: false,
			type: Boolean,
		},
	},
	data() {
		return {
			collapsed: false, // collapse sidebar
			drawer: null, // sidebar drawer default true
			chatSidebar: false, // chat component right sidebar
			sidebarImages: '', // sidebar background images
			enableDefaultSidebar: false,
		}
	},
	methods: {
		// toggle full screen method
		toggleFullScreen() {},
		sidebarPath() {},
		getMenuLink() {},
		toggleSearchForm() {},
	},
}
</script>
