<script lang="ts">
  import { onMount } from "svelte";
  let accessToken = "";
  let loading = true;
  let user = "";

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data;
      switch (message.type) {
        case "token":
          accessToken = message.value;
          const response = await fetch(`${apiBaseUrl}/me`, {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await response.json();
          console.log(data);
          user = data.user;
          loading = false;
      }
    });
    tsvscode.postMessage({ type: "get-token", value: undefined });
  });
</script>

{#if loading}
  <div>Loading...</div>
{:else if user}
  <pre>{JSON.stringify(user, null, 2)}</pre>
{:else}
  <div>No user logged in</div>
{/if}
<!-- svelte-ignore missing-declaration -->
<button
  on:click={() => {
    tsvscode.postMessage({
      type: "onInfo",
      value: "info",
    });
  }}
  >info
</button>
