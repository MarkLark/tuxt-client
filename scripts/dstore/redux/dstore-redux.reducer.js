import merge from 'lodash/merge';
import {combineReducers} from 'redux';
import {ACTIONS} from './dstore-redux.constants';

function addInstance(state, action) {
    let obj = action.response;
    let newState = {instances: {}};

    newState.instances[obj.id] = obj;
    return merge({}, state, newState);
}

function readAllInstances(state, action) {
    let instances = action.response;
    let newState = {instances: {}};

    instances.forEach((obj) => {
        newState.instances[obj.id] = obj;
    });

    return merge({}, state, newState);
}

function readInstance(state, action) {
    let obj = action.response;
    let newState = Object.assign({}, state);

    newState.instances[obj.id] = obj;
    return newState;
}

function deleteInstance(state, action) {
    let oid = action.id;
    let newState = Object.assign({}, state);

    delete newState.instances[oid];
    return newState;
}

function updateInstance(state, action) {
    let obj = action.response;
    let newState = Object.assign({}, state);

    newState.instances[obj.id] = obj;
    return newState;
}

const initValue = {instances: {}};

function createReducer(namespace) {
    return (state = initValue, action) => {
        // If we don't have a namespace, then it's not a DStore action
        // If we don't have a response, then there might have been an error
        if (!action.namespace || !action.response || !action.action) {
            return state;
        }

        // If this is not our namespace, then return state
        if (namespace !== action.namespace) {
            return state;
        }

        switch (action.action) {
        case ACTIONS.ADD:
            return addInstance(state, action);
        case ACTIONS.READ:
            return readInstance(state, action);
        case ACTIONS.READ_ALL:
            return readAllInstances(state, action);
        case ACTIONS.UPDATE:
            return updateInstance(state, action);
        case ACTIONS.DELETE:
            return deleteInstance(state, action);
        default:
            return state;
        }
    };
}

export default function generateReducers(ptr, namespace = '') {
    let rtn = {};

    Object.keys(ptr).forEach((key) => {
        let value = ptr[key];
        let type = typeof value;

        if (type === 'string') {
            let ns = namespace === '' ? value : `${namespace}.${value}`;

            rtn[value] = createReducer(ns);
        } else if (type === 'object') {
            let ns = namespace === '' ? key : `${namespace}.${key}`;

            rtn[key] = generateReducers(value, ns);
        } else {
            throw new Error('Unsupported entry type: ' + type);
        }
    });
    return combineReducers(rtn);
}
