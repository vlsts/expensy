<script lang="ts">
	import { Card, Heading, Select, Button, Toast } from 'flowbite-svelte';
	import { files } from '$lib/stores/files';
	import { categories } from '$lib/stores/categories';
	import Icon from '@iconify/svelte';
	import ChartSplitCategories from './chartSplitCategories.svelte';
	import ClassicExpensesOverview from './classicExpensesOverview.svelte';

	let selectedPeriod: 'day' | 'week' | 'month' | 'year' = 'month';
	const periodOptions = [
		{ value: 'day', name: 'Today' },
		{ value: 'week', name: 'This Week' },
		{ value: 'month', name: 'This Month' },
		{ value: 'year', name: 'This Year' }
	];

	let showDefaultCategoryToast = false;

	async function handleCategoryDelete(categoryId: string) {
		try {
			await categories.deleteCategory(categoryId);
		} catch (error) {
			showDefaultCategoryToast = true;
			setTimeout(() => (showDefaultCategoryToast = false), 3000);
		}
	}

	async function handleFileDelete(fileId: string) {
		if (confirm('Are you sure you want to delete this file?')) {
			await files.deleteFile(fileId);
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="flex justify-between items-center mb-8">
		<Heading tag="h1" class="text-3xl font-bold">Expensy Dashboard</Heading>
		<Select class="w-40" bind:value={selectedPeriod} items={periodOptions} />
	</div>

	<div class="grid md:grid-cols-2 gap-6 mb-8">
		<Card>
			<ChartSplitCategories {selectedPeriod} />
		</Card>
		<Card>
			<ClassicExpensesOverview />
		</Card>
	</div>

	<div class="grid md:grid-cols-2 gap-6 mt-8">
		<!-- Categories Card -->
		<Card>
			<div class="flex justify-between items-center mb-4">
				<Heading tag="h2" class="text-xl">Categories</Heading>
			</div>
			<div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
				{#each $categories.items as category}
					<div class="flex items-center justify-between p-3 rounded-lg border">
						<div class="flex items-center gap-3">
							<div
								class="w-10 h-10 rounded-full flex items-center justify-center"
								style:background-color={'#' + category.color + '33'}>
								<Icon icon={category.id_icon} class="w-5 h-5" />
							</div>
							<span class="font-medium">{category.name}</span>
						</div>
						<Button
							size="xs"
							color="red"
							class="!p-2"
							on:click={() => handleCategoryDelete(category.id_category)}>
							<Icon icon="bi:trash" class="w-4 h-4" />
						</Button>
					</div>
				{/each}
			</div>
		</Card>

		<!-- Files Card -->
		<Card>
			<div class="flex justify-between items-center mb-4">
				<Heading tag="h2" class="text-xl">Files</Heading>
			</div>
			<div class="divide-y">
				{#each $files.items as file}
					<div class="flex items-center justify-between py-3">
						<span class="truncate">{file.filename}</span>
						<Button size="xs" color="red" class="!p-2" on:click={() => handleFileDelete(file.id!)}>
							<Icon icon="bi:trash" class="w-4 h-4" />
						</Button>
					</div>
				{/each}
			</div>
		</Card>
	</div>
</div>

{#if showDefaultCategoryToast}
	<Toast class="fixed bottom-4 right-4" color="red">
		<span class="font-medium">Error!</span>
		Cannot delete default category.
	</Toast>
{/if}
