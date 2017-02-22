export default function(app) {
    RouterConfig.$inject = ['$stateProvider'];
    function RouterConfig($stateProvider) {
        $stateProvider

        .state('index', {
            abstract: true,
            views: {
                main: {template: '<ui-view></ui-view>'},
            }
        })

        .state('index.appscatview', {
            url: '/apps/category/view',
            template: '<apps-category-view></apps-category-view>'
        });
    }
    return RouterConfig;
}
