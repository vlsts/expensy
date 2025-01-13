<script lang="ts">
    import { goto } from "$app/navigation";
    import Corbado from "@corbado/web-js/";
    import { onMount } from "svelte";
    let { children } = $props();

	onMount(async () => {
        await Corbado.load({
            projectId: "pro-9274187161272909532",
            darkMode: "off",
        });
		if (!Corbado.user) {
			goto('/login')
		}
	});
</script>

{@render children()}
