<script lang="ts">
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
  }[];
</script>

{#each info as w}
  <div class="icon">
    {w.message}
  </div>
  <div>{w.priority}</div>
{/each}

<style>
  .icon {
    width: 70px;
    height: 70px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  
</style>
