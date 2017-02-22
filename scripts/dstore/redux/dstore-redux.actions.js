import {CALL_API, ACTIONS} from './dstore-redux.constants';

function makeAdd(namespace) {
    return (instance) => (dispatch, getState) => {
        dispatch({[CALL_API]: {
            type: ACTIONS.ADD,
            namespace: namespace,
            data: instance
        }});
    };
}

function makeRead(namespace) {
    return (id) => (dispatch, getState) => {
        dispatch({[CALL_API]: {
            type: ACTIONS.READ,
            namespace: namespace,
            data: {id: id}
        }});
    };
}

function makeReadAll(namespace) {
    return () => (dispatch, getState) => {
        dispatch({[CALL_API]: {
            type: ACTIONS.READ_ALL,
            namespace: namespace
        }});
    };
}

function makeUpdate(namespace) {
    return (instance) => (dispatch, getState) => {
        dispatch({[CALL_API]: {
            type: ACTIONS.UPDATE,
            namespace: namespace,
            data: instance
        }});
    };
}

function makeDelete(namespace) {
    return (id) => (dispatch, getState) => {
        dispatch({[CALL_API]: {
            type: ACTIONS.DELETE,
            namespace: namespace,
            data: {id: id}
        }});
    };
}

export default function(namespaces) {
    let data = {};

    namespaces.forEach((namespace) => {
        let ptr = data;
        let lastName = null;

        namespace.split('.').forEach((name, index, array) => {
            if (!ptr.hasOwnProperty(name)) {
                ptr[name] = {};
            }

            // If we are in the last element, save the name so we can use ptr[lastName]
            // Else re-allocate ptr to equal the new object
            // This is so after we iterate the array, we are not re-allocating ptr itself, but a
            // member inside ptr
            if (index === array.length - 1) {
                lastName = name;
            } else {
                ptr = ptr[name];
            }
        });

        ptr[lastName] = {
            add: makeAdd(namespace),
            read: makeRead(namespace),
            readAll: makeReadAll(namespace),
            update: makeUpdate(namespace),
            delete: makeDelete(namespace)
        };
    });
    return data;
}
