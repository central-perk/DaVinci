define(['app'], function(app) {
    app.directive('fvShow', ['config', '$rootScope', 'hotkeys', '$sce',
        function(config, $rootScope, hotkeys, $sce) {
            return {
                restrict: 'E',
                templateUrl: '/common/service/flyer-view/show/index.html',
                replace: true,
                scope: {
                    flyerId: '@',
                    flyerLink: '@',
                    flyerCdnVersion: '@',
                    transferMode: '@'
                },
                link: function($scope, $ele, $attrs) {

                    $scope.getIframeLink = function(options) {
                        var _id = options._id;
                        var iframeLink = '/f/' + _id + '/mobile';
                        var link = options.link;
                        var cdnVersion = options.cdnVersion;

                        if (parseInt(cdnVersion) === 1) {
                            var timeStmp = new Date().getTime();
                            iframeLink = $sce.trustAsResourceUrl(link + '?_mobile=true&_t' + timeStmp);
                        }
                        return iframeLink;
                    };
                    $scope.iframeLink = $scope.getIframeLink({
                        link: $scope.flyerLink,
                        cdnVersion: $scope.flyerCdnVersion,
                        _id: $scope.flyerId
                    });
                    // 监听
                    $scope.$on('viewPreviewClick', function(event, data) {
                        if (data && data.flyer) {
                            $scope.iframeLink = $scope.getIframeLink(data.flyer);
                        }

                    });

                    var $iframe = $ele.find('iframe');
                    $iframe[0].onload = function() {
                        var iframeWindow = $iframe[0].contentWindow;
                        $scope.prev = function() {
                            iframeWindow.__DVC.slide.prev();
                        };

                        $scope.next = function() {
                            iframeWindow.__DVC.slide.next();
                        };
                    };

                    // 上一页
                    hotkeys.add({
                        combo: 'up',
                        callback: function() {
                            $scope.prev();
                        }
                    });

                    // 下一页
                    hotkeys.add({
                        combo: 'down',
                        callback: function() {
                            $scope.next();
                        }
                    });

                    // 上一页
                    hotkeys.add({
                        combo: 'left',
                        callback: function() {
                            $scope.prev();
                        }
                    });

                    // 下一页
                    hotkeys.add({
                        combo: 'right',
                        callback: function() {
                            $scope.next();
                        }
                    });
                }
            };
        }
    ]);
});