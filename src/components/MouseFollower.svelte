<script context="module" lang="ts">
  export let mouseFollowerOpen: HTMLDivElement;
</script>

<script lang="ts">
  import { onMount } from "svelte";

  if (mouseFollowerOpen) {
    mouseFollowerOpen.remove();
    mouseFollowerOpen = null;
  }
  const onMouseMove = (e: MouseEvent) => {
    if (!mouseFollowerOpen || !e) return;
    const rect = mouseFollowerOpen.getBoundingClientRect();
    const x =
      e.clientX + 14 + rect.width > window.innerWidth
        ? e.clientX - rect.width
        : e.clientX + 14;
    const y =
      e.clientY + 14 + rect.height > window.innerHeight
        ? e.clientY - rect.height
        : e.clientY + 14;

    mouseFollowerOpen.style.setProperty("--x", `${x}px`);
    mouseFollowerOpen.style.setProperty("--y", `${y}px`);
  };
  document.removeEventListener("onmousemove", onMouseMove);
  onMount(() => {
    document.addEventListener("mousemove", (e) => onMouseMove(e));
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
