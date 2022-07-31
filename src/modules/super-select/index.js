define(['app'], function(app) {
    app.directive('superSelect', [function factory() {
            var directive = {
                    restrict: 'E',
                    replace: "true",
                    scope:{
                        setting:'=setting',
                        optVal :'=optVal'
                    },
                    templateUrl: '/modules/super-select/index.html',
                    controller: ['$scope',function($scope) {
                        var setting = $scope.setting;
                        $scope.opts = setting.opts;
                        $scope.label = setting.label;

                        $scope.curOpt = {};
                            if (!$scope.optVal) {
                                $scope.curOpt = $scope.opts[0];
                            } else {
                                for (var i = 0, len = $scope.opts.length; i < len; i++) {
                                    if ($scope.opts[i].val === $scope.optVal) {
                                        $scope.curOpt = $scope.opts[i];
                                        return;
                                    }
                                    if (len - 1 == i) {
                                        $scope.curOpt = $scope.opts[0];
                                    }
                                }
                            }
                            $scope.$watch('curOpt',function(newVal,oldVal){
                                if(newVal&&oldVal){
                                    $scope.optVal = $scope.curOpt.val;
                                }
                            });
                     }]
                };
                  return directive;
            }]);


});