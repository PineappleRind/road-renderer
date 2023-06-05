<script lang="ts">
  import Canvas from "./components/Canvas.svelte";
  import DebugRoads from "./components/Debug.svelte";
  import Sidebar from "./components/Sidebar.svelte";
</script>

<main>
  <Canvas />
  <div class="display: flex;flex-direction:column">
    <Sidebar />
  </div>
</main>

<style>
</style>
