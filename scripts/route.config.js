export default function(app) {
    RouterConfig.$inject = ['$stateProvider'];
    function RouterConfig($stateProvider) {
        $stateProvider

        .state('index', {
            abstract: true,
            views: {
                main: {template: '<ui-view></ui-view>'},
            }
        });
    }
    return RouterConfig;
}
