import Commands from './index'
import Programs from 'programs'

const helpMsg = 
`[Terminality Help]
Help Options:
    -a, --all   -   List all programs and commands

Commands:
    help        -   View this message
    clear       -   Clear the terminal feed
    sudo        -   Doesn't do anything yet, but changes the prompt color!
    exit        -   Removes sudo status
    echo        -   Writes out it's own arguments
    theme       -   Changes the shell theme
    whoami      -   Writes out who your user is

Filesystem:
    mount       -   Mounts the built-in example filesystem (takes no arguments)
    whereami    -   Echos out your current path
    stat        -   Displays information about a directory/path given one as argument
    cat         -   Echos out the contents of a file (only works on files)

Misc. Programs:
    sleep       -   Just sleeps the prompt a given time (shows the async'ness)

PRO-TIP: Use mount before any other filesystem commands, or they will just error out.
I intend to have the FS async-ly fetch remote filesystem directories so that's what the
command is for.
`
/**
 * Displays help message, also lists some programs
 * @param {object} exec Call Data
 */
export default function Help(exec) {
    if(exec.props.hasOwnProperty('a') || exec.props.hasOwnProperty('all')) {
        const sortAlpha = (a,b) => {
            const upA = a.toUpperCase(), upB = b.toUpperCase()
            return upA > upB ? 1 : (upA < upB ? -1 : 0)
        }

        const cmds = Object.keys(Commands).sort(sortAlpha)
        const pgrms = Object.keys(Programs).sort(sortAlpha)

        let rtn = 'Commands:\n'
        let ln = '\t'
        for(const key of cmds) {
            if((ln.length + key.length) >= 160) {
                rtn += '\t'+ln+'\n'
                ln = key+', '
            } else
                ln += key+', '
        }
        rtn += ln.substr(0, ln.length-2)
        rtn += '\n\nPrograms:\n'

        ln = '\t'
        for(const key of pgrms) {
            if((ln.length + key.length) >= 160) {
                rtn += '\t'+ln+'\n'
                ln = key+', '
            } else
                ln += key+', '
        }
        rtn += ln.substr(0, ln.length-2) + '\n'

        return rtn
    } else
        return helpMsg
}
