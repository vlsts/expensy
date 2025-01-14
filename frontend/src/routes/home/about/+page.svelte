<script lang="ts">
	import { Card, Heading } from 'flowbite-svelte';
	import { GithubSolid, LinkedinSolid, EnvelopeSolid } from 'flowbite-svelte-icons';
</script>

<!-- About Section -->
<section class="bg-white dark:bg-gray-900">
	<div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
		<div class="max-w-screen-lg mx-auto text-center mb-8 lg:mb-16">
			<Heading tag="h1" class="mb-4 text-4xl font-extrabold">About Expensy</Heading>
			<p class="text-gray-500 dark:text-gray-400 text-lg">
				Expensy is a modern expense tracking application designed to help individuals and small
				teams manage their finances effectively. With real-time tracking, intuitive categorization,
				and powerful analytics, we make expense management simple and efficient.
			</p>
		</div>
	</div>
</section>

<!-- Team Section -->
<section class="bg-gray-50 dark:bg-gray-800">
	<div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
		<!-- TODO: replace with real contact details -->
		<Heading tag="h2" class="mb-8 text-3xl font-bold text-center">Meet the Team</Heading>
		<div class="grid gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
			<Card>
				<div class="flex flex-col items-center">
					<img
						class="w-24 h-24 mb-3 rounded-full shadow-lg"
						src="https://avatars.githubusercontent.com/u/26856087?v=4"
						alt="Maker 1" />
					<h3 class="mb-1 text-xl font-medium">Vlad-Stefan Sas</h3>
					<span class="text-sm text-gray-500 dark:text-gray-400">
						DevOps / Cybersecurity Passionate
					</span>
					<p class="mt-3 flex justify-center space-x-4">
						<a
							href="https://github.com/username"
							class="text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
							target="_blank"
							rel="noopener">
							<GithubSolid class="w-6 h-6" />
						</a>
						<a
							href="https://linkedin.com/in/username"
							class="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 transition-colors"
							target="_blank"
							rel="noopener">
							<LinkedinSolid class="w-6 h-6" />
						</a>
						<a
							href="mailto:email@example.com"
							class="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 transition-colors">
							<EnvelopeSolid class="w-6 h-6" />
						</a>
					</p>
				</div>
			</Card>

			<Card>
				<div class="flex flex-col items-center">
					<img
						class="w-24 h-24 mb-3 rounded-full shadow-lg"
						src="https://avatars.githubusercontent.com/u/128151908?v=4"
						alt="Maker 2" />
					<h3 class="mb-1 text-xl font-medium">David-Ioan Stoica</h3>
					<span class="text-sm text-gray-500 dark:text-gray-400">Junior Developer</span>
					<p class="mt-3 flex justify-center space-x-4">
						<a
							href="https://github.com/username"
							class="text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
							target="_blank"
							rel="noopener">
							<GithubSolid class="w-6 h-6" />
						</a>
						<a
							href="https://linkedin.com/in/username"
							class="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 transition-colors"
							target="_blank"
							rel="noopener">
							<LinkedinSolid class="w-6 h-6" />
						</a>
						<a
							href="mailto:email@example.com"
							class="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 transition-colors">
							<EnvelopeSolid class="w-6 h-6" />
						</a>
					</p>
				</div>
			</Card>
		</div>
	</div>
</section>

<!-- Tech Stack Section -->
<section class="bg-white dark:bg-gray-900">
	<div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
		<Heading tag="h2" class="mb-8 text-3xl font-bold text-center">Our Tech Stack</Heading>
		<div class="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 max-w-6xl mx-auto">
			<Card class="text-center hover:shadow-lg transition-shadow">
				<img
					src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Svelte_Logo.svg"
					alt="Svelte"
					class="w-16 h-16 mx-auto mb-4" />
				<h3 class="text-lg font-semibold">Svelte</h3>
				<p class="text-sm text-gray-500">Frontend Framework</p>
			</Card>

			<Card class="text-center hover:shadow-lg transition-shadow">
				<img
					src="https://docs.nestjs.com/assets/logo-small.svg"
					alt="NestJS"
					class="w-16 h-16 mx-auto mb-4" />
				<h3 class="text-lg font-semibold">NestJS</h3>
				<p class="text-sm text-gray-500">Backend Framework</p>
			</Card>

			<Card class="text-center hover:shadow-lg transition-shadow">
				<img
					src="https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg"
					alt="MongoDB"
					class="w-16 h-16 mx-auto mb-4" />
				<h3 class="text-lg font-semibold">MongoDB</h3>
				<p class="text-sm text-gray-500">Database</p>
			</Card>

			<Card class="text-center hover:shadow-lg transition-shadow">
				<img
					src="https://www.docker.com/wp-content/uploads/2022/03/vertical-logo-monochromatic.png"
					alt="Docker"
					class="w-16 h-16 mx-auto mb-4 object-contain" />
				<h3 class="text-lg font-semibold">Docker</h3>
				<p class="text-sm text-gray-500">Containerization</p>
			</Card>

			<Card class="text-center hover:shadow-lg transition-shadow">
				<img src="https://bun.sh/logo.svg" alt="Bun" class="w-16 h-16 mx-auto mb-4" />
				<h3 class="text-lg font-semibold">Bun</h3>
				<p class="text-sm text-gray-500">JavaScript Runtime</p>
			</Card>

			<Card class="text-center hover:shadow-lg transition-shadow">
				<img
					src="https://corbado.com/logos/corbado-sm.svg"
					alt="Corbado"
					class="w-16 h-16 mx-auto mb-4" />
				<h3 class="text-lg font-semibold">Corbado</h3>
				<p class="text-sm text-gray-500">Passkey Authentication</p>
			</Card>

			<Card class="text-center hover:shadow-lg transition-shadow">
				<img
					src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
					alt="GitHub"
					class="w-16 h-16 mx-auto mb-4" />
				<h3 class="text-lg font-semibold">GitHub</h3>
				<p class="text-sm text-gray-500">CI/CD & Container Registry</p>
			</Card>

			<Card class="text-center hover:shadow-lg transition-shadow">
				<img
					src="https://upload.wikimedia.org/wikipedia/commons/f/ff/DigitalOcean_logo.svg"
					alt="DigitalOcean"
					class="w-16 h-16 mx-auto mb-4" />
				<h3 class="text-lg font-semibold">DigitalOcean</h3>
				<p class="text-sm text-gray-500">Cloud Hosting</p>
			</Card>
		</div>
	</div>
</section>
