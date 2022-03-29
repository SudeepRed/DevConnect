<script lang="ts">
</script>

<button
  on:click={() => {
    tsvscode.postMessage({
      type: "onInfo",
      value: "info",
    });
  }}
  >info
</button>
