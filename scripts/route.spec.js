import uiRouter from 'angular-ui-router';
import routeConfig from './route.config';

describe('Route Config', () => {
    beforeEach(() => {
        let app = angular.module('test', [uiRouter]);

        app.config(routeConfig());
        angular.mock.module('test');
    });

    describe('`index.appscatview` state', () => {
        it('Should transition to `index.appscatview` state', inject(($rootScope, $state) => {
            $state.go('index.appscatview');
            $rootScope.$digest();
            expect($state.current.name).toBe('index.appscatview');
        }));
    });
});
