<script lang="ts">
  import { match } from "assert";
  import { hasContext } from "svelte";

  export let type: string;
  export let info: {
    category: any;
    channelid: any;
    message: any;
    message_link: any;
    priority: any;
    teamid: any;
    title: any;
    ts: any;
    userid: any;
    avatar: any;
    name: any;
  }[];
  export let summary = "";
  export let map = new Map();
  let jsonSummary: JSON;
  let keys, values, entries: [string, any][];

  if (summary.length > 0) {
    jsonSummary = JSON.parse(summary);
    keys = Object.keys(jsonSummary); // ["foo", "batz"]
    values = Object.values(jsonSummary); // ["bar", "boink"]
    entries = Object.entries(jsonSummary); // [["foo", "bar"], ["batz", "boink"]]
  }
  let expandedInfo = 0;
  let color = "";
</script>

{#if type != "summary"}
  {#each info as w}
    {#if type == "feature" && w.category == type}
      <div
        class="icon"
        style="background-color:{color}"
        on:click={() => {
          expandedInfo = w.ts;
        }}
      >
        <div class="feature"><div>📝{w.title}</div></div>

        {#if expandedInfo === w.ts}
          <div class="expanded">
            <div>Posted by: {w.name}</div>
            <!-- <div>Channel: {w.channelid}</div> -->
            <div>{w.message}</div>
            <a href={w.message_link}>Go there!</a>
          </div>
        {/if}
        <div class="logo">
          <button
            class="button del"
            on:click={() => {
              info = info.filter((i) => i != w);
              // console.log(info, "hello");
            }}>Complete</button
          >
          <img src={w.avatar} alt="oops" />
        </div>
      </div>
    {:else if type == "bug" && w.category == type}
      <div
        class="icon"
        style="background-color:{color}"
        on:click={() => {
          expandedInfo = w.ts;
        }}
      >
        {#if w.priority == "Low"}
          <div class="low"><div>🐛{w.title}</div></div>
        {:else if w.priority == "Medium"}
          <div class="med">
            <div>🐛{w.title}</div>
          </div>
        {:else if w.priority == "High"}
          <div class="high">
            <div>🐛{w.title}</div>
          </div>
        {:else if w.priority == "Urgent"}
          <div class="urgent"><div>🐛{w.title}</div></div>
        {:else if w.category == type}
          <div>🐛{w.title}</div>
        {/if}

        {#if expandedInfo === w.ts}
          <div class="expanded">
            <div>Posted by: {w.name}</div>
            <!-- <div>Channel: {w.channelid}</div> -->
            <div>{w.message}</div>
            <a href={w.message_link}>Go to there!</a>
          </div>
        {/if}
        <div class="logo">
          <button
            class="button del"
            on:click={() => {
              info = info.filter((i) => i != w);
              // console.log(info, "hello");
            }}>Complete</button
          >
          <img src={w.avatar} alt="oops" />
        </div>
      </div>
    {:else if type == "all"}
      <div
        class="icon"
        style="background-color:{color}"
        on:click={() => {
          expandedInfo = w.ts;
        }}
      >
        {#if w.priority == "Low" && w.category == "bug"}
          <div class="low"><div>🐛{w.title}</div></div>
        {:else if w.priority == "Medium" && w.category == "bug"}
          <div class="med">
            <div>🐛{w.title}</div>
          </div>
        {:else if w.priority == "High" && w.category == "bug"}
          <div class="high">
            <div>🐛{w.title}</div>
          </div>
        {:else if w.priority == "Urgent" && w.category == "bug"}
          <div class="urgent"><div>🐛{w.title}</div></div>
        {:else if w.category == "bug"}
          <div>🐛{w.title}</div>
        {:else}
          <div class="feature">📝{w.title}</div>
        {/if}

        {#if expandedInfo === w.ts}
          <div class="expanded">
            <div>Posted by: {w.name}</div>
            <!-- <div>Channel: {w.channelid}</div> -->
            <div>{w.message}</div>
            <a href={w.message_link}>Go to there!</a>
          </div>
        {/if}
        <div class="logo">
          <button
            class="button del"
            on:click={() => {
              info = info.filter((i) => i != w);
              // console.log(info, "hello");
            }}>Complete</button
          >
          <img src={w.avatar} alt="oops" />
        </div>
      </div>
    {/if}
  {/each}
{:else if (type = "summary")}
  {#each entries as [key, value]}
    <div class="summary" style="background-color:{color}">
      <div class="feature">📝{key}</div>
      <ol>
        <!-- {console.log(value, map.has(value),"Hello")} -->
        {#if value.length > 0}
          {#each value as v}
            <!-- {console.log(map.get(v.match(/\(([^)]+)\)/)))} -->
            <li>
              <a href={map.get(v).message_link}>{map.get(v).message}</a>
            </li>
          {/each}
        
        {:else if map.has(key)}
          <li>
            <a href={map.get(key).message_link}>{map.get(key).message}</a>
          </li>
        {/if}
      </ol>
    </div>
  {/each}
{/if}

<style>
  a {
    color: inherit;
    text-decoration: none;
  }
  .del {
    /* margin-top: -5px;
     */
    padding: 0;
    margin-right: 20px;
    z-index: 10;
  }
  .logo {
    padding: 10px;

    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .feature {
    min-height: 20px;
    border-bottom: 3px dashed #6050e3ff;
    margin-bottom: 10px;
    padding: 10px;
  }
  .low {
    min-height: 20px;
    border-bottom: 3px dashed rgb(151, 196, 47);
    margin-bottom: 10px;
    padding: 10px;
  }
  .med {
    min-height: 20px;
    border-bottom: 3px dashed rgb(252, 255, 47);
    margin-bottom: 10px;
    padding: 10px;
  }
  .high {
    min-height: 20px;
    border-bottom: 3px dashed rgb(255, 153, 0);
    margin-bottom: 10px;
    padding: 10px;
  }
  .urgent {
    min-height: 20px;
    border-bottom: 3px dashed rgb(255, 83, 71);
    margin-bottom: 10px;
    padding: 10px;
  }
  img {
    width: 25px;
    height: 25px;
  }
  .expanded {
    padding: 5px;
    /* margin-top: 5px;
    margin-bottom: 5px; */
  }
  .icon {
    background-color: rgb(36, 36, 36);

    font-size: 14px;
    box-shadow: 0 0 10px rgb(0, 0, 0);

    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .icon div:last-child {
    margin-left: auto;
  }
  .icon:hover {
    background-color: rgb(52, 42, 126);
    transition: 0.2s ease-out;
    color: white;
  }
  .summary {
    background-color: rgb(36, 36, 36);

    font-size: 14px;
    box-shadow: 0 0 10px rgb(0, 0, 0);
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .summary:hover {
    background-color: rgb(52, 42, 126);
    transition: 0.2s ease-out;
    color: white;
  }
</style>
