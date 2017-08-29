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
    'clear': () => ({ shell: {type: 'clear'} }),
    'sudo': exec => ({ shell: {type: 'sudo', user: exec.user} }),
    'exit': () => ({ shell: {type: 'exit'} }),
    'echo': exec => exec.rawArgs,
    'whoami': exec => exec.user,
    'pngshl': exec => ShellI.pingBack(exec.path),
    'theme': theme
}

function theme(exec) {
    if(exec.args.length === 1) {
        switch(exec.args[0]) {
            case 'classic':
                return {
                    stdout: 'Set theme to classic',
                    shell: { type: 'theme', theme: 'classic' }
                }
            case 'solar':
                return {
                    stdout: 'Set theme to solar',
                    shell: { type: 'theme', theme: 'solar' }
                }
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