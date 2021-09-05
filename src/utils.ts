const isProduction: boolean = process.env.NODE_ENV === 'production'
const prefix: string = 'Invariant failed'

// Throw an error if the condition fails
// Strip out error messages for production
// > Not providing an inline default argument for message as the result is smaller
export function invariant(condition: any, message?: string): asserts condition {
  if (condition) {
    return
  }
  // Condition not passed

  // In production we strip the message but still throw
  if (isProduction) {
    throw new Error(prefix)
  }

  // When not in production we allow the message to pass through
  // *This block will be removed in production builds*
  throw new Error(`${prefix}: ${message || ''}`)
}

export function warning(condition: any, message: string): void {
  // don't do anything in production
  // wrapping in production check for better dead code elimination
  if (!isProduction) {
    // condition passed: do not log
    if (condition) {
      return
    }

    // Condition not passed
    const text: string = `Warning: ${message}`

    // check console for IE9 support which provides console
    // only with open devtools
    if (typeof console !== 'undefined') {
      console.warn(text)
    }

    // Throwing an error and catching it immediately
    // to improve debugging
    // A consumer can use 'pause on caught exceptions'
    // https://github.com/facebook/react/issues/4216
    try {
      throw Error(text)
    } catch (x) {}
  }
}
