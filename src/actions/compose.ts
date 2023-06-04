/* eslint-disable @typescript-eslint/no-invalid-void-type */

type Action<N extends HTMLElement = HTMLElement, P = never> = (node: N, params?: P) => {
  update?: (args: any) => void
  destroy?: () => void
} | void

type ActionDescriptor<N extends HTMLElement = HTMLElement, P = never> = Action<N> | [Action<N, P>, P]

type Params<N extends HTMLElement = HTMLElement> = ActionDescriptor<N, any>[]

export type ActionList<N extends HTMLElement = HTMLElement> = Params<N>

export default function compose<N extends HTMLElement = HTMLElement>(node: N, params: Params<N>) {
  const ret: ReturnType<Action>[] = []

  params.forEach(descriptor => {
    if (Array.isArray(descriptor)) {
      ret.push(descriptor[0](node, descriptor[1]))
    }
    else {
      ret.push(descriptor(node))
    }
  })

  return {
    update(newParams: Params) {
      newParams.forEach((descriptor, idx) => {
        const curr = ret[idx]

        if (Array.isArray(descriptor)) {
          curr?.update?.(descriptor[1])
        }
      })
    },
    destroy() {
      ret.forEach(t => t?.destroy?.())
    },
  }
}
