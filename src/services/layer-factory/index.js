/**
 *  导出客户
 *
 */
define(["app"], function (app) {
  app.service("$layerFactory", [
    "config",
    "$layerAnimate",
    "$layerManage",
    "$imageUpload",
    "$imageManage",
    "$alert",
    "$rootScope",
    "$utils",
    function (
      config,
      $layerAnimate,
      $layerManage,
      $imageUpload,
      $imageManage,
      $alert,
      $rootScope,
      $utils
    ) {
      var events = config.EVENTS;
      var customeConfig = config.CPTS[config.FLYERS.categorys.interact].custome;
      var defaults = {
          image: {
            url: "/images/brand/logo_square_260x260.png",
            crop: {},
            ratio: -1,
          },
        },
        defLink = {
          tel: "4006666888",
          web: "http://davinci.echoes.link",
          type: "none",
          openNewTab: false,
        },
        editorSize = config.SCREEN_SIZE.editor.interact;
      this.init = function (page) {
        this.page = page;
        this.page.count = this.page.count || {};
      };
      // 创建图片层
      this.createImage = function () {
        var self = this;
        $imageManage
          .init(null, {
            title: "Add Image",
          })
          .then(function (imagePacks) {
            var nextX;
            var nextY;
            var imagePackslen = imagePacks.length;
            _.forEach(imagePacks, function (result, index) {
              var width = 140,
                height = parseInt(result.crop.h / (result.crop.w / width));
              if (!nextX) {
                nextX =
                  (editorSize.width - width) / 2 - (imagePackslen - 1) * 10;
              } else {
                nextX += 20;
              }
              if (!nextY) {
                nextY = (editorSize.height - height) / 2;
              } else {
                nextY += 20;
              }
              var layer = {
                type: 2, //枚举 1 - 文本 , 2 - 图片
                style: {
                  //层容器样式
                  width: width,
                  height: height,
                  x: nextX,
                  y: nextY,
                  rotateZ: 0,
                  zIndex: $layerManage.getNextzIndex(),
                },
                link: defLink,
                animate: $layerAnimate.getDefaultAnimate("fadeIn"),
                content: {
                  //层内容的属性
                  style: {
                    opacity: 100,
                    backgroundColor: "",
                    borderStyle: "none",
                    borderWidth: 0,
                    borderColor: "",
                    boxShadow: 0,
                    borderRadius: 0,
                    blur: 0,
                  },
                  crop: result.crop,
                  pic: result.url,
                  cropUrl: result.cropUrl,
                  category: result.category,
                },
                asSubmitBtn: false,
              };
              $layerManage.addLayer(layer);
            });
          });
      };
      // 创建文本层
      this.createText = function () {
        var self = this,
          textDefaults = {
            width: 230,
            height: 40,
          },
          text = "<div>Text layer, try to edit it</div>",
          fontSize = 14,
          layer = {
            type: 1, //枚举 1 - 文本 , 2 - 图片
            style: {
              //层容器样式
              width: textDefaults.width, //max 320
              height: textDefaults.height, //max 568
              x: (editorSize.width - textDefaults.width) / 2,
              y: (editorSize.height - textDefaults.height) / 2,
              rotateZ: 0,
              zIndex: $layerManage.getNextzIndex(),
            },
            link: defLink,
            animate: $layerAnimate.getDefaultAnimate("fadeIn"),
            content: {
              //层内容的属性
              style: {
                opacity: 100,
                backgroundColor: "",
                borderStyle: "none",
                borderWidth: 0,
                borderColor: "",
                boxShadow: 0,
                paddingLeft: 0,
                paddingRight: 0,
                borderRadius: 0,
              },
              editorStyle: {
                textAlign: "center",
                verticalAlign: "middle",
                lineHeight: 1,
                letterSpacing: 0,
                paddingTop: 13,
                fontSize: 14,
              },
              text: text,
            },
            asSubmitBtn: false,
          };
        $layerManage.addLayer(layer);
      };
      // 创建输入框
      this.createIbox = function () {
        var layer = {
          type: 3,
          style: {
            width: 280,
            height: 40,
            x: 20,
            y: 233,
            rotateZ: 0,
            zIndex: $layerManage.getNextzIndex(),
          },
          animate: $layerAnimate.getDefaultAnimate("fadeIn"),
          content: {
            //层内容的属性
            style: {
              opacity: 100,
              backgroundColor: "#ffffff",
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "#cccccc",
              boxShadow: 0,
              paddingLeft: 0,
              paddingRight: 0,
              borderRadius: 20,
            },
            type: "extra",
            label: "Untitled",
            isRequired: false,
          },
        };
        $layerManage.addLayer(layer);
      };
      // 创建地图
      this.createMap = function () {
        var layer = {
          type: 4,
          style: {
            width: 50,
            height: 50,
            x: 135,
            y: 228,
            rotateZ: 0,
            zIndex: $layerManage.getNextzIndex(),
          },
          animate: $layerAnimate.getDefaultAnimate("bounceIn"),
          content: {
            //层内容的属性
            style: {
              opacity: 100,
              borderStyle: "none",
              borderWidth: 0,
              borderColor: "",
              boxShadow: 0,
              borderRadius: 0,
              blur: 0,
            },
            crop: {
              w: 50,
              h: 50,
            },
            pic: "/images/layer-map.png",
            cropUrl: "/images/layer-map.png",
            link: "",
          },
        };
        layer.animate.dir = "fromCenter";
        $layerManage.addLayer(layer);
      };
      // 创建视频
      this.createVideo = function () {
        var layer = {
          type: 5,
          style: {
            width: 100,
            height: 50,
            x: 110,
            y: 228,
            rotateZ: 0,
            zIndex: $layerManage.getNextzIndex(),
          },
          animate: $layerAnimate.getDefaultAnimate("bounceIn"),
          content: {
            //层内容的属性
            style: {
              opacity: 100,
              borderStyle: "none",
              borderWidth: 0,
              borderColor: "",
              boxShadow: 0,
              borderRadius: 0,
              blur: 0,
            },
            crop: {
              w: 100,
              h: 50,
            },
            pic: "/images/layer-video.png",
            cropUrl: "/images/layer-video.png",
            code: "",
          },
        };
        layer.animate.dir = "fromCenter";
        $layerManage.addLayer(layer);
      };
      // 创建幻灯片
      this.createSlider = function () {
        var layer = {
          type: 6,
          style: {
            width: 210,
            height: 140,
            x: 55,
            y: 183,
            rotateZ: 0,
            zIndex: $layerManage.getNextzIndex(),
          },
          animate: $layerAnimate.getDefaultAnimate("fadeIn"),
          content: {
            // 层内容的属性
            style: {
              opacity: 100,
              borderStyle: "none",
              borderWidth: 0,
              borderColor: "",
              boxShadow: 0,
              borderRadius: 0,
              blur: 0,
            },
            node: [],
          },
        };
        $layerManage.addLayer(layer);
      };
      this.createShape = function (shape) {
        $layerManage.addLayer({
          type: 7,
          style: {
            width: shape.width || 160, //max 320
            height: shape.height || 160, //max 568
            x: 90,
            y: 183,
            rotateZ: 0,
            zIndex: $layerManage.getNextzIndex(),
          },
          link: defLink,
          animate: $layerAnimate.getDefaultAnimate("fadeIn"),
          content: {
            //层内容的属性
            style: {
              opacity: 100,
              backgroundColor: "#3B9466",
              borderStyle: "none",
              borderWidth: 0,
              borderColor: "",
              boxShadow: 0,
              borderRadius: 0,
              blur: 0,
              svg: shape.src,
            },
          },
          asSubmitBtn: false,
        });
      };
    },
  ]);
});
