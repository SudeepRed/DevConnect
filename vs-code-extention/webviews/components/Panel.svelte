<script lang="ts">
  import { onMount } from "svelte";
  import SlackCards from "./slack_cards.svelte";
  import GithubCards from "./github_cards.svelte";
  import "app.css";
  let loading = true;
  let slack_info: {
    category: any;
    channelid: any;
    message: any;
    message_link: any;
    priority: any;
    teamid: any;
    title: any;
    ts: any;
    userid: any;
    priority_id: any;
    avatar: any;
    name:any;
  }[] = [];
  let github_info: {
    id: any;
    owner: any;
    message: any;
    priority: any;
    sender: any;
    sender_avatar: any;
    assigned_user: any;
    repo: any;
    ts: any;
    priority_id: any;
    category: any;
    
  }[] = [];
  let groupedData = "";
  let messages: string[] =[];
  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data;
      switch (message.type) {
        case "getInfo":
          console.log("from workkkk", message.value);
          if (message.value[0] != "$") {
            const response = await fetch(`${apiBaseUrl}/getInfo/slack`, {
              method: "POST",
              body: JSON.stringify({
                teamid: message.value,
              }),
              headers: {
                "content-type": "application/json",
                // authorization: `Bearer ${accessToken}`,
              },
            });
            console.log("HEllo");
            const res = await response.json();

            res.data.forEach((d: any) => {
              slack_info.push(d);
              messages.push(d.message);
            });
            slack_info.sort(function (a, b) {
              return b.priority_id -a.priority_id ;
            });
            const gt = await fetch(`${apiBaseUrl}/groupThings`, {
              method: "POST",
              body: JSON.stringify({
                text: messages,
              }),
              headers: {
                "content-type": "application/json",
                // authorization: `Bearer ${accessToken}`,
              },
            });
            groupedData = await gt.json()
            console.log(groupedData)
            console.log(slack_info[0].message);
            loading = false;
          } else {
            console.log("hey gh");
            const response = await fetch(`${apiBaseUrl}/getInfo/github`, {
              method: "POST",
              body: JSON.stringify({
                owner: message.value.split("$")[1],
                repo: message.value.split("$")[2],
              }),
              headers: {
                "content-type": "application/json",
                // authorization: `Bearer ${accessToken}`,
              },
            });

            const res = await response.json();

            res.data.forEach((d: any) => {
              github_info.push(d);
              messages.push(d.message)
            });
            github_info.sort(function (a, b) {
              return -(a.priority_id - b.priority_id);
            });
            const gt = await fetch(`${apiBaseUrl}/groupThings`, {
              method: "POST",
              body: JSON.stringify({
                text: messages,
              }),
              headers: {
                "content-type": "application/json",
                // authorization: `Bearer ${accessToken}`,
              },
            });
            groupedData = await gt.json()
            console.log(groupedData)
            // console.log(slack_info[0].message);
            loading = false;
          }
      }
    });
    tsvscode.postMessage({ type: "dashboard", value: " " });
  });

  let active = "all";
</script>

<!-- <div>Hello</div> -->
<div class="tabbar">
  <div style="margin-top: 1em;">
    {#each ["All", "Bugs", "Feature Requests"] as tab}
      <button
        class="tab"
        on:click={() => {
          if (tab == "Bugs") {
            active = "bug";
          } else if (tab == "Feature Requests") {
            active = "feature";
          } else {
            active = "all";
          }
        }}>{tab}</button
      >
    {/each}
  </div>
</div>
{#if loading}
  <div>Loading...</div>
{:else if slack_info.length > 0}
  {#if active == "bug"}<SlackCards info={slack_info} type={active} />
  {:else if active == "feature"}
    <SlackCards info={slack_info} type={active} />
  {:else}
    <SlackCards info={slack_info} type={active} />
  {/if}
{:else if github_info.length > 0}
  {#if active == "bug"}<GithubCards info={github_info} type={active} />
  {:else if active == "feature"}
    <GithubCards info={github_info} type={active} />
  {:else}
    <GithubCards info={github_info} type={active} />
  {/if}
{:else}
  <div>No user logged in</div>
{/if}

<style>
  .tabbar {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  }
  .tab {
    font-family: "Montserrat", sans-serif;
    background-color: #202022;
    border-style: none;
    color: white;
    height: 45px;
    border-bottom: 3px solid #202022;
    /* border-style: solid; */
  }
  .tab:hover {
    border-bottom: 3px solid #6050e3ff;
    /* border-style: solid; */
    color: #6050e3ff;
  }
</style>
