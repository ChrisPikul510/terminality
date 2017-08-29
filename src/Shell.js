import React from 'react'

import { parseInputToCall } from './processing/Parser'
import { formatOutput } from './processing/Output'

import Commands from './commands'
import Programs from './programs'
import Errors from './errors'

import Feed from './Feed'
import Prompt from './Prompt'

const hostname = window.location.host

const _welcomeMsg = `Welcome to Terminality, a small JS terminal simulator.

Type the command 'mount' to mount the example filesystem.
Otherwise use 'help' for a list of some commands you can use.`

export default class Shell extends React.Component {
    state ={
        sudo: false,
        user: 'user',
        env: {
            home: '/home/user',
            path: '/home/user'
        }
    }

    componentDidMount() {
        this.refs.feed.addEntry(null, formatOutput(_welcomeMsg))
        this.refs.prompt.setActive(true)
    }

    render() {
        const { sudo, user } = this.state
        return <div id='shell'>
            <Feed ref='feed' />
            <Prompt ref='prompt' 
                user={user} hostname={hostname} path='~' sudo={sudo}
                onEnter={this.handleEnter} />
        </div>
    }

    handleEnter = value => {
        let _exec = null, _isCMD = false
        parseInputToCall(value, this.state.env)
            .then(call => ({
                ...call,
                env: this.state.env,
                path: '~',
                user: this.state.user,
                hostname: hostname,
                sudo: this.state.sudo
            }))
            .then(execute => {
                _exec = execute
                if(Commands.hasOwnProperty(execute.cmd)) {
                    _isCMD = true
                    return Commands[execute.cmd](execute)
                } else if(Programs.hasOwnProperty(execute.cmd)) {
                    return Programs[execute.cmd](execute)
                } else {
                    throw 'NO_CMD'
                }
            })
            .then(output => {
                if(!_exec)
                    throw 'PANIC'

                let formatted = null
                if(output) {
                    formatted = formatOutput(output, _exec)
                }

                if(_isCMD && (_exec.cmd === 'clear' || _exec.cmd === 'clr')) {
                    this.refs.feed.clear()
                } else {
                    if(_isCMD) {
                        if(_exec.cmd === 'sudo') {
                            this.setState({ 
                                sudo: true,
                                user: (_exec.args.length == 2 && _exec.args[0] == 'su' ? _exec.args[1] : 'user')
                            })
                        } else if(_exec.cmd === 'exit') {
                            this.setState({ 
                                sudo: false,
                                user: 'user'
                            })
                        }
                    }

                    this.refs.feed.addEntry({
                        user: _exec.user,
                        hostname: hostname,
                        path: _exec.path,
                        sudo: _exec.sudo,
                        value
                    }, formatted)
                }

                this.refs.prompt.reset()
                this.refs.prompt.setActive(true)
            })
            .catch(err => {
                console.error(err)

                let formatted = null
                if(Errors.hasOwnProperty(err))
                    formatted = formatOutput(Errors[err], _exec)
                else
                    formatted = formatOutput(Erros.PANIC, _exec)

                this.refs.feed.addEntry({
                    user: _exec.user,
                    hostname: hostname,
                    path: _exec.path,
                    sudo: _exec.sudo,
                    value
                }, formatted)


                this.refs.prompt.reset()
                this.refs.prompt.setActive(true)
            })
    }
}