<script lang="ts">
    import { goto } from '$app/navigation';
    import Corbado from '@corbado/web-js';
    import {onMount} from 'svelte';
 
    let authElement: HTMLDivElement;
 
    onMount(async () => {
        await Corbado.load({
            projectId: "pro-9274187161272909532",
            darkMode: "off",

        });
        if (Corbado.user) {
            goto('/');
        }
        Corbado.mountAuthUI(
            authElement, {
                onLoggedIn: () => {
                    goto('/app');
                },
            })
    })
</script>
 
<div bind:this={authElement}></div>
