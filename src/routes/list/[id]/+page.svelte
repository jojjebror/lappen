<script lang="ts">
	import { page } from '$app/state';
	import { ROUTES } from '#lib/constants.ts';
	import { sortItems, suggest } from '#lib/items.ts';
	import {
		addItem,
		clearChecked,
		joinList,
		liveHistory,
		liveItems,
		liveLists,
		session,
		setChecked
	} from '#lib/store.svelte.ts';

	const id = $derived(page.params.id!);
	const lists = liveLists();
	const list = $derived(lists.docs.find((l) => l.id === id));
	const items = liveItems(() => list?.id);
	const history = liveHistory(() => list?.id);

	let input = $state('');
	const sorted = $derived(sortItems(items.docs));
	const suggestions = $derived(suggest(history.docs, input, items.docs));
	const hasChecked = $derived(items.docs.some((i) => i.checked));

	$effect(() => {
		if (session.uid && !lists.loading && !list) joinList(id, session.uid);
	});

	const add = (name: string) => {
		if (name.trim()) addItem(id, name.trim(), items.docs);
		input = '';
	};

	const share = () => {
		const url = page.url.href;
		if (navigator.share) navigator.share({ title: list?.name, url }).catch(() => {});
		else navigator.clipboard.writeText(url);
	};
</script>

<header class="mb-4 flex items-center gap-3">
	<a href={ROUTES.home} class="-ml-2 px-2 py-1 text-2xl text-muted" aria-label="Back">‹</a>
	<h1 class="flex-1 truncate text-2xl font-semibold tracking-tight">{list?.name ?? ''}</h1>
	<button onclick={share} class="rounded-lg px-3 py-1 text-accent">Share</button>
</header>

<form
	onsubmit={(e) => {
		e.preventDefault();
		add(input);
	}}
>
	<input
		bind:value={input}
		placeholder="Add item"
		enterkeyhint="done"
		autocomplete="off"
		class="w-full rounded-xl border border-line bg-white px-4 py-3 text-lg outline-none focus:border-accent"
	/>
</form>

<div class="mt-2 flex min-h-9 flex-wrap gap-2">
	{#each suggestions as s (s.name)}
		<button
			onpointerdown={(e) => e.preventDefault()}
			onclick={() => add(s.name)}
			class="rounded-full border border-line bg-white px-3 py-1 text-sm"
		>
			{s.name}
		</button>
	{/each}
</div>

<ul class="mt-2 divide-y divide-line">
	{#each sorted as item (item.id)}
		<li>
			<button
				onclick={() => setChecked(id, item.id, !item.checked)}
				class={[
					'w-full py-3 text-left text-lg transition-colors',
					item.checked && 'text-muted line-through'
				]}
			>
				{item.name}
			</button>
		</li>
	{/each}
</ul>

{#if hasChecked}
	<button onclick={() => clearChecked(id, items.docs)} class="mt-6 w-full py-3 text-muted">
		Clear crossed off
	</button>
{/if}
