<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const ui = useUIStore()
const showProfileMenu = ref(false)

const navItems = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'Expenses', path: '/expenses', icon: '💰' },
  { name: 'Scan Receipt', path: '/scan', icon: '📷' },
  { name: 'Analytics', path: '/analytics', icon: '📈' },
]

function handleLogout() {
  showProfileMenu.value = false
  auth.logout()
  router.push('/login')
}

function navigateTo(path: string) {
  router.push(path)
  showProfileMenu.value = false
  ui.closeMobileSidebar()
}
</script>

<template>
  <!-- Mobile overlay backdrop -->
  <Transition name="fade">
    <div
      v-if="ui.mobileSidebarOpen"
      @click="ui.closeMobileSidebar()"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
    ></div>
  </Transition>

  <!-- Sidebar -->
  <aside
    class="fixed inset-y-0 left-0 z-50 flex flex-col bg-gradient-to-b from-primary-500 via-primary-600 to-primary-800 transition-all duration-300 ease-in-out"
    :class="[
      ui.sidebarCollapsed ? 'w-[68px]' : 'w-64',
      ui.mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Logo Section -->
    <div
      class="flex items-center border-b border-primary-400/30 transition-all duration-300"
      :class="ui.sidebarCollapsed ? 'justify-center px-2 py-4' : 'gap-3 px-5 py-5'"
    >
      <!-- SVG Logo -->
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0">
        <rect x="6" y="3" width="20" height="30" rx="3" fill="#FFE8B4" opacity="0.9" />
        <rect x="10" y="10" width="12" height="2" rx="1" fill="#5E244E" opacity="0.5" />
        <rect x="10" y="15" width="9" height="2" rx="1" fill="#5E244E" opacity="0.5" />
        <rect x="10" y="20" width="11" height="2" rx="1" fill="#5E244E" opacity="0.5" />
        <rect x="10" y="25" width="7" height="2" rx="1" fill="#5E244E" opacity="0.3" />
        <circle cx="27" cy="9" r="7" fill="#E68457" />
        <path d="M27 5V13M23 9H31" stroke="white" stroke-width="1.8" stroke-linecap="round" />
        <path d="M24.5 6.5L29.5 11.5M29.5 6.5L24.5 11.5" stroke="white" stroke-width="1" stroke-linecap="round" opacity="0.5" />
      </svg>
      <div v-if="!ui.sidebarCollapsed" class="overflow-hidden">
        <h1 class="text-lg font-bold text-cream-100 whitespace-nowrap">ExpenseAI</h1>
        <p class="text-[11px] text-primary-200 whitespace-nowrap">Smart Expense Tracking</p>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-4" :class="ui.sidebarCollapsed ? 'px-2' : 'px-3'">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        @click="ui.closeMobileSidebar()"
        class="flex items-center rounded-lg mb-1 text-sm font-medium transition-all duration-200"
        :class="[
          route.path === item.path
            ? 'bg-white/15 text-cream-100 shadow-sm'
            : 'text-primary-100 hover:bg-white/10 hover:text-white',
          ui.sidebarCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'
        ]"
        :title="ui.sidebarCollapsed ? item.name : undefined"
      >
        <span class="text-lg flex-shrink-0">{{ item.icon }}</span>
        <span v-if="!ui.sidebarCollapsed" class="whitespace-nowrap">{{ item.name }}</span>
      </router-link>
    </nav>

    <!-- Collapse Toggle (desktop) -->
    <button
      @click="ui.toggleSidebar()"
      class="hidden lg:flex items-center justify-center py-2.5 text-primary-200 hover:text-white hover:bg-white/10 transition-colors border-t border-primary-400/30"
      :title="ui.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-300" :class="ui.sidebarCollapsed ? 'rotate-180' : ''" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </button>

    <!-- Profile Section (bottom) -->
    <div class="relative border-t border-primary-400/30">
      <button
        @click="showProfileMenu = !showProfileMenu"
        class="w-full flex items-center transition-colors hover:bg-white/10"
        :class="ui.sidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3'"
      >
        <!-- Avatar -->
        <div
          v-if="auth.user?.avatar_url"
          class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary-300/50"
        >
          <img :src="auth.user.avatar_url" class="w-full h-full object-cover" alt="" />
        </div>
        <div
          v-else
          class="w-8 h-8 rounded-full bg-primary-400 flex items-center justify-center text-xs font-bold text-cream-100 flex-shrink-0 ring-2 ring-primary-300/50"
        >
          {{ auth.userInitials }}
        </div>
        <template v-if="!ui.sidebarCollapsed">
          <div class="flex-1 text-left overflow-hidden">
            <p class="text-sm font-medium text-cream-100 truncate">{{ auth.user?.name }}</p>
            <p class="text-[11px] text-primary-200 truncate">{{ auth.user?.email }}</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary-200 flex-shrink-0 transition-transform duration-200" :class="showProfileMenu ? 'rotate-180' : ''" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
        </template>
      </button>

      <!-- Profile Dropdown (pops UP) -->
      <Transition name="slide-up">
        <div
          v-if="showProfileMenu"
          class="absolute bottom-full left-2 right-2 mb-2 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50"
        >
          <button
            @click="navigateTo('/profile')"
            class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
            Profile & Settings
          </button>
          <div class="border-t border-gray-100 my-1"></div>
          <button
            @click="handleLogout"
            class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-crimson-400 hover:bg-crimson-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
            </svg>
            Log Out
          </button>
        </div>
      </Transition>
    </div>
  </aside>

  <!-- Click-away overlay for profile menu -->
  <div v-if="showProfileMenu" @click="showProfileMenu = false" class="fixed inset-0 z-40"></div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.2s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
