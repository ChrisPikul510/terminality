import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

// Get style
import 'index.scss'

// Setup some global environment type stuff
import Events from './Events'
import ShellI from './Shelli'

// Taking the _trm_ namespace, let's be nice and not override it
if(window.hasOwnProperty('_trm_'))
    console.warn('Window already has the namespace _trm_ being used! Cannot (will not) override it')
else {
    window._trm_ = {
        events: Events,
        shell: ShellI
    }
}

import Shell from 'components/Shell'

ReactDOM.render(<Shell />, document.getElementById('root'))
