define(["app"], function (app) {
  app.directive("fiEditStyleCustomSlider", [
    "config",
    "$rootScope",
    function (config, $rootScope) {
      var fiPageCustomeBasePath = "/components/custome";
      return {
        restrict: "E",
        templateUrl: "/components/custome/slider/style/index.html",
        scope: {
          layer: "=ngModel",
        },
        link: function ($scope, $element, $attrs) {
          var layer = $scope.layer;
          var addFixed = false;
          $scope.borderStyles = [
            {
              key: "none",
              value: "none",
            },
            {
              value: "solid",
            },
            {
              value: "dashed",
            },
            {
              value: "dotted",
            },
            {
              value: "double",
            },
          ];

          if (
            layer.content.style.borderStyle === "none" &&
            layer.content.style.borderWidth === 0
          ) {
            addFixed = true;
          }

          $scope.$watch("layer.content.style.borderStyle", function (newVal) {
            if (newVal) {
              if (newVal !== "none" && addFixed) {
                $scope.layer.content.style.borderColor = "#eee";
                $scope.layer.content.style.borderWidth = 2;
              } else if (newVal === "none") {
                $scope.layer.content.style.borderColor = "";
                $scope.layer.content.style.borderWidth = 0;
              }
            }
          });
        },
      };
    },
  ]);
});
