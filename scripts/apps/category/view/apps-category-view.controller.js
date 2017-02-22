import {dstore} from '../../../dstore/redux';
import {stateGo} from 'redux-ui-router';

export default class {
    /*@ngInject;*/
    constructor($scope, $ngRedux) {
        this.$ngRedux = $ngRedux;

        // bind redux state to this component, which subscribes to updates like a
        // one way data binding
        const disconnect = $ngRedux.connect((state) => ({
            categories: state.dstore.app.category.instances
        }))($scope);

        // remove the redux data binding when component is destroyed
        $scope.$on('$destroy', disconnect);
    }

    readAll() {
        this.$ngRedux.dispatch(dstore.app.category.readAll());
    }

    remove(id) {
        this.$ngRedux.dispatch(dstore.app.category.delete(id));
    }

    read(id) {
        this.$ngRedux.dispatch(dstore.app.category.read(id));
        this.oid = null;
    }

    goto_update(id) {
        this.$ngRedux.dispatch(stateGo('index.appscatupdate', {id: id}));
    }
}
