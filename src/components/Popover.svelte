<script lang="ts" context="module">
export let popoverOpen: HTMLDivElement | undefined;
</script>

<script lang="ts">
  type Action = {
    name: string;
    action?: () => void;
  };
  /** The coordinates of the top left corner of the popover */
  export let coordinates: { x: number; y: number };
  export let actions: Action[];

  if (popoverOpen) {
    popoverOpen.remove();
    popoverOpen = null;
  }

  let clickOutsideHandler = (e) => {
    let inside = (e.target as HTMLElement)?.closest(".popover");
    if (!inside && popoverOpen) {
      popoverOpen.remove();
      popoverOpen = null;
      document.removeEventListener("click", clickOutsideHandler)
    }
  };
  document.addEventListener("click", clickOutsideHandler);
  
</script>

<div
  class="popover"
  bind:this={popoverOpen}
  style={`--x: ${coordinates.x}px; --y: ${coordinates.y}px`}
>
  {#each actions as action}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="popover-item"
      on:click={(e) => {
        e.stopImmediatePropagation();
        action.action();
        popoverOpen.remove();
        popoverOpen = null;
      }}
    >
      {action.name}
    </div>
  {/each}
</div>

<style>
  .popover {
    animation: popover-show 0.2s var(--ease);
    border-radius: var(--radius);
    position: fixed;
    left: var(--x);
    top: var(--y);
    padding: 4px;
    box-shadow: var(--shadow);
    border: var(--border);
    background: var(--background-l1);
    min-width: 10rem;
    max-width: 30rem;
    z-index: 2;
  }
  .popover-item {
    padding: 4px 10px;
    text-align: left;
  }
  .popover-item:hover {
    background: var(--background-l2);
    cursor: pointer;
    border-radius: var(--radius);
  }
  .popover-item:active {
    background: var(--background-l3);
  }
</style>
