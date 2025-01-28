<script lang="ts">
	import { Button, Modal, Label, Input, Textarea, Select, Datepicker } from 'flowbite-svelte';
	import { currencies } from '$lib/stores/currencies';
	import { categories } from '$lib/stores/categories';
	import { files } from '$lib/stores/files';
	import { expenses } from '$lib/stores/expenses';
	import { onMount } from 'svelte';
	import { type File as FileApi } from '$lib/types/api.types';

	let { open = $bindable() } = $props();

	let formData = $state({
		name: '',
		amount: 0,
		id_currency: '',
		description: '',
		id_files: [] as string[],
		id_category: '',
		date: new Date()
	});

	let errors = $state({
		name: '',
		amount: '',
		id_currency: '',
		id_category: ''
	});

	async function handleSubmit() {
		// Reset errors
		errors = {
			name: '',
			amount: '',
			id_currency: '',
			id_category: ''
		};

		// Validate
		if (!formData.name) errors.name = 'Name is required';
		if (!formData.amount || formData.amount <= 0) errors.amount = 'Valid amount is required';
		if (!formData.id_currency) errors.id_currency = 'Currency is required';
		if (!formData.id_category) errors.id_category = 'Category is required';
		
		console.log(errors)
		if (Object.values(errors).some((error) => error)) return;

		try {
			await expenses.createExpense(formData);
			await expenses.fetchExpenses();
			open = false;
		} catch (error) {
			console.error('Failed to create expense:', error);
		}
	}

	onMount(() => {
		console.log($files.items);
	});
</script>

<Modal title="Add Expense" bind:open autoclose={false} outsideclose>
	<form class="space-y-6" onsubmit={handleSubmit}>
		<div>
			<Label for="name">Name</Label>
			<Input id="name" placeholder="Expense name" required bind:value={formData.name} />
		</div>

		<div>
			<Label for="amount">Amount</Label>
			<Input id="amount" type="number" step="0.01" min="0" required bind:value={formData.amount} />
		</div>

		<div>
			<Label for="currency">Currency</Label>
			<Select
				id="currency"
				required
				bind:value={formData.id_currency}
				items={$currencies.items.map((c) => ({
					value: c.shortname,
					name: c.shortname
				}))} />
		</div>

		<div>
			<Label for="description">Description</Label>
			<Textarea
				id="description"
				placeholder="Optional description"
				bind:value={formData.description} />
		</div>

		<div>
			<Label for="category">Category</Label>
			<Select
				id="category"
				required
				bind:value={formData.id_category}
				items={$categories.items.map((c) => ({
					value: c._id,
					name: c.name
				}))} />
		</div>

		<div>
			<Label for="files">Attached Files</Label>
			<Select
				id="files"
				multiple
				bind:value={formData.id_files}
				items={$files.items.map((f: FileApi) => ({
					value: f._id,
					name: f.filename
				}))} />
		</div>

		<div>
			<Label for="date">Date</Label>
			<Datepicker required bind:value={formData.date} />
		</div>

		<div class="flex justify-end space-x-4">
			<Button color="alternative" on:click={() => (open = false)}>Cancel</Button>
			<Button type="submit" color="blue">Create Expense</Button>
		</div>
	</form>
</Modal>
