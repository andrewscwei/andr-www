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
    <g transform="matrix(3.65714,0,0,3.65714,-256.055,0)">
      <path
        id="Bottom_Right_Shadow-2"
        d="M135.36,52.46L105,70L105,34.92L135.36,52.46Z"
        style="fill:rgb(236,236,236);fill-rule:nonzero;"
      />
      <path
        id="Bottom_Right-2"
        d="M129.8,55.67L105,70L105,34.92L129.8,55.67Z"
        style="fill:rgb(240,240,240);fill-rule:nonzero;"
      />
      <path
        id="Mid_Right-2"
        d="M105,35L135.39,52.53L135.39,17.46L105,35Z"
        style="fill:#fff;fill-rule:nonzero;"
      />
      <path
        id="Top_Right_Shadow-2"
        d="M135.35,17.54L105,35.08L105,0L135.35,17.54Z"
        style="fill:rgb(238,238,238);fill-rule:nonzero;"
      />
      <path
        id="Top_Right-2"
        d="M129.8,20.75L105,35.08L105,0L129.8,20.75Z"
        style="fill:rgb(240,240,240);fill-rule:nonzero;"
      />
      <path
        id="Bottom_Left_Shadow-2"
        d="M74.64,52.46L105,70L105,34.92L74.64,52.46Z"
        style="fill:rgb(240,240,240);fill-rule:nonzero;"
      />
      <path
        id="Bottom_Left-2"
        d="M80.18,55.66L105,70L105,34.92L80.18,55.66Z"
        style="fill:rgb(249,249,249);fill-rule:nonzero;"
      />
      <path
        id="Mid_Left-2"
        d="M105,35L74.64,52.54L74.64,17.47L105,35Z"
        style="fill:#fff;fill-rule:nonzero;"
      />
      <path
        id="Top_Left_Shadow-2"
        d="M74.65,17.54L105,35.08L105,0L74.65,17.54Z"
        style="fill:rgb(238,238,238);fill-rule:nonzero;"
      />
      <path
        id="Top_Left-2"
        d="M80.18,20.69L105,35.08L105,0L80.18,20.69Z"
        style="fill:rgb(241,241,241);fill-rule:nonzero;"
      />
    </g>
  </svg>
</SVG>
