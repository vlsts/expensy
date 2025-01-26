<script lang="ts">
	import { expenses } from '$lib/stores/expenses';
	import { categories } from '$lib/stores/categories';
	import { files } from '$lib/stores/files';
	import { Button, Card, Heading, Modal } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import type { File } from '$lib/types/api.types';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';

	let { expenseId, open = $bindable() } = $props();

	let expense = $derived($expenses.items.find((e) => e.id_expense === expenseId));
	let category = $derived(
		expense ? $categories.items.find((c) => c.id_category === expense.id_category) : null
	);

	function getFileName(fileId: string): string | null {
		// First check if file exists in store
		let file = $files.items.find((f) => f.id === fileId);

		return file?.filename || null;
	}
</script>

<Modal title="Viewing expense" bind:open autoclose outsideclose>
	{#if $expenses.loading || $categories.loading}
		<div class="animate-pulse w-full max-w-4xl">
			<div class="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
		</div>
	{:else if !expense}
		<Card class="w-full max-w-4xl">
			<div class="text-center text-red-500">Expense not found</div>
		</Card>
	{:else}
		<div class="grid md:grid-cols-2 gap-8">
			<!-- Left Column - Details -->
			<div class="space-y-4">
				<Heading tag="h1" class="text-2xl font-bold">
					{expense.name}
				</Heading>
				{#if expense.description}
					<p class="text-gray-600 dark:text-gray-400">
						{expense.description}
					</p>
				{/if}
				<p class="text-sm text-gray-500">
					Created on {new Date(expense.date).toLocaleDateString(undefined, {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
						hour: '2-digit',
						minute: '2-digit'
					})}
				</p>
				<Button
					size="sm"
					on:click={() => {
						expenses.deleteExpense(expense.id_expense);
						open = false;
					}}
					class="flex items-center space-x-2">
					<Icon icon="bi:trash" class="w-4 h-4 mx-2" />
					Delete Expense
				</Button>
			</div>

			<!-- Right Column - Amount & Category -->
			<div class="flex flex-col items-center justify-center space-y-6">
				{#if category}
					<div
						class="w-20 h-20 rounded-full flex items-center justify-center"
						style:background-color={'#' + category.color + '33'}>
						<Icon icon={category.id_icon} class="w-12 h-12" />
					</div>
				{/if}
				<div class="text-center">
					<p class="text-3xl font-bold">
						{expense.amount.toFixed(2)}
						{expense.id_currency}
					</p>
					{#if category}
						<p class="text-gray-600 dark:text-gray-400 mt-2">
							{category.name}
						</p>
					{/if}
				</div>
				{#if expense.id_files.length > 0}
					<div class="mt-8 w-full">
						<Heading tag="h3" class="text-lg font-semibold mb-4">Attached Files</Heading>
						<div class="space-y-3">
							{#each expense.id_files as file}
								<div
									class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
									<div class="flex items-center space-x-3">
										<Icon icon="bi:file-image" class="w-5 h-5 text-gray-500" />
										<span class="text-sm">{getFileName(file)}</span>
									</div>
									<Button
										size="xs"
										color="light"
										href={`${PUBLIC_BACKEND_URL}/files/${file}`}
										class="flex items-center space-x-2">
										<Icon icon="bi:download" class="w-4 h-4" />
										<span>Download</span>
									</Button>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</Modal>
