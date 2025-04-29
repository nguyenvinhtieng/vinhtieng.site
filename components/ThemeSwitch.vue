<template>
  <button
    ref="buttonRef"
    @click="onToggleTheme"
    aria-label="Toggle theme"
    class="md:w-10 md:h-10 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition cursor-pointer"
  >
    <NuxtIcon
      :name="theme === 'dark' ? 'moon' : 'sun'"
      class="text-xl text-yellow-500 dark:text-yellow-400 transition-transform duration-300"
    />
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import useCommonStore  from '@/stores/common.store'

const buttonRef = ref<HTMLElement | null>(null)
const commonStore = useCommonStore()
const { theme } = storeToRefs(commonStore)

const onToggleTheme = async () => {
  const nextTheme = theme.value === 'dark' ? 'light' : 'dark'
  if (
    !document.startViewTransition ||
    !buttonRef.value ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    commonStore.setTheme(nextTheme)
    return
  }

  await document.startViewTransition(() => {
    commonStore.setTheme(nextTheme)
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

</script>

<style scoped>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
</style>