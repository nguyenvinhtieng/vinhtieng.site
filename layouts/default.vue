<template>
	<main>
		<Header />
		<main class="min-h-screen flex flex-col pt-14 bg-gradient-to-br from-white to-slate-100 dark:from-neutral-950 dark:to-neutral-900 z-10">
			<NuxtPage class="flex-1"/>
			<Footer />
		</main>
		<Background />
		<SearchDialog />
	</main>
</template>
<script setup lang="ts">
import Header from '@/components/layouts/Header.vue'
import Footer from '@/components/layouts/Footer.vue'
import SearchDialog from '~/components/SearchDialog.vue';
import Background from '~/components/home/Background.vue';

</script>