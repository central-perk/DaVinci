//!TODO 移除 design 相关逻辑
define([
  "app",
  "modules/flyer-interact-editor/edit-area/bg/animate/index",
], function (app) {
  app.directive("fiEditBg", [
    "config",
    "$rootScope",
    function (config, $rootScope) {
      return {
        restrict: "E",
        templateUrl: "/modules/flyer-interact-editor/edit-area/bg/index.html",
        scope: {
          page: "=ngModel",
        },
        link: function ($scope, $element, $attrs) {
          $scope.PICSIZE = config.PICSIZE.interact;
          var events = config.EVENTS,
            bg = $scope.page.bg,
            tabsDic = {
              theme: {
                name: "主题",
                type: "theme",
              },
              custom: {
                name: "定制",
                type: "custom",
              },
            };
          if (bg.customSwitch) {
            $scope.curType = tabsDic.custom.type;
          } else {
            $scope.curType = tabsDic.theme.type;
          }
          $scope.tabs = [
            {
              name: tabsDic.theme.name,
              type: tabsDic.theme.type,
            },
            {
              name: tabsDic.custom.name,
              type: tabsDic.custom.type,
            },
          ];
          $scope.changeBg = function () {
            $rootScope.$broadcast(events.pageBgClick, {
              page: $scope.page,
              action: "changeBg",
            });
          };
          $scope.save = function () {
            $scope.$emit(events.pageEditorClick, {
              action: "savePage",
              page: $scope.page,
            });
          };
          $scope.rmBg = function ($event) {
            $rootScope.$broadcast(events.pageBgClick, {
              page: $scope.page,
              action: "removeBg",
            });
          };
          $scope.setCurType = function (_curType) {
            if (_curType === tabsDic.theme.type) {
              //若是设置主题,当前页面自定义图片应禁用
              $scope.page.bg.customSwitch = false;
            } else {
              $scope.page.bg.customSwitch = true;
            }
            $scope.curType = _curType;
          };

          //页面效果
          $scope.pageTransitions = [
            {
              label: "zoom",
              value: "scale",
            },
            {
              label: "Cube",
              value: "cube",
            },
            {
              label: "Slide",
              value: "move",
            },
            {
              label: "Fade in",
              value: "fade",
            },
            {
              label: "advance",
              value: "push",
            },
            {
              label: "flip",
              value: "flip",
            },
            {
              label: "drop",
              value: "fall",
            },
            {
              label: "Rotate",
              value: "rotate",
            },
            {
              label: "Carousel",
              value: "carousel",
            },
          ];
        },
      };
    },
  ]);
});
