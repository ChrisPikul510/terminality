import React from 'react'

import 'prompt.scss'
export default class Prompt extends React.Component {
    static defaultProps = {
        user: 'user',
        path: '',
        sudo: false
    }

    state = {
        value: [],
        raw: '',
        ctrl: false,
        alt: false,
        shift: false,
        active: false,
        focus: false
    }

    componentDidMount() {
        //document.addEventListener('keydown', this.handleKeyDown)
        document.addEventListener('mouseup', this.handleTouch)
        document.addEventListener('touchstart', this.handleTouch)

        if(this.state.active)
            this.refs.input.focus()
    }

    componentWillUnmount() {
        //document.removeEventListener('keydown', this.handleKeyDown)
        document.removeEventListener('mouseup', this.handleTouch)
        document.removeEventListener('touchstart', this.handleTouch)
    }

    render() {
        const { user, hostname, path, sudo } = this.props
        return <div className={'prompt'+(sudo?' pmt-sudo':'')}>
            <div className='prompt-content'>
                <span className='prompt-prefix'>
                    <span className='pmt-pre-user'>{user}</span>
                    <span className='pmt-pre-sepr'>@</span>
                    <span className='pmt-pre-host'>{hostname}</span>
                    <span className='pmt-pre-sepr'>:</span>
                    <span className='pmt-pre-path'>{path}</span>
                    <span className='pmt-pre-end'>{sudo ? '#' : '$'}</span>
                </span>
                { this.state.value }
                { this.state.active && <span className={'prompt-cursor'+(this.state.focus?' focus':' blur')}></span> }
            </div>
            <input type='text' ref='input' 
                value={this.state.raw} 
                onKeyDown={this.handleKeyDown} 
                onChange={() => {}}
                onFocus={() => this.setState({ focus: true })}
                onBlur={() => this.setState({ focus: false })} />
        </div>
    }

    reset = () => this.setState({
        value: [],
        raw: ''
    })

    setActive = active => this.setState({ active }, () => {
        if(this.state.active)
            this.refs.input.focus()
    })

    handleTouch = evt => {
        if(this.state.active)
            this.refs.input.focus()
    }

    handleChange = evt => this.setState({ value: evt.target.value })
    handleKeyDown = evt => {
        if(!this.state.active)
            return

        const { key, keyCode } = evt

        const curValue = this.state.raw
        const valid = 
            (keyCode > 47 && keyCode < 58)   || // number keys
            keyCode == 32   || // spacebar
            (keyCode > 64 && keyCode < 91)   || // letter keys
            (keyCode > 95 && keyCode < 112)  || // numpad keys
            (keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
            (keyCode > 218 && keyCode < 223);   // [\]' (in order)
        
        if(valid) {
            this.processValue(curValue + evt.key)
        } else {
            switch(evt.key) {
                case 'Control':
                    this.setState({ ctrl: true })
                    break
                case 'Shift':
                    this.setState({ shift: true })
                    break
                case 'Enter':
                    this.setState({ active: false }, () => this.props.onEnter(curValue))
                    break
                case 'Backspace':
                    const nextValue = curValue.substring(0, Math.max(0, curValue.length - 1))
                    this.processValue(nextValue)
                    break
            }
        }
    }

    processValue = next => {
        let tokens = next.trim().split(/\s/g)
        const value = []

        if(tokens.length > 0) {
            tokens.forEach((t,ind) => {
                const classes = ['pmt-char']
                if(ind === 0)
                    classes.push('pmt-cmd')
                else {
                    if(t.startsWith('-'))
                        classes.push('pmt-prop')
                    else
                        classes.push('pmt-arg')
                }

                value.push(<span className={classes.join(' ')} key={'t-'+ind}>{t}</span>)
                if(ind < tokens.length - 1)
                    value.push(<span className='pmt-space' key={'ps-'+ind}>&nbsp;</span>)
            })

            if(next.substr(next.length - 1) === ' ')
                value.push(<span className='pmt-space' key='ps-end'>&nbsp;</span>)
        }

        this.setState({
            raw: next,
            value
        })
    }
}