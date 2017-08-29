/**
 * Takes incoming output strings and formats them to DOM objects. Better then dangerouslySettingHTML
 * @param {string} output Takes string input and formats the output options by control characters
 */
export function formatOutput(output, exec) {
    let formatted = output
    if(!formatted)
        return ''

    const regex = /\$\{(\w+)\}/gi
    let match = regex.exec(output)
    while(match != null) {
        let _org = match[1]
        let _var = _org.toLowerCase()
        if(exec.hasOwnProperty(_var)) {
            formatted = formatted.replace('${'+_org+'}', exec[_var])
        } else if(exec.env.hasOwnProperty(_var)) {
            formatted = formatted.replace('${'+_org+'}', exec.env[_var])
        }
        match = regex.exec(output)
    }

    /*
    const regex2 = /\\e\[(\d+)m/gi
    match = regex2.exec(formatted)
    while(match != null) {
        let _val = match[1]
        switch(_val) {
            case '1':
                formatted = <span>{ formatted.substr(0, match.index) }
                    <b>{ formatted.substr(match.index + 5) }</b>
                </span>
        }
        match = regex2.exec(formatted)
    }
    */
    //formatted = formatted.replace(/(\n|\\n)/gi, '<br />')
    //console.log('Formatted output', output, formatted)
    return formatted
}