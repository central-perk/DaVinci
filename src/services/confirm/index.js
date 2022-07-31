/**
 *  确认框
 *
 */
define([
    'app'
], function(app) {
    app.service('$confirm', ['config', '$http', '$modalService', '$q', '$modalStack',
        function(config, $http, $modalService, $q, $modalStack) {

            // 展示
            this.init = function(options) {
                var options = options || {},
                    width = options.width || 450,
                    height = options.height || 240,
                    windowClass = options.windowClass || '',
                    onConfirm = options.onConfirm,
                    delay = $q.defer();
                $modalService.show({
                    templateUrl: '/services/confirm/index.html',
                    width: width,
                    height: height,
                    windowClass: windowClass,
                    backdrop: options.backdrop || 'true',
                    controller: ['config', '$scope', '$rootScope', '$modalInstance', '$modalService',
                        function(config, $scope, $rootScope, $modalInstance, $modalService) {
                            defaultOptions = {
                                btnClose: {
                                    class: 'btn-default',
                                    name: '取消',
                                    hide: false
                                },
                                btnHeadClose: {
                                    hide: false
                                },
                                btnConfirm: {
                                    class: 'btn-success',
                                    name: '确认',
                                    hide: false
                                },
                                modal: {
                                    title: '标题',
                                    body: '内容',
                                    hideHead: false,
                                    hideFooter: false
                                }
                            };

                            //关闭按钮
                            $scope.close = function() {
                                $modalInstance.close();
                            };

                            $scope.init = function() {
                                $scope.modal = _.merge(defaultOptions.modal, options.modal);
                                $scope.btnClose = _.merge(defaultOptions.btnClose, options.btnClose);
                                $scope.btnConfirm = _.merge(defaultOptions.btnConfirm, options.btnConfirm);
                                $scope.btnHeadClose = _.merge(defaultOptions.btnHeadClose, options.btnHeadClose);
                            };

                            $scope.do = function() {
                                if (onConfirm) {
                                    $scope.waitRes = true;
                                    //在有确认函数情况下，进入loading
                                    onConfirm(function() {
                                        $scope.waitRes = false;
                                        $scope.close();;
                                    })
                                } else {
                                    $scope.close();
                                    delay.resolve();
                                }
                            };
                        }
                    ]
                });
                return delay.promise;
            }
            this.close = function() {
                $modalStack.dismissAll();
            };

        }
    ]);
});