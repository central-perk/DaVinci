/**
 *  模块 - 上传图片
 */
define(['app'], function(app) {
    app.directive('imageUpload', ['$rootScope', '$imageManage', '$timeout', 'config', '$image',
        function factory($rootScope, $imageManage, $timeout, config, $image) {
            var events = config.EVENTS;
            var directive = {
                scope: {
                    uploadCallback: '&uploadCallback',
                    image: '@options',
                    cropSize: '@cropSize'
                },
                link: function($scope, $element, $attrs, $transclude, ngModel) {

                    //点击元素
                    $element.bind('click', function($event) {
                        $event.stopPropagation();
                        var image = $scope.image || {};
                        var options = {
                            image: $scope.$eval(image)
                        };

                        if ($scope.cropSize) {
                            options.cropSize = $scope.cropSize;
                        }
                        if ($attrs.tip) {
                            options.tip = $attrs.tip;
                        }
                        //呼出模态框
                        $imageManage.init(null, {
                            title: '修改图片',
                            disableDynamic: false,
                            disableMulti: true
                        }).then(function(imagePacks) {
                            var obj = {
                                data: imagePacks[0]
                            };
                            $scope.uploadCallback(obj);
                        });
                    });
                }
            };
            return directive;
        }
    ]);
});