const subscriptions = {}
const EventTypes = {
  SetupComplete: 'SetupComplete'
}

const getIdGenerator = () => {
  let lastId = 0

  return function getNextUniqueId() {
    lastId += 1
    return lastId
  }
}

const idGenerator = getIdGenerator()

const subscribe = (eventType, callback) => {
  const id = idGenerator()

  if (!subscriptions[eventType])
    subscriptions[eventType] = {}

  subscriptions[eventType][id] = callback

  return {
    unsubscribe: () => {
      delete subscriptions[eventType][id]
      if (Object.keys(subscriptions[eventType]).length === 0) delete subscriptions[eventType]
    }
  }
}

const publish = (eventType, arg) => {
  if (!subscriptions[eventType])
    return

  Object.keys(subscriptions[eventType]).forEach(key => subscriptions[eventType][key](arg))
}

module.exports = { publish, subscribe, EventTypes }