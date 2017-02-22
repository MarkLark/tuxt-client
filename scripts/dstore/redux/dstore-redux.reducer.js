import merge from 'lodash/merge';
import {combineReducers} from 'redux';
import {ACTIONS} from './dstore-redux.constants';

function add_instance(state, action) {
    let obj = action.response;
    let new_state = { instances: {} };
    new_state.instances[obj.id] = obj;

    return merge({}, state, new_state );
}

function read_all_instances(state, action) {
    let instances = action.response;
    let new_state = { instances: {} };

    instances.forEach( obj => {
        new_state.instances[obj.id] = obj;
    });

    return merge({}, state, new_state);
}

function read_instance(state, action) {
    let obj = action.response;
    let new_state = Object.assign({}, state);
    new_state.instances[obj.id] = obj;

    return new_state;
}

function delete_instance(state, action) {
    let oid = action.id;
    let new_state = Object.assign({}, state);
    delete new_state.instances[oid];
    return new_state;
}

function update_instance(state, action) {
    let obj = action.response;
    let new_state = Object.assign({}, state);
    new_state.instances[obj.id] = obj;

    return new_state;
}

const init_value = { instances: {} };

function create_reducer(namespace) {
    return (state = init_value, action) => {
        // If we don't have a namespace, then it's not a DStore action
        // If we don't have a response, then there might have been an error
        if (! action.namespace || ! action.response || ! action.action) {
            return state;
        }

        // If this is not our namespace, then return state
        if (namespace !== action.namespace) {
            return state;
        }

        switch (action.action) {
            case ACTIONS.ADD:
                return add_instance(state, action);
            case ACTIONS.READ:
                return read_instance(state, action);
            case ACTIONS.READ_ALL:
                return read_all_instances(state, action);
            case ACTIONS.UPDATE:
                return update_instance(state, action);
            case ACTIONS.DELETE:
                return delete_instance(state, action);
            default:
                return state;
        }
    }
}

export default function generate_reducers(ptr, namespace = "") {
    let rtn = {};
    Object.keys(ptr).forEach( key => {
        let value = ptr[key];
        let type = typeof value;

        if (type === 'string') {
            if (namespace === "") {
                namespace = value;
            } else {
                namespace = `${namespace}.${value}`;
            }
            rtn[value] = create_reducer(namespace);
        } else if (type === 'object') {
            if (namespace === "") {
                namespace = key;
            } else {
                namespace = `${namespace}.${key}`;
            }
            rtn[key] = generate_reducers(value, namespace);
        } else {
            throw new Error('Unsupported entry type: ' + type);
        }
    });
    return combineReducers(rtn);
}
