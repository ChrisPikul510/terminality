/**
 * Big old list of commands and their shortcuts?
 * {
 *   'commandname': Function taking it
 * }
 */

import Help from './Help'
import ShellI from '../Shelli'

const noop = () => {}

const commands = {
    'help': Help,
    'clear': noop,
    'sudo': noop,
    'exit': noop,
    'echo': noop,
    'whoami': exec => exec.user,
    'pngshl': exec => ShellI.pingBack(exec.path)
}

export default commands