define([
  "app",
  "pages/tpl-center/card/index",
  "pages/tpl-center/star/index",
  "services/tpl/index",
], function (app) {
  app.controller("TplCenterController", [
    "$scope",
    "$rootScope",
    "config",
    "$http",
    "$alert",
    "$routeParams",
    "$utils",
    "$tplConfig",
    "$q",
    "TplService",
    function (
      $scope,
      $rootScope,
      config,
      $http,
      $alert,
      $routeParams,
      $utils,
      $tplConfig,
      $q,
      TplService
    ) {
      var events = config.EVENTS;

      $scope.query = {
        page: 1,
      };
      $scope.getTags = function () {
        var kbn = $rootScope.user.kbn;
        if (kbn === 10 || kbn === 0) {
          return config.TEMPLATES.tags;
        } else if (kbn === 1) {
          return [config.TEMPLATES.tags[3], config.TEMPLATES.tags[4]];
        }
      };

      $scope.init = function () {
        var kbn = $rootScope.user.kbn;
        $scope.$emit(events.globalHeaderClick, {
          route: "tpl-center",
        });
        $scope.tags = $scope.getTags();

        $scope.filters = [
          {
            label: "排除已购买",
            key: "withoutBuyout",
          },
          // {
          // 	label: '获赞最多的',
          // 	key: 'upvote'
          // },
          {
            label: "浏览最多的",
            key: "view",
          },
          //  {
          // 	label: '收藏最多的',
          // 	key: 'collect'
          // }, {
          // 	label: '评级最高的',
          // 	key: 'star'
          // }
        ];

        $scope.sorts = [
          {
            label: "价格由高至低",
            key: "priceDesc",
          },
          {
            label: "价格由低至高",
            key: "priceAsc",
          },
          {
            label: "按时间正序",
            key: "createdTimeAsc",
          },
          {
            label: "按时间倒序",
            key: "createdTimeDesc",
          },
        ];

        if (kbn === 0) {
          $scope.listByTag(config.TEMPLATES.tags[0]);
        } else if (kbn === 10 || kbn === 1 || !kbn) {
          $scope.listTpl();
        }
      };

      $scope.listTpl = function () {
        if ($scope.nextPage) {
          $scope.loading = true;
        }
        $http({
          method: "get",
          url: "/api/templates",
          params: $scope.query,
        }).success(function (data) {
          if (data.code === 200) {
            $scope.loading = false;
            var tpls = data.msg.templates || [];
            $scope.tpls = $scope.tpls || [];
            $scope.tpls = $scope.tpls.concat(tpls);
            $scope.next = data.msg.next;
            $scope.count = data.msg.count;
            $scope.nextPage = data.msg.nextPage;
          }
        });
      };

      // 按类型查询
      $scope.listByTag = function (tag) {
        $scope.activeTag = tag;
        $scope.query.tags = tag.tag;
        $scope.listTplByQuery();
      };

      // 筛选
      $scope.listByFilter = function (filter) {
        $scope.activeFilter = filter;
        $scope.query.filter = filter.key;
        $scope.listTplByQuery();
      };

      // 排序
      $scope.listBySort = function (sort) {
        $scope.activeSort = sort;
        $scope.query.sort = sort.key;
        $scope.listTplByQuery();
      };

      // 取消行业
      $scope.cancelTag = function () {
        delete $scope.activeTag;
        delete $scope.query.tags;
        $scope.listTplByQuery();
      };

      // 取消筛选
      $scope.cancelFilter = function () {
        delete $scope.activeFilter;
        delete $scope.query.filter;
        $scope.listTplByQuery();
      };

      // 取消排序
      $scope.cancelSort = function () {
        delete $scope.activeSort;
        delete $scope.query.sort;
        $scope.listTplByQuery();
      };

      $scope.listTplByQuery = function () {
        delete $scope.query.title;
        $scope.query.page = 1;
        $scope.tpls = [];
        $scope.listTpl();
      };

      // 按标题搜索
      $scope.listByTitle = function () {
        delete $scope.query.tags;
        delete $scope.query.filter;
        delete $scope.query.sort;
        $scope.query.page = 1;
        $scope.tpls = [];
        $scope.listTpl();
      };

      $scope.nextTpl = function () {
        $scope.query.page = $scope.nextPage;
        $scope.listTpl();
      };

      // 搜索框按条件 fixed
      $scope.searchAreaFixed = function () {
        var $searchArea = $(".tpl-center .search-area");
        $searchArea.scrollToFixed({
          limit: $("body").offset().top,
          zIndex: 100,
        });

        // scope 销毁场景，要对 dom 或 bom 元素的事件解绑
        $scope.$on("$destroy", function () {
          $(window).off("scroll");
          $searchArea.unbind();
        });
      };

      $scope.createTpl = function () {
        $tplConfig.show({
          confirmBtn: {
            label: "创建",
          },
          action: "create",
        });
      };
    },
  ]);
});
