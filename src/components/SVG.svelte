<script lang="ts">
  import compose, { type ActionList } from '../actions/compose'

  export let actions: ActionList = []
</script>

<figure class="fvcc h-max w-max" use:compose={actions}>
  <slot />
</figure>

<style lang="postcss">
  figure {
    & > :global(svg *) {
      fill: var(--tint-color) !important;
      transition: fill 200ms ease-out;
    }
  }
</style>
