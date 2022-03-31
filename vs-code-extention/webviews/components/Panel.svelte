<script lang="ts">
  import { onMount } from "svelte";
  import Cards from "./cards.svelte";

  import "app.css";
  let loading = true;
  let info: {
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
  }[] = [];
  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data;
      switch (message.type) {
        case "getInfo":
          console.log("from workkkk", message.value);
          const response = await fetch(`${apiBaseUrl}/getInfo`, {
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
            info.push(d);
          });
          info.sort(function (a, b) {
            return a.priority_id - b.priority_id;
          });
          console.log(info[0].message);
          loading = false;
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
{:else if info.length > 0}
  {#if active == "bug"}<Cards {info} type={active} />
  {:else if active == "feature"}
    <Cards {info} type={active} />
  {:else}
    <Cards {info} type={active} />
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
