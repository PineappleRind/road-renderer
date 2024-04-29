<script lang="ts">
import { roads as roadsstore } from "@/road/store";

let roads: string;
roadsstore.subscribe((newroads) => {
	roads = JSON.stringify(newroads, null, 2);
});
</script>

<code>{roads}</code>

<style>
  code {
    white-space: pre;
    max-height: 100vh;
    overflow-y: auto;
    user-select:text;
    display: block;
  }
</style>
