<script lang="ts">
	import { Button, Card, Heading, Toast } from 'flowbite-svelte';
	import { files } from '$lib/stores/files';
	import { categories } from '$lib/stores/categories';
	import Icon from '@iconify/svelte';
	import ChartSplitCategories from './chartSplitCategories.svelte';
	import ClassicExpensesOverview from './classicExpensesOverview.svelte';

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
	<div class="mb-8">
		<Heading tag="h1" class="text-3xl font-bold">Expensy Dashboard</Heading>
	</div>

	<div class="grid md:grid-cols-2 gap-6 mb-8">
		<Card>
			<ChartSplitCategories />
		</Card>
		<Card>
			<ClassicExpensesOverview />
		</Card>
	</div>

	<div class="grid md:grid-cols-2 gap-8 mt-8 px-6">
		<!-- Categories Card -->
		<Card>
			<div class="flex justify-between items-center mb-4 sticky top-0 bg-white z-10">
				<Heading tag="h2" class="text-xl">Categories</Heading>
			</div>
			<div
				class="grid grid-cols-2 sm:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto pr-2
						scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
				{#each $categories.items as category}
					<div
						class="flex flex-col items-center p-4 rounded-lg border hover:shadow-md transition-shadow">
						<div
							class="w-12 h-12 rounded-full flex items-center justify-center mb-2"
							style:background-color={'#' + category.color + '33'}>
							<Icon icon={category.id_icon} class="w-6 h-6" />
						</div>
						<span class="font-medium text-center min-h-[2.5rem] flex items-center text-sm">
							{category.name}
						</span>
						<Button
							size="xs"
							color="red"
							class="!p-1 mt-2"
							on:click={() => handleCategoryDelete(category.id_category)}>
							<Icon icon="bi:trash" class="w-3 h-3" />
						</Button>
					</div>
				{/each}
			</div>
		</Card>

		<!-- Files Card -->
		<Card>
			<div class="flex justify-between items-center mb-4 sticky top-0 bg-white z-10">
				<Heading tag="h2" class="text-xl">Files</Heading>
			</div>
			<div
				class="divide-y max-h-[500px] overflow-y-auto pr-2
						scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
				{#each $files.items as file}
					<div class="flex items-center justify-between py-4 px-2">
						<span class="truncate flex-1 mr-4">{file.filename}</span>
						<Button size="xs" color="red" class="!p-1" on:click={() => handleFileDelete(file.id!)}>
							<Icon icon="bi:trash" class="w-3 h-3" />
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
		Cannot delete the category. (If the category is default, you cannot delete it)
	</Toast>
{/if}
