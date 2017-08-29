/**
 * Big old list of commands and their shortcuts?
 * {
 *   'commandname': Function taking it
 * }
 */
export default {
    'help': exec => helpMsg,
    'clear': exec => {},
    'sudo': exec => {},
    'exit': exec => {},
    'echo': exec => exec.rawArgs,
    'whoami': exec => exec.user,
}

const helpMsg = 
`[Terminality Help]
Commands:
    help    -   View this message
    clear   -   Clear the terminal feed
    sudo    -   Doesn't do anything yet, but changes the prompt color!
    exit    -   Removes sudo status
    echo    -   Writes out it's own arguments
    whoami  -   Writes out who your user is

Filesystem:
    mount   -   Mounts the built-in example filesystem (takes no arguments)
    whereami-   Echos out your current path
    stat    -   Displays information about a directory/path given one as argument
    cat     -   Echos out the contents of a file (only works on files)

Misc. Programs:
    sleep   -   Just sleeps the prompt a given time (shows the async'ness)

PRO-TIP: Use mount before any other filesystem commands, or they will just error out.
I intend to have the FS async-ly fetch remote filesystem directories so that's what the
command is for.
`