import Events from './Events'

/**
 * Singleton global class(object) for interfacing with the running shell
 * Acts as a public bridge to the react component since state may not
 * be guarenteed there
 */
class ShellI {
    pingBack(payload) {
        Events.dispatch('shelli.cmd', {
            type: 'ECHOPING',
            payload
        })
    }
}

const _inst = new ShellI()
export default _inst