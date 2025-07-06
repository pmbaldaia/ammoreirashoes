<script setup>
import {
  PhHouse,
  PhUsersThree,
  PhCalendarCheck,
  PhImages,
  PhCalendar,
} from "@phosphor-icons/vue";
import { useRoute } from "vue-router";

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
});

const route = useRoute();

const links = [
  { name: "Dashboard", icon: PhHouse, to: "/admin" },
  { name: "Equipas", icon: PhUsersThree, to: "/admin/equipas" },
  { name: "Jornadas", icon: PhCalendarCheck, to: "/admin/jornadas" },
  { name: "Galeria", icon: PhImages, to: "/admin/galeria" },
  { name: "Eventos", icon: PhCalendar, to: "/admin/eventos" },
];

const isActive = (to) => route.path === to;
</script>

<template>
  <aside
    :class="[
      'flex flex-col bg-white dark:bg-gray-900 border-r dark:border-gray-800 shadow-sm min-h-screen transition-[width] duration-300',
      collapsed ? 'w-16 items-center' : 'w-64 items-start',
    ]"
  >
    <div
      :class="[
        'flex items-center h-16 border-b dark:border-gray-800 px-4 pb-4 font-bold text-gray-800 dark:text-white w-full mt-4 justify-center',
      ]"
    >
      <img
        v-if="collapsed"
        src="/assets/img/logotipo.png"
        alt="Logo pequeno"
        class="w-8 h-8 object-contain"
      />
      <img
        v-else
        src="/assets/img/logotipo.png"
        alt="Logo médio"
        class="w-16 h-auto object-contain"
      />
    </div>
    <nav
      :class="[
        'flex-1 mt-6 space-y-1 w-full px-4',
        collapsed ? 'flex flex-col items-center' : '',
      ]"
    >
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        exact
        :aria-current="isActive(link.to) ? 'page' : undefined"
        :class="[
          'group flex items-center gap-3 rounded-lg font-medium transition-colors w-full',
          isActive(link.to)
            ? 'bg-red-800 text-white font-bold'
            : 'text-gray-700 dark:text-gray-300 hover:bg-green-900 dark:hover:bg-green-900 hover:text-white',
          collapsed ? 'justify-center px-0 py-3' : 'justify-start px-4 py-3',
        ]"
      >
        <component
          :is="link.icon"
          class="w-5 h-5"
          weight="bold"
          :class="[
            isActive(link.to)
              ? 'text-white'
              : 'text-gray-700 dark:text-gray-300 group-hover:text-white dark:group-hover:text-white',
          ]"
        />

        <span v-if="!collapsed">{{ link.name }}</span>
      </NuxtLink>
    </nav>
  </aside>
</template>
