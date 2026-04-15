const listeners = new Map()

function on(event, callback) {
  if (!listeners.has(event)) {
    listeners.set(event, new Set())
  }
  listeners.get(event).add(callback)
}

function off(event, callback) {
  if (!listeners.has(event)) return
  listeners.get(event).delete(callback)
}

function emit(event, payload) {
  if (!listeners.has(event)) return
  for (const callback of listeners.get(event)) {
    try {
      callback(payload)
    } catch (error) {
      console.error(`eventBus error for event ${event}:`, error)
    }
  }
}

export default { on, off, emit }
