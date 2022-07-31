/**
 * 交互作品-动画-背景设置
 *
 */
define(["app"], function (app) {
  //交互作品页面缩略图
  app.directive("fiEditBgAnimate", [
    "config",
    "$validator",
    function factory(config, $validator) {
      var directive = {
        restrict: "E",
        templateUrl:
          "/modules/flyer-interact-editor/edit-area/bg/animate/index.html",
        link: function ($scope, $element, $attrs) {
          var events = config.EVENTS;

          $scope.$validator = $validator;
          var commonSubRadios = [
            {
              type: "origin",
              name: "Origin",
            },
            {
              type: "horizontal",
              name: "Horizontal",
            },
            {
              type: "vertical",
              name: "Vertical",
            },
          ];
          $scope.bgAnimateEffects = [
            {
              type: "none",
              name: "none",
              commonSubRadios: [],
            },
            {
              type: "stretch",
              name: "Stretch",
              radios: commonSubRadios,
            },
            {
              type: "slide",
              name: "Slide",
              radios: [
                {
                  type: "horizontal",
                  name: "Horizontal",
                },
                {
                  type: "vertical",
                  name: "Vertical",
                },
              ],
            },
          ];
          $scope.changeType = function (type) {
            $scope.page.bg.animate = $scope.page.bg.animate || {};
            $scope.page.bg.animate.type = type;
            if (type === "none") {
              $scope.page.bg.animate.switch = false;
            } else {
              $scope.page.bg.animate.switch = true;
            }
          };

          if (!$scope.page.bg.animate) {
            $scope.page.bg.animate = $scope.page.bg.animate || {};
            $scope.page.bg.animate.type = "none";
          }
        },
      };
      return directive;
    },
  ]);
});
