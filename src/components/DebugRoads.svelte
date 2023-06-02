<script lang="ts">
  import { roads } from "../road/store";

  let asa: any;
  roads.subscribe((waha) => {
    asa = JSON.stringify(waha, null, 2);
  });
</script>

<code>{asa}</code>
<style>
    code {
        position: fixed;
        top: 0;
        left: 0;
        white-space: pre;
    }
</style>