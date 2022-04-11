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

  <div class="button-container">
    <center class="button-sd">
      <button
        style="align-items:center;color:#000;background-color:#6050e3ff;border:none;border-radius:44px;display:inline-flex;font-family:'Montserrat', sans-serif;font-size:14px;color:white;height:34px;justify-content:center;text-decoration:none;width:204px"
        on:click={() => {
          accessToken = "";
          user = null;
          tsvscode.postMessage({ type: "logout", value: undefined });
        }}
      >
        Logout</button
      >
    </center>

    <center class="button-sd">
      <a
        href={`${GITHUB_URL}`}
        style="align-items:center;color:#000;background-color:#6050e3ff;border:none;border-radius:44px;display:inline-flex;font-family:'Montserrat', sans-serif;font-size:14px;color:white;height:34px;justify-content:center;text-decoration:none;width:204px"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          ><path
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          /></svg
        >&nbsp; Add to GitHub</a
      ></center
    >
    <center class="button-sd">
      <a
        href={`${SLACK_URL}/slack/install`}
        style="align-items:center;color:#000;background-color:#6050e3ff;border:none;border-radius:44px;display:inline-flex;font-family:'Montserrat', sans-serif;font-size:14px;color:white;height:34px;justify-content:center;text-decoration:none;width:204px"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          style="height:16px;width:16px;margin-right:12px"
          viewBox="0 0 122.8 122.8"
          ><path
            d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
            fill="#e01e5a"
          /><path
            d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
            fill="#36c5f0"
          /><path
            d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
            fill="#2eb67d"
          /><path
            d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
            fill="#ecb22e"
          /></svg
        >Add to Slack</a
      ></center
    >
  </div>
{:else}
  <center>
    <div>&nbsp;</div>
    <div>&nbsp;</div>
    <div>You are not logged in!</div>
    <div>&nbsp;</div>
    <div>&nbsp;</div>
    <button
      class="button-sd"
      style="align-items:center;color:#000;background-color:#6050e3ff;border:none;border-radius:44px;display:inline-flex;font-family:'Montserrat', sans-serif;font-size:14px;color:white;height:34px;justify-content:center;text-decoration:none;width:204px"
      on:click={() => {
        tsvscode.postMessage({ type: "authenticate", value: undefined });
      }}>Login with GitHub</button
    >
  </center>
{/if}

<!-- svelte-ignore missing-declaration -->
<style>
  .button-sd {
    width: 100%;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .button-container {
    height: 70vh;
    /* border: 1px solid red; */
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    /* cursor: pointer; */
  }
  h2 {
    font-weight: normal;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
</style>
