// 自定义页面--动画编辑
define(["app"], function (app) {
  app.directive("fiEditAnimate", [
    "config",
    "$layerAnimate",
    "$rootScope",
    "$timeout",
    function (config, $layerAnimate, $rootScope, $timeout) {
      return {
        restrict: "E",
        templateUrl:
          "/modules/flyer-interact-editor/edit-area/animate/index.html",
        scope: {
          layer: "=ngModel",
        },
        link: function ($scope, $element, $attrs) {
          var events = config.EVENTS;
          var defaults = $layerAnimate.getDefaults();
          var init = function () {
            if (
              $scope.layer.animate.disappear !== 1 &&
              $scope.layer.animate.disappear !== 0
            ) {
              $scope.layer.animate.disappear = 0;
            }
            $scope.animates = $layerAnimate.list($scope.layer);

            //例如
            var animateType = $scope.layer.animate.type;
            var dirType = $scope.layer.animate.dir;
            for (var i = 0, iLen = $scope.animates.length; i < iLen; i++) {
              if (animateType === "none") {
                $scope.selectAnimateType = animateType;
                break;
              }

              if ($scope.animates[i].config.type === animateType) {
                $scope.selectAnimateType = animateType;
                //判断方向

                $scope.dirs = defaults[animateType].dirs;
                for (var j = 0, jLen = $scope.dirs.length; j < jLen; j++) {
                  if ($scope.dirs[j].type === dirType) {
                    $scope.selectAnimateDir = $scope.dirs[j].type;
                  }
                }
              }
            }
          };

          // layer上点击事件（包括右键菜单）
          var layerClickOff = $scope.$on(
            events.layerClick,
            function ($event, data) {
              switch (data.action) {
                case "chooseLayer":
                  $scope.layer = data.layer;
                  init();
                  break;
              }
            }
          );

          $scope.$on("$destory", function () {
            layerClickOff();
          });

          // init();
          //设置动画类型
          $scope.animateChange = function () {
            if ($scope.selectAnimateType === defaults.none.config.type) {
              $scope.layer.animate = $layerAnimate.getDefaultAnimate(
                defaults.none.config.type
              );
              $scope.dirs = defaults[$scope.selectAnimateType].dirs;
            } else {
              if ($scope.selectAnimateType !== $scope.layer.animate.type) {
                var newAnimate = $layerAnimate.getDefaultAnimate(
                  $scope.selectAnimateType
                );
                newAnimate.duration = $scope.layer.animate.duration;
                newAnimate.delay = $scope.layer.animate.delay;

                $scope.layer.animate = newAnimate;

                $scope.dirs = defaults[$scope.selectAnimateType].dirs;
                var dirType = $scope.layer.animate.dir;
                for (var j = 0, jLen = $scope.dirs.length; j < jLen; j++) {
                  if ($scope.dirs[j].type === dirType) {
                    $scope.selectAnimateDir = $scope.dirs[j].type;
                    break;
                  }
                }
              } else {
              }
            }
          };

          //设置动画方向
          $scope.animateDirChange = function (val) {
            $scope.layer.animate.dir = $scope.selectAnimateDir;
          };

          $scope.animateCounts = [
            {
              name: "1 time",
              val: "1",
            },
            {
              name: "2 times",
              val: "2",
            },
            {
              name: "3 times",
              val: "3",
            },
            {
              name: "4 times",
              val: "4",
            },
            {
              name: "5 times",
              val: "5",
            },
            {
              name: "6 times",
              val: "6",
            },
            {
              name: "7 times",
              val: "7",
            },
            {
              name: "8 times",
              val: "8",
            },
            {
              name: "9 times",
              val: "9",
            },
            {
              name: "10 times",
              val: "10",
            },
            {
              name: "Unlimited",
              val: "infinite",
            },
          ];
        },
      };
    },
  ]);
});
