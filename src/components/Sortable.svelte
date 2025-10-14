<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Sortable from "sortablejs";

  let sortableInstance: Sortable | null = null;
  let todoULElement: HTMLUListElement;

  let { children, options = {}, ...restProps } = $props();

  onMount(() => {
    if (!todoULElement) return;

    if (!sortableInstance) {
      sortableInstance = new Sortable(todoULElement, options);
    }
  });

  onDestroy(() => {
    sortableInstance?.destroy();
  });
</script>

<ul bind:this={todoULElement} {...restProps}>
  {@render children()}
</ul>
