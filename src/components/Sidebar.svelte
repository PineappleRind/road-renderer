<script lang="ts">
  import { currentSelection } from "@/events/interactables";
  import Debug from "@/components/Debug.svelte";
  import road from "@/road";

  let id;
  currentSelection.subscribe((newID: string) => {
    if (!newID) id = "";
    if (newID) id = newID;
  });

  let tabActive = "inspector";
  let tabs = ["inspector", "debug"];
</script>

<aside>
  <div class="tabPicker">
    {#each tabs as tab}
      <div
        class="tabTrigger"
        on:click={() => (tabActive = tab)}
        class:active={tabActive === tab}
      >
        {tab}
      </div>
    {/each}
  </div>
  <div class="tab" class:tabActive={tabActive === "inspector"}>
    {#if id}
      <p>{id}</p>
      <button on:click={() => road.delete(id)}>Delete road</button>
    {/if}
  </div>
  <div class="tab" class:tabActive={tabActive === "debug"}><Debug /></div>
</aside>

<style>
  aside {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    height: fit-content;
    margin-top: 10px;
    margin-bottom: 10px;
    max-height: calc(100dvh - 20px);
    border-top-right-radius: var(--radius);
    border-bottom-right-radius: var(--radius);
    background: var(--background-l1);
    border: var(--border);
    display: flex;
    flex-direction: column;
  }

  .tab {
    position: relative;
    top: 0;
    display: none;
    padding: 15px;
    max-height: 100vh;
    overflow-y: auto;
  }
  .tab.tabActive {
    display: block;
  }

  .tabPicker {
    display: flex;
    border-bottom: var(--border);
  }

  .tabTrigger {
    min-width: 100px;
    width: 100%;
    padding: 4px 10px;
    transition: 0.2s var(--ease);
    cursor: pointer;
    scale: 0.97;
    text-align: center;
    position: relative;
    color: var(--foreground-l2);
  }
  .tabTrigger.active {
    cursor: default;
    scale: 1;
    color: var(--foreground-l1);
  }
  .tabTrigger::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 2px;
    background: var(--background-accent);
    transition: 0.2s var(--ease);
    opacity: 0;
    scale: 0.3 1;
  }
  .tabTrigger.active::after {
    scale: 1 1;
    opacity: 1;
  }

  .tabTrigger:last-child {
    border-top-right-radius: var(--radius);
  }
</style>
