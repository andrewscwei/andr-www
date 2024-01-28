import '@andrewscwei/id'
import App from './App.svelte'
import './index.css'
import rethrow from './utils/rethrow'

const target = document.getElementById('root') ?? rethrow(Error('No element with id "root" found'))
const app = new App({ target })

export default app
