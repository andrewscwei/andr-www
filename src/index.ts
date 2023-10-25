import '@andrewscwei/id'
import App from './App.svelte'
import { ERR_UNKNOWN } from './faults'
import './index.css'
import rethrow from './utils/rethrow'

const target = document.getElementById('root') ?? rethrow(ERR_UNKNOWN)
const app = new App({ target })

export default app
