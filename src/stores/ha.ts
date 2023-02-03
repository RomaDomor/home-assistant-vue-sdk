import { ref } from "vue";
import { defineStore } from "pinia";
import { API } from "./api";
import type { Entity, KeyedArray } from "./api/types";

export const useHAStore = defineStore("ha", () => {
	const entities = ref<KeyedArray<Entity>>();

	const api = new API(
		import.meta.env.VITE_API_PROTOCOL,
		import.meta.env.VITE_API_DOMAIN,
		import.meta.env.VITE_API_PORT,
		import.meta.env.VITE_API_KEY
	);
	api.setHandler((e, c) => {
		if (entities.value == null) entities.value = e;
		// console.log("UPDATE", e, c);
		if (c !== undefined) entities.value[`${c.domain}.${c.id}`] = c;
		// TODO: Fix Vue DOM updates (not registering update);
	});
	api.initSockets();

	console.log("INIT");

	return { entities };
});
