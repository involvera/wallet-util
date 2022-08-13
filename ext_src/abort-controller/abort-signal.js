import {
    // Event,
    EventTarget,
    // Type,
    defineEventAttribute,
} from "../event-target-shim"

/**
 * The signal class.
 * @see https://dom.spec.whatwg.org/#abortsignal
 */
class AbortSignal extends EventTarget {
    /**
     * AbortSignal cannot be constructed directly.
     */
    constructor() {
        super()
        throw new TypeError("AbortSignal cannot be constructed directly")
    }

    /**
     * Returns `true` if this `AbortSignal`'s `AbortController` has signaled to abort, and `false` otherwise.
     */
    get aborted() {
        const aborted = abortedFlags.get(this)
        if (typeof aborted !== "boolean") {
            throw new TypeError(
                `Expected 'this' to be an 'AbortSignal' object, but got ${
                    this === null ? "null" : typeof this
                }`,
            )
        }
        return aborted
    }
}
defineEventAttribute(AbortSignal.prototype, "abort")

/**
 * Create an AbortSignal object.
 */
export function createAbortSignal() {
    const signal = Object.create(AbortSignal.prototype)
    EventTarget.call(signal)
    abortedFlags.set(signal, false)
    return signal
}

/**
 * Abort a given signal.
 */
export function abortSignal(signal) {
    if (abortedFlags.get(signal) !== false) {
        return
    }

    abortedFlags.set(signal, true)
    signal.dispatchEvent<"abort">({ type: "abort" })
}

/**
 * Aborted flag for each instances.
 */
const abortedFlags = new WeakMap()

// Properties should be enumerable.
Object.defineProperties(AbortSignal.prototype, {
    aborted: { enumerable: true },
})

// `toString()` should return `"[object AbortSignal]"`
if (typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol") {
    Object.defineProperty(AbortSignal.prototype, Symbol.toStringTag, {
        configurable: true,
        value: "AbortSignal",
    })
}

exports.AbortSignal = AbortSignal