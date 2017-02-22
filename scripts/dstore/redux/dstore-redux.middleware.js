import {ACTIONS, HTTP_METHODS, TYPES, CALL_API} from './dstore-redux.constants';

const API_ROOT = 'http://127.0.0.1:5000/api/';

const sendApi = (endpoint, action, data = null) => {
    if (!HTTP_METHODS.hasOwnProperty(action)) {
        throw new Error('Incompatible action supplied');
    }

    const packet = {
        headers: {Accept: 'application/json'},
        method: HTTP_METHODS[action],
        mode: 'cors'
    };

    if (data !== null) {
        packet.headers['Content-Type'] = 'application/json';
        packet.body = JSON.stringify(data);
    }

    return fetch(endpoint, packet).then((response) =>
        response.json().then((data) => {
            if (!response.ok) {
                return Promise.reject(data);
            }

            return data;
        })
    );
};

export default (store) => (next) => (action) => {
    const callAPI = action[CALL_API];

    if (typeof callAPI === 'undefined') {
        return next(action);
    }

    let {data = null} = callAPI;
    const {namespace, type} = callAPI;
    let needsId = [ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE].indexOf(type) > -1;

    if (typeof namespace !== 'string') {
        throw new Error('Model namespace must be a string.');
    }

    const actionWith = (rdata) => {
        const finalAction = Object.assign({}, action, rdata);

        delete finalAction[CALL_API];
        if (needsId) {
            finalAction.id = data.id;
        }
        return finalAction;
    };

    // namespace: apps.category
    // action   : ADD
    // type     : ADD_APPS_CATEGORY
    // types:
    //          ADD_APPS_CATEGORY
    //          ADD_APPS_CATEGORY_REQUEST
    //          ADD_APPS_CATEGORY_SUCCESS
    //          ADD_APPS_CATEGORY_FAILURE

    const ns = namespace.toUpperCase().replace('.', '_');
    const types = {
        request: `${type}_${ns}_${TYPES.REQUEST}`,
        success: `${type}_${ns}_${TYPES.SUCCESS}`,
        failure: `${type}_${ns}_${TYPES.FAILURE}`
    };

    next(actionWith({
        type: types.request,
        namespace: namespace,
        action: type
    }));

    let endpoint = API_ROOT + namespace.replace('.', '/') + '/';

    if (needsId) {
        endpoint = `${endpoint}${data.id}`;
        if (type === ACTIONS.READ) {
            data = null;
            needsId = false;
        }
    }

    return sendApi(endpoint, type, data).then(
        (response) => next(actionWith({
            response: response,
            type: types.success,
            namespace: namespace,
            action: type
        })),
        (error) => next(actionWith({
            type: types.failure,
            error: error.message || 'Something bad happened',
            namespace: namespace,
            action: type
        }))
    );
};
