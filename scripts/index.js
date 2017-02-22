import 'app.scss';
import 'vendor';
import 'templates-cache.generated';

import uiRouter from 'angular-ui-router';
import ngRedux from 'ng-redux';
import ngReduxUiRouter from 'redux-ui-router';

// Import config for libraries
import reduxConfig from './redux.config';
import routeConfig from './route.config';

const app = angular
    .module('tuxtApp', [
        uiRouter,
        ngRedux,
        ngReduxUiRouter
    ]);

// Disable HTML5 mode for routes
app.config(['$locationProvider', ($locationProvider) => {
    $locationProvider.hashPrefix('!');
    $locationProvider.html5Mode({
        enabled: false,
        requireBase: false
    });
}]);

// Load config for ui-router
app.config(routeConfig(app));

// Load Redux config
app.config(reduxConfig);

export default app;