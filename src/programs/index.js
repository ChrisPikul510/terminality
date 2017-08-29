/**
 * List of programs.
 * Programs operate different then commands, as they don't modify the shell environment
 */

 import Filesystem from './filesystem'

 export default {
    'wait': sleep, //-\_Aliased
    'sleep': sleep, //-/
    ...Filesystem
 }

 function sleep(exec) {
    return new Promise((resolve, reject) => {
        let timeMs = 1000
        if(exec.args.length > 0)
            timeMs = parseInt(exec.args[0])
        else if(exec.props.hasOwnProperty('time'))
            timeMs = parseInt(exec.props['time'])

        setTimeout(resolve, timeMs)
    })
 }