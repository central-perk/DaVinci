// 图像管理
define(["app"], function (app) {
  app.service("$imageManage", [
    "$modalService",
    "$q",
    "$http",
    "$utils",
    function ($modalService, $q, $http, $utils) {
      var initData;
      var cropDefSrc = "/images/logo/xuan.png";
      // $http({
      //     method: 'get',
      //     url: '/api/images/all'
      // }).
      // success(function(data, status, headers, config) {
      //     if (data.code === 200) {
      //         initData = data.msg;
      //     } else {
      //         $alert.error(data.msg);
      //     }
      // });
      initData = {
        code: 200,
        msg: {
          public: {
            static: [
              {
                tag: "colorBackground",
                name: "Colorful Background",
                data: [],
              },
              {
                tag: "festivalElements",
                name: "Festival element",
                data: [],
              },
              {
                tag: "seasonOfLove",
                name: "Love Season",
                data: [],
              },
              {
                tag: "cartoonCharacters",
                name: "Cartoon Character",
                data: [],
              },
              {
                tag: "officeSupplies",
                name: "Office Supplies",
                data: [],
              },
              {
                tag: "abstractThings",
                name: "Abstract Thing",
                data: [],
              },
              {
                tag: "vehicle",
                name: "Transportation",
                data: [],
              },
              {
                tag: "otherImages",
                name: "Other images",
                data: [],
              },
            ],
            dynamic: [
              {
                tag: "festivalElements",
                name: "Festival element",
                data: [],
              },
              {
                tag: "seasonOfLove",
                name: "Love Season",
                data: [],
              },
              {
                tag: "flowersStory",
                name: "Flower Story",
                data: [],
              },
              {
                tag: "cartoonCharacters",
                name: "Cartoon Doll",
                data: [],
              },
            ],
          },
          user: {
            static: [
              {
                tag: "default",
                name: "Default Category",
                data: [],
              },
            ],
          },
        },
      }.msg;

      this.init = function (image, options) {
        var defOptions = {
          title: "图片管理",
          disableDynamic: false,
          disableMulti: false,
          cropBox: {
            bgFade: true,
            allowSelect: false,
            boxHeight: 280,
            boxWidth: 280,
            bgOpacity: 0.8,
            setSelect: [0, 0, 175, 175],
          },
          ratio: 0,
          numDigts: 4,
          storageLocal: false,
          library: "user",
          quantity: "single",
          category: "static",
        };
        options = options || {};
        options = _.merge(defOptions, options);
        var imageUploadDelay = $q.defer();

        // 设置默认裁剪比例
        options.cropBox.aspectRatio = options.ratio;

        var cropBoxOptions = options.cropBox;

        $modalService.show({
          templateUrl: "/services/image-manage/index.html",
          width: 860,
          height: 560,
          controller: [
            "config",
            "$image",
            "$scope",
            "$modalInstance",
            "$http",
            "$alert",
            "$timeout",
            "$rootScope",
            "hotkeys",
            function (
              config,
              $image,
              $scope,
              $modalInstance,
              $http,
              $alert,
              $timeout,
              $rootScope,
              hotkeys
            ) {
              var imageNumLimit = config.USERS.limit.imageNum;

              $scope.allImage = initData;
              $scope.publicStaticImages = $scope.allImage.public.static;
              $scope.publicDynamicImages = $scope.allImage.public.dynamic;
              $scope.imageItems = $scope.publicStaticImages[0].data;
              $scope.userImageItems = $scope.allImage.user.static[0].data;

              $scope.title = options.title;
              $scope.disableDynamic = options.disableDynamic;
              $scope.disableMulti = options.disableMulti;
              $scope.ratio = options.ratio;

              var events = config.EVENTS,
                $cropArea,
                $modalBody,
                $imageItems,
                $paging,
                paging,
                imageCropClickOff,
                $cropBox;

              // 图片裁剪初始化
              var cropBox,
                imageCrop = options.crop || {};

              cropBoxOptions.onDblClick = function () {
                $scope.cropAddImage();
              };

              $scope.image = {
                library: options.library,
                quantity: options.quantity,
                category: options.category,
              };

              $scope.curImages = [];

              //上传图片
              $scope.onFileSelect = function (images) {
                if ($scope.userImageItems.length >= imageNumLimit) {
                  return $alert.error(
                    "用户最多可上传" + imageNumLimit + "图片"
                  );
                }

                $image
                  .mulitiUpload({
                    images: images,
                    onSuccessCallback: function (data) {
                      var index = _.findIndex(
                        $scope.userImageItems,
                        function (imageItem) {
                          return imageItem.name === data.image.name;
                        }
                      );
                      $scope.userImageItems[index] = data.image;
                      initData.user.static[0].data = $scope.userImageItems;
                    },
                  })
                  .then(function (data) {
                    $scope.userImageItems = data.images.concat(
                      $scope.userImageItems
                    );
                    $scope.image.library = "user";
                    clearImages();
                  });
              };

              // 切换素材库
              $scope.chooseLibrary = function (library) {
                $scope.image.library = library;
                $scope.image.category = "static";
                clearImages();
              };

              // 切换图片类型（动态，静态）
              $scope.chooseCategory = function (category) {
                if ($scope.allImage) {
                  // category表示动态、静态
                  $scope.image.category = category;
                  $scope.imageItems = $scope.allImage.public[category][0].data;
                  $(".svs-image-manage .nav-tabs li:not(.category) .title")
                    .eq(0)
                    .text("静态图像");
                  $(".svs-image-manage .nav-tabs li:not(.category) .title")
                    .eq(1)
                    .text("动态图像");
                  clearImages();
                }
              };

              // 切换图片分类
              $scope.switchCategory = function ($event, category) {
                $($event.target)
                  .parents("tab-heading")
                  .find(".title")
                  .text(category.name);
                var $categoryList = $($event.target).parents(".category-list");
                $categoryList.hide();
                $scope.imageItems = category.data;
                if ($modalBody) $scope.retract();
              };

              // 显示图片分类菜单
              $scope.showCategorys = function ($event) {
                var $caretDown = $($event.target);
                if ($caretDown.parents("li").hasClass("active")) {
                  $($event.target).next().show();
                }
              };

              // 隐藏图片分类菜单
              $scope.hideCategorys = function ($event) {
                var $categoryList = $($event.target);
                if (!$categoryList.hasClass("category-list")) {
                  $categoryList = $categoryList.parents(".category-list");
                }
                $categoryList.hide();
              };

              // 鼠标移出，重置图片状态
              $scope.resetImage = function ($event) {
                var $imageItem = $($event.target);
                if (!$imageItem.hasClass("image-item")) {
                  $imageItem = $imageItem.parents(".image-item");
                }
                $imageItem.removeClass("ready-to-rm");
              };

              // 准备删除图像
              $scope.toRmImage = function ($event) {
                var $toRmImage = $($event.target),
                  $imageItem = $toRmImage.parents(".image-item"),
                  $rmImage = $imageItem.find(".rm-image");

                $imageItem.addClass("ready-to-rm");
                $event.stopPropagation();
                return false;
              };

              // 删除图像
              $scope.rmImage = function ($event, $index, imageItem) {
                $http({
                  method: "delete",
                  url: "/api/images/" + imageItem._id,
                }).success(function (data, status, headers, config) {
                  if (data.code === 200) {
                    $scope.userImageItems.splice(
                      _.indexOf($scope.userImageItems, imageItem),
                      1
                    );
                    initData.user.static[0].data = $scope.userImageItems;
                  } else {
                    $alert.error(data.msg);
                  }
                });
                $event.stopPropagation();
                return false;
              };

              // 删除所有图像
              $scope.rmAllImages = function ($event) {
                $image.delAll($scope.curImages, function () {
                  _.forEach($scope.curImages, function (imageItem) {
                    $scope.userImageItems.splice(
                      _.indexOf($scope.userImageItems, imageItem),
                      1
                    );
                  });
                  initData.user.static[0].data = $scope.userImageItems;
                  $scope.curImages = [];
                });
              };

              // 选择图像
              $scope.chooseImage = function ($event, $index, imageItem) {
                var $imageItem = $($event.target);
                if (!$imageItem.hasClass("image-item"))
                  $imageItem = $imageItem.parents(".image-item");
                if ($imageItem.hasClass("error")) return;
                // 单选
                if ($scope.image.quantity === "single") {
                  $scope.curImage = imageItem;

                  $(".svs-image-manage .image-item").removeClass("active");
                  $imageItem.addClass("active");

                  $scope.image.category = imageItem.category;

                  if (imageItem.category == "dynamic") {
                    if ($modalBody) $scope.retract();
                    $imageItem.addClass("active");
                    return;
                  }

                  // 必须加载动态图判断之后

                  // 静态图片
                  if ($scope.image.category === "static") {
                    loadCropImage(imageItem);

                    // 不在裁剪中
                    if (
                      !$modalBody ||
                      ($modalBody && !$modalBody.hasClass("croping"))
                    ) {
                      var lineNum = Math.floor($index / 8);

                      // 展开图片裁剪区域
                      $cropArea = $(".svs-image-manage .crop-area");
                      $cropArea.css({
                        height: "",
                        border: "",
                      });

                      // 列表缩进
                      $modalBody = $imageItem.parents(".modal-body");
                      $modalBody.addClass("croping");
                      $modalBody.scrollTop("0");
                      $imageItems = $modalBody.find(".image-items");
                      $imageItems.css("margin-top", -103 * lineNum);
                      $paging = $modalBody.find(".paging");
                      $paging.show();
                    }
                  }

                  // 多选
                } else if ($scope.image.quantity === "multi") {
                  // 元素变成选中状态toggle
                  if ($imageItem.hasClass("active")) {
                    $imageItem.removeClass("active");
                    $scope.curImages.splice(
                      _.indexOf($scope.curImages, imageItem),
                      1
                    );
                  } else {
                    $imageItem.addClass("active");
                    $scope.curImages.push(imageItem);
                  }
                }
              };

              // 直接使用单张图片
              $scope.addImage = function ($event) {
                if ($event) {
                  var $imageItem = $($event.target);
                  if (!$imageItem.hasClass("image-item"))
                    $imageItem = $imageItem.parents(".image-item");
                  if ($imageItem.hasClass("error")) return;
                }
                if ($scope.curImage) {
                  var imageObj = new Image(),
                    __image = $scope.curImage;
                  imageObj.src = __image.url;
                  imageObj.onload = function () {
                    var result = {
                      crop: {
                        w: imageObj.width,
                        h: imageObj.height,
                      },
                      url: __image.url,
                      cropUrl: __image.url,
                    };
                    imageUploadDelay.resolve([result]);
                    $scope.loading = false;
                    $scope.close();
                  };
                }
              };

              function packImage(imageItem) {
                var imageObj = new Image();
                imageObj.src = imageItem.url;
                return {
                  crop: {
                    w: imageObj.width,
                    h: imageObj.height,
                  },
                  url: imageItem.url,
                  cropUrl: imageItem.url,
                };
              }

              // 直接使用多张图片
              $scope.addAllImages = function () {
                var result = _.reduce(
                  $scope.curImages,
                  function (result, imageItem) {
                    result.push(packImage(imageItem));
                    return result;
                  },
                  []
                );
                imageUploadDelay.resolve(result);
                $scope.close();
              };

              // 使用裁剪后的单张图片
              $scope.cropAddImage = function () {
                if ($scope.loading) {
                  return;
                }
                var __image = $scope.curImage;
                url = __image.url;
                $scope.loading = true;
                $image
                  .crop({
                    data: {
                      crop: imageCrop,
                      url: url,
                      local: options.storageLocal,
                    },
                    storageLocal: options.storageLocal,
                  })
                  .then(
                    function (result) {
                      $scope.userImageItems = [result.image].concat(
                        $scope.userImageItems
                      );
                      initData.user.static[0].data = $scope.userImageItems;
                      imageUploadDelay.resolve([result]);
                      $scope.loading = false;
                      $scope.close();
                    },
                    function () {
                      $scope.loading = false;
                    }
                  );
              };

              // 裁剪区域缩进
              $scope.retract = function () {
                $cropArea.css({
                  height: 0,
                  border: "none",
                });

                $modalBody.removeClass("croping");
                $imageItems.css("margin-top", "");
                $(".svs-image-manage .image-item").removeClass("active");
                $paging.hide();
              };

              // 显示上一行
              $scope.prevLine = function () {
                if (paging) return;

                var marginTop = Number(
                  $imageItems.css("margin-top").slice(0, -2)
                );
                marginTop += 103;
                if (marginTop <= 0) {
                  paging = true;
                  $imageItems.animate(
                    {
                      "margin-top": marginTop,
                    },
                    300,
                    function () {
                      paging = false;
                    }
                  );
                }
              };

              // 显示下一行
              $scope.nextLine = function () {
                if (paging) return;

                var marginTop = Number(
                  $imageItems.css("margin-top").slice(0, -2)
                );
                marginTop -= 103;
                var imageItemLength = $(".svs-image-manage .image-item").length;
                if (marginTop / -103 < imageItemLength / 8) {
                  paging = true;
                  $imageItems.animate(
                    {
                      "margin-top": marginTop,
                    },
                    300,
                    function () {
                      paging = false;
                    }
                  );
                }
              };

              $scope.$watch("image.quantity", function (newVal, oldVal) {
                // 切换会单选的时候去除图片选中状态
                if (newVal && newVal === "single") {
                }
                if (newVal && newVal === "multi") {
                }
                clearImages();
              });

              // 清空选中的图片
              function clearImages() {
                $(".svs-image-manage .image-item").removeClass("active");
                $scope.curImage = null;
                $scope.curImages = [];
                if ($modalBody) $scope.retract();
              }

              // 初始化裁剪区域
              $scope.initCropBox = function () {
                var image = new Image();
                image.src = cropDefSrc;
                image.onload = function () {
                  $cropBox = $("#image-manage-crop-box");

                  $cropBox.Jcrop(cropBoxOptions, function () {
                    cropBox = this;
                    cropBoxOptions.onSelect = updatePreview;

                    cropBox.setOptions(cropBoxOptions);
                  });
                };
              };

              function changeImageCrop(c) {
                if (isNaN(c.x)) return;
                imageCrop.x = c.x.toFixed(options.numDigts);
                imageCrop.y = c.y.toFixed(options.numDigts);
                imageCrop.x2 = c.x2.toFixed(options.numDigts);
                imageCrop.y2 = c.y2.toFixed(options.numDigts);
                imageCrop.w = c.w;
                imageCrop.h = c.h;
                imageCrop.bX = cropBox.getBounds()[0];
                imageCrop.bY = cropBox.getBounds()[1];
                imageCrop.ratio = 1;
              }

              function updatePreview(c) {
                changeImageCrop(c);
                $("#layer-drag-label").remove();
              }
              //创建拖拽提示
              function createLayerDragLabel(e, deltas, image) {
                if ($("#layer-drag-label").html()) {
                  refreshLayerDragLabel(e, deltas, image);
                  return;
                }
                $("body").append(
                  '<div id="layer-drag-label" style="width:150px;"    class="layer-label layer-drag-label">' +
                    '<div class="measure"><span class="name">宽&nbsp;:</span><span class="w"></span><span class="unit">px</span></div>' +
                    '<div class="measure"><span class="name">高&nbsp;:</span><span class="h"></span><span class="unit">px</span></div>' +
                    "</div>"
                );
                refreshLayerDragLabel(e, deltas, image);
              }
              //刷新拖拽提示
              function refreshLayerDragLabel(e, deltas, image) {
                var xBili =
                  $($(".crop-area .jcrop-tracker")[1]).width() / image.width;
                var yBili =
                  $($(".crop-area .jcrop-tracker")[1]).height() / image.height;
                $("#layer-drag-label").css({
                  left:
                    $(".crop-area .display").offset().left +
                    deltas.x * xBili +
                    (deltas.w * xBili) / 2 +
                    10,
                  top:
                    $(".crop-area .display").offset().top +
                    deltas.y * yBili +
                    deltas.h * yBili +
                    10,
                });
                $("#layer-drag-label").find(".w").text(parseInt(deltas.w));
                $("#layer-drag-label").find(".h").text(parseInt(deltas.h));
              }
              var isFixScale = false;
              hotkeys.add({
                combo: "shift",
                action: "keypress",
                callback: function () {
                  $(".crop-area").addClass("scaling");
                  cropBoxOptions.aspectRatio = imageCrop.w / imageCrop.h;
                  cropBoxOptions.setSelect = [
                    imageCrop.x,
                    imageCrop.y,
                    imageCrop.x2,
                    imageCrop.y2,
                  ];
                  $cropBox.Jcrop(cropBoxOptions, function () {});
                },
              });

              hotkeys.add({
                combo: "shift",
                action: "keyup",
                callback: function () {
                  $(".crop-area").removeClass("scaling");
                  cropBoxOptions.aspectRatio = 0;
                  cropBoxOptions.setSelect = [
                    imageCrop.x,
                    imageCrop.y,
                    imageCrop.x2,
                    imageCrop.y2,
                  ];
                  $cropBox.Jcrop(cropBoxOptions, function () {});
                },
              });
              // 加载裁剪图片
              function loadCropImage(imageItem) {
                var oldData;
                var image = new Image();
                image.src = imageItem.url;
                image.onload = function () {
                  cropBox.setImage(imageItem.url);
                  $timeout(function (argument) {
                    var bigData =
                      image.width > image.height ? image.width : image.height;
                    cropBoxOptions.onChange = function (data) {
                      if (!isNaN(data.x)) {
                        if (oldData && !$utils.objEqual(data, oldData)) {
                          createLayerDragLabel(null, data, image);
                        }
                        oldData = data;
                      }
                      changeImageCrop(data);
                    };
                    if (imageCrop.h && imageCrop.w) {
                      var _width = (image.height * imageCrop.w) / imageCrop.h;
                      var _height = (image.width * imageCrop.h) / imageCrop.w;
                      if (_width < image.width) {
                        cropBoxOptions.setSelect = [
                          0,
                          0,
                          Math.round(_width),
                          image.height,
                        ];
                      } else if (_height < image.height) {
                        cropBoxOptions.setSelect = [
                          0,
                          0,
                          image.width,
                          Math.round(_height),
                        ];
                      }
                    } else {
                      cropBoxOptions.setSelect = [0, 0, bigData, bigData];
                    }

                    cropBox.setOptions(cropBoxOptions);
                  }, 100);
                };
              }

              // 关闭窗口
              $scope.close = function () {
                // 清除状态错误的图片
                $modalInstance.close();
                _.forEach(
                  initData.user.static[0].data,
                  function (imageItem, index, imageItems) {
                    if (
                      imageItem &&
                      imageItem.status &&
                      imageItem.status === 10
                    ) {
                      imageItems.splice(index, 1);
                    }
                  }
                );
              };
            },
          ],
        });

        return imageUploadDelay.promise;
      };
    },
  ]);
});
