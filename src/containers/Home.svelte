<script lang="ts">
  import Logo from '../components/Logo.svelte'
  import contacts from '../data/contacts'
  import projects from '../data/projects'
</script>

<main class="fvcl h-max w-max">
  <div class="logo mb-2">
    <Logo />
  </div>
  <h1 class="name uppercase mb-1/2">Andrew Wei</h1>
  <span class="description text-xs">Engineer / Designer / Illustrator</span>
  <ul class="fhcl mt-5 wrap">
    {#each contacts as contact}
      <a class="link m-1/2 ts-opacity hover:a-70" href={contact.url} target="_blank" type="button">
        {#if contact.icon && contact.icon.length > 1}
          <img class="h-max w-max" src={contact.icon} alt={contact.name} />
        {/if}
      </a>
    {/each}
    <div class="divider m-1/2 after:cc" />
    {#each projects as project}
      <a
        class="link m-1/2 ts-opacity hover:a-70 after:cc after:w-max"
        class:inactive={project.isActive === false}
        href={project.url}
        target="_blank"
        type="button"
      >
        {#if project.icon && project.icon.length > 1}
          <img class="h-max w-max" src={project.icon} alt={project.name} />
        {/if}
      </a>
    {/each}
  </ul>
</main>

<style lang="postcss">
  main {
    --link-radius: 1rem;
    --tint-color: #fff;

    background: #1a1a1a;
    color: #fff;
    padding: 10%;
  }

  .logo {
    width: 7rem;
  }

  .name {
    letter-spacing: 0.2rem;
    font-size: 3.4rem;
  }

  .description {
    color: #666;
  }

  .divider {
    height: calc(var(--link-radius) * 2);
    width: calc(var(--link-radius) * 2);

    &::after {
      background: #666;
      height: 1.4rem;
      width: 0.1rem;
    }
  }

  .link {
    height: calc(var(--link-radius) * 2);
    width: calc(var(--link-radius) * 2);

    &.inactive {
      pointer-events: none;

      & img {
        opacity: 0.3;
      }

      &:after {
        background: #fff;
        height: 0.1rem;
      }
    }
  }
</style>
