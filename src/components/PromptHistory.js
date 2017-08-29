import React from 'react'

export default class PromptHistory extends React.PureComponent {
    static defaultProps = {
        user: 'user',
        hostname: 'localhost',
        path: '~',
        sudo: false,
        value: ''
    }
    
    render() {
        const { user, hostname, path, sudo, value } = this.props
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
            <span className='prompt-history'>{ value }</span>
        </div>
    </div>
    }
}