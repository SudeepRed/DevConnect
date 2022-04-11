<script lang="ts">
  import { onMount } from "svelte";
  import WorkspaceIcons from "./workspaceIcons.svelte";

  let accessToken = "";
  let loading = true;
  let user: any;
  let workspaces: { name: any; id: any; icon: any }[] = [];
  let repo: { name: any }[] = [];
  let owner = "";
  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data;
      switch (message.type) {
        case "token":
          accessToken = message.value;
          const responseSlack = await fetch(`${apiBaseUrl}/slack-workspace`, {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          });
          const responseGithub = await fetch(`${apiBaseUrl}/github-repo`, {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          });
          const slack_workspaces = await responseSlack.json();
          const git_repo = await responseGithub.json();
          user = null;
          workspaces = [];
          repo = [];
          owner = "";
          console.log(git_repo);
          console.log(slack_workspaces);
          user = slack_workspaces.userInfo;

          owner = user.username;
          console.log(owner);
          slack_workspaces.workspaces.forEach((workspace: any) => {
            workspaces.push({
              name: workspace.teaminfo.name,
              id: workspace.teaminfo.id,
              icon: workspace.teaminfo.icon["image_102"],
            });
          });
          git_repo.repo.forEach((r: any) => {
            repo.push({
              name: r.repo,
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
  <WorkspaceIcons {workspaces} {repo} {owner} />
  <div>&nbsp;</div>
  <button
    class="button"
    on:click={() => {
      accessToken = "";
      user = null;
      tsvscode.postMessage({ type: "logout", value: undefined });
    }}>logout</button
  >
  <button class="button">
    <a href={`${SLACK_URL}/slack/install`}>Add to slack </a></button
  >
  <button class="button">
    <a href={`${GITHUB_URL}`}>Add to github repo </a></button
  >
{:else}
  <div>No user logged in</div>
  <button
    class="button"
    on:click={() => {
      tsvscode.postMessage({ type: "authenticate", value: undefined });
    }}>login with GitHub</button
  >
{/if}

<!-- svelte-ignore missing-declaration -->
<style>
  h2 {
    font-weight: normal;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
</style>
