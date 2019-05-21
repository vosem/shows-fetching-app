import { createStore, compose, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import ReduxThunk from 'redux-thunk';
import rootReducer from '../reducers';

const logger = createLogger();
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducer,
    // applyMiddleware(logger, ReduxThunk),
    composeEnhancer(applyMiddleware(/*logger,*/ ReduxThunk))
);

export default store;