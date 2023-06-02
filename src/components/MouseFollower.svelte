<script context="module" lang="ts">
  export let mouseFollowerOpen: HTMLDivElement;
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { destroyMouseFollower } from "./MouseFollower";
  import { mouseState } from "../events/store";
  import type { Coordinate } from "../types/position";

  if (mouseFollowerOpen) destroyMouseFollower();

  const onMouseMove = (coords: Coordinate) => {
    if (!mouseFollowerOpen || !document.contains(mouseFollowerOpen) || !coords)
      return;
    const rect = mouseFollowerOpen.getBoundingClientRect();
    const x =
      coords.x + 14 + rect.width > window.innerWidth
        ? coords.x - rect.width
        : coords.x + 14;
    const y =
      coords.y + 14 + rect.height > window.innerHeight
        ? coords.y - rect.height
        : coords.y + 14;

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
