define([
    'app'
], function(app) {
    app.directive('fiEditContentCustomShape', ['config', '$rootScope', function(config, $rootScope) {
        var fiPageCustomeBasePath = '/components/custome';
        return {
            restrict: 'E',
            templateUrl: '/components/custome/shape/content/index.html',
            scope: {
                layer: "=ngModel"
            },
            link: function($scope, $element, $attrs) {

                $scope.svgs = [{
                    src: '/images/svg/1.svg',
                }, {
                    src: '/images/svg/2.svg',
                }, {
                    src: '/images/svg/3.svg',
                }, {
                    src: '/images/svg/4.svg',
                }, {
                    src: '/images/svg/5.svg',
                    height: 144
                }, {
                    src: '/images/svg/6.svg',
                }, {
                    src: '/images/svg/7.svg',
                }, {
                    src: '/images/svg/8.svg',
                }, {
                    src: '/images/svg/9.svg',
                    height: 106
                }, {
                    src: '/images/svg/10.svg',
                }, {
                    src: '/images/svg/11.svg',
                    height: 186
                }, {
                    src: '/images/svg/12.svg',
                    height: 213
                }];

                $scope.getSvgStyle = function(link) {
                    return {
                        '-webkit-mask-image': 'url(' + link + ')'
                    };
                };

                $scope.replaceShape = function(svg) {
                    $scope.layer.style.width = svg.width || 160;
                    $scope.layer.style.height = svg.height || 160;
                    $scope.layer.content.style.svg = svg.src;
                };


            }
        };
    }]);
});