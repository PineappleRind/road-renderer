<script lang="ts" context="module">
export let mouseFollowerOpen: HTMLDivElement;
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { destroyMouseFollower } from "./MouseFollower";
  import { mouseState } from "../events/store";
  import type { Coordinate } from "../types/position";

  const MARGIN = 14;

  if (mouseFollowerOpen) destroyMouseFollower();

  const onMouseMove = (coords: Coordinate) => {
    if (!mouseFollowerOpen || !document.contains(mouseFollowerOpen) || !coords)
      return;
    const rect = mouseFollowerOpen.getBoundingClientRect();
    const x =
      coords.x + MARGIN + rect.width > window.innerWidth
        ? coords.x - rect.width
        : coords.x + MARGIN;
    const y =
      coords.y + MARGIN + rect.height > window.innerHeight
        ? coords.y - rect.height
        : coords.y + MARGIN;

    mouseFollowerOpen.style.setProperty("--x", `${x}px`);
    mouseFollowerOpen.style.setProperty("--y", `${y}px`);
  };
  onMount(() => {
    mouseState.subscribe(onMouseMove);
  });
</script>

<div class="mouse-follower" bind:this={mouseFollowerOpen}>
  <slot />
</div>

<style>
  .mouse-follower {
    position: fixed;
    left: var(--x);
    top: var(--y);
  }
</style>
