define([
    'app'
], function(app) {
    app.directive('fiEditContentCustomMap', ['config', '$rootScope', '$validator', '$layerManage', function(config, $rootScope, $validator, $layerManage) {
        var fiPageCustomeBasePath = '/components/custome';
        return {
            restrict: 'E',
            templateUrl: '/components/custome/map/content/index.html',
            scope: {
                layer: "=ngModel"
            },
            link: function($scope, $element, $attrs) {
                $scope.replaceImage = function() {
                    $scope.$emit('fiEditAreaClick', {
                        action: 'editLayerImage',
                        layer: $scope.layer
                    });
                };

                var map = new BMap.Map("allmap");
                var myValue;

                //建立一个自动完成的对象
                var ac = new BMap.Autocomplete({
                    input: 'suggestId',
                    location: map
                });

                //鼠标放在下拉列表上的事件
                ac.addEventListener('onhighlight', function(e) {
                    var str = '',
                        value = '',
                        _value = e.fromitem.value;

                    if (e.fromitem.index > -1) {
                        value = _value.province + _value.city + _value.district + _value.street + _value.business;
                    }
                    str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value;
                    value = '';

                    if (e.toitem.index > -1) {
                        _value = e.toitem.value;
                        value = _value.province + _value.city + _value.district + _value.street + _value.business;
                    }
                    str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value;
                });

                //鼠标点击下拉列表后的事件
                ac.addEventListener('onconfirm', function(e) {
                    var _value = e.item.value;
                    myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                    setPlace();
                });

                function setPlace() {
                    //清除地图上所有覆盖物
                    map.clearOverlays();

                    function myFun() {
                        //获取第一个智能搜索的结果
                        var pp = local.getResults().getPoi(0).point;
                        // 将搜索结果赋值给scope
                        $scope.layer.content.location = myValue;
                        $scope.layer.content.lng = pp.lng;
                        $scope.layer.content.lat = pp.lat;
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
                var ngModel = $scope.layer.content;
                if (ngModel.location && ngModel.lat && ngModel.lng) {
                    myValue = $scope.layer.content.location;
                    ac.setInputValue(myValue);
                    var point = new BMap.Point(ngModel.lng, ngModel.lat);
                    var marker = new BMap.Marker(point);
                    map.centerAndZoom(point, 18);
                    map.addOverlay(marker);
                    setPlace();
                } else {
                    map.centerAndZoom("北京", 12);
                }
            }
        };
    }]);
});