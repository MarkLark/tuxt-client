import {createStore, combineReducers, applyMiddleware} from 'redux';
import DStore, {dstore} from '../../dstore/redux';
import thunk from 'redux-thunk';
import {isEqual} from 'lodash';

let ds = DStore([
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

const reducers = combineReducers({dstore: ds.reducers});
const store = createStore(reducers, applyMiddleware(thunk, ds.middleware));

const defaults = {
    0: {id: 0, tag: 'os', name: 'OS', description: 'Operating System'},
    1: {id: 1, tag: 'http', name: 'HTTP', description: 'Hypertext Transfer Protocol - Internet'},
    2: {id: 2, tag: 'firewall', name: 'Firewall', description: 'Network firewall'}
};

describe('dstore apps.category', () => {
    it('can request all App.Category', () => {
        store.dispatch(dstore.app.category.readAll());
    });

    // Allow some time for the GET request above to retrieve the data
    it('sleeping', (done) => {
        setTimeout(() => {
            done();
        }, 100);
    }, 200);

    it('can wait for something', () => {
        let state = store.getState();

        expect(isEqual(defaults, state.dstore.app.category.instances)).toBeTruthy();
    });
});
