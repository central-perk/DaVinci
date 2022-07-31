define([
    'app'
], function(app) {
    app.directive('fiEditContentCustomVideo', ['config', '$rootScope', '$validator', '$layerManage', function(config, $rootScope, $validator, $layerManage) {
        var fiPageCustomeBasePath = '/components/custome';
        return {
            restrict: 'E',
            templateUrl: '/components/custome/video/content/index.html',
            scope: {
                layer: "=ngModel"
            },
            link: function($scope, $element, $attrs) {
                $scope.replaceImage = function() {
                    $scope.$emit('fiEditAreaClick', {
                        action: 'editLayerImage',
                        layer: $scope.layer
                    });
                };

            }
        };
    }]);
});