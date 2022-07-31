define(['app'], function(app) {
    app.directive('ngLoading', ['$rootScope',
        function factory($rootScope) {
            var directive = {
                restrict: 'E', // 指令的使用方式，包括标签，属性，类，注释
                replace:'true',
                templateUrl: '/modules/loading/index.html'
            };
            return directive;
        }
    ]);
});
