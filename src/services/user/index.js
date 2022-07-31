define(["app"], function (app) {
  app.service("$user", [
    "$rootScope",
    "$http",
    "$q",
    "config",
    "$utils",
    function ($rootScope, $http, $q, config, $utils) {
      var Profile = {
        init: function () {
          var delay = $q.defer(),
            self = this;
          $rootScope.user = {
            _id: "62e64a6aca6b39bbe8b8b3f0",
            nickname: "Ecat",
            integral: 0,
            head: "https://wyxcdn.fspage.com/flat-boy-with-vintage-glasses-avatar-vector-illustration.jpg",
            headUrl:
              "https://wyxcdn.fspage.com/flat-boy-with-vintage-glasses-avatar-vector-illustration.jpg",
            headCrop: {},
            status: 10,
            email: "support@echuandan.com",
            nopwd: false,
            rmLogoPack: 0,
            dataFlowPack: 0,
            storagePack: 0,
            storage: {
              enable: true,
              space: 132,
            },
            traffic: {
              enable: true,
              space: 0,
            },
            kbn: 10,
            plan: {
              category: 10,
              endTime: "",
              name: "免费版",
            },
          };

          if ($rootScope.user) {
            delay.resolve();
          } else {
            $http({
              method: "get",
              url: "/api/user",
            }).success(function (data, status, headers, config) {
              if (data.code === 200) {
                $rootScope.user = data.msg.user;
                self.setUserHeadImg($rootScope.user.head);
              } else {
                window.location.reload();
              }
            });
          }
          return delay.promise;
        },
        clear: function () {
          $rootScope.user = null;
          $rootScope.plan = null;
        },
        setUserHeadImg: function (val) {
          $("#user-head")
            .attr("src", val + "?imageView2/0/w/40")
            .css("visibility", "visible");
        },
        setUserHead: function (data) {
          $rootScope.user.head = data.head;
          $rootScope.user.headUrl = data.headUrl;
          $rootScope.user.headCrop = data.headCrop;
        },
        get: function (userID) {
          var delay = $q.defer(),
            self = this;
          $http({
            method: "get",
            url: "/api/user/" + userID + "/info",
          }).success(function (data, status, headers, config) {
            if (data.code === 200) {
              delay.resolve(data.msg);
            } else {
              window.location.reload();
            }
          });
        },
        getAmount: function (options) {
          var delay = $q.defer(),
            self = this,
            queryStr = $utils.makeQuery(options);
          $http({
            method: "get",
            url: "/api/user/amount?" + queryStr,
          }).success(function (data, status, headers, config) {
            if (data.code === 200) {
              delay.resolve(data.msg);
            } else {
              window.location.reload();
            }
          });
          return delay.promise;
        },
        _updateCreatFlyerRecord: function (category) {
          $http({
            method: "put",
            url: "/api/user/createFlyerRecord",
            data: {
              category: category,
            },
          }).success(function (data, status, headers, config) {
            if (data.code === 200) {
            } else {
              $alert.error(data.msg);
            }
          });
        },
        updateCreatFlyerRecord: function (category) {
          if (parseInt(category) === config.FLYERS.categorys.static) {
            if (!$rootScope.user.createStaticFlyerRecord) {
              $rootScope.user.createStaticFlyerRecord = true;
              this._updateCreatFlyerRecord(category);
            }
          }
          if (parseInt(category) === config.FLYERS.categorys.interact) {
            if (!$rootScope.user.createInteractFlyerRecord) {
              $rootScope.user.createInteractFlyerRecord = true;
              this._updateCreatFlyerRecord(category);
            }
          }
        },
      };

      return Profile;
    },
  ]);

  //新的做法
  app.factory("UserService", [
    "Restangular",
    "$timeout",
    function (Restangular, $timeout) {
      var baseRoute = Restangular.all("users");

      return {
        listFlyer: function (userID, query) {
          return Restangular.one("users", userID).customGET("flyers", query);
        },
        listTpl: function (userID, query) {
          return Restangular.one("users", userID).customGET("templates", query);
        },
        updatePack: function (userID, data) {
          return baseRoute.one(userID).one("pack").customPUT(data);
        },
        // 关注
        follow: function (userID) {
          return baseRoute.one(userID).one("follow").customPOST();
        },
        // 取消关注，移除粉丝
        unfollow: function (userID) {
          return baseRoute.one(userID).one("unfollow").customDELETE();
        },
        forbidReply: function (userID) {
          return baseRoute.one(userID).one("forbidReply").customPUT();
        },
        allowReply: function (userID) {
          return baseRoute.one(userID).one("allowReply").customPUT();
        },
        chat: function (userID, chat) {
          return Restangular.one("users", userID).post("chats", chat);
        },
        // 用户主页，个人信息
        getIntro: function (userID) {
          return Restangular.one("users", userID).one("home").customGET();
        },
        // 用户中心，获取基本信息
        getInfo: function (userID) {
          return Restangular.one("users", userID).one("info").customGET();
        },
        // 用户中心，更新基本信息
        updateInfo: function (userID, user) {
          return Restangular.one("users", userID).one("info").customPUT(user);
        },
        // 去除新增好友、粉丝标记
        // category 0 - 新增好友， 1  -新增粉丝
        removeNewCount: function (userID, category) {
          return Restangular.one("users", userID).one("newCount").customPUT({
            category: category,
          });
        },
        // 获取手机验证码
        getVcode: function (userID, truetel) {
          return Restangular.one("users", userID)
            .one("truetel")
            .post("verifyCode", {
              truetel: truetel,
            });
        },
        submitVcode: function (userID, data) {
          return Restangular.one("users", userID)
            .one("truetel")
            .one("verify")
            .customPUT(data);
        },
      };
    },
  ]);
});
