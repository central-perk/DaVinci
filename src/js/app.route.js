define([
  "app",
  "js/controllers/flyers-interact-edit",
  "pages/account/index",
  "pages/user/index",
  "pages/tpl-center/index",
  "pages/plaza/index",
  "pages/data/index",
], function (app) {
  app.config([
    "$stateProvider",
    "$urlRouterProvider",
    "$locationProvider",
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
      // 开启html5mode
      $locationProvider.html5Mode(true);

      // var redirectToPath =
      //   window.DVC && window.DVC._user ? "/u/" + window.DVC._user._id : "/";
      // $urlRouterProvider.otherwise(redirectToPath);
      // 路由
      $stateProvider
        // .state('tplCenter', {
        //     url: '/tpl-center',
        //     templateUrl: '/pages/tpl-center/index.html',
        //     controller: 'TplCenterController',
        //     pageTitle: '模板中心'
        // })
        // .state('plaza', {
        //     url: '/plaza',
        //     templateUrl: '/pages/plaza/index.html',
        //     controller: 'PlazaController',
        //     pageTitle: '作品展示'
        // })
        // .state('data', {
        //     url: '/f/:flyerID/data',
        //     templateUrl: '/pages/data/index.html',
        //     controller: 'DataController',
        //     resolve: {
        //         flyer: ['FlyerService', '$stateParams',
        //             function(FlyerService, $stateParams) {
        //                 var flyerID = $stateParams.flyerID;
        //                 return FlyerService.getDataSetting(flyerID)
        //                     .then(function(data) {
        //                         return data.msg;
        //                     });
        //             }
        //         ]
        //     },
        //     pageTitle: '作品数据'
        // })
        .state("flyerEditor", {
          url: "/",
          templateUrl: "/views/templates/flyer-interact/edit.html",
          controller: "EditorController",
          resolve: {
            flyer: [
              "FlyerService",
              "$state",
              "$stateParams",
              "$rootScope",
              "$location",
              function (
                FlyerService,
                $state,
                $stateParams,
                $rootScope,
                $location
              ) {
                var flyerID = $stateParams.flyerID,
                  appID = $location.search().appID;

                // return FlyerService.get(flyerID).then(function (data) {
                //   if (data.code === 200) {
                var flyer = {
                  code: 200,
                  msg: {
                    audio: {
                      thirdparty: {},
                      upload: {},
                      library: {
                        key: "1",
                      },
                      category: 10,
                      active: false,
                    },
                    setting: {
                      permission: {
                        category: 10,
                        pwd: "",
                      },
                      validTime: {
                        switch: false,
                      },
                      dailyValidTime: {
                        data: [],
                        switch: false,
                      },
                      status: 20,
                    },
                    qrcode: {
                      hideLogo: true,
                    },
                    deleted: 0,
                    desc: "",
                    logo: "/images/logo/geren.png",
                    category: "20",
                    tags: ["individual"],
                    content: [
                      {
                        kind: "custome",
                        properties: null,
                        layers: [
                          {
                            id: "layer-gpd9ya",
                            type: 1,
                            style: {
                              width: 200,
                              height: 40,
                              x: 60,
                              y: 233,
                              rotateZ: 0,
                              zIndex: 10,
                            },
                            animate: {
                              name: "移入",
                              type: "fadeIn",
                              dir: "fromLeft",
                              duration: 1,
                              delay: 0,
                              disappear: 0,
                              distance: 150,
                            },
                            content: {
                              text: "<div>Text layer, try to edit it</div>",
                              editorStyle: {
                                marginTop: 0,
                                fontSize: 14,
                                paddingTop: 13,
                                letterSpacing: 0,
                                lineHeight: 1,
                                verticalAlign: "middle",
                                textAlign: "center",
                              },
                              style: {
                                borderRadius: 0,
                                paddingRight: 0,
                                paddingLeft: 0,
                                boxShadow: 0,
                                borderColor: "",
                                borderWidth: 0,
                                borderStyle: "none",
                                backgroundColor: "",
                                opacity: 100,
                              },
                              link: {
                                tel: "4006666888",
                                web: "http://davinci.echoes.link",
                                type: "none",
                                openNewTab: false,
                              },
                            },
                            _new: null,
                            state: null,
                            active: false,
                            pageid: "page-xnm4ri",
                          },
                        ],
                        selected: true,
                        bg: {
                          animate: {
                            switch: true,
                            type: "stretch",
                          },
                          name: "bg",
                          key: "",
                          value: "",
                          category: "",
                          undertone: "#fff",
                          style: {
                            repeat: "extrude",
                            position: "middle",
                            opacity: 100,
                            blur: 0,
                          },
                          customValue: "",
                          customSwitch: true,
                          id: "page-xnm4ri-bg",
                        },
                        transition: {
                          type: "scale",
                        },
                        effect: {
                          name: "mask",
                          enable: false,
                        },
                        id: "page-xnm4ri",
                        ids: {
                          bg: "page-xnm4ri-bg",
                        },
                        count: {
                          text: 2,
                        },
                        _es: 0,
                        form: null,
                      },
                    ],
                    transferMode: "vertical",
                    status: 10,
                    istop: 0,
                    friendShare: false,
                    canRecommend: false,
                    recommend: false,
                    channels: [],
                    storage: 132,
                    pv: 0,
                    firstPubTime: null,
                    inHomePage: false,
                    freeze: false,
                    _id: "i6mxgx",
                    curPageID: "page-xnm4ri",
                    title: "Please start your creative journey",
                    user: {
                      domain: {
                        enable: true,
                      },
                      level: 10,
                      _id: "62e64a6aca6b39bbe8b8b3f0",
                    },
                    cdnVersion: 1,
                    createdTime: "2022-07-31T09:33:12.382Z",
                    updatedTime: "2022-07-31T09:42:04.974Z",
                    pubTime: "2022-07-31T09:33:12.382Z",
                    __v: 1,
                    link: "http://localhost:12000/f/i6mxgx",
                  },
                }.msg;
                flyer.tags =
                  flyer.tags && flyer.tags.length >= 1 ? flyer.tags[0] : "";
                return flyer;
                //   } else {
                //     $state.go("user", {
                //       userID: $rootScope.user._id,
                //     });
                //   }
                // });
              },
            ],
          },
        });
      // .state("tplEditor", {
      //   url: "/templates/:tplID/edit",
      //   templateUrl: "/views/templates/flyer-interact/edit.html",
      //   controller: "EditorController",
      //   resolve: {
      //     flyer: [
      //       "FlyerService",
      //       "$stateParams",
      //       "$rootScope",
      //       "config",
      //       function (FlyerService, $stateParams, $rootScope, config) {
      //         var tplID = $stateParams.tplID;
      //         FlyerService.setModel("templates");

      //         return FlyerService.get(tplID).then(function (data) {
      //           if (data && data.code === 200 && data.msg) {
      //             var _doc = data.msg;
      //             var tplStatus = data.msg.status,
      //               TPL_STATUS = config.TEMPLATES.status;
      //             if (
      //               tplStatus === TPL_STATUS.verifying ||
      //               tplStatus === TPL_STATUS.updatedVerifying
      //             ) {
      //               // 这里在之后需要修改成 state 的写法
      //               return window.location.replace(
      //                 "/u/" + $rootScope.user._id + "/tpl"
      //               );
      //             }
      //             if (!_doc._id) return _doc;
      //             _doc.tags =
      //               _doc.tags && _doc.tags.length >= 1 ? _doc.tags[0] : "";
      //             return _doc;
      //           } else {
      //             return window.location.replace("/tpl-center");
      //           }
      //         });
      //       },
      //     ],
      //   },
      // });
    },
  ]);
});
