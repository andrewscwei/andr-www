import queryString from 'query-string'
import { readable } from 'svelte/store'
import type QueryParams from '../vos/QueryParams'

function init() {
  const rawParams = queryString.parse(location.search)
  const params: QueryParams = {
    accessCode: (typeof rawParams['access'] !== 'string' || rawParams['access'].length === 0) ? undefined : rawParams['access'],
  }

  const { subscribe } = readable<QueryParams>(params)

  return {
    subscribe,
  }
}

export default init()
