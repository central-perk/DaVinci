// 地址输入框
define(['app'], function(app) {
    app.directive('address', ['$rootScope',
        function factory($rootScope) {
            return {
                restrict: 'E', // element
                templateUrl: '/modules/address/index.html',
                require: "ngModel",
                scope: {
                    ngModel: "="
                }
            };
        }
    ]).controller('AddressController', ['$scope',
        function($scope) {
            $scope.initAddress = function() {
                var myValue;
                var ac = new BMap.Autocomplete({
                    input: 'suggestId'
                });
                //鼠标放在下拉列表上的事件
                ac.addEventListener('onhighlight', function(e) {
                    var str = '',
                        value = '',
                        _value = e.fromitem.value;

                    if (e.fromitem.index > -1) {
                        value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                    }
                    str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value;
                    value = '';

                    if (e.toitem.index > -1) {
                        _value = e.toitem.value;
                        value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                    }
                    str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value;
                });
                //鼠标点击下拉列表后的事件
                ac.addEventListener('onconfirm', function(e) {
                    var _value = e.item.value;
                    myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                    setPlace();
                });
                function setPlace(){
                    function myFun(){
                        //获取第一个智能搜索的结果
                        var pp = local.getResults().getPoi(0).point;
                        // 将搜索结果赋值给scope
                        $scope.$parent.ngModel = {
                            location: myValue,
                            lng: pp.lng,
                            lat: pp.lat
                        };
                        $scope.$apply();
                    }
                    //智能搜索
                    var local = new BMap.LocalSearch('北京市', {
                        onSearchComplete: myFun
                    });
                    local.search(myValue);
                }
                var ngModel = $scope.$parent.ngModel;
                if (ngModel.location && ngModel.lat && ngModel.lng) {
                    var myValue = $scope.$parent.ngModel.location;
                    ac.setInputValue(myValue);
                    setPlace();
                }
            };

        }
    ]);
});
