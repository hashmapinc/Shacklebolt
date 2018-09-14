import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './home/home';
import registerServiceWorker from './registerServiceWorker';

import init_amplify from './amplify-setup';
import { withAuthenticator } from 'aws-amplify-react';

init_amplify();
const LoginableHome = withAuthenticator(Home);
ReactDOM.render(<LoginableHome />, document.getElementById('root'));
registerServiceWorker();
