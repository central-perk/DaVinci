define(['app'], function(app) {
    app.directive('userFlyerCard', ['$rootScope', 'config', '$window', '$location', 'FlyerService', '$timeout', '$confirm', '$http', '$alert', '$flyerConfig', '$utils', '$image', '$q', '$affirm', '$flyerShare', '$flyer', '$flyerView',
        function($rootScope, config, $window, $location, FlyerService, $timeout, $confirm, $http, $alert, $flyerConfig, $utils, $image, $q, $affirm, $flyerShare, $flyer, $flyerView) {
            var events = config.EVENTS;
            return {
                restrict: 'E',
                templateUrl: '/pages/user/flyer/card/index.html',
                replace: true,
                require: 'ngModel',
                scope: {
                    flyer: '=ngModel',
                    hideShare: '@',
                    hideData: '@',
                    isAuthor: '@'
                },
                link: function($scope, $element, $attrs) {
                    var flyerID = $scope.flyer._id;
                    // Boolean
                    $attrs.$observe('hideShare', function() {
                        $scope.hideShare = $scope.$parent.$eval($attrs.hideShare);
                    });

                    $attrs.$observe('hideData', function() {
                        $scope.hideData = $scope.$parent.$eval($attrs.hideData);
                    });

                    $attrs.$observe('isAuthor', function() {
                        $scope.isAuthor = $scope.$parent.$eval($attrs.isAuthor);
                    });

                    FlyerService.setModel('flyers');

                    var timer;
                    $scope.dropdown = {
                        isopen: false
                    };
                    $scope.user = $rootScope.user;


                    // 预览
                    $scope.preview = function($event) {
                        $flyerView.show({
                            flyer: $scope.flyer
                        });
                        if (!$event) return;
                        $event.preventDefault();
                        $event.stopPropagation();
                        return false;
                    };

                    // 编辑
                    $scope.edit = function($event) {
                        window.location.pathname = '/fi/' + flyerID + '/edit';
                        if (!$event) return;
                        $event.preventDefault();
                        $event.stopPropagation();
                        return false;
                    };

                    $scope.clickTop = function($event) {
                        if ($scope.isDraft($scope.flyer.status)) {
                            $scope.edit($event);
                        } else {
                            $scope.preview($event);
                        }
                    };

                    // 收藏
                    $scope.collect = function($event) {
                        $utils.collect($scope.flyer, 1);
                        if (!$event) return;
                        $event.preventDefault();
                        $event.stopPropagation();
                        return false;
                    };

                    // 取消收藏
                    $scope.uncollect = function($event) {
                        $utils.uncollect($scope.flyer);
                        if (!$event) return;
                        $event.preventDefault();
                        $event.stopPropagation();
                        return false;
                    };


                    // 设置
                    $scope.config = function($event) {
                        $flyerConfig.show({
                            flyer: $scope.flyer,
                            action: 'update'
                        }).then(function(flyer) {
                            $scope.flyer = _.merge($scope.flyer, flyer);
                        });
                    };

                    // 准备删除作品
                    $scope.toRmFlyer = function($event, flyer) {
                        $affirm.show({
                            msg: '确认删除作品？',
                            btnConfirm: {
                                label: '删除'
                            }
                        }).then(function() {
                            FlyerService.remove(flyerID)
                                .then(function() {
                                    // 删除作品
                                    if (data.code === 200) {
                                        $scope.$emit(events.flyerCardClick, {
                                            flyer: flyer,
                                            action: 'remove'
                                        });
                                        $alert.success(data.msg);
                                    } else {
                                        $alert.error(data.msg);
                                    }
                                });
                        });
                    };


                    // 共享作品
                    $scope.share = function() {
                        $flyerShare.show({
                            flyer: $scope.flyer,
                            onSave: function(flyer) {
                                return FlyerService.setFriendShare(flyer._id, {
                                    friendShare: flyer.friendShare
                                }).then(function(data) {
                                    if (data.code === 200) {
                                        $scope.flyer.friendShare = flyer.friendShare;
                                        $alert.success('保存成功');
                                    } else {
                                        $alert.error(data.msg);
                                    }
                                });
                            }
                        });
                    };

                    // 数据
                    $scope.dataFlyer = function($event, flyer) {
                        if ($scope.isDraft(flyer.status)) return;
                        $location.path('/f/' + flyer._id + '/data');
                    };


                    // 复制作品
                    $scope.cloneFlyer = function($event, flyer) {
                        $flyer.clone(flyer._id)
                            .then(function(result) {
                                if (flyer.category === 10) {
                                    $location.path('/f/' + result + '/edit');
                                } else {
                                    window.location.pathname = '/fi/' + result + '/edit';
                                }
                            });
                        $event.preventDefault();
                        $event.stopPropagation();
                        return false;
                    };

                    $scope.getFlyerStatusClass = function(value) {
                        if (value) {
                            var cls;
                            switch (value) {
                                case 10:
                                    cls = 'draft';
                                    break;
                                case 20:
                                    cls = 'published';
                                    break;
                                case 30:
                                    cls = 'updated';
                                    break;
                                case 40:
                                    cls = 'freeze';
                                    break;
                            }
                            return cls;
                        }
                    };

                    $scope.closeDropdown = function() {
                        timer = $timeout(function() {
                            $scope.dropdown.isopen = false;
                        }, 300);
                    };

                    // 是否为草稿作品
                    $scope.isDraft = $utils.isDraft;

                    $scope.openDropdown = function() {
                        $timeout.cancel(timer);
                        $scope.dropdown.isopen = true;
                    };

                    $scope.deltaTime = function(ts) {
                        var now = moment(),
                            update = moment(ts);
                        return update.from(now);
                    };
                }
            };
        }
    ]);
});