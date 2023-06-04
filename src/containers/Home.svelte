<script lang="ts">
  import Logo from '../components/Logo.svelte'
  import identities from '../data/identities'
</script>

<main class="fvcl h-max w-max">
  <div class="logo clipped mb-2">
    <div class="anim duration-500 ease-out">
      <Logo />
    </div>
  </div>
  <div class="clipped mb-1/2">
    <h1 class="name anim duration-500 delay-100 ease-out text-xl uppercase">Andrew Wei</h1>
  </div>
  <div class="clipped">
    <div class="description anim duration-500 delay-200 ease-out text-xs">Engineer / Designer / Illustrator</div>
  </div>
  <ul class="fhcl mt-5 wrap">
    {#each identities as identity, idx}
      <li class="clipped">
        {#if identity.type === 'divider'}
          <div class="divider anim ease-out duration-200 m-1/2 after:cc" style:animation-delay={`${300 + idx * 20}ms`} />
        {:else}
          <a
            class="link m-1/2 ts-opacity hover:a-70"
            class:inactive={identity.isActive === false}
            href={identity.url}
            target="_blank"
            type="button"
          >
            <span class="anim duration-200 ease-out fvcc w-max h-max after:cc after:w-max" style:animation-delay={`${300 + idx * 20}ms`}>
              <img class="h-max w-max text-xs" src={identity.icon} alt={identity.name} />
            </span>
          </a>
        {/if}
      </li>
    {/each}
  </ul>
</main>

<style lang="postcss">
  @keyframes slide-up {
    0% {
      opacity: 0;
      transform: translate3d(0, 100%, 0);
    }

    100% {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes slide-right {
    0% {
      opacity: 0;
      transform: translate3d(0, 100%, 0);
    }

    100% {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  main {
    --link-radius: 1rem;
    --tint-color: #fff;

    background: #1a1a1a;
    color: #fff;
    padding: 10%;
  }

  .logo {
    width: 6.6rem;

    & > * {
      animation-name: slide-right;
    }
  }

  .name {
    animation-name: slide-up;
    letter-spacing: 0.2rem;
  }

  .description {
    animation-name: slide-up;
    color: #666;
  }

  .divider {
    animation-name: slide-up;
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

    & span {
      animation-name: slide-up;
    }

    &.inactive {
      pointer-events: none;

      & span::after {
        background: #fff;
        height: 0.1rem;
      }

      & img {
        opacity: 0.3;
      }
    }
  }
</style>
