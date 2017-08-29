
export function parseInputToCall(inp, env) {
    return new Promise((resolve, reject) => {
        cleanAndFillEnvironment(inp, env)
            .then(str => tokenizeString(str))
            .then(({ tokens, input }) => parseCall(tokens, input))
            .then(call => resolve(call))
            .catch(reject)
    })
}

/**
 * Takes incoming RAW text and replaces environment variables as it finds them,
 * also takes the time to replace anything else we might want substituted
 * @param {string} inp Input string (raw text)
 */
export function cleanAndFillEnvironment(inp, env) {
    return new Promise((resolve, reject) => {
        let formatted = inp.trim()
    
        const regex = /\$(\w+)\s?/gi
        let match = regex.exec(inp)
        while(match != null) {
            let _org = match[1]
            let _var = _org.toLowerCase()
            if(env.hasOwnProperty(_var))
                formatted = formatted.replace('$'+_org+'', env[_var])

            match = regex.exec(inp)
        }

        formatted = formatted.replace('~', env.home)

        resolve(formatted)
    })
}

/**
 * Trims and splits the input string based on it's space-separator
 * also groups quoted messages (single/double) as single tokens
 * @param {string} inp Input string (raw text)
 */
export function tokenizeString(inp) {
    return new Promise((resolve, reject) => {
        inp = inp.trim()
        if(inp.length === 0)
            resolve(null)
        else {
            const tokens = []
            let curToken = '', inQuote = false, qtStart = ''
            for(let i=0; i < inp.length; i++) {
                const char = inp.charAt(i)
                if(char === '\'' || char === '"') {
                    if(inQuote) {
                        if(char === qtStart) {
                            tokens.push(curToken)
                            curToken = ''
                            inQuote = false
                            qtStart = ''
                        } else
                            curToken += char
                    } else {
                        inQuote = true
                        qtStart = char
                    }
                } else if(!inQuote && /\s/.test(char) && curToken !== '') {
                    tokens.push(curToken)
                    curToken = ''
                } else
                    curToken += char
            }

            if(curToken != '')
                tokens.push(curToken)

            resolve({ tokens, input: inp })
        }
    })
}

/**
 * Taking the array of tokens, assembles a call-signature block
 * @param {string[]} tokens Array of tokens
 * @param {string} input Raw input passed from tokenizer
 */
export function parseCall(tokens, input) {
    return new Promise((resolve, reject) => {
        if(!tokens || Array.isArray(tokens) == false || tokens.length === 0)
            resolve(null)
        else {
            //For version 1 I'm just gonna do command/program as first array element
            //in more "proper" bash type environments there would probably be
            //environment variable settings and command chaining/piping
            const call = {
                cmd: tokens[0].toLowerCase(),
                args: [],
                props: {},
                rawArgs: input.substr(input.indexOf(' ')+1),
            }
            let curProp = '', curPropLong = ''
            for(let i=1; i < tokens.length; i++) {
                if(tokens[i].startsWith('-')) {
                    if(curProp !== '')
                        call.props[curProp] = true
                    curPropLong = tokens[i]
                    curProp = tokens[i].substr(Math.max(1, tokens[i].indexOf('-', 1) + 1))
                } else {
                    if(curProp !== '')
                        call.props[curProp] = tokens[i]

                    if(curPropLong.startsWith('--')===false)
                        call.args.push(tokens[i])
                    curProp = ''
                }
            }
            if(curProp !== '')
                call.props[curProp] = true

            resolve(call)
        }
    })
    
}
