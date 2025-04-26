<template>
  <button
    ref="buttonRef"
    @click="toggleTheme"
    class="md:w-10 md:h-10 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition cursor-pointer"
  >
    <Icon
      :icon="isDark ? 'mdi:moon-waning-crescent' : 'mdi:weather-sunny'"
      class="w-6 h-6 text-yellow-500 dark:text-yellow-400 transition-transform duration-300"
    />
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'

const isDark = ref<boolean>(false)
const buttonRef = ref<HTMLElement | null>(null)

const toggleTheme = async () => {
  if (
    !document.startViewTransition ||
    !buttonRef.value ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    isDark.value = !isDark.value
    return
  }

  const nextIsDark = !isDark.value

  await document.startViewTransition(() => {
    isDark.value = nextIsDark
  }).ready

  const { top, left, width, height } = buttonRef.value.getBoundingClientRect()
  const x = left + width / 2
  const y = top + height / 2
  const right = window.innerWidth - left
  const bottom = window.innerHeight - top
  const maxRadius = Math.hypot(Math.max(left, right), Math.max(top, bottom))

  document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${maxRadius}px at ${x}px ${y}px)`,
      ],
    },
    {
      duration: 500,
      easing: 'ease-in-out',
      pseudoElement: '::view-transition-new(root)',
    }
  )
}

watch(isDark, (value) => {
  document.documentElement.classList.toggle('dark', value)
  localStorage.setItem('isDarkTheme', JSON.stringify(value))
})

onMounted(() => {
  try {
    const isDarkThemeLocalStorage = localStorage.getItem('isDarkTheme')
    if (isDarkThemeLocalStorage !== null) {
      isDark.value = JSON.parse(isDarkThemeLocalStorage)
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  } catch {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  document.documentElement.classList.toggle('dark', isDark.value)
})
</script>

<style scoped>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
</style>