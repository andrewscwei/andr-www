import debug from 'debug'

const NAMESPACE = 'app'

export default function useDebug(subnamespace = '') {
  if (process.env.NODE_ENV === 'development') {
    if (window.localStorage.debug !== `${NAMESPACE}*`) window.localStorage.debug = `${NAMESPACE}*`

    const namespace = [NAMESPACE, ...subnamespace.split(':').filter(Boolean)].join(':')
    if (typeof window === 'undefined') debug.enable(namespace)

    return debug(namespace)
  }
  else {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {}
  }
}
