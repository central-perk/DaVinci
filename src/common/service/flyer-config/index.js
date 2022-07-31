define(["app"], function (app) {
  app.service("$flyerConfig", [
    "$modalService",
    function ($modalService) {
      this.show = function (option) {
        var defaultOption = {
          title: "Work Setting",
          width: 700,
          height: 460,
          templateUrl: "/common/service/flyer-config/index.html",
          windowClass: "flyer-config rect-modal",
          confirmBtn: {
            label: "Save",
          },
          hideTitleEdit: false,
          hideDescEdit: false,
          hidePermissionEdit: false,
        };
        option = _.merge(defaultOption, option);
        option.controller = [
          "config",
          "$scope",
          "$rootScope",
          "$modalInstance",
          "$http",
          "$imageManage",
          "$affirm",
          "$alert",
          "FlyerService",
          function (
            config,
            $scope,
            $rootScope,
            $modalInstance,
            $http,
            $imageManage,
            $affirm,
            $alert,
            FlyerService
          ) {
            $scope.tags = config.TEMPLATES.tags;
            $scope.transfers = [
              {
                label: "Horizontal",
                key: "horizontal",
              },
              {
                label: "Vertical",
                key: "vertical",
              },
            ];
            $scope.title = option.title;
            $scope.confirmBtn = option.confirmBtn;
            $scope.flyer = option.flyer || {};
            $scope.flyer.transferMode =
              $scope.flyer.transferMode || $scope.transfers[1].key;
            $scope.flyer.tags = $scope.tags[0].tag;
            $scope.flyer.logo = $scope.tags[0].url;

            $scope.flyer.title = "Please start your creative journey";

            $scope.FPMS = config.FLYERS.setting.permissions;
            $scope.user = $rootScope.user;
            $scope.hideTitleEdit = option.hideTitleEdit;
            $scope.hideDescEdit = option.hideDescEdit;
            $scope.hidePermissionEdit = option.hidePermissionEdit;
            $scope.curWindow = "info";
            $scope.compressSuffix = "";
            var startRmLogo = $scope.flyer.rmLogo;
            var endRmLogo = false;

            // replace cover
            $scope.replaceLogo = function () {
              $imageManage
                .init(null, {
                  title: "Replace Cover",
                  ratio: 1,
                  disableDynamic: true,
                  disableMulti: true,
                })
                .then(function (imagePacks) {
                  $scope.flyer.logoCustomValue = imagePacks[0].cropUrl;
                  $scope.flyer.logo = imagePacks[0].cropUrl;
                });
            };
            // select default cover
            $scope.selectLogo = function () {
              delete $scope.flyer.logoCustomValue;
            };
            // switch to remove copyright page
            $scope.goInfo = function () {
              $scope.$$childTail.curWindow = "info";
            };
            // switch to remove copyright page
            $scope.goCopyright = function () {
              $scope.$$childTail.curWindow = "copyright";
            };
            // Switch to the purchase copyright package page
            $scope.goBuy = function () {
              $scope.pack = {
                name: "rmLogo",
                unit: "money",
              };
              $scope.costs = $scope.getCosts($scope.pack);
              $scope.chooseCost($scope.costs[0]);
              $scope.$$childTail.curWindow = "buy";
            };
            $scope.goExchange = function () {
              $scope.pack = {
                name: "rmLogo",
                unit: "integral",
              };
              $scope.costs = $scope.getCosts($scope.pack);
              $scope.chooseCost($scope.costs[0]);
              $scope.$$childTail.curWindow = "exchange";
            };
            $scope.chooseCost = function (cost) {
              var curCost = _.find($scope.costs, {
                active: true,
              });
              if (curCost) curCost.active = false;
              $scope.cost = _.find($scope.costs, cost);
              $scope.cost.active = true;
              // $scope.wechatPaySetting = {
              // 	price: $scope.cost.price,
              // 	subject: $scope.cost.name,
              // 	unit: $scope.pack.unit,
              // 	pack: $scope.pack.name,
              // 	category: $scope.cost.category
              // };
            };
            $scope.doPay = function () {
              document.getElementById("payForm").submit();
            };
            $scope.doExchange = function () {
              $http({
                method: "post",
                url: "/api/service-pack/exchange",
                data: {
                  category: $scope.cost.category,
                  pack: $scope.pack.name,
                  unit: $scope.pack.unit,
                },
              }).success(function (data) {
                if (data.code === 200) {
                  $scope.user.integral = data.msg.integral;
                  $scope.user.rmLogoPack = data.msg.rmLogoPack;
                  $scope.goCopyright();
                } else {
                  $alert.error(data.msg);
                }
              });
            };
            $scope.getCosts = function (option) {
              return config.SERVICE_PACK.rmLogo[option.unit].costs;
            };
            // use the copyright-free package
            $scope.usePack = function ($event) {
              $affirm
                .show({
                  msg: "Are you sure to use a copyright package to remove the copyright information on the last page?",
                  height: 140,
                })
                .then(function () {
                  $scope.flyer.rmLogo = true;
                });
              $event.preventDefault();
              $event.stopPropagation();
              return false;
            };

            $scope.save = function () {
              endRmLogo = $scope.flyer.rmLogo;
              if (option.action === "update") {
                return FlyerService.updateSetting(
                  $scope.flyer._id,
                  $scope.flyer
                ).then(function (data) {
                  if (data.code === 200) {
                    if (!startRmLogo && endRmLogo) {
                      $rootScope.user.rmLogoPack -= 1;
                    }
                    $alert.success("Save successfully");
                    $modalInstance.close($scope.flyer);
                  } else {
                    $alert.error(data.msg);
                  }
                });
              } else if (option.action === "create") {
                if ($scope.flyer._id) {
                  // flyer := tpl
                  $scope.flyer.template = $scope.flyer._id;
                }
                return FlyerService.create($scope.flyer).then(function (data) {
                  if (data.code === 200) {
                    if (!startRmLogo && endRmLogo) {
                      $rootScope.user.rmLogoPack -= 1;
                    }
                    window.location.pathname = "/fi/" + data.msg + "/edit";
                  } else {
                    $alert.error(data.msg);
                  }
                });
              } else {
                alert("no action found!");
              }
            };

            $scope.close = function () {
              $modalInstance.dismiss();
            };
          },
        ];
        return $modalService.show(option);
      };
    },
  ]);
});
