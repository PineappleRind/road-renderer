<script context="module" lang="ts">
  export let mouseFollowerOpen: HTMLDivElement;
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { destroyMouseFollower } from "@/components/MouseFollower";
  import { mouseState } from "@/events/store";
  import type { Coordinate } from "@/types/position";

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
    animation: mouse-follower-in 0.2s;
    text-shadow: 0px 0px 10px var(--background-l0), 0px 0px 10px var(--background-l0);
    transition: opacity 0.2s, scale 0.2s;
  }
  :global(.mouse-follower.hidden) {
    opacity: 0;
    scale: 0.98;
  }
  @keyframes mouse-follower-in {
    from { opacity: 0; scale: 0.98 }
  }
</style>
