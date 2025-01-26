<script lang="ts">
	import { Button, Modal, Label, Input } from 'flowbite-svelte';
	import { categories } from '$lib/stores/categories';
	import Icon from '@iconify/svelte';

	let { open = $bindable() } = $props();

	let formData = $state({
		name: '',
		id_icon: '',
		color: '#ffffff'
	});

	let errors = $state({
		name: '',
		id_icon: ''
	});

	async function handleSubmit() {
		errors = { name: '', id_icon: '' };

		if (!formData.name) errors.name = 'Name is required';
		if (!formData.id_icon) errors.id_icon = 'Icon is required';

		if (Object.values(errors).some((error) => error)) return;
		if (!formData.color) formData.color = 'ffffff';
		if (formData.color[0] === '#') formData.color = formData.color.slice(1);

		try {
			await categories.createCategory(formData);
			await categories.fetchCategories();
			open = false;
		} catch (error) {
			console.error('Failed to create category:', error);
		}
	}
</script>

<Modal title="Add Category" bind:open autoclose={false} outsideclose>
	<form class="grid grid-cols-2 gap-6" onsubmit={handleSubmit}>
		<!-- Left Column - Form Fields -->
		<div class="space-y-6">
			<div>
				<Label for="name">Name</Label>
				<Input id="name" placeholder="Category name" required bind:value={formData.name} />
			</div>

			<div>
				<Label for="icon">Icon</Label>
				<Input
					id="icon"
					placeholder="Icon name from Iconify"
					required
					bind:value={formData.id_icon} />
				<p class="mt-2 text-sm text-gray-500">
					Visit <a
						href="https://icon-sets.iconify.design"
						target="_blank"
						class="text-blue-600 hover:underline">
						Iconify
					</a>
					to choose an icon
				</p>
			</div>

			<div>
				<Label for="color">Color</Label>
				<div class="flex gap-2">
					<Input id="color" type="color" class="w-16 h-10" bind:value={formData.color} />
					<Input
						type="text"
						maxlength={7}
						placeholder="#ffffff"
						class="flex-1"
						bind:value={formData.color} />
				</div>
			</div>
		</div>

		<!-- Right Column - Preview -->
		<div
			class="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
			<p class="mb-4 text-sm text-gray-500">Preview</p>
			<div
				class="w-20 h-20 rounded-full flex items-center justify-center mb-4"
				style:background-color={(formData.color.startsWith('#') ? '' : '#') +
					formData.color +
					'33'}>
				{#if formData.id_icon}
					<Icon icon={formData.id_icon} class="w-12 h-12" />
				{:else}
					<div class="text-gray-400">No icon selected</div>
				{/if}
			</div>
			<p class="text-center font-medium">
				{formData.name || 'Category Name'}
			</p>
		</div>

		<div class="col-span-2 flex justify-end space-x-4">
			<Button color="alternative" on:click={() => (open = false)}>Cancel</Button>
			<Button type="submit" color="blue">Create Category</Button>
		</div>
	</form>
</Modal>
