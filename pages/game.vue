<template>
  <div class="min-h-screen text-gray-800 dark:text-gray-100 relative z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pb-16">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 mb-6">
          <NuxtIcon name="game" class="text-4xl text-sky-500 dark:text-sky-400 animate-float" />
        </div>
        
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-12 tracking-tight text-gray-900 dark:text-gray-100">
          🎮 {{ $t('game_list.title') }}
        </h1>
      </div>

      <!-- Games Grid -->
      <div class="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        <GameCard
          v-for="game in GAMES"
          :key="game.url"
          :name="gameName(game)"
          :description="gameDescription(game)"
          :url="game.url"
          :image="game.image"
          :category="gameCategory(game)"
          :is-mine="game.isMine"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useHead } from '#app';
import { SITE } from '~/constants/common';
import { GAMES, type GameItem } from '~/data/games';
import GameCard from '~/components/game/GameCard.vue';

const { t, locale } = useI18n();

useHead({
  title: 'Free Online Games | Best Browser Games Collection',
  meta: [
    {
      name: 'description',
      content: 'Discover the best free online games! Play Chinese Chess, Venge.io FPS shooter, and more browser games. All games are free and playable instantly.',
    },
    {
      name: 'keywords',
      content: 'free online games, browser games, io games, fps games, chinese chess, venge.io, play games online',
    },
    { property: 'og:title', content: 'Free Online Games | Best Browser Games' },
    {
      property: 'og:description',
      content: 'Discover the best free online games! Play instantly in your browser - no download required.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${SITE}/game` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Free Online Games' },
    {
      name: 'twitter:description',
      content: 'Discover the best free online games! Play instantly in your browser.',
    },
  ],
  link: [{ rel: 'canonical', href: `${SITE}/game` }],
});

const gameName = (game: GameItem): string => {
  return locale.value === 'vi' ? game.nameVi : game.nameEn;
};

const gameDescription = (game: GameItem): string => {
  return locale.value === 'vi' ? game.descriptionVi : game.descriptionEn;
};

const gameCategory = (game: GameItem): string => {
  return locale.value === 'vi' ? game.categoryVi : game.categoryEn;
};
</script>
