import Events from './Events'

/**
 * Singleton global class(object) for interfacing with the running shell
 * Acts as a public bridge to the react component since state may not
 * be guarenteed there.
 * 
 * In the future, I may replace this with a FIFO queue type structure
 */
class ShellI {
    pingBack(payload) {
        Events.dispatch('shelli.cmd', {
            type: 'ECHOPING',
            payload
        })
    }

    setTheme(theme) {
        Events.dispatch('shelli.cmd', {
            type: 'THEME',
            theme
        })
    }
}

const _inst = new ShellI()
export default _inst