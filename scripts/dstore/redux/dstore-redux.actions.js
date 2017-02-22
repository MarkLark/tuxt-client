import {CALL_API, ACTIONS} from "./dstore-redux.constants";

function make_add(namespace) {
    return instance => (dispatch, getState) => {
        return dispatch({[CALL_API]: {
            type: ACTIONS.ADD,
            namespace: namespace,
            data: instance
        }});
    };
}

function make_read(namespace) {
    return id => (dispatch, getState) => {
        return dispatch({[CALL_API]: {
            type: ACTIONS.READ,
            namespace: namespace,
            data: { id: id }
        }});
    };
}

function make_read_all(namespace) {
    return () => (dispatch, getState) => {
        return dispatch({[CALL_API]: {
            type: ACTIONS.READ_ALL,
            namespace: namespace
        }});
    }
}

function make_update(namespace) {
    return (instance) => (dispatch, getState) => {
        return dispatch({[CALL_API]: {
            type: ACTIONS.UPDATE,
            namespace: namespace,
            data: instance
        }});
    }
}

function make_delete(namespace) {
    return (id) => (dispatch, getState) => {
        return dispatch({[CALL_API]: {
            type: ACTIONS.DELETE,
            namespace: namespace,
            data: { id: id }
        }});
    }
}

export default function(namespaces) {
    let data = {};
    namespaces.forEach(namespace => {
        let ptr = data;
        let last_name = null;
        namespace.split('.').forEach((name, index, array) => {
            if (! ptr.hasOwnProperty(name)) {
                ptr[name] = {};
            }

            // If we are in the last element, save the name so we can use ptr[last_name]
            // Else re-allocate ptr to equal the new object
            // This is so after we iterate the array, we are not re-allocating ptr itself, but a
            // member inside ptr
            if (index == array.length - 1) {
                last_name = name;
            } else {
                ptr = ptr[name];
            }
        });

        ptr[last_name] = {
            add: make_add(namespace),
            read: make_read(namespace),
            read_all: make_read_all(namespace),
            update: make_update(namespace),
            delete: make_delete(namespace)
        };
    });
    return data;
}
