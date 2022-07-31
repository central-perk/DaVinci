define([
    'app',
    'pages/user/relation/blk/index',
], function(app, pageConfig) {
    app.controller('UserRelationController', ['$scope', '$rootScope', 'config', '$alert', 'RelationService', '$relation', '$affirm', 'UserService', 'FlyerService',
        function($scope, $rootScope, config, $alert, RelationService, $relation, $affirm, UserService, FlyerService) {
            var events = config.EVENTS,
                userID = $scope.user._id; // 访问目标用户的 userID

            $scope.init = function() {
                $scope.loading = false;
                $scope.query = {};
                $scope.relations = [];
                $scope.removeNewCount();
            };

            // 删除新增好友提示
            $scope.removeNewCount = function() {
                if (!$scope.user.newFriendCount) return;
                UserService.removeNewCount(userID, 0)
                    .then(function(data) {
                        if (data.code === 200) {
                            delete $scope.user.newFriendCount;
                        } else {
                            $alert.error(data.msg);
                        }
                    });
            };

            // 好友列表
            $scope.listFriend = function(query) {
                if (query) {
                    $scope.relations = [];
                    $scope.query = query;
                }
                if ($scope.nextPage) $scope.loading = true;
                return RelationService.listFriend($scope.query)
                    .then(function(data) {
                        if (data.code === 200) {
                            $scope.loading = false;
                            $scope.relations = $scope.relations.concat(data.msg.relationships || []);
                            $scope.next = data.msg.next;
                            $scope.count = data.msg.count;
                            $scope.nextPage = data.msg.nextPage;
                        } else {
                            $alert.error(data.msg);
                        }
                    });
            };



            // 添加好友
            $scope.addRelation = function() {
                $relation.show();
            };

            // 解除好友
            $scope.rmFriend = function(user) {
                $affirm.show({
                    msg: '确定解除好友关系？',
                    btnConfirm: {
                        label: '解除'
                    }
                }).then(function() {
                    var relationID = _.result(_.find($scope.relations, {
                        user: user
                    }), '_id');
                    RelationService.remove(relationID)
                        .then(function(argument) {
                            if (data.code === 200) {
                                _.remove($scope.relations, {
                                    user: user
                                });
                                $scope.count = $scope.relations.length;
                                $alert.success(data.msg);
                            } else {
                                $alert.error(data.msg);
                            }
                        });
                });
            };

            // 加载更多
            $scope.loadMore = function(opt) {
                $scope.query.page = $scope.nextPage;
                $scope.listFriend();
            };
        }
    ]);
});