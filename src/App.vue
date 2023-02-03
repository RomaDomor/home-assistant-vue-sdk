<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import routes from "@/router/routes";
import { useHAStore } from "@/stores/ha";
import { ref } from "vue";
import {
	Dialog,
	DialogPanel,
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
	TransitionChild,
	TransitionRoot
} from "@headlessui/vue";
import {
	Bars3BottomLeftIcon,
	CogIcon,
	HomeIcon,
	PhotoIcon,
	PlusIcon,
	RectangleStackIcon,
	Squares2X2Icon,
	UserGroupIcon,
	XMarkIcon
} from "@heroicons/vue/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/vue/20/solid";

const sidebarNavigation = routes;

const mobileMenuOpen = ref(false);
const store = useHAStore();
</script>

<template>
	<div class="flex h-full">
		<!-- Narrow sidebar -->
		<div
			class="hidden w-20 overflow-y-auto bg-neutral-900 md:block border-neutral-700 border-r"
			style="background-image: background-image: url(data:image/png;base64,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);"
		>
			<div class="flex w-full flex-col items-center py-6">
				<div class="flex flex-shrink-0 items-center">
					<!-- <img
						class="h-8 w-auto"
						src="https://tailwindui.com/img/logos/mark.svg?color=white"
						alt="Your Company"
					/> -->
					<Bars3BottomLeftIcon class="h-8 w-auto text-white" />
				</div>
				<div class="mt-36 w-full flex-1 space-y-12">
					<RouterLink
						v-for="item in sidebarNavigation"
						:key="item.name"
						:to="item.path"
						:class="[
							item.name == $route.name
								? 'border-purple-800 text-purple-800 border-r-2'
								: 'text-white hover:border-purple-800 hover:border-r hover:text-white',
							'group w-full py-1 flex flex-col items-center text-xs font-medium px-2'
						]"
						:aria-current="
							item.name == $route.name ? 'page' : undefined
						"
					>
						<component
							:is="item.icon"
							:class="[
								item.name == $route.name
									? 'text-purple-800'
									: 'text-white group-hover:text-purple-800',
								'h-6 w-6'
							]"
							aria-hidden="true"
						/>
						<!-- <span class="mt-2">{{ item.name }}</span> -->
					</RouterLink>
				</div>
			</div>
		</div>

		<!-- Mobile menu -->
		<TransitionRoot as="template" :show="mobileMenuOpen">
			<Dialog
				as="div"
				class="relative z-20 md:hidden"
				@close="mobileMenuOpen = false"
			>
				<TransitionChild
					as="template"
					enter="transition-opacity ease-linear duration-300"
					enter-from="opacity-0"
					enter-to="opacity-100"
					leave="transition-opacity ease-linear duration-300"
					leave-from="opacity-100"
					leave-to="opacity-0"
				>
					<div class="fixed inset-0 bg-neutral-600 bg-opacity-75" />
				</TransitionChild>

				<div class="fixed inset-0 z-40 flex">
					<TransitionChild
						as="template"
						enter="transition ease-in-out duration-300 transform"
						enter-from="-translate-x-full"
						enter-to="translate-x-0"
						leave="transition ease-in-out duration-300 transform"
						leave-from="translate-x-0"
						leave-to="-translate-x-full"
					>
						<DialogPanel
							class="relative flex w-full max-w-xs flex-1 flex-col bg-purple-700 pt-5 pb-4"
						>
							<TransitionChild
								as="template"
								enter="ease-in-out duration-300"
								enter-from="opacity-0"
								enter-to="opacity-100"
								leave="ease-in-out duration-300"
								leave-from="opacity-100"
								leave-to="opacity-0"
							>
								<div class="absolute top-1 right-0 -mr-14 p-1">
									<button
										type="button"
										class="flex h-12 w-12 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-white"
										@click="mobileMenuOpen = false"
									>
										<XMarkIcon
											class="h-6 w-6 text-white"
											aria-hidden="true"
										/>
										<span class="sr-only"
											>Close sidebar</span
										>
									</button>
								</div>
							</TransitionChild>
							<div class="flex flex-shrink-0 items-center px-4">
								<img
									class="h-8 w-auto"
									src="https://tailwindui.com/img/logos/mark.svg?color=white"
									alt="Your Company"
								/>
							</div>
							<div class="mt-5 h-0 flex-1 overflow-y-auto px-2">
								<nav class="flex h-full flex-col">
									<div class="space-y-1">
										<a
											v-for="item in sidebarNavigation"
											:key="item.name"
											:href="item.path"
											:class="[
												item.name == $route.name
													? 'bg-purple-800 text-white'
													: 'text-purple-100 hover:bg-purple-800 hover:text-white',
												'group py-2 px-3 rounded-md flex items-center text-sm font-medium'
											]"
											:aria-current="
												item.name == $route.name
													? 'page'
													: undefined
											"
										>
											<component
												:is="item.icon"
												:class="[
													item.name == $route.name
														? 'text-white'
														: 'text-purple-300 group-hover:text-white',
													'mr-3 h-6 w-6'
												]"
												aria-hidden="true"
											/>
											<span>{{ item.name }}</span>
										</a>
									</div>
								</nav>
							</div>
						</DialogPanel>
					</TransitionChild>
					<div class="w-14 flex-shrink-0" aria-hidden="true">
						<!-- Dummy element to force sidebar to shrink to fit close icon -->
					</div>
				</div>
			</Dialog>
		</TransitionRoot>

		<!-- Content area -->
		<div class="flex flex-1 flex-col overflow-hidden">
			<!-- Main content -->
			<div class="flex flex-1 items-stretch overflow-hidden">
				<RouterView />
			</div>
		</div>
	</div>
</template>
