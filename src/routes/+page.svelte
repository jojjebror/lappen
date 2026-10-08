<script lang="ts">
	import { goto } from '$app/navigation';
	import { APP_NAME, DEFAULT_LIST_NAME, ROUTES } from '#lib/constants.ts';
	import { createList, liveLists, session } from '#lib/store.svelte.ts';

	const lists = liveLists();
	let creating = $state(false);
	let name = $state('');

	const submit = (e: SubmitEvent) => {
		e.preventDefault();
		if (session.uid) goto(ROUTES.list(createList(session.uid, name.trim() || DEFAULT_LIST_NAME)));
	};
</script>

<h1 class="mb-6 text-3xl font-semibold tracking-tight">{APP_NAME}</h1>

<ul class="mb-6 divide-y divide-line">
	{#each lists.docs as list (list.id)}
		<li>
			<a href={ROUTES.list(list.id)} class="block py-4 text-lg">{list.name}</a>
		</li>
	{/each}
</ul>

{#if creating}
	<form onsubmit={submit} class="flex gap-2">
		<!-- svelte-ignore a11y_autofocus -->
		<input
			bind:value={name}
			placeholder={DEFAULT_LIST_NAME}
			autofocus
			class="min-w-0 flex-1 rounded-xl border border-line bg-white px-4 py-3 text-lg outline-none focus:border-accent"
		/>
		<button class="rounded-xl bg-accent px-5 font-medium text-white">Create</button>
	</form>
{:else}
	<button
		onclick={() => (creating = true)}
		disabled={!session.uid}
		class="w-full rounded-xl bg-accent py-3 text-lg font-medium text-white disabled:opacity-50"
	>
		New list
	</button>
{/if}
