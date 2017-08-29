import React from 'react'

import PromptHistory from './PromptHistory'

import 'feed.scss'
export default class Feed extends React.Component {
    state = {
        history: []
    }

    render() {
        const { history } = this.state

        return <div id='feed'>
            { history.map((hist, ind) => <div className='feed-entry' key={ind}>
                {hist.prompt !== null && <PromptHistory {...hist.prompt} />}
                {hist.output !== null && <div className='feed-entry-output'><pre>{ hist.output }</pre></div>}
            </div>)}
        </div>
    }

    addEntry = (prompt, output) => {
        const history = this.state.history.concat([{
            prompt, output
        }])
        this.setState({ history })
    }

    clear = () => this.setState({ history: [] })
}
