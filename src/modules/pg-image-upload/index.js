/**
 *  模块 - 页面上传图片
 */
define(['app'], function(app) {

    app.directive('pgImageUpload', ['$rootScope', '$modalService', '$timeout', 'config',
        function factory($rootScope, $modalService, $timeout, config) {
            var events = config.EVENTS;
            var directive = {
                scope: false,
                link: function($scope, $element, $attrs, $transclude, ngModel) {
                    var image,
                        lock = false;
                  
                    $element.bind('click', function($event) {
                        image = $scope.$eval($attrs.options);
                        if (lock) return;
                        $scope.$emit(events.pgImageClick, {
                            action: 'editPgImage',
                            image: image,
                            tip: $attrs.tip
                        });
                        $event.stopPropagation();
                        return false;
                    });

                    //监听图片管理的取消和保存
                    $rootScope.$on(events.imageCropClick, function(event, data) {
                        if (data.action === 'cancel' || data.action === 'save') {
                            $element.removeClass('pic-lock');
                            lock = false;
                        }
                    });

                    //监听有图片被点击
                    $rootScope.$on(events.pgImageClick, function(event, data) {
                        if (data.action === 'editPgImage') {
                            lock = true;
                            $element.addClass('pic-lock');
                        }
                    });
                }
            };
            return directive;
        }
    ]);
});
