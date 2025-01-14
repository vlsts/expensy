<script lang="ts">
	import { Button, Card, Heading } from 'flowbite-svelte';
	import { CheckOutline } from 'flowbite-svelte-icons';
</script>

<section class="bg-white dark:bg-gray-900">
	<div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
		<div class="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
			<Heading tag="h1" class="mb-4 text-4xl tracking-tight font-extrabold">
				Simple, Transparent Pricing
			</Heading>
			<p class="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
				Choose the perfect plan for your expense tracking needs
			</p>
		</div>
		<div class="space-y-8 lg:grid lg:grid-cols-2 sm:gap-6 xl:gap-10 lg:space-y-0 max-w-4xl mx-auto">
			<!-- Starter Tier -->
			<Card padding="xl">
				<h3 class="mb-4 text-2xl font-semibold">Free</h3>
				<div class="flex justify-center items-baseline my-8">
					<span class="mr-2 text-5xl font-extrabold">$0</span>
					<span class="text-gray-500 dark:text-gray-400">/forever</span>
				</div>
				<ul class="mb-8 space-y-4 text-left">
					<li class="flex items-center space-x-3">
						<CheckOutline class="flex-shrink-0 w-5 h-5 text-green-500" />
						<span>Up to 50 monthly transactions</span>
					</li>
					<li class="flex items-center space-x-3">
						<CheckOutline class="flex-shrink-0 w-5 h-5 text-green-500" />
						<span>Basic expense categories</span>
					</li>
					<li class="flex items-center space-x-3">
						<CheckOutline class="flex-shrink-0 w-5 h-5 text-green-500" />
						<span>Monthly summary reports</span>
					</li>
				</ul>
				<Button class="w-full" color="purple" href="/app/dashboard">Get Started</Button>
			</Card>

			<!-- Professional Tier -->
			<Card padding="xl" class="bg-primary-50 dark:bg-gray-800 relative">
				<div class="absolute -top-4 left-0 right-0 flex justify-center">
					<span class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
						RECOMMENDED
					</span>
				</div>
				<h3 class="mb-4 text-2xl font-semibold">Pro</h3>
				<div class="flex justify-center items-baseline my-8">
					<span class="mr-2 text-5xl font-extrabold">$5</span>
					<span class="text-gray-500 dark:text-gray-400">/month</span>
				</div>
				<ul class="mb-8 space-y-4 text-left">
					<li class="flex items-center space-x-3">
						<CheckOutline class="flex-shrink-0 w-5 h-5 text-green-500" />
						<span>Unlimited transactions</span>
					</li>
					<li class="flex items-center space-x-3">
						<CheckOutline class="flex-shrink-0 w-5 h-5 text-green-500" />
						<span>Custom categories & tags</span>
					</li>
					<li class="flex items-center space-x-3">
						<CheckOutline class="flex-shrink-0 w-5 h-5 text-green-500" />
						<span>Advanced analytics & reports</span>
					</li>
					<li class="flex items-center space-x-3">
						<CheckOutline class="flex-shrink-0 w-5 h-5 text-green-500" />
						<span>Budget planning tools</span>
					</li>
					<li class="flex items-center space-x-3">
						<CheckOutline class="flex-shrink-0 w-5 h-5 text-green-500" />
						<span>Priority support</span>
					</li>
				</ul>
				<Button class="w-full" color="purple" href="/app/dashboard">Get Started</Button>
			</Card>
		</div>
	</div>
</section>
