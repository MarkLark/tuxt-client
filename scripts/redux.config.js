import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import {combineReducers} from 'redux';
import {router} from 'redux-ui-router';
import DStore from './dstore/redux/dstore-redux';

const logger = createLogger();

let dstore = DStore([
    'app.app',
    'app.category',
    'app.subcategory',
    'app.version',
    'article.article',
    'article.chapterlist',
    'article.tag',
    'article.taglist',
    'chapter.chapter',
    'chapter.content',
    'chapter.contentmap',
    'chapter.map',
    'chapter.tag',
    'chapter.taglist',
    'os.distro',
    'os.os',
    'os.version'
]);

let reducers = combineReducers({
    router: router,
    dstore: dstore.reducers
});


store.$inject = ['$ngReduxProvider'];
export default function store($ngReduxProvider) {
    $ngReduxProvider.createStoreWith(
        reducers,
        ['ngUiRouterMiddleware', thunk, dstore.middleware, logger],
        [window.devToolsExtension ? window.devToolsExtension() : (f) => f]
    );
}
