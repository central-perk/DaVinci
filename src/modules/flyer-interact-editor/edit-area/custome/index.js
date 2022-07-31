define(["app"], function (app) {
  app.directive("fiEditAreaCustome", [
    "config",
    "$rootScope",
    "$layerClipboard",
    "$layerFactory",
    "$layerManage",
    function (
      config,
      $rootScope,
      $layerClipboard,
      $layerFactory,
      $layerManage
    ) {
      return {
        restrict: "E",
        templateUrl:
          "/modules/flyer-interact-editor/edit-area/custome/index.html",
        replace: true,
        link: function ($scope, $ele, $attrs) {
          var events = config.EVENTS;
          $scope.tabs1 = [
            {
              label: "Content",
              key: "content",
            },
            {
              label: "Style",
              key: "style",
            },
            {
              label: "Arrange",
              key: "arrange",
            },
            {
              label: "Animation",
              key: "animate",
            },
          ];
          //切换页面编辑器页签
          var _onTabChange = function (tab) {
            if (tab) {
              if (
                tab.key === "effect" &&
                $scope.page &&
                $scope.page.effect.enable
              ) {
                $scope.page.effect = $scope.page.effect || {};
                $scope.$emit(events.pageEditorClick, {
                  action: "editEffect",
                });
              } else {
                $scope.$emit(events.pageEditorClick, {
                  action: "notEditEffect",
                });
              }
            }
          };

          var pgThumbClickOff = $scope.$on(
            events.pgThumbClick,
            function (event, data) {
              if (data.action === "edit") {
                if (data.page !== $scope.page.id) {
                  if ($scope.activeTab2.key === "effect") {
                    setTimeout(function () {
                      $scope.$apply(function () {
                        _onTabChange($scope.activeTab2);
                      });
                    }, 10);
                  }
                }
              }
            }
          );

          // 预制各类型layer的默认显示页签
          var tab1Cache = {
            // layerType: tabIndex
            1: 0,
            2: 0,
          };

          //切换页面编辑器页签
          $scope.changeTab1 = function ($index, remember) {
            if ($index !== null) {
              //这儿报错了$index undefined
              $index = $index || 0;
              $scope.activeTab1 = $scope.tabs1[$index];
              $scope.tabs1[$index].active = true;
              // 缓存当前layer类型的tab
              if ($scope.$parent.layer && remember) {
                tab1Cache[$scope.$parent.layer.type] = $index;
              }
            }
          };

          $scope.changeTab1(0);

          /**
           * 背景，特效，图层
           */

          $scope.tabs2 = [
            {
              label: "Background",
              key: "bg",
            },
            {
              label: "Effect",
              key: "effect",
            },
            {
              label: "Layer",
              key: "layer",
            },
          ];

          //切换页面编辑器页签
          $scope.changeTab2 = function (tab) {
            if (tab) {
              $scope.activeTab2 = tab;
              $scope.activeTab2.active = true;
              _onTabChange(tab);
            }
          };
          $scope.changeTab2($scope.tabs2[0]);

          $scope.tabStyle = function (tabs) {
            return {
              width: (1 / tabs.length) * 100 + "%",
            };
          };

          $scope.isText = $layerManage.isText;
          $scope.isImage = $layerManage.isImage;
          $scope.isIbox = $layerManage.isIbox;
          $scope.isMap = $layerManage.isMap;
          $scope.isVideo = $layerManage.isVideo;
          $scope.isSlider = $layerManage.isSlider;
          $scope.isShape = $layerManage.isShape;
          var layerClickOff = $scope.$on(
            events.layerClick,
            function ($event, data) {
              switch (data.action) {
                case "chooseLayer":
                  if ($scope.isText($scope.layer)) {
                    $scope.tabs1[0].label = "Text";
                  }
                  if ($scope.isImage($scope.layer)) {
                    $scope.tabs1[0].label = "Image";
                  }
                  if ($scope.isIbox($scope.layer)) {
                    $scope.tabs1[0].label = "Input Box";
                  }
                  if ($scope.isMap($scope.layer)) {
                    $scope.tabs1[0].label = "Map";
                  }
                  if ($scope.isVideo($scope.layer)) {
                    $scope.tabs1[0].label = "Video";
                  }
                  if ($scope.isSlider($scope.layer)) {
                    $scope.tabs1[0].label = "Slides";
                  }
                  if ($scope.isShape($scope.layer)) {
                    $scope.tabs1[0].label = "Shape";
                  }

                  // Create a new layer and set the content tab to the active state
                  if (data.init) {
                    $scope.changeTab1(0);
                  } else {
                    $scope.changeTab1(tab1Cache[data.layer.type], true);
                  }
                  break;
              }
            }
          );

          var bgClickOff = $scope.$on(
            events.pageBgClick,
            function ($event, data) {
              if (data) {
                if (data.action === "chooseBg") {
                  // 新建页面，背景页签置成激活状态
                  if (data.init) {
                    $scope.tabs2[0].active = true;
                  }
                }
              }
            }
          );

          $scope.$on("$destory", function () {
            layerClickOff();
            bgClickOff();
          });
          $scope.$watch(
            "page.effect",
            function () {
              _onTabChange($scope.activeTab2);
            },
            true
          );
        },
      };
    },
  ]);
});
