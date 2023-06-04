<script lang="ts">
  import { ERR_UNKNOWN } from '../faults'
  import Party8423Icon from './8423Icon.svelte'
  import AristotlIcon from './AristotlIcon.svelte'
  import DiceIcon from './DiceIcon.svelte'
  import EmailIcon from './EmailIcon.svelte'
  import EvenStevenIcon from './EvenStevenIcon.svelte'
  import GitHubIcon from './GitHubIcon.svelte'
  import GrubbbIcon from './GrubbbIcon.svelte'
  import MonitoringTestIcon from './MonitoringTestIcon.svelte'
  import PascalIcon from './PascalIcon.svelte'
  import SyblIcon from './SyblIcon.svelte'
  import TwitterIcon from './TwitterIcon.svelte'
  import VARIANTEIcon from './VARIANTEIcon.svelte'
  import VerbIcon from './VerbIcon.svelte'

  export let name: string | undefined

  function getComponentByName(componentName?: string) {
    switch (componentName) {
      case 'Email': return EmailIcon
      case 'Twitter': return TwitterIcon
      case 'GitHub': return GitHubIcon
      case 'Pascal': return PascalIcon
      case 'VARIANTE': return VARIANTEIcon
      case 'Grubbb': return GrubbbIcon
      case 'Verb': return VerbIcon
      case 'Dice': return DiceIcon
      case 'Flight Monitering Test': return MonitoringTestIcon
      case 'Aristotl': return AristotlIcon
      case 'Sybl': return SyblIcon
      case 'Even Steven': return EvenStevenIcon
      case '8423': return Party8423Icon
      default: throw ERR_UNKNOWN
    }
  }
</script>

<svelte:component this={getComponentByName(name)}/>
