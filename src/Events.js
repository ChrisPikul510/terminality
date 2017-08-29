/**
 * Global Event Dispatcher
 * Instead of the built-in DOM based event dispatcher, this serve's as a more global option for JS object-to-object communication
 */
class EventDispatcher {
    delegates = null

    // tslint:disable-next-line
	static _id = 0
	static get id() {
		EventDispatcher._id++
		return EventDispatcher._id
	}

	constructor() {
		this.delegates = new Map()

		this.dispatch = this.dispatch.bind(this)
		this.addListener = this.addListener.bind(this)
		this.removeListener = this.removeListener.bind(this)
	}

	dispatch(key, evt = null) {
		if(typeof key === 'undefined' || key === null)
			throw 'EventDispatcher::dispatch Cannot dispatch an event with no key'
        key = key.toLowerCase().trim()
        
		if(this.delegates.has(key)) {
            const delMap = this.delegates.get(key)
            
			for( const [k, cb] of delMap.entries() ) {
				cb(evt)
			}
		}
	}

	addListener(key, callback) {
		const setKey = key.toLowerCase().trim()
		const newId = EventDispatcher.id

		if(this.delegates.has(setKey)) {
			const delegates = this.delegates.get(setKey)
			delegates.set(newId, callback)
			this.delegates.set(setKey, delegates)
		} else {
			const newMap = new Map()
			newMap.set(newId, callback)
			this.delegates.set(setKey, newMap)
        }
        
		return newId
	}

	removeListener(id) {
		for(const [key, val] of this.delegates.entries()) {
			if( typeof val.has !== 'undefined' && val.has(id) ) {
				const delegates = val
				delegates.delete(id)
				this.delegates.set(key, delegates)
			}
		}
	}
}

const _inst = new EventDispatcher()

export default _inst