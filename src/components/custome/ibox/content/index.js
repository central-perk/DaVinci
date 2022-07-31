// 文本内容编辑区域

define([
    'app'
], function(app) {
    app.directive('fiEditContentCustomIbox', ['config', '$utils', '$rootScope', '$timeout', '$layerManage', '$validator', function(config, $utils, $rootScope, $timeout, $layerManage, $validator) {
        var fiPageCustomeBasePath = '/components/custome';
        var events = config.EVENTS;
        return {
            restrict: 'E',
            templateUrl: '/components/custome/ibox/content/index.html',
            scope: {
                layer: "=ngModel"
            },
            link: function($scope, $element, $attrs) {
                $scope.changeType = function($event, changeLabel) {
                    if (changeLabel) {
                        $scope.layer.content.label = $($event.target).attr('title');
                    }
                };
            }
        };
    }]);
});