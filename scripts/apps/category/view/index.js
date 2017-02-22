import AppsController from './apps-category-view.controller';
import template from './apps-category-view.template.html';

export default angular

    .module('tuxtApp.apps.category.view', [])

    .component('appsCategoryView', {
        template,
        controller: AppsController,
    })

    .name;
