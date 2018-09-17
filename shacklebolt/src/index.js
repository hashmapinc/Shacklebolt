import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import App from './App'
import init_amplify from './amplify-setup';

// configure the amplify instance
init_amplify();

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
