<script lang="ts">
	import { expenses } from '$lib/stores/expenses';
	import { categories } from '$lib/stores/categories';
	import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
	import { onMount } from 'svelte';

	const MAX_CATEGORIES = 5;

	Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

	let chart: Chart;

	$: {
		if (chart && $expenses.items && $categories.items) {
			const categoryTotals = $expenses.items.reduce((acc, expense) => {
				acc[expense.id_category] = (acc[expense.id_category] || 0) + expense.amount;
				return acc;
			}, {});

			const sortedCategories = Object.entries(categoryTotals)
				.sort(([, a], [, b]) => b - a)
				.slice(0, MAX_CATEGORIES);

			const categoryData = sortedCategories.map(([categoryId, total]) => {
				const category = $categories.items.find((c) => c.id_category === categoryId);
				return {
					value: total,
					backgroundColor: '#' + category?.color,
					label: category?.name || 'Unknown'
				};
			});

			chart.data.datasets[0].data = categoryData.map((d) => d.value);
			chart.data.datasets[0].backgroundColor = categoryData.map((d) => d.backgroundColor);
			chart.data.labels = categoryData.map((d) => d.label);
			chart.update();
		}
	}

	onMount(() => {
		const ctx = document.getElementById('categoryChart') as HTMLCanvasElement;
		chart = new Chart(ctx, {
			type: 'doughnut',
			data: {
				labels: [],
				datasets: [
					{
						data: [],
						backgroundColor: [],
						borderWidth: 1
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						position: 'bottom'
					},
					tooltip: {
						callbacks: {
							label: (context) => {
								const value = context.raw as number;
								return `${context.label}: ${value.toFixed(2)}`;
							}
						}
					}
				}
			}
		});

		return () => {
			chart.destroy();
		};
	});
</script>

<canvas id="categoryChart"></canvas>
