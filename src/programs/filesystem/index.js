/**
 * Mock filesystem commands!
 */
import MSFS from './msfs'

export default {
    'whereami': exec => exec.path,
    'mount': mount,
    'stat': stat,
    'cat': cat
}

function mount(exec) {
    if(exec.args.length === 0) {
        MSFS.mount()
        return 'Ok, filesystem mounted'
    } else
        return 'mount does not support arguments yet'
}

function stat(exec) {
    let path = exec.path
    if(exec.args.length > 0)
        path = exec.args[exec.args.length  - 1]

    const info = MSFS.stat(path)
    if(!info)
        return `Error parsing path ${path}, maybe the file doesn't exist?`
    const permStr = info.perm.toString(8)
    return `Stat info for "${path}":\n\tPermissions: ${permStr}\n`
}

function cat(exec) {
    if(exec.args.length === 0)
        return 'Please supply a path to the file'

    const contents = MSFS.readFile(exec.args[exec.args.length  - 1])
    if(!contents)
        return `Error parsing path, maybe the file doesn't exist?`

    return contents
}