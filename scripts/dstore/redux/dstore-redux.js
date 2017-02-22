import generate_reducers from './dstore-redux.reducer';
import dstoreMiddleware from './dstore-redux.middleware';
import generate_actions from './dstore-redux.actions';

/*
 Converts an array of Model namespaces, into a usable object for use with combineReducers
 i.e.
 input:[
     "apps.category",
     "apps.subcategory",
     "apps.tags.list",
     "article.content",
     "article.content_type"
 ]
 output:{
     apps: [ // combineReducers
         0: "category", // ActionReducer
         1: "subcategory", // ActionReducer
         tags: [ // combineReducers
            "list" // ActionReducer
         ]
     ],
     article: [ // combineReducers
         0: "content", // ActionReducer
         1: "content_type" // ActionReducer
     ]
 }
 */
function convert_namespaces(namespaces) {
    let rlist = {};
    namespaces.forEach(namespace => {
        let ptr = rlist;
        namespace.split('.').forEach((name, index, array) => {
            if (index == array.length - 1) {
                ptr.push(name);
            } else if (index === array.length - 2) {
                if (!(name in ptr)) {
                    ptr[name] = [];
                }
            } else {
                if (!(name in ptr)) {
                    ptr[name] = {};
                }
            }
            ptr = ptr[name];
        });
    });
    return rlist;
}



export let dstore = {};

export default function DStore(namespaces) {
    let models = convert_namespaces(namespaces);
    dstore = generate_actions(namespaces);
    return {
        reducers: generate_reducers(models),
        middleware: dstoreMiddleware,
        actions: dstore
    };
}
