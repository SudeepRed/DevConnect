<script lang="ts">
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
  let expandedInfo = 0;
  let color = "";

</script>

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
          <a href={w.message_link}>Go to there!</a>
        </div>
      {/if}
      <div class="logo">
        <img
          src={w.avatar}
          alt="oops"
        />
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
        <img
          src={w.avatar}
          alt="oops"
        />
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
        <button class="button del" on:click={()=>{}}>Delete</button>
        <img
          src={w.avatar}
          alt="oops"
        />
        
      </div>
    </div>
  {/if}
{/each}

<style>
    .del{
    /* margin-top: -5px;
     */
     padding: 0;
     margin-right:20px ;
     z-index: 10;
  }
  .logo{
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
</style>
