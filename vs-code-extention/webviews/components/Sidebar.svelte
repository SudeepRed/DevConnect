<script lang="ts">
  import { profile } from "console";
  import { onMount } from "svelte";
  import WorkspaceIcons from "./workspaceIcons.svelte";

  let accessToken = "";
  let loading = true;
  let user: any;
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
  <h2>Hey&#128075! {user["displayName"]}</h2>
  <div>&nbsp;</div>
  <WorkspaceIcons {workspaces} />
  <div>&nbsp;</div>
  <button class="button" on:click={async () => {}}>Add to slack</button>
{:else}
  <div>No user logged in</div>
{/if}
<!-- svelte-ignore missing-declaration -->
<button class="button"
  on:click={() => {
    // tsvscode.commands.executeCommand("devconnect.dashboard");
    tsvscode.postMessage({
      type: "dashboard",
      value: "hehe",
    });
  }}
  >info
</button>

<style>
  h2 {
    font-weight: normal;
  }
</style>
