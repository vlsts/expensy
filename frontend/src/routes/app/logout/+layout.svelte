<script lang="ts">
	import Corbado from '@corbado/web-js';
	import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
 
	onMount(async () => {
        await Corbado.load({
            projectId: "pro-9274187161272909532",
            darkMode: "off",
        });

        Corbado.logout();

        goto('/');
	});
</script>
