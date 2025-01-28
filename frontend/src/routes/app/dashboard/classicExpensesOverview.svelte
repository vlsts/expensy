<script lang="ts">
	import { expenses } from '$lib/stores/expenses';
	import { categories } from '$lib/stores/categories';
	import { EyeOutline } from 'flowbite-svelte-icons';
	import { Heading, Button } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import ModalViewExpense from './modalViewExpense.svelte';

	let viewExpenseModal = $state(false);
	let viewExpenseId: string = $state('');

	let latestExpenses = $derived(
		$expenses.items
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			.slice(0, 3)
	);

	let getCategoryFromId = $derived((id_category: string) => {
		return $categories.items.find((c) => c._id === id_category) ?? null;
	});

	$effect(() => {
		if ($expenses.error) {
			console.error('Failed to load expenses:', $expenses.error);
		}
	});

	function viewExpense(id_expense: string) {
		viewExpenseModal = true;
		viewExpenseId = id_expense;
	}
</script>

<div class="space-y-4">
	<Heading tag="h3" class="text-lg font-semibold mb-4">Latest Expenses</Heading>

	{#if $expenses.loading}
		<div class="animate-pulse space-y-4">
			{#each Array(3) as _}
				<div class="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
			{/each}
		</div>
	{:else if $expenses.error}
		<p class="text-center text-red-500">Failed to load expenses</p>
	{:else if latestExpenses.length === 0}
		<p class="text-center text-gray-500">No expenses recorded yet</p>
	{:else}
		{#each latestExpenses as expense}
			{@const category = getCategoryFromId(expense.id_category)}
			<div
				class="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700">
				<div class="flex items-center space-x-4">
					<div class="flex-shrink-0">
						{#if category}
							<div
								class="w-10 h-10 rounded-full flex items-center justify-center"
								style:background-color={'#' + category.color + '33'}>
								<Icon icon={category.id_icon} class="w-6 h-6" />
							</div>
						{:else}
							<div
								class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
								<span class="text-gray-500">?</span>
							</div>
						{/if}
					</div>
					<div>
						<p class="font-medium">{expense.name}</p>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{new Date(expense.date).toLocaleDateString()}
						</p>
					</div>
				</div>
				<div class="flex items-center space-x-4">
					<span class="font-semibold">
						{expense.amount.toFixed(2)}
						<!-- {expense.id_currency} -->
					</span>
					<Button color="light" class="p-2" on:click={() => viewExpense(expense._id)}>
						<EyeOutline class="w-4 h-4" />
					</Button>
				</div>
			</div>
		{/each}
	{/if}
</div>

<ModalViewExpense expenseId={viewExpenseId} bind:open={viewExpenseModal} />
