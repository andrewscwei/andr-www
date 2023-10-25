<script lang="ts">
  import { ERR_UNKNOWN } from '../faults'
  import AristotlIcon from './AristotlIcon.svelte'
  import DiceIcon from './DiceIcon.svelte'
  import EmailIcon from './EmailIcon.svelte'
  import EvenStevenIcon from './EvenStevenIcon.svelte'
  import GitHubIcon from './GitHubIcon.svelte'
  import GrubbbIcon from './GrubbbIcon.svelte'
  import MonitoringTestIcon from './MonitoringTestIcon.svelte'
  import Party8423Icon from './8423Icon.svelte'
  import PascalIcon from './PascalIcon.svelte'
  import SyblIcon from './SyblIcon.svelte'
  import TwitterIcon from './TwitterIcon.svelte'
  import VARIANTEIcon from './VARIANTEIcon.svelte'
  import VerbIcon from './VerbIcon.svelte'
  import VestigeIcon from './VestigeIcon.svelte'

  export let name: string | undefined

  function getComponentByName(componentName?: string) {
    switch (componentName) {
      case '8423': return Party8423Icon
      case 'Aristotl': return AristotlIcon
      case 'Dice': return DiceIcon
      case 'Email': return EmailIcon
      case 'Even Steven': return EvenStevenIcon
      case 'Flight Monitering Test': return MonitoringTestIcon
      case 'GitHub': return GitHubIcon
      case 'Grubbb': return GrubbbIcon
      case 'Pascal': return PascalIcon
      case 'Sybl': return SyblIcon
      case 'Twitter': return TwitterIcon
      case 'VARIANTE': return VARIANTEIcon
      case 'Verb': return VerbIcon
      case 'Vestige Story': return VestigeIcon
      default: throw ERR_UNKNOWN
    }
  }
</script>

<svelte:component this={getComponentByName(name)}/>
