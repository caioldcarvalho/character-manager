<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { appStore } from '$lib/stores/app.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	// Load characters from localStorage on mount
	onMount(() => {
		appStore.loadFromLocalStorage();
	});

	// Auto-save on state changes
	$effect(() => {
		// Access state to trigger reactivity
		appStore.state.characters;
		// Save is handled within store methods
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
