<script lang="ts">
	import { Modal, Button, Label, Spinner, Dropzone } from 'flowbite-svelte';
	import { files } from '$lib/stores/files';

	let { open = $bindable() } = $props();
	let selectedFile: FileList | undefined = $state(undefined);
	let doOCR = $state(false);
	let uploading = $state(false);
	let error = $state<string | null>(null);

	async function handleSubmit() {
		if (!selectedFile) return;
		if (selectedFile.length === 0) {
			error = 'Please select a file to upload';
			return;
		}

		const file = selectedFile.item(0)!;

		try {
			uploading = true;
			error = null;
			await files.uploadFile(file, {
				filename: file.name,
				mime_type: file.type,
				doOCR
			});
			await files.fetchFiles();

			open = false;
			selectedFile = undefined;
			doOCR = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Upload failed';
		} finally {
			uploading = false;
		}
	}
</script>

<Modal bind:open size="md" autoclose={false}>
	<div class="flex justify-between items-center mb-4">
		<h3 class="text-xl font-medium text-gray-900">Upload File</h3>
	</div>

	<Dropzone id="dropzone" bind:files={selectedFile} max={1} class="mb-4" />

	{#if error}
		<p class="text-red-500 text-sm mb-4">{error}</p>
	{/if}

	<Label class="flex items-center space-x-2">
		<input
			type="checkbox"
			bind:checked={doOCR}
			class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
		<div class="text-sm">
			<span class="font-medium">Enable automatic expense scanning (Alpha)</span>
			<p class="text-gray-500 text-xs">
				This feature will attempt to extract expense information from your document
			</p>
		</div>
	</Label>

	<svelte:fragment slot="footer">
		<Button color="alternative" on:click={() => (open = false)}>Cancel</Button>
		<Button color="blue" disabled={!selectedFile || uploading} on:click={handleSubmit}>
			{#if uploading}
				<Spinner size="sm" class="mr-2" />
				Uploading...
			{:else}
				Upload
			{/if}
		</Button>
	</svelte:fragment>
</Modal>
