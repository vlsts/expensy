<script lang="ts">
	import { page } from '$app/stores';
	import { categories } from '$lib/stores/categories';
	import { currencies } from '$lib/stores/currencies';
	import { expenses } from '$lib/stores/expenses';
	import { files } from '$lib/stores/files';
	import { Button, Modal } from 'flowbite-svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import AddCategoryModal from './addCategoryModal.svelte';
	import AddExpenseModal from './addExpenseModal.svelte';
	import AddFileModal from './addFileModal.svelte';

	let { children } = $props();
	let showExpenseModal = $state(false);
	let showCategoryModal = $state(false);
	let showFileModal = $state(false);

	onMount(() => {
		Promise.all([
			categories.fetchCategories(),
			expenses.fetchExpenses(),
			currencies.fetchCurrencies(),
			files.fetchFiles()
		]).then(() => console.log($files.items));
	});

	let showButtons = $derived(!$page.url.pathname.includes('/app/account'));
</script>

{#if showButtons}
	<div class="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
		<Button
			color="blue"
			class="rounded-full shadow-lg flex items-center gap-2"
			on:click={() => (showExpenseModal = true)}>
			<PlusOutline class="w-4 h-4" />
			Add Expense
		</Button>

		<Button
			color="green"
			class="rounded-full shadow-lg flex items-center gap-2"
			on:click={() => (showCategoryModal = true)}>
			<PlusOutline class="w-4 h-4" />
			Add Category
		</Button>

		<Button
			color="purple"
			class="rounded-full shadow-lg flex items-center gap-2"
			on:click={() => (showFileModal = true)}>
			<PlusOutline class="w-4 h-4" />
			Add File
		</Button>
	</div>
{/if}

<AddCategoryModal bind:open={showCategoryModal} />
<AddExpenseModal bind:open={showExpenseModal} />
<AddFileModal bind:open={showFileModal} />

{@render children()}
