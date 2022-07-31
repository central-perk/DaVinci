define(["app"], function (app) {
  app.run([
    "$rootScope",
    "$state",
    "$stateParams",
    "$utils",
    "$modalStack",
    function ($rootScope, $state, $stateParams, $utils, $modalStack) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.isAuthor = $utils.isAuthor;

      $rootScope.$on(
        "$stateChangeStart",
        function (event, toState, toParams, fromState, fromParams) {
          $modalStack.dismissAll();
          if (
            toState.name.indexOf("account") === 0 ||
            toState.name === "data"
          ) {
            $("body").css("background-color", "#F0F0F0");
          } else {
            $("body").css("background-color", "");
          }
          $("#loading").show();
        }
      );
      $rootScope.$on(
        "$stateChangeSuccess",
        function (event, toState, toParams, fromState, fromParams) {
          $("#loading").hide();
        }
      );
    },
  ]);

  // app.config(['$httpProvider',
  //     function($httpProvider) {
  //         // reponse拦截器，判断session过期等场景
  //         var interceptor = ['$q', '$rootScope', '$alert',
  //             function($q, $rootScope, $alert) {
  //                 return {
  //                     response: function(resp) {
  //                         //截获所有reponse，在登陆超时时，回到首页
  //                         if (resp && resp.data && resp.data.code === 401) {
  //                             $(window).unbind('beforeunload');
  //                             return window.open('/', '_self');
  //                         }
  //                         return resp;
  //                     },
  //                     responseError: function(rejection) {
  //                         if (rejection.status === 0) {
  //                             $alert.error('请求失败,请检查您的网络环境');
  //                             return;
  //                         }
  //                         return $q.reject(rejection);
  //                     }
  //                 };
  //             }
  //         ];
  //         $httpProvider.interceptors.push(interceptor);
  //     }
  // ]);

  // growl
  app.config([
    "growlProvider",
    function (growlProvider) {
      growlProvider.globalTimeToLive(3000);
      growlProvider.onlyUniqueMessages(false);
      growlProvider.globalEnableHtml(true);
    },
  ]);

  // Restangular
  app.config([
    "RestangularProvider",
    function (RestangularProvider) {
      RestangularProvider.setBaseUrl("/api");
    },
  ]);
});
