/**
 * Mock filesystem commands!
 */
import MSFS from './msfs'

export default {
    'whereami': exec => exec.path,
    'mount': mount,
    'stat': stat,
    'cat': cat,
    'ls': ls
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
    let path = exec.path
    if(exec.args.length > 0) {
        path = exec.args[exec.args.length  - 1]
        if(path.charAt(0) !== '/') {
            if(path.startsWith('./')) {
                const rel = path.substr(2)
                if(rel.length > 0)
                    path = exec.path + '/' + path.substr(2)
                else
                    path = exec.path
            } else
                path = exec.path + '/' + path
        }
    }

    const contents = MSFS.readFile(path)
    if(!contents)
        return `Error parsing path, maybe the file doesn't exist?`

    return contents
}

function ls(exec) {
    let path = exec.path
    if(exec.args.length > 0) {
        path = exec.args[exec.args.length  - 1]
        if(path.charAt(0) !== '/') {
            if(path.startsWith('./')) {
                const rel = path.substr(2)
                if(rel.length > 0)
                    path = exec.path + '/' + path.substr(2)
                else
                    path = exec.path
            } else
                path = exec.path + '/' + path
        }
    }

    const contents = MSFS.listContents(path)
    if(!contents)
        return `Error parsing path ${path}, maybe the folder doesn't exist?`

    if(contents.length === 0)
        return `Folder is empty`

    contents.sort((a,b) => {
        const upA = (a.isDir?0:10)+a.name.toUpperCase(), upB = (b.isDir?0:10)+b.name.toUpperCase()
        return upA > upB ? 1 : (upA < upB ? -1 : 0)
    })
    let results = `Contents of path: ${path} (${contents.length} items)\n\n`
    for(const obj of contents) {
        results += `\t${obj.name}\t\t${obj.isDir?'Directory':'File'}`
    }

    return results
}