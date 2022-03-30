<script lang="ts">
  import { profile } from "console";
  import { onMount } from "svelte";
  import WorkspaceIcons from "./workspaceIcons.svelte";

  let accessToken = "";
  let loading = true;
  let user = "";
  let workspaces: { name: any; id: any; icon: any }[] = [];

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
          user = data.userInfo;
          data.workspaces.forEach((workspace: any) => {
            workspaces.push({
              name: workspace.teaminfo.name,
              id: workspace.teaminfo.id,
              icon: workspace.teaminfo.icon["image_102"],
            });
          });

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
  <WorkspaceIcons {workspaces} />
  <button on:click={async () => {}}>Add to slack</button>
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
