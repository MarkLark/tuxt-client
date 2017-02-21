import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import { combineReducers } from 'redux';
import { router } from 'redux-ui-router';

const logger = createLogger();

let reducers = combineReducers({
    router
});


store.$inject = ['$ngReduxProvider'];
export default function store($ngReduxProvider) {
  $ngReduxProvider.createStoreWith(
    reducers,
    ['ngUiRouterMiddleware', thunk, logger],
    [window.devToolsExtension ? window.devToolsExtension() : f => f]
  );
}
