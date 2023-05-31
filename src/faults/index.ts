import SuperError from '@andrewscwei/super-error'

function fault(code: string, message?: string, cause?: unknown): SuperError {
  const error = new SuperError(message ?? code, code, undefined, SuperError.deserialize(cause))

  return error
}

export const ERR_UNKNOWN = fault('ERR_UNKNOWN')
