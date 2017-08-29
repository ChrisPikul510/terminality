import React from 'react'

import Events from '../Events'

import { parseInputToCall } from '../processing/Parser'
import { formatOutput } from '../processing/Output'

import Commands from '../commands'
import Programs from '../programs'
import Errors from '../errors'

import Feed from './Feed'
import Prompt from './Prompt'

const hostname = window.location.host

const _welcomeMsg = `Welcome to Terminality, a small JS terminal simulator.

Type the command 'mount' to mount the example filesystem.
Otherwise use 'help' for a list of some commands you can use.`

export default class Shell extends React.Component {
    state ={
        sudo: null,
        user: 'user',
        env: {
            home: '/home/user',
            path: '/home/user'
        },
        theme: 'classic'
    }

    evtCmd = null

    componentDidMount() {
        this.evtCmd = Events.addListener('shelli.cmd', this.handleEvent)

        this.refs.feed.addEntry(null, formatOutput(_welcomeMsg))
        this.refs.prompt.setActive(true)
    }

    componentWillUnmount() {
        if(this.evtCmd)
            Events.removeListener(this.evtCmd)
    }

    render() {
        const { sudo, user, theme } = this.state
        return <div id='shell' className={'theme-'+theme}>
            <Feed ref='feed' />
            <Prompt ref='prompt' 
                user={sudo !== null ? sudo : user} hostname={hostname} path='~' sudo={(sudo !== null)}
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

                let formatted = null, shellInstr = null
                if(output) {
                    if(typeof output === 'object') {
                        if(output.hasOwnProperty('stdout'))
                            formatted = formatOutput(output.stdout, _exec)

                        if(output.hasOwnProperty('shell'))
                            shellInstr = output.shell
                    } else if(typeof output === 'string')
                        formatted = formatOutput(output, _exec)
                }

                if(shellInstr && shellInstr.type === 'clear') {
                    this.refs.feed.clear()
                } else {
                    if(shellInstr && shellInstr.type)
                        this.handleInstruction(shellInstr)

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
                    formatted = formatOutput(Errors.PANIC, _exec)

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

    handleInstruction = instr => {
        switch(instr.type) {
            case 'sudo':
                return this.setState({ sudo: (shellInstr.user ? shellInstr.user : this.state.user) })
            case 'exit':
                return this.setState({ sudo: null })
            case 'theme':
                return this.setState({ theme: instr.theme })
            default:
                console.warn('Unknown shell instruction!', instr.type)
        }
    }

    handleEvent = evt => {
        switch(evt.type) {
            case 'ECHOPING':
                this.refs.feed.addEntry(null, 'Interface is open. ShellI completed the trip!\nIf this message appeared before your prompt line, it\'s because it\'s faster.\n\n')
                break;
        }
    }
}