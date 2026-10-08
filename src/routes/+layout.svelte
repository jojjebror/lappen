<script lang="ts">
	import './layout.css';
	import { APP_NAME, THEME_COLOR } from '#lib/constants.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<title>{APP_NAME}</title>
	<meta name="theme-color" content={THEME_COLOR} />
</svelte:head>

<main
	class="mx-auto min-h-dvh max-w-lg px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]"
>
	{@render children()}
</main>
