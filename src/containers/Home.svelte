<script lang="ts">
  import Logo from '../components/Logo.svelte'
  import contacts from '../data/contacts'
  import projects from '../data/projects'
</script>

<main class="fvcl h-max w-max">
  <div class="logo mb-2">
    <Logo />
  </div>
  <h1 class="name text-2xl uppercase mb-1/2">Andrew Wei</h1>
  <span class="description text-s">Engineer / Designer / Illustrator</span>
  <ul class="fhcl mt-5 wrap">
    {#each contacts as contact}
      <a class="link m-1/2 ts-opacity hover:a-70" href={contact.url} target="_blank">
        {#if contact.icon && contact.icon.length > 1}
          <img class="h-max w-max" src={contact.icon} alt={contact.name} />
        {/if}
      </a>
    {/each}
    <div class="divider mh-1 mv-1/2"/>
    {#each projects as project}
      <a class="link m-1/2 ts-opacity hover:a-70" class:inactive={project.isActive === false} href={project.url} target="_blank">
        {#if project.icon && project.icon.length > 1}
          <img class="h-max w-max" src={project.icon} alt={project.name} />
        {/if}
      </a>
    {/each}
  </ul>
</main>

<style lang="postcss">
  main {
    background: #1a1a1a;
    color: #fff;
    padding: 5%;
  }

  .logo {
    --tint-color: #fff;
    width: 7rem;
  }

  .name {
    letter-spacing: 0.2rem;
  }

  .description {
    color: #666;
  }

  .divider {
    width: .1rem;
    height: 1.4rem;
    background: #666;
  }

  .link {
    height: 2rem;
    width: 2rem;
    position: relative;

    &.inactive {
      pointer-events: none;

      & img {
        opacity: 0.3;
      }

      &:after {
        background: #fff;
        bottom: 0;
        content: '';
        height: 0.1rem;
        left: 0;
        margin: auto;
        position: absolute;
        right: 0;
        top: 0;
        width: 100%;
        z-index: 10;
      }
    }
  }
</style>
