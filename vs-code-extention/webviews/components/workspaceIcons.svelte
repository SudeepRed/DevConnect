<script lang="ts">
  export let workspaces: { name: any; id: any; icon: any }[];
  export let repo: { name: any }[];
  export let owner:string;
</script>

<div class="sb_content">
  {#each workspaces as w (w.id)}
    <div class="icon">
      <!-- svelte-ignore missing-declaration -->
      <button
        class="image button"
        on:click={() => {
          tsvscode.postMessage({
            type: "dashboard",
            value: w.id,
          });
        }}
      >
        <img src={w.icon} alt={"icon"} />
      </button>
      {w.name}
    </div>
  {/each}
  {#each repo as r}
    <div class="icon">
      <!-- svelte-ignore missing-declaration -->
      <button class="image button" on:click={() => {
        tsvscode.postMessage({
          type: "dashboard",
          value: "$"+owner+"$"+r.name,
        });
      }}>
        <img
          src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
          alt={"icon"}
        />
      </button>
      {r.name}
    </div>
  {/each}
</div>

<style>
  .sb_content {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  .icon {
    width: 70px;
    height: 70px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .image {
    background: none;
    padding: 5px;
    margin-bottom: 2px;
    width: 50px;
    height: 50px;
  }
  img:hover {
    box-shadow: 0px 0px 10px rgb(124, 124, 124);
  }
  img {
    border-radius: 50%;
  }
</style>
