<figure class="fvcc">
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
