<script setup lang="ts">
import { Switch } from "@headlessui/vue";
import { ref } from "vue";
import {
	ArrowPathRoundedSquareIcon,
	EllipsisHorizontalIcon,
	BellAlertIcon,
	ComputerDesktopIcon
} from "@heroicons/vue/20/solid";
import { useHAStore } from "@/stores/ha";
// import { EntityDomain } from "@/stores/types";

// import TheWelcome from "../components/TheWelcome.vue";
const enabled = ref(false);

const store = useHAStore();
// const fan = computed(() => store.fans["1_floor_ventilation"]);
// console.log(store.getSwitch ?? null);
store.$subscribe((m, s) =>
	console.log(m, s.entities["light.lounge_main_lighting"])
);
</script>

<template>
	<main class="flex-1 overflow-y-auto" v-if="store.entities != null">
		<!-- Primary column -->
		<section
			aria-labelledby="primary-heading"
			class="flex h-full min-w-0 flex-1 flex-col lg:order-last"
		>
			<h1 id="primary-heading" class="sr-only">Main</h1>
			<!-- Your content -->
			<!-- <nav
				class="flex w-full h-24 "
			></nav> -->
			<div
				class="mx-auto w-full px-8 bg-zinc-900 border-b border-neutral-700 py-6 space-y-5"
			>
				<div class="relative flex justify-between">
					<div class="relative z-10 flex px-2 lg:px-0">
						<div class="flex flex-shrink-0 items-center">
							<p class="text-neutral-500 text-sm font-bold">
								Lounge
							</p>
						</div>
					</div>
					<div
						class="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center"
					>
						<!-- Profile dropdown -->
						<button class="text-neutral-300">
							<EllipsisHorizontalIcon class="h-4 w-auto" />
						</button>
					</div>
				</div>
				<div class="flex justify-between">
					<p class="text-neutral-500 text-xs">Temperature</p>
					<div class="flex space-x-12">
						<p>
							<BellAlertIcon
								class="h-4 w-auto text-neutral-400"
							/>
						</p>
						<button class="flex space-x-2">
							<ArrowPathRoundedSquareIcon
								class="h-4 w-auto"
								:class="
									enabled
										? 'text-blue-600'
										: 'text-neutral-400'
								"
							/>
							<Switch
								v-model="enabled"
								:class="[
									enabled ? 'bg-blue-600' : 'bg-neutral-400',
									'relative inline-flex h-4 w-7 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
								]"
							>
								<span class="sr-only">Use setting</span>
								<span
									aria-hidden="true"
									:class="[
										enabled
											? 'translate-x-3'
											: 'translate-x-0',
										'pointer-events-none inline-block h-3 w-3 transform rounded-full bg-neutral-300 shadow ring-0 transition duration-200 ease-in-out'
									]"
								/>
							</Switch>
						</button>
					</div>
				</div>
			</div>
			<section class="space-y-16 py-16 px-20">
				<div class="w-full grid grid-cols-2 gap-8">
					<div></div>
					<div class="space-y-12">
						<section>
							<h3
								class="text-neutral-500 uppercase text-xs font-bold"
							>
								Devices
							</h3>
							<div class="grid grid-cols-4 gap-4 mt-4">
								<div
									v-for="i in 6"
									:key="i"
									v-on:click="
										store.entities[
											'light.lounge_main_lighting'
										].toggle()
									"
									class="bg-neutral-900 flex flex-col space-y-1 justify-center items-center aspect-square rounded-md filter drop-shadow-md p-4"
								>
									<ComputerDesktopIcon
										class="h-8 w-auto text-neutral-600"
									/>
									<div
										class="h-0.5 w-8 rounded-full bg-gray-300"
									>
										<div
											:style="
												'width: ' +
												(store.entities[
													'light.lounge_main_lighting'
												].on
													? store.entities[
															'light.lounge_main_lighting'
													  ].brightness ?? 0
													: 0) /
													2.55 +
												'%'
											"
											class="h-full rounded-full bg-purple-600"
										></div>
									</div>
								</div>
							</div>
						</section>
						<section>
							<h3
								class="text-neutral-500 uppercase text-xs font-bold"
							>
								Last days
							</h3>
						</section>
					</div>
				</div>
				<div>
					<h3 class="text-neutral-500 uppercase text-xs font-bold">
						Devices
					</h3>
					<div class="mt-8 flex justify-between">
						<div
							v-for="i in 5"
							:key="i"
							class="group hover:shadow-md hover:shadow-neutral-600 aspect-square bg-neutral-900 w-1/6 rounded-3xl filter drop-shadow-md flex-col justify-between p-4 text-neutral-600"
						>
							<div class="justify-between flex items-center">
								<ComputerDesktopIcon class="h-5 w-auto" />
								<button class="flex space-x-2">
									<Switch
										v-model="enabled"
										:class="[
											enabled
												? 'bg-purple-700'
												: 'bg-neutral-500',
											'relative inline-flex h-4 w-7 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
										]"
									>
										<span class="sr-only">Enable</span>
										<span
											aria-hidden="true"
											:class="[
												enabled
													? 'translate-x-3'
													: 'translate-x-0',
												'pointer-events-none inline-block h-3 w-3 transform rounded-full bg-neutral-300 shadow ring-0 transition duration-200 ease-in-out'
											]"
										/>
									</Switch>
								</button>
							</div>
							<div class="mt-8 flex flex-col">
								<p class="text-sm tracking-tighter">
									Air condition
								</p>
								<p class="text-sm tracking-tighter">16 C</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</section>
	</main>

	<!-- Secondary column (hidden on smaller screens) -->
	<aside
		class="hidden w-80 overflow-y-auto border-l border-neutral-700 bg-neutral-900 lg:block"
	>
		<!-- Your content -->
	</aside>
</template>
