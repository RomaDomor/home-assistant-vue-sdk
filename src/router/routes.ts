import HomeView from "../views/HomeView.vue";

import { HomeIcon } from "@heroicons/vue/24/outline";

export default [
	{
		path: "/",
		name: "home",
		friendlyName: "Home",
		component: HomeView,
		icon: HomeIcon
	},
	{
		path: "/about",
		name: "about",
		friendlyName: "About",
		// route level code-splitting
		// this generates a separate chunk (About.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: HomeView,
		icon: HomeIcon
	}
];
