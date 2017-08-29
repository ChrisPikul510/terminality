/**
 * Mock storage filesystem
 * Singleton designed
 */

var fsBlank = {
    'home': {
        '[i]': {
            perm: 0o1777,
            uid: 0,
            gid: 0
        },
        'user': {
            '[i]': {
                perm: 0o1740,
                uid: 1,
                gid: 1
            },
            'readme.txt': {
                '[i]': {
                    perm: 0o0400,
                    uid: 1,
                    gid: 1,
                    content: 'Test file content'
                }
            }
        }
    }
}

function getPathObj(path) {
    if(_fs == null) {
        console.log('[MSFS] No filesystem mounted')
        return null
    }

    const tokens = path.split('/')
    let pathObj = _fs
    for(let i=1; i < tokens.length; i++) {

        if(pathObj.hasOwnProperty(tokens[i])) {
            pathObj = pathObj[tokens[i]]
        } else {
            console.log(`[MSFS] Path does not have object "${tokens[i]}"`, path, tokens, pathObj)
            return null
        }
    }

    return pathObj['[i]']
}

var _fs = null
class MSFS {
    mount() {
        _fs = {...fsBlank}
    }

    stat(path) {
        if(path.startsWith('/')==false || /[^\w\s\/\.]/g.test(path)) {
            console.log('[MSFS.stat] Invlaid path format', path)
            return null
        }
        return getPathObj(path)
    }

    readFile(path) {
        const stat = this.stat(path)
        if(!stat)
            return null

        if((stat.perm & 0o1000)) {
            console.log('[MSFS.readFile] Path is directory!', path)
            return null
        } else if(!(stat.perm & 0o0444)) {
            console.log('[MSFS.readFile] Permission denied')
            return null
        } else
            return stat.content
    }
}

const inst = new MSFS()
export default inst
