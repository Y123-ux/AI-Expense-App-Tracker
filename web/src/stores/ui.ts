import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const stored = localStorage.getItem('sidebar-collapsed')
  const sidebarCollapsed = ref(stored === null ? false : stored === 'true')
  const mobileSidebarOpen = ref(false)

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
    localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed.value))
  }

  function toggleMobileSidebar() {
    mobileSidebarOpen.value = !mobileSidebarOpen.value
  }

  function closeMobileSidebar() {
    mobileSidebarOpen.value = false
  }

  return {
    sidebarCollapsed, mobileSidebarOpen,
    toggleSidebar, toggleMobileSidebar, closeMobileSidebar,
  }
})
