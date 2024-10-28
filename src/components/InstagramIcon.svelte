<script lang="ts">
  import type { ActionList } from "../actions/compose";
  import SVG from "./SVG.svelte";

  export let actions: ActionList = [];
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
    <g transform="matrix(3.65714,0,0,3.65714,0,0)">
      <path
        d="M63,0L7,0C3.1,0 0,3.1 0,7L0,63C0,66.9 3.1,70 7,70L63,70C66.9,70 70,66.9 70,63L70,7C70,3.1 66.9,0 63,0ZM35,21C42.7,21 49,27.3 49,35C49,42.7 42.7,49 35,49C27.3,49 21,42.7 21,35C21,27.3 27.3,21 35,21ZM8.8,63C7.8,63 7.1,62.3 7.1,61.3L7.1,31.5L14.4,31.5C14,32.6 14,34 14,35C14,46.6 23.5,56 35,56C46.5,56 56,46.5 56,35C56,34 56,32.6 55.6,31.5L63,31.5L63,61.3C63,62.3 62.3,63 61.3,63L8.8,63ZM63,15.8C63,16.8 62.3,17.5 61.3,17.5L54.3,17.5C53.3,17.5 52.6,16.8 52.6,15.8L52.6,8.8C52.6,7.8 53.3,7.1 54.3,7.1L61.3,7.1C62.3,7.1 63,7.8 63,8.8L63,15.8Z"
        style="fill:#fff;fill-rule:nonzero;"
      />
    </g>
  </svg>
</SVG>
