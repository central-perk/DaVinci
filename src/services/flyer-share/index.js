define(['app'], function(app) {
    app.service('$flyerShare', ['$modalService', '$q',
        function($modalService, $q) {
            this.show = function(options, callback) {
                var defOptions = {
                    title: '共享作品给所有好友',
                    confirmBtn: {
                        label: '保存'
                    }
                };

                options = options || {};
                options = _.merge(defOptions, options);
                var delay = $q.defer(),
                    tpl = options.tpl,
                    onSave = options.onSave;
                $modalService.show({
                    templateUrl: '/services/flyer-share/index.html',
                    width: 320,
                    height: 250,
                    windowClass: 'flyer-share rect-modal',
                    controller: ['config', '$scope', '$modalInstance', '$alert',
                        function(config, $scope, $modalInstance, $alert) {
                            $scope.title = options.title;
                            $scope.confirmBtn = options.confirmBtn;
                            $scope.flyer = options.flyer;

                            $scope.save = function() {
                                onSave($scope.flyer).then(function() {
                                    $scope.close();
                                });
                            };

                            $scope.close = function() {
                                $modalInstance.close();
                            };

                        }
                    ]
                });
            };

            // 将作品分享给单个好友
            this.friend = function(options, callback) {
                var defOptions = {
                    title: '共享作品给该好友',
                    confirmBtn: {
                        label: '共享所选'
                    }
                };

                options = options || {};
                options = _.merge(defOptions, options);

                $modalService.show({
                    templateUrl: '/services/flyer-share/friend.html',
                    width: 980,
                    height: 740,
                    windowClass: 'flyer-share-friend rect-modal',
                    controller: ['$scope', '$rootScope', '$modalInstance', '$alert', 'FlyerService', 'FlyerShareService',
                        function($scope, $rootScope, $modalInstance, $alert, FlyerService, FlyerShareService) {
                            var userID = options.user._id;

                            $scope.init = function() {
                                $scope.title = options.title;
                                $scope.confirmBtn = options.confirmBtn;
                                $scope.flyers = [];
                                $scope.shareFlyers = [];
                                $scope.listFlyer();
                                $scope.listShares();
                            };

                            $scope.listFlyer = function() {
                                FlyerService.listOneShare()
                                    .then(function(data) {
                                        if (data.code === 200) {
                                            $scope.flyers = data.msg;
                                        } else {
                                            $alert.error(data.msg);
                                        }
                                    });
                            };

                            $scope.listShares = function() {
                                return FlyerShareService.list({
                                        userID: userID
                                    })
                                    .then(function(data) {
                                        if (data.code === 200) {
                                            $scope.shareFlyers = data.msg.flyers;
                                        } else {
                                            $alert.error(data.msg);
                                        }
                                    });
                            };

                            // 点击作品
                            $scope.clickFlyer = function(flyerID) {
                                if ($scope.ifShared(flyerID)) {
                                    _.pull($scope.shareFlyers, flyerID);
                                } else {
                                    $scope.shareFlyers.push(flyerID);
                                }
                                if ($scope.shareFlyers.length == $scope.flyers.length) {
                                    $scope.chooseAll = true;
                                } else {
                                    $scope.chooseAll = false;
                                }
                            };

                            // 判断是否被选中
                            $scope.ifShared = function(flyerID) {
                                return _.indexOf($scope.shareFlyers, flyerID) !== -1;
                            };


                            $scope.save = function() {
                                FlyerShareService.update({
                                    userID: userID,
                                    flyers: $scope.shareFlyers
                                })
                                    .then(function(data) {
                                        if (data.code === 200) {
                                            $alert.success(data.msg);
                                            $scope.close();
                                        } else {
                                            $alert.error(data.msg);
                                        }
                                    });
                            };

                            // 选择所有
                            $scope.clickChooseAll = function() {
                                if ($scope.chooseAll) {
                                    $scope.shareFlyers = _.pluck($scope.flyers, '_id');
                                } else {
                                    $scope.shareFlyers = [];
                                }
                            };


                            $scope.close = function() {
                                $modalInstance.close();
                            };

                        }
                    ]
                });
            };
        }
    ]);

    app.factory('FlyerShareService', ['Restangular', 'config',
        function(Restangular, config) {
            var baseTpl = Restangular.all('flyerShares');
            return {
                list: function(query) {
                    return baseTpl.customGET('', query);
                },
                update: function(data) {
                    return baseTpl.customPOST(data);
                }
            };
        }
    ]);
});