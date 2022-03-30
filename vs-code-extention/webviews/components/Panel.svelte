<script lang="ts">
  import { onMount } from "svelte";
  import Cards from "./cards.svelte";
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
          console.log(info[0].message);
          loading = false;
      }
    });
    tsvscode.postMessage({ type: "dashboard", value: " " });
  });
</script>

<!-- <div>Hello</div> -->

{#if loading}
  <div>Loading...</div>
{:else if info.length > 0}
  <Cards {info} />
{:else}
  <div>No user logged in</div>
{/if}

<!-- category: "bug"
channelid: "C037UCKAVL0"
message: "payment options is not loading"
message_link: "https://vschatworkspace.slack.com/archives/C037UCKAVL0/p1648676460797859"
priority: "High"
teamid: "T0377063THA"
title: "Payment Options Not Loading"
ts: "1648676460.797859"
userid: "U037UCK98F2" -->
