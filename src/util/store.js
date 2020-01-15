export default function(type = 'localStorage') {

  const ac = window[type]

  return {
    set(key, value) {
      try {
        // if (Object.prototype.toString.call(value))
        if (typeof value === 'object') {
          value = JSON.stringify(value)
        }
        // console.log('store', key, value)
        ac.setItem(key, value)
      } catch (err) { console.log(err) }
    },
    get(key) {
      try {
        return JSON.parse(ac.getItem(key))
      } catch (err) {
        return ac.getItem(key)
      }
    },
    remove(key) {
      try {
        ac.removeItem(key)
      } catch (err) { console.log(err) }
    },
    clear() {
      try {
        ac.clear()
      } catch (err) { console.log(err) }
    },
    has(key) {
      // return Store(type).get(key) !== undefined
    }
  }
}