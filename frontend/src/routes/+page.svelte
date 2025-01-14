<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from 'flowbite-svelte';
	import { Card, Heading } from 'flowbite-svelte';

	onMount(async () => {});
</script>

<!-- Hero Section -->
<section class="bg-white dark:bg-gray-900">
	<div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
		<div class="mr-auto place-self-center lg:col-span-7">
			<Heading
				tag="h1"
				class="max-w-2xl mb-4 text-4xl font-extrabold leading-none md:text-5xl xl:text-6xl">
				Smart Expense Management Made Simple
			</Heading>
			<p
				class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
				Track expenses, manage budgets, and gain financial insights with our intuitive expense
				manager.
			</p>
			<Button size="xl" color="purple" href="/app">Get Started</Button>
		</div>
	</div>
</section>

<!-- Features Section -->
<section class="bg-gray-50 dark:bg-gray-800">
	<div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
		<div class="mb-8 lg:mb-16">
			<Heading tag="h2" class="mb-4 text-4xl tracking-tight font-extrabold text-center">
				Features that make expense tracking easier
			</Heading>
		</div>
		<div class="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
			<Card>
				<Heading tag="h3" class="mb-2 text-xl font-bold">Real-time Tracking</Heading>
				<p class="text-gray-500 dark:text-gray-400">
					Monitor your expenses in real-time with automatic receipt categorization.
				</p>
			</Card>
			<Card>
				<Heading tag="h3" class="mb-2 text-xl font-bold">Smart Budgeting</Heading>
				<p class="text-gray-500 dark:text-gray-400">
					Set and manage budgets in multiple currencies.
				</p>
			</Card>
			<Card>
				<Heading tag="h3" class="mb-2 text-xl font-bold">Detailed Reports</Heading>
				<p class="text-gray-500 dark:text-gray-400">
					Get insights with detailed analytics and customizable reports.
				</p>
			</Card>
		</div>
	</div>
</section>
