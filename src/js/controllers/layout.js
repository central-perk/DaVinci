define(["app"], function (app) {
  app.controller("LayoutController", [
    "$scope",
    "$http",
    "$location",
    "$rootScope",
    "$routeParams",
    "$alert",
    "config",
    "$user",
    "$templateCache",
    function (
      $scope,
      $http,
      $location,
      $rootScope,
      $routeParams,
      $alert,
      config,
      $user,
      $templateCache
    ) {
      var events = config.EVENTS,
        flag = $location.search().flag;

      $scope.curHeaderNav = {};

      //获取用户状态
      $scope.getUserStatus = function () {
        $http({
          method: "get",
          url: "/api/user/status",
        }).success(function (data, status, headers) {
          if (data.code === 200) {
            if (
              $rootScope.user &&
              data.msg &&
              data.msg.status &&
              config.USERS.status.initial !== data.msg.status
            ) {
              // $rootScope.user.status === data.msg;
              $(".badge-active-email").remove();
            }
          }
        });
      };

      //获取未读信息个数
      $scope.countUnReadMessages = function (callback) {
        // $http({
        //     method: 'get',
        //     url: '/api/messages/count/unread'
        // }).
        // success(function(data, status, headers, config) {
        //     if (data.code === 200) {
        //         if (callback) {
        //             callback(data.msg);
        //         } else {
        //             $scope.unReadMsgCount = data.msg;
        //         }
        //     } else {
        //         $alert.error(data.msg);
        //     }
        // });
      };

      //TODO 提示验证邮箱
      $scope.directTo = function (url) {
        window.open("http://" + window.location.host + "/" + url, "_blank");
      };

      //验证邮箱
      $scope.validateEmail = function () {
        $http({
          method: "put",
          url: "/api/user/email/validate",
        }).success(function (data, status, headers, config) {
          if (data.code === 200) {
            $alert.success(data.msg);
          } else {
            $alert.error(data.msg);
          }
        });
      };

      //监听－视图加载完毕
      $scope.$on("$viewContentLoaded", function () {
        // $('#loading').fadeOut();
        var pathname = location.pathname,
          $navItem = $('header a[href="' + pathname + '"]');

        $alert.init();
        // if ($('.badge-active-email').data('initial')) {
        //     $scope.getUserStatus();
        // }

        // $('.badge-msg-count').removeClass('hide');

        // if ($("script#bmap").length === 0) {
        //   $("body").append(
        //     '<script id="bmap"  type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=ueX3adPTrQ5Q0daGQYyKe2U0&callback=initialize"></script>'
        //   );
        // }
      });

      //套餐，个人，额初始化
      $user.init();

      //监听－未读消息数量
      $scope.$on(events.countUnReadMessages, function ($event, callback) {
        $scope.countUnReadMessages(callback);
      });

      //监听－全局导航被点击
      $rootScope.$on(events.globalHeaderClick, function ($event, data) {
        if (data && data.route) {
          $scope.curHeaderNav.route = data.route;
        }
      });

      //监听－更新昵称
      $scope.$on(events.userProfileChange, function ($event, data) {
        if (data.action === "updateNickname") {
          $scope.user.nickname = data.nickname;
        } else if (data.action === "updateHead") {
          $scope.user.head = data.form.head;
          $user.setUserHeadImg(data.form.head);
        }
      });

      $scope.dropdown = {
        isopen: false,
      };

      $scope.toRenewalPlan = function () {
        var category = $scope.user.plan.category;
        $location.path("/renewal").search({
          category: category,
          orderType: config.ORDERS.types.planRenewal,
        });
      };

      //跳转
      $scope.toContacts = function () {
        $location.path("/contacts");
      };
      $scope.toAccount = function () {
        $location.path("/account");
      };

      $scope.toGroups = function () {
        $location.path("/groups");
      };

      $scope.initTemplateCache = function () {
        var tplScripts = $('script[type="text/ng-template"]');
        for (var i = 0, len = tplScripts.length; i < len; i++) {
          var $elem = $(tplScripts[i]);
          $templateCache.put($elem.attr("path"), $elem.html());
        }
      };
      $scope.initTemplateCache();
      $scope.countUnReadMessages();

      function check_os() {
        var osType;
        if (navigator.userAgent.toLocaleLowerCase().indexOf("mac") !== -1) {
          osType = "osx";
        } else {
          osType = "os-other";
        }
        $("body").addClass(osType);
      }
      check_os();

      $scope.logout = function ($event) {
        window.location.replace("/api/logout");
        $event.preventDefault();
        $event.stopPropagation();
        return false;
      };
    },
  ]);
});
