/**
 *  交互作品设计器
 *  监听 - 主题，背景，色彩，文字选择器被hover
 *  监听 - 缩略图主键加号被点击
 *  监听 - 作品改变
 *  监听 - 设计器发生变化
 *  监听 - 页面变化
 *  监听 - 页面编辑区域的点击
 *  监听 - 缩略图被点击
 *  监听 - 缩略图主键加号被点击
 *  监听 - 数据发生验证通过或不通过
 *
 */
define([
  "app",
  "services/pg-data/index",
  "services/pg-add/index",
  "services/pg-template-add/index",
  "services/pg-template/index",
  "services/image-manage/index",
  "modules/pg-thumb/index",
  "modules/pg-vessel/index",
  "components/effect/base/index",
  "components/effect/mask/index",
  "components/effect/fpscan/index",
  "components/custome/base/index",
  "components/custome/bg/index",
  "modules/layer-container/index",
  "modules/flex-carousel/index",
  "modules/flyer-interact-editor/upgrade/index",
  "modules/flyer-interact-editor/top-bar/index",
  "modules/flyer-interact-editor/edit-area/index",
  "modules/flyer-interact-editor/nav-area/index",
  "modules/flyer-interact-editor/display-area/index",
  "modules/flyer-interact-editor/nav-area/pg-add-custom/index",
  "modules/flyer-interact-editor/edit-hotkey/index",
  "services/layer-clipboard/index",
  "services/layer-factory/index",
  "services/layer-manage/index",
  "services/layer-animate/index",
  "services/pg-manage/index",
], function (app) {
  window.__DVC.env = "dt";
  app
    .directive("flyerInteractEditor", [
      "config",
      function (config) {
        var events = config.EVENTS;
        return {
          restrict: "E",
          templateUrl: "/modules/flyer-interact-editor/index.html",
          replace: true,
        };
      },
    ])
    .controller("flyerInteractEditorController", [
      "$scope",
      "$editHotkey",
      "$rootScope",
      "config",
      "$http",
      "$routeParams",
      "$alert",
      "$window",
      "$utils",
      "$q",
      "$pgData",
      "$validator",
      "$pgAdd",
      "$loading",
      "$flyer",
      "$pgAddCustom",
      "$pgManage",
      "$layerManage",
      "FlyerService",
      "TplService",
      "$location",
      "$flyerUpgrade",
      function (
        $scope,
        $editHotkey,
        $rootScope,
        config,
        $http,
        $routeParams,
        $alert,
        $window,
        $utils,
        $q,
        $pgData,
        $validator,
        $pgAdd,
        $loading,
        $flyer,
        $pgAddCustom,
        $pgManage,
        $layerManage,
        FlyerService,
        TplService,
        $location,
        $flyerUpgrade
      ) {
        var events = config.EVENTS;
        var flyerID;
        var appID = $location.search().appID;
        if (appID) {
          $rootScope.user = $rootScope.user || {};
          $rootScope.user.isPartnerUser = true;
        }
        var flyersPageRoute = "/u/" + $rootScope.user._id;
        //保存单个页面
        $scope.savePage = function (options) {
          var page = options.page,
            data;
          //fix无pageid情况
          if (!page.id) {
            page = $pgData.installID(page);
          }
          data = {
            page: page,
          };

          FlyerService.savePage(flyerID, page.id, data).then(function (data) {
            if (data.code === 200) {
              page._es = config.PAGES.editState.initial;
            } else {
              $alert.error(data.msg);
            }
          });
        };

        $scope.uniquePageID = function (page) {
          var pages = $scope.flyer.content;
          for (var i = 0; i < pages.length; i++) {
            if (pages[i].id === page.id) {
              page.id = "page-" + $utils.createToken();
              $scope.uniquePageID(page);
            }
          }
        };

        // 创建单个页面
        // 应该将这个逻辑放到nav-area中
        $scope.createPage = function (options) {
          var page = options.page,
            newPageIndex = options.newPageIndex;
          //验证pageID
          $scope.uniquePageID(page);
          $scope.apiCreatePage({
            page: page,
            newPageIndex: newPageIndex,
          });
        };
        $scope.apiCreatePage = function (options) {
          FlyerService.createPage(flyerID, options).then(function (data) {
            if (data.code === 200) {
              var page = options.page;

              if (options.newPageIndex) {
                $scope.flyer.content.splice(options.newPageIndex, 0, page);
              } else {
                $scope.flyer.content.push(page);
              }
              //创建成功，更新curPageID
              $scope.flyer.curPageID = page.id;
              $pgManage.setNewPageID(page.id);
              $pgData.setPages($scope.flyer.content);
            } else {
              $alert.error(data.msg);
            }
          });
        };

        //更新页面其他元素id
        $scope.newPageIDs = function (page) {
          for (var key in page.ids) {
            page.ids[key] = page.id + "-" + key;
          }
        };

        //复制单个页面
        $scope.copyPage = function (options) {
          var newPageIndex =
              _.findIndex($scope.flyer.content, {
                id: options.page.id,
              }) + 1,
            page = angular.copy(options.page);

          //验证pageID
          $scope.uniquePageID(page);
          if (page.kind === "custome") {
            page = $layerManage.initLayerPageID(page);
          }
          $scope.newPageIDs(page);

          FlyerService.createPage(flyerID, {
            page: page,
            newPageIndex: newPageIndex,
          }).then(function (data) {
            if (data.code === 200) {
              $scope.flyer.content.splice(newPageIndex, 0, page);
              $scope.flyer.curPageID = page.id;
              $pgData.setPages($scope.flyer.content);
            } else {
              $alert.error(data.msg);
            }
          });
        };

        //删除单个页面
        $scope.removePage = function (options) {
          var index = options.index,
            targetPageID = $scope.flyer.content[index].id;

          FlyerService.removePage(flyerID, targetPageID).then(function (data) {
            if (data.code === 200) {
              $scope.flyer.content.splice(index, 1);
              var curPageIndex = index - 1;
              if (curPageIndex < 0) {
                curPageIndex = 0;
              }
              var curPage = $scope.flyer.content[curPageIndex];
              //初始化当前layer
              $layerManage.init(curPage);
              $scope.$emit(events.pgThumbClick, {
                action: "edit",
                page: curPage,
                pageNum: curPageIndex + 1,
              });
              //删除页面，若当前页也是被选中页，更新curPageID
              if ($scope.curPageID === targetPageID) {
                $scope.curPageID = $scope.flyer.content[curPageIndex].id;
              }
              $pgData.setPages($scope.flyer.content);
            } else {
              $alert.error(data.msg);
            }
          });
        };
        //初始化设计器
        $scope.init = function () {
          if (!$scope.flyer) {
            return;
          }
          flyerID = $scope.flyer._id;

          $flyerUpgrade.v1($scope.flyer).then(function (argument) {
            var pages = $scope.flyer.content;

            //找到当前页面索引
            $scope.curPageIndex = _.findIndex($scope.flyer.content, {
              id: $scope.flyer.curPageID,
            });

            $pgData.init({
              flyer: $scope.flyer,
            });
            $pgAddCustom.initTemplates();

            //paData服务 加载pages
            $pgData.setPages(pages);
            //初始化页面拖拽
            $scope.initSortable();
            //关闭窗口提示
            $scope.initWindowCloseHelp();
            //监听当前页面变化
            $scope.watchCurPageID();
          });
        };

        //监听当前页面变化
        $scope.watchCurPageID = function () {
          $scope.$watch("flyer.curPageID", function (newVal) {
            $pgManage.setCurPageID(newVal);
          });
        };

        //初始化页面拖拽
        $scope.initSortable = function () {
          //拖拽
          $scope.sortableOptions = {
            stop: function (e, ui) {
              var pageID =
                $(e.toElement).find(".page").attr("id") ||
                $(e.toElement).parent().parent().attr("id");
              //此处有问题，选中
              if (pageID !== $scope.flyer.curPageID) {
                var page = $scope.getPageByID(pageID);
                if (!page) return;
                $rootScope.$broadcast(events.pgThumbClick, {
                  action: "edit",
                  page: page,
                });
              }
            },
          };
        };

        //关闭窗口提示
        $scope.initWindowCloseHelp = function (argument) {
          $(window).on("beforeunload", function (e) {
            if (window.navigator.userAgent.indexOf("Chrome") !== -1) {
              return "正在编辑作品";
            }
            if (e && e.preventDefault) {
              e.preventDefault();
            } else {
              window.event.returnValue = "";
            }
          });
        };
        $scope.getPageByID = function (pageID) {
          for (var i = 0; i < $scope.flyer.content.length; i++) {
            if ($scope.flyer.content[i].id === pageID) {
              return $scope.flyer.content[i];
            }
          }
        };

        //更新pageID
        $scope.selectPage = function (options) {
          // FlyerService.selectPage(flyerID, options.pageID).then(function (
          //   data
          // ) {
          //   if (data.code === 200) {
          //   } else {
          //     $alert.error(data.msg);
          //   }
          // });
        };
        //添加页面
        $scope.toAddPage = function ($event) {
          $pgAdd.show(function (data) {
            $scope.createPage({
              page: data.page,
              newPageIndex: $scope.flyer.content.length,
              flyerID: $scope.flyer._id,
            });
            $scope.flyer.curPageID = data.page.id;
          });
          $event.stopPropagation();
          return false;
        };
        // 保存作品
        $scope.update = function (_options) {
          var options = _options || {};
          var delay = $q.defer();
          //数据格式有错误时，清空保存回调
          var flyer = $scope.flyer,
            sortIDs = $scope.getSortPageIDs(flyer.content),
            pages;
          if ($scope.flyer.tplsEmpty) {
            pages = flyer.content;
          } else {
            pages = $scope.getChangedPages(flyer.content);
          }

          $scope
            .apiUpdate({
              form: {
                category: flyer.category,
                curPageID: flyer.curPageID,
                pages: pages,
                title: flyer.title,
                titleEdited: flyer.titleEdited,
                sortIDs: sortIDs,
                publish: options.publish,
              },
            })
            .then(
              function (result) {
                $scope.flyer.tplsEmpty = false;
                $scope.flyer = _.merge($scope.flyer, result);
                //第一次通过复制或模版创建
                $alert.success("保存成功");
                if ($scope.flyer.status === config.FLYERS.status.published) {
                  $flyer.setVal("status", config.FLYERS.status.updated);
                }

                $scope.$broadcast(events.flyerChange, {
                  action: "update",
                  flyerID: $scope.flyer._id,
                });
                $scope.afterUpateInteractFlyer();
                delay.resolve();
              },
              function () {
                delay.reject();
              }
            );

          return delay.promise;
        };

        $scope.apiUpdate = function (options) {
          var delay = $q.defer();
          FlyerService.update(flyerID, options.form).then(function (data) {
            if (data.code === 200) {
              delay.resolve(data.msg);
            } else {
              if (data.code === 1517 || data.code === 1518) {
                $scope.lackAmountWarning($scope.flyer.category);
              } else {
                $alert.error(data.msg);
              }
            }
          });
          return delay.promise;
        };
        //保存交互后处理页面状态
        $scope.afterUpateInteractFlyer = function () {
          var _pages = $scope.flyer.content;
          for (var i = 0; i < _pages.length; i++) {
            if (_pages[i]) {
              if (_pages[i]._es !== config.PAGES.editState.intial) {
                _pages[i]._es = config.PAGES.editState.intial;
              }
            }
          }
        };
        //获取发生变化的页面列表
        $scope.getChangedPages = function (_pages) {
          var pages = [];
          for (var i = 0; i < _pages.length; i++) {
            if (_pages[i]) {
              if (_pages[i]._es === config.PAGES.editState.change) {
                pages.push(_pages[i]);
              }
              if (_pages[i].kind === "std" || !_pages[i].kind) {
                pages.push(_pages[i]);
              }
            }
          }
          return angular.copy(pages);
        };

        // 发布
        $scope.publish = function (options) {
          return $alert.error("不支持发布");
          if ($scope.tplMode && $scope.flyer.content.length < 5) {
            return $alert.error("模版的页面至少需要5页");
          }
          $scope
            .update({
              publish: true,
            })
            .then(
              function () {
                $(window).off("beforeunload");
                $flyer.setVal("status", config.FLYERS.status.published);

                // 新标签打开
                window.open($scope.flyer.link, "_blank");
              },
              function () {}
            );
        };
        // 预览作品
        $scope.preview = function () {
          $scope
            .update({
              preview: true,
            })
            .then(
              function () {
                $scope.$emit("interactOperateClick", {
                  action: "preview",
                  flyer: $scope.flyer,
                  tplMode: $scope.tplMode,
                });
              },
              function () {}
            );
        };
        //点击返回
        $scope.jump = function () {
          window.location.replace(flyersPageRoute);
          return;
        };

        $scope.getSortPageIDs = function (_pages) {
          var ids = [];
          for (var i = 0; i < _pages.length; i++) {
            ids.push(_pages[i].id);
          }
          return ids;
        };
        // 监听消息，创建页面
        var pgAddBtnClickOff = $scope.$on(
          events.pgAddBtnClick,
          function ($event, data) {
            if (data.action === "createCustom") {
              //靠模板创建
              $pgData.createCustomPage(
                {
                  tpl: data.tpl,
                },
                function (page) {
                  $scope.createPage({
                    page: page,
                    newPageIndex: $scope.flyer.content.length,
                    flyerID: $scope.flyer._id,
                  });
                }
              );
            }
          }
        );

        //监听 - 页面编辑区域的点击
        var pageEditorClickOff = $scope.$on(
          events.pageEditorClick,
          function ($event, data) {
            if (data) {
              if (data.action === "savePage") {
                $scope.savePage({
                  page: data.page,
                });
              }
            }
          }
        );

        //监听 - 缩略图被点击
        var pgThumbClickOff = $scope.$on(
          events.pgThumbClick,
          function (event, data) {
            if (data && data.action) {
              switch (data.action) {
                case "remove":
                  $scope.removePage({
                    index: parseInt(data.pageNum) - 1,
                  });
                  break;
                case "edit":
                  $scope.curPage = data.page;
                  $scope.curPageIndex = parseInt(data.pageNum) - 1;
                  $scope.flyer.curPageID = data.page.id;
                  $scope.selectPage({
                    pageID: $scope.curPage.id,
                  });
                  break;
                case "copy":
                  $scope.copyPage({
                    page: data.page,
                  });
                  break;
                case "pgUp":
                  if (Number(data.pageNum) > 1) {
                    var pageIndex = data.pageNum - 1;
                    var tmp = $scope.flyer.content[pageIndex - 1];
                    $scope.flyer.content[pageIndex] = tmp;
                    $scope.flyer.content[pageIndex - 1] = data.page;
                  }
                  break;
                case "pgDown":
                  if (Number(data.pageNum) < $scope.flyer.content.length) {
                    var pageIndex = data.pageNum - 1;
                    var tmp = $scope.flyer.content[pageIndex + 1];
                    $scope.flyer.content[pageIndex] = tmp;
                    $scope.flyer.content[pageIndex + 1] = data.page;
                  }
                  break;
              }
            }
          }
        );

        //监听 - 缩略图主键加号被点击
        var pgAddClickOff = $scope.$on(
          events.pgAddClick,
          function (event, data) {
            if (data) {
              if (data.action === "add") {
                $scope.createPage({
                  page: data.page,
                  newPageIndex: data.newPageIndex,
                  flyerID: $scope.flyer._id,
                });
              }
            }
          }
        );

        var designBtnsClickOff = $scope.$on(
          events.designBtnsClick,
          function ($event, data) {
            if (data) {
              if (data.action === "viewError") {
                var _obj = data.error.obj;
                $scope.$emit(events.pgThumbClick, {
                  action: "edit",
                  page: _obj,
                  pageNum: data.error.pageNum,
                });
              }
            }
          }
        );

        var topBarClickOff = $scope.$on(
          events.topBarClick,
          function ($event, data) {
            if (data) {
              if (data.action === "update") {
                $scope.update();
              }
              if (data.action === "preview") {
                $scope.preview();
              }
              if (data.action === "publish") {
                $scope.publish();
              }
              if (data.action === "jump") {
                $scope.jump();
              }
              if (data.action === "submit") {
                $scope.submit();
              }
            }
          }
        );

        $scope.submit = function () {
          TplService.submit(flyerID).then(function (data) {
            if (data.code === 200) {
              $(window).off("beforeunload");
              $alert.success("模版提交成功");
              return window.open("/u/" + $rootScope.user._id + "/tpl", "_self");
            } else {
              $alert.success(data.msg);
            }
          });
        };

        $scope.$on("$destory", function () {
          pgAddBtnClickOff();
          pageEditorClickOff();
          pgThumbClickOff();
          pgAddClickOff();
          designBtnsClickOff();
          topBarClickOff();
        });

        //快捷键初始化
        $editHotkey.init();

        $scope.tplMode = FlyerService.getModel() === "templates";
      },
    ]);
});
