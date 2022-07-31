define([], function() {

    var app = angular.module('app', [
        'restangular',
        'ui.router',
        'ngRoute',
        'ngResource',
        'ngCookies',
        'ui.bootstrap',
        'ui.sortable',
        'mediaPlayer',
        'angular-lodash',
        'angularFileUpload',
        'ngAnimate',
        'angular-growl',
        'ngSanitize',
        'angularSpectrumColorpicker',
        'ui.bootstrap.contextMenu',
        'ui.bootstrap-slider',
        'ui.select',
        'cfp.hotkeys'
    ]);

    return app;
});