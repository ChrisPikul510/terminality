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
    'pngshl': exec => ShellI.pingBack(exec.path),
    'theme': theme
}

function theme(exec) {
    if(exec.args.length === 1) {
        switch(exec.args[0]) {
            case 'classic':
                ShellI.setTheme('classic')
                break;
            case 'solar':
                ShellI.setTheme('solar')
                break;
            default:
                return 'No theme available by that name.\nAvailable Themes: classic, solar'
        }
    } else {
        if(exec.props.hasOwnProperty('h')) {
            return `Changes the Shell theme.
Usage:      theme [name] 
Options:
    h   -   This message.
    l   -   List available themes
`
        } else if(exec.props.hasOwnProperty('l')) {
            return 'Available Themes: classic, solar'
        } else
            return 'Invalid options, use -h to see help info'
    }
}

export default commands