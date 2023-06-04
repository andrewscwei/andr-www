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
    <g transform="matrix(3.66237,0,0,3.66237,-0.366237,-0.549356)">
      <path
        d="M70,13.3C67.4,14.4 64.7,15.2 61.8,15.6C64.8,13.8 67,11 68.1,7.7C65.3,9.3 62.3,10.5 59,11.2C56.4,8.4 52.6,6.7 48.5,6.7C40.6,6.7 34.1,13.1 34.1,21.1C34.1,22.2 34.2,23.3 34.5,24.4C22.5,23.6 12,17.9 4.9,9.2C3.7,11.3 3,13.8 3,16.4C3,21.4 5.5,25.8 9.4,28.4C7,28.3 4.8,27.7 2.9,26.6L2.9,26.8C2.9,33.8 7.9,39.6 14.4,40.9C13.2,41.2 11.9,41.4 10.6,41.4C9.7,41.4 8.8,41.3 7.9,41.1C9.7,46.8 15,51 21.3,51.1C16.4,55 10.2,57.2 3.5,57.2C2.3,57.2 1.2,57.1 0.1,57C6.5,61.1 14,63.5 22.1,63.5C48.5,63.5 63,41.6 63,22.6L63,20.7C65.6,18.7 68.1,16.2 70,13.3Z"
        style="fill:white;fill-rule:nonzero;"
      />
    </g>
  </svg>
</SVG>
