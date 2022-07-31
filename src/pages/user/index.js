define([
  "app",
  "pages/user/intro/index",
  "pages/user/flyer/index",
  "pages/user/tpl/index",
  "pages/user/tpl_/index",
  "pages/user/collect/index",
  "pages/user/relation/index",
  "pages/user/follow/index",
  "pages/user/fans/index",
], function (app) {
  app.controller("UserController", [
    "$scope",
    "$rootScope",
    "$state",
    "user",
    function ($scope, $rootScope, $state, user) {
      $scope.user = user;
      if ($state.is("user")) $state.go("user.flyer");
    },
  ]);

  app.config([
    "$stateProvider",
    "$urlRouterProvider",
    "$locationProvider",
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
      $stateProvider
        .state("user", {
          url: "/u/:userID",
          templateUrl: "/pages/user/index.html",
          controller: "UserController",
          pageTitle: "我的主页",
          resolve: {
            user: [
              "UserService",
              "$stateParams",
              function (UserService, $stateParams) {
                var userID = $stateParams.userID;
                return {
                  _id: "62e64a6aca6b39bbe8b8b3f0",
                  nickname: "Ecat",
                  head: "https://wyxcdn.fspage.com/flat-boy-with-vintage-glasses-avatar-vector-illustration.jpg",
                  email: "support@echuandan.com",
                  view: 0,
                  likeCount: 0,
                  followCount: 0,
                  fansCount: 0,
                  flyerCount: 0,
                  newFriendCount: 0,
                  newFansCount: 0,
                };
                // return UserService.getIntro(userID)
                // 		.then(function (data) {
                // 			return data.msg;
                // 		});
              },
            ],
          },
        })
        .state("user.flyer", {
          url: "/flyer",
          templateUrl: "/pages/user/flyer/index.html",
          controller: "UserFlyerController",
          pageTitle: "我的主页",
        })
        .state("user.tpl", {
          url: "/tpl",
          templateUrl: "/pages/user/tpl/index.html",
          controller: "UserTplController",
          pageTitle: "我的主页",
        })
        .state("user.tpl_", {
          url: "/tpl_",
          templateUrl: "/pages/user/tpl_/index.html",
          controller: "UserTpl_Controller",
          pageTitle: "我的主页",
        })
        .state("user.collect", {
          url: "/collect",
          templateUrl: "/pages/user/collect/index.html",
          controller: "UserCollectController",
          pageTitle: "我的主页",
        })
        .state("user.relation", {
          url: "/relation",
          templateUrl: "/pages/user/relation/index.html",
          controller: "UserRelationController",
          pageTitle: "我的主页",
        })
        .state("user.follow", {
          url: "/follow",
          templateUrl: "/pages/user/follow/index.html",
          controller: "UserFollowController",
          pageTitle: "我的主页",
        })
        .state("user.fans", {
          url: "/fans",
          templateUrl: "/pages/user/fans/index.html",
          controller: "UserFansController",
          pageTitle: "我的主页",
        });
    },
  ]);
});
