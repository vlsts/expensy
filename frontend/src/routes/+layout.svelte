<script lang="ts">
	import { goto } from '$app/navigation';
	import Corbado from '@corbado/web-js/';
	import { onMount } from 'svelte';
	import '../app.css';
	let { children } = $props();
	import { PUBLIC_CORBADO_PROJECT_ID, PUBLIC_CORBADO_SUPPORT_MAIL } from '$env/static/public';
	import {
		Navbar,
		NavBrand,
		NavHamburger,
		NavUl,
		NavLi,
		Dropdown,
		DropdownItem,
		Avatar,
		Button
	} from 'flowbite-svelte';
	import { isCorbadoLoaded, isLoggedIn } from '$lib/stores/corbado';
	import { page } from '$app/state';
	let isMarketingPage = $derived(
		page.url.pathname === '/' || page.url.pathname.startsWith('/home')
	);

	const handleLogout = async () => {
		await Corbado.logout();
		$isLoggedIn = false;
		goto('/');
	};

	onMount(async () => {
		await Corbado.load({
			projectId: PUBLIC_CORBADO_PROJECT_ID,
			customerSupportEmail: PUBLIC_CORBADO_SUPPORT_MAIL,
			darkMode: 'auto',
			isDevMode: true
		});
		$isCorbadoLoaded = true;
		$isLoggedIn = Corbado.isAuthenticated || false;
	});
</script>

{#if $isCorbadoLoaded}
	<Navbar let:hidden let:toggle>
		<NavBrand href="/">
			<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
				Expensy
			</span>
		</NavBrand>

		<NavHamburger on:click={toggle} />

		<div class="flex items-center ml-auto">
			{#if isMarketingPage}
				<!-- Marketing pages navigation -->
				<NavUl {hidden} class="me-4">
					<NavLi href="/">Home</NavLi>
					<NavLi href="/home/pricing">Pricing</NavLi>
					<NavLi href="/home/about">About</NavLi>
				</NavUl>
				<Button href="/app/account">Go to App</Button>
			{:else}
				<!-- App pages navigation -->
				{#if $isLoggedIn}
					<NavUl {hidden} class="me-4">
						<NavLi href="/app/dashboard">Dashboard</NavLi>
						<NavLi href="/app/expenses">Expenses</NavLi>
					</NavUl>
					<div class="flex items-center">
						<Avatar id="avatar-menu" src="" />
						<Dropdown triggeredBy="#avatar-menu">
							<DropdownItem href="/app/passkey-settings">Passkey Settings</DropdownItem>
							<DropdownItem on:click={handleLogout}>Sign out</DropdownItem>
						</Dropdown>
					</div>
				{:else}
					<Button href="/app/account">Login</Button>
				{/if}
			{/if}
		</div>
	</Navbar>
	<div class="mt-2">
		{@render children()}
	</div>
{/if}
