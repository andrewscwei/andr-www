<script lang="ts">
  import type { ActionList } from '../actions/compose'
  import SVG from './SVG.svelte'

  export let actions: ActionList = []
</script>

<SVG {actions}>
  <svg
    viewBox="0 0 256 256"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xml:space="preserve"
    style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
  >
    <g transform="matrix(1,0,0,1,23,0)">
      <g transform="matrix(1.66113,0,0,1.66113,-28.1395,-18.1395)">
        <circle cx="35" cy="35" r="18.06" style="fill:white;" />
      </g>
      <g transform="matrix(1.66113,0,0,1.66113,-28.1395,69.8605)">
        <circle cx="35" cy="35" r="18.06" style="fill:white;" />
      </g>
      <g transform="matrix(1.66113,0,0,1.66113,-28.1395,157.86)">
        <circle cx="35" cy="35" r="18.06" style="fill:white;" />
      </g>
      <g transform="matrix(1.66113,0,0,1.66113,121.86,-18.1395)">
        <circle cx="35" cy="35" r="18.06" style="fill:white;" />
      </g>
      <g transform="matrix(1.66113,0,0,1.66113,121.86,69.8605)">
        <circle cx="35" cy="35" r="18.06" style="fill:white;" />
      </g>
      <g transform="matrix(1.66113,0,0,1.66113,121.86,157.86)">
        <circle cx="35" cy="35" r="18.06" style="fill:white;" />
      </g>
    </g>
  </svg>
</SVG>
