// 地图
define(['app'], function(app) {
    app.directive('map', ['$rootScope',
        function factory($rootScope) {
            var directive = {
                restrict: 'E', // 指令的使用方式，包括标签，属性，类，注释
                templateUrl: '/modules/map/index.html', // 从指定的url地址加载模板
                // replace: true, // 是否用模板替换当前元素，若为false，则append在当前元素上
                // transclude: true, //是否将当前元素的内容转移到模板中
                require: "ngModel",
                scope: {
                    ngModel: "="
                },
                link: function($scope, $element, $attrs, $transclude, ngModel) {

                }
            };
            return directive;
        }
    ]).controller('MapController', ['$scope', '$timeout',
        function($scope, $timeout) {
            $scope.initMap = function() {

                var map = new BMap.Map("allmap");
                var myValue;

                map.centerAndZoom("北京",12);
                //建立一个自动完成的对象
                var ac = new BMap.Autocomplete(
                    {
                        input: 'suggestId',
                        location: map
                    }
                );
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
                    //清除地图上所有覆盖物
                    map.clearOverlays();
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

                        map.centerAndZoom(pp, 18);
                        //添加标注
                        map.addOverlay(new BMap.Marker(pp));
                    }
                    //智能搜索
                    var local = new BMap.LocalSearch(map, {
                        onSearchComplete: myFun
                    });
                    local.search(myValue);
                }
                var ngModel = $scope.$parent.ngModel;
                if (ngModel.location && ngModel.lat && ngModel.lng) {
                    var myValue = $scope.$parent.ngModel.location;
                    ac.setInputValue(myValue);
                    var point = new BMap.Point(ngModel.lng, ngModel.lat);
                    var marker = new BMap.Marker(point);
                    map.centerAndZoom(point, 18);
                    map.addOverlay(marker);
                    setPlace();
                }
            }
        }
    ]);
});
