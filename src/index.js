import React from 'react';
import ReactDOM from 'react-dom';
import store from './store/index';
import {Provider} from 'react-redux';
import Container from './components/App';
import './index.css';

ReactDOM.render(
    <div>
        <Provider store={store}>
            <Container />
        </Provider>
    </div>,
    document.getElementById('root')
);