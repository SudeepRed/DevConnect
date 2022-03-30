<script lang="ts">
  export let workspaces: { name: any; id: any; icon: any }[];
</script>

{#each workspaces as w (w.id)}
  <div class="icon">
    <button class="image" on:click={()=>{
        
    }}>
      <img src={w.icon} alt={"icon"} />
    </button>
    {w.name}
  </div>
{/each}

<!-- <pre>{JSON.stringify(workspaces)}</pre> -->
<style>
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
  img:hover{
    box-shadow: 0px 0px 10px rgb(124, 124, 124);
      
  }
  img {
    border-radius: 50%;
  }
</style>
