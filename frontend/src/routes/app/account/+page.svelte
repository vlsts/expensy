<script lang="ts">
	import Corbado from '@corbado/web-js';
	import { onMount } from 'svelte';
	import { isLoggedIn } from '$lib/stores/corbado';
	import { Card, Heading } from 'flowbite-svelte';

	let authElement: HTMLDivElement;
	let passkeyManagementElement: HTMLDivElement;

	onMount(async () => {
		Corbado.mountAuthUI(authElement, {
			onLoggedIn: () => {
				$isLoggedIn = true;
			}
		});
		Corbado.mountPasskeyListUI(passkeyManagementElement);
	});
</script>

<div class="container mx-auto px-4 py-8">
	<div class="grid md:grid-cols-2 gap-12 items-start">
		<!-- Info Column -->
		<div class="space-y-6 w-full">
			<Heading tag="h1" class="text-3xl font-bold mb-6">
				{$isLoggedIn ? 'Manage Your Account Security' : 'Get Started with Expensy'}
			</Heading>

			{#if $isLoggedIn}
				<Card class="p-6 w-full">
					<div class="space-y-6">
						<div>
							<h3 class="text-xl font-semibold mb-3">Manage Your Passkeys</h3>
							<p class="text-gray-600 dark:text-gray-400 leading-relaxed">
								Add additional passkeys to your account for enhanced security and convenience. Each
								passkey provides a secure way to access your account without passwords. You can add
								multiple passkeys across different devices for seamless access.
							</p>
						</div>
						<div>
							<h4 class="text-lg font-semibold mb-2">Managing Your Passkeys</h4>
							<p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
								Use the panel on the right to:
							</p>
							<ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
								<li>View all your registered passkeys</li>
								<li>Add new passkeys for other devices</li>
								<li>Remove passkeys you no longer use</li>
							</ul>
						</div>
					</div>
				</Card>

				<Card class="p-6 w-full">
					<h3 class="text-xl font-semibold mb-4">Supported Platforms</h3>
					<div class="grid grid-cols-2 gap-6">
						<div class="space-y-4">
							<div class="flex items-center space-x-3">
								<span class="text-gray-600 dark:text-gray-400">iOS/MacOS</span>
							</div>
							<div class="flex items-center space-x-3">
								<span class="text-gray-600 dark:text-gray-400">Android</span>
							</div>
						</div>
						<div class="space-y-4">
							<div class="flex items-center space-x-3">
								<span class="text-gray-600 dark:text-gray-400">Windows</span>
							</div>
							<div class="flex items-center space-x-3">
								<span class="text-gray-600 dark:text-gray-400">Security Keys</span>
							</div>
						</div>
					</div>
				</Card>
			{:else}
				<Card class="p-6 w-full">
					<div class="space-y-6">
						<div>
							<h3 class="text-xl font-semibold mb-3">Create Your Account</h3>
							<p class="text-gray-600 dark:text-gray-400 leading-relaxed">
								Experience password-free authentication with our modern passkey system. Sign up
								quickly and securely using your email or GitHub account.
							</p>
						</div>
						<div>
							<h4 class="text-lg font-semibold mb-2">Why Passkeys?</h4>
							<ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
								<li>More secure than traditional passwords</li>
								<li>No need to remember complex passwords</li>
								<li>Quick and easy login across all your devices</li>
								<li>Protected against phishing attacks</li>
							</ul>
						</div>
					</div>
				</Card>
			{/if}
		</div>

		<!-- Interactive Panel Column -->
		<div>
			<div bind:this={authElement} class="w-full {$isLoggedIn ? 'hidden' : ''}"></div>
			<div bind:this={passkeyManagementElement} class="w-full {!$isLoggedIn ? 'hidden' : ''}"></div>
		</div>
	</div>
</div>
