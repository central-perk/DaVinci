define(['app'], function(app) {
    app.directive('dvcpagination', ['$location',
        function factory($location) {
            var directive = {
                restrict: 'E', //指令的使用方式，包括标签，属性，类，注释
                templateUrl: '/modules/pagination/index.html', //从指定的url地址加载模板
                replace: true, // //是否用模板替换当前元素，若为false，则append在当前元素上
                transclude: true, //是否将当前元素的内容转移到模板中
                require: "ngModel",
                scope: {
                    ngModel: '=',
                    turn: '&'
                },
                link: function($scope, $element, $attrs, $transclude, ngModel) {
                    $scope.$watch('ngModel', function(value) {
                        if (value) {
                            $scope.pagination = value;
                        }
                    });

                    if (!$attrs.turn) {
                        //刷新页面
                        $scope.search = function(page) {
                            var query = $location.search();
                            query.page = page;
                            $location.path($location.path()).search(query);
                        };
                    } else {
                        $scope.search = function(page) {
                            $scope.turn({
                                data: page
                            });
                        };
                    }
                }
            };
            return directive;
        }
    ]);
});
