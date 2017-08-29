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

    if(path.startsWith('/')==false || /[^\w\s\/\.]/g.test(path)) {
        console.log('[MSFS.stat] Invlaid path format', path)
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

    return pathObj
}

var _fs = null
class MSFS {
    mount() {
        _fs = {...fsBlank}
    }

    stat(path) {
        const result = getPathObj(path)
        if(result)
            return result['[i]']
        else
            return null
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

    listContents(path) {
        const result = getPathObj(path)
        if(!result)
            return null

        const stat = result['[i]']
        if((stat.perm & 0o1000)==false)
            return null

        const rtn = []
        for(const key in result) {
            if(key.charAt(0) !== '[') {
                rtn.push({
                    name: key,
                    isDir: stat.perm & 0o1000
                })
            }
        }

        return rtn
    }
}

const inst = new MSFS()
export default inst
