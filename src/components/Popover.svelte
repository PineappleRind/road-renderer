<script lang="ts">
  type Action = {
    name: string;
    action?: () => void;
  };
  /** The coordinates of the top left corner of the popover */
  export let coordinates: { x: number; y: number };
  export let actions: Action[];
</script>

<div class="popover" style={`--x: ${coordinates.x}px; --y: ${coordinates.y}px`}>
  {#each actions as action}
    <div class="popover-item">{action.name}</div>
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
