<script lang="ts">
	import { Chart } from 'flowbite-svelte';
	import type { Expense } from '$lib/types/api.types';
	import { expenses as storeExpenses } from '$lib/stores/expenses';
	import { categories as storeCategories } from '$lib/stores/categories';
	import { type ApexOptions } from 'apexcharts';
	import { onMount } from 'svelte';

	let selectedPeriod = $props<'day' | 'week' | 'month' | 'year'>();

	let filteredExpenses = $derived(filterExpensesByPeriod($storeExpenses.items, selectedPeriod));

	let expenseData = $derived(
		$storeCategories.items
			.map((category) => ({
				name: category.name,
				total: filteredExpenses
					.filter((exp) => exp.id_category === category.id_category)
					.reduce((sum, exp) => sum + exp.amount, 0)
			}))
			.filter((data) => data.total > 0)
	);

	let isLoading = $derived($storeExpenses.loading || $storeCategories.loading);
	let hasError = $derived($storeExpenses.error || $storeCategories.error);
	let hasData = $derived(expenseData.length > 0);

	let options = $derived({
		series: expenseData.map((d) => d.total),
		colors: $storeCategories.items.map((c) => c.color || '#1C64F2'),
		chart: {
			type: 'donut',
			height: 320
		},
		plotOptions: {
			pie: {
				donut: {
					labels: {
						show: true,
						total: {
							show: true,
							label: `Total (${selectedPeriod})`,
							// This function receives the ApexCharts globals object
							// seriesTotals contains an array of all values in the chart
							// We sum them and format to 2 decimal places
							formatter: function (w: { globals: { seriesTotals: number[] } }) {
								const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
								return total.toFixed(0);
							}
						}
					}
				}
			}
		},
		labels: expenseData.map((d) => d.name),
		legend: {
			position: 'bottom'
		}
	} as ApexOptions);

	function filterExpensesByPeriod(expenses: Expense[], period: string): Expense[] {
		const now = new Date();
		const startDate = new Date();
		const endDate = new Date();

		// Set end date to end of current day
		endDate.setHours(23, 59, 59, 999);

		switch (period) {
			case 'day':
				// Start of current day
				startDate.setHours(0, 0, 0, 0);
				break;
			case 'week':
				// Start of current week (last Sunday/Monday)
				startDate.setDate(now.getDate() - now.getDay());
				startDate.setHours(0, 0, 0, 0);
				break;
			case 'month':
				// Start of current month
				startDate.setDate(1);
				startDate.setHours(0, 0, 0, 0);
				break;
			case 'year':
				// Start of current year
				startDate.setMonth(0, 1);
				startDate.setHours(0, 0, 0, 0);
				break;
			default:
				return expenses;
		}

		return expenses.filter((exp) => {
			const expDate = new Date(exp.date);
			return expDate >= startDate && expDate <= endDate;
		});
	}

	$effect(() => {
		console.log('Chart data updated:', {
			expenses: filteredExpenses.length,
			categories: expenseData.length,
			total: expenseData.reduce((sum, d) => sum + d.total, 0)
		});
	});

	onMount(() => {
		console.log(filteredExpenses);
	});
</script>

{#if isLoading}
	<div class="flex items-center justify-center h-[320px]">
		<p>Loading chart data...</p>
	</div>
{:else if hasError}
	<div class="flex items-center justify-center h-[320px]">
		<p class="text-red-500">Failed to load chart data</p>
	</div>
{:else if !hasData}
	<div class="flex items-center justify-center h-[320px]">
		<p>No expenses found for selected period</p>
	</div>
{:else}
	<div class="w-full h-[320px]">
		<Chart {options} />
	</div>
{/if}
