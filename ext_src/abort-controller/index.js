

const { AbortSignal, abortSignal, createAbortSignal } = require('./abort-signal')

/**
 * The AbortController.
 * @see https://dom.spec.whatwg.org/#abortcontroller
 */
class AbortController {
    /**
     * Initialize this controller.
     */
    constructor() {
        signals.set(this, createAbortSignal())
    }

    /**
     * Returns the `AbortSignal` object associated with this object.
     */
    get signal() {
        return getSignal(this)
    }

    /**
     * Abort and signal to any observers that the associated activity is to be aborted.
     */
    abort() {
        abortSignal(getSignal(this))
    }
}

/**
 * Associated signals.
 */
const signals = new WeakMap()

/**
 * Get the associated signal of a given controller.
 */
function getSignal(controller) {
    const signal = signals.get(controller)
    if (signal == null) {
        throw new TypeError(
            `Expected 'this' to be an 'AbortController' object, but got ${
                controller === null ? "null" : typeof controller
            }`,
        )
    }
    return signal
}

// Properties should be enumerable.
Object.defineProperties(AbortController.prototype, {
    signal: { enumerable: true },
    abort: { enumerable: true },
})

if (typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol") {
    Object.defineProperty(AbortController.prototype, Symbol.toStringTag, {
        configurable: true,
        value: "AbortController",
    })
}

exports.AbortController = AbortController
exports.AbortSignal = AbortSignal
module.exports = AbortController
