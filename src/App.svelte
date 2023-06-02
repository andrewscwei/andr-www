<script lang="ts">
  import appConf from './app.conf'
  import AltFaviconDark from './assets/meta/favicon-dark.png'
  import FaviconDark from './assets/meta/favicon-dark.svg'
  import AltFaviconLight from './assets/meta/favicon-light.png'
  import FaviconLight from './assets/meta/favicon-light.svg'
  import OGImage from './assets/meta/og-image.png'
  import PinnedIcon from './assets/meta/pinned-icon.svg'
  import TwitterCard from './assets/meta/twitter-card.png'
  import Home from './containers/Home.svelte'
  import colorScheme, { DARK_MODE } from './stores/colorScheme'

  const { title: pageTitle, description: pageDescription, url: pageURL } = appConf

  $: isDarkMode = $colorScheme === DARK_MODE
</script>

<svelte:head>
  <link rel='canonical' href={pageURL}/>
  <link rel='mask-icon' type='image/svg+xml' href={PinnedIcon} color={isDarkMode ? '#fff' : '#000'}/>
  <link rel='alternate icon' type='image/png' href={isDarkMode ? AltFaviconDark : AltFaviconLight}/>
  <link rel='icon' href={isDarkMode ? FaviconDark : FaviconLight}/>
  <title>{pageTitle}</title>
  <meta name='description' content={pageDescription}/>

  <meta property="og:type" content="website" />
  <meta property='og:site_name' content={pageTitle}/>
  <meta property='og:title' content={pageTitle}/>
  <meta property='og:description' content={pageDescription}/>
  <meta property='og:url' content={pageURL}/>
  <meta property='og:image' content={pageURL + OGImage}/>
  <meta property='og:image:alt' content={pageDescription}/>

  <meta name="twitter:card" content="summary_large_image" />
  <meta name='twitter:title' content={pageTitle}/>
  <meta name='twitter:description' content={pageDescription}/>
  <meta name='twitter:image' content={pageURL + TwitterCard}/>

  <meta name='apple-mobile-web-app-title' content={pageTitle}/>
</svelte:head>

<div class="h-max w-max">
  <Home/>
</div>
