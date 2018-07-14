import {createStore, compose, applyMiddleware} from 'redux';
import reducer from '../reducers/index.js';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas';
import thunk from 'redux-thunk';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [thunk, sagaMiddleware];

const configureStore = () => {
    //createStore 参数1：reducer 参数2：saga组合
    const store = createStore(reducer,compose(applyMiddleware(...middlewares)));
    sagaMiddleware.run(rootSaga);
    return store;
}

export default configureStore
