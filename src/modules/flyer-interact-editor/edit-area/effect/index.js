define(["app"], function (app) {
  app.directive("fiEditEffect", [
    "config",
    "$validator",
    "$rootScope",
    function (config, $validator, $design, $rootScope) {
      return {
        restrict: "E",
        templateUrl:
          "/modules/flyer-interact-editor/edit-area/effect/index.html",
        scope: {
          page: "=ngModel",
        },
        link: function ($scope, $element, $attrs) {
          var interactCptsConfig =
              config.CPTS[config.FLYERS.categorys.interact],
            events = config.EVENTS;
          $scope.navs = [
            {
              name: "none",
              label: "none",
            },
            {
              name: interactCptsConfig.mask._t,
              label: interactCptsConfig.mask.name,
            },
            {
              name: interactCptsConfig.fpscan._t,
              label: interactCptsConfig.fpscan.name,
            },
          ];

          var init = function () {
            if ($scope.page.effect) {
              if ($scope.page.effect.enable && $scope.page.effect.name) {
                for (var i = 0; i < $scope.navs.length; i++) {
                  if ($scope.navs[i].name === $scope.page.effect.name) {
                    $scope.activeNav = $scope.navs[i];
                  }
                }
              } else {
                $scope.activeNav = $scope.navs[0];
              }
            } else {
              $scope.activeNav = $scope.navs[0];
            }
          };
          init();

          $scope.setActiveNav = function (nav) {
            $scope.activeNav = nav;

            if (nav.name === "none") {
              $scope.disableEffect();
              return;
            }
            $scope.page.effect.name = nav.name;
            $scope.enableEffect();
            // $scope.editors = [{}];
          };
          $scope.$watch(
            "page.id",
            function (newVal, olaVal) {
              if (newVal && olaVal) {
                init();
              }
            },
            true
          );
          $scope.disableEffect = function () {
            $scope.page.effect = $scope.page.effect || {};
            $scope.page.effect.enable = false;
          };

          $scope.enableEffect = function () {
            $scope.page.effect = $scope.page.effect || {};
            $scope.page.effect.enable = true;
          };
        },
      };
    },
  ]);
});
