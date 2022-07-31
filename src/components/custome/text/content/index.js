/**
 *  文本内容编辑区域
 *
 */
define(["app", "./font", "./editor"], function (app, font, editor) {
  app.directive("fiEditContentCustomText", [
    "config",
    "$utils",
    "$rootScope",
    "$timeout",
    "$layerManage",
    "$validator",
    "$pgData",
    "$alert",
    function (
      config,
      $utils,
      $rootScope,
      $timeout,
      $layerManage,
      $validator,
      $pgData,
      $alert
    ) {
      var fiPageCustomeBasePath = "/components/custome";
      var events = config.EVENTS;
      return {
        restrict: "E",
        templateUrl: "/components/custome/text/content/index.html",
        scope: {
          layer: "=ngModel",
        },
        link: function ($scope, $element, $attrs) {
          var ftFamilyMap = font.ftFamilyMap, //实际css字体配置
            defTextConf = {
              //默认文本配置
              backgroundColor: "",
              bold: false,
              color: "#333333",
              fontFamily: "ft-wryh",
              fontSize: 2,
              italic: false,
              underline: false,
            },
            page = $layerManage.getPage(),
            isEditText = false;

          $scope.placeholder = config.FI_EDITOR.LAYER.link.placeholder;
          $scope.error = {};
          $scope.ftFamilyList = font.ftFamilyList; //select字体配置
          $scope.ftSizeList = font.ftSizeList; //select字体配置

          //同步内容
          var syncTextHtml = function (_html) {
            var layer = $scope.layer;
            var html = _html;
            $layer = $(".mdl-pg-vessel #" + layer.id);
            var $thumbLayer = $(".thumbs #" + layer.pageid + " #" + layer.id);
            if (!html) {
              html = $layer.find(".content").html();
            }
            $scope.layer.content.text = html;
            $thumbLayer.find(".content").html(html);
            $layerManage.resizeVerticalPostion(layer);
            setTimeout(function () {
              $scope.$apply();
            }, 150);
          };
          var editorFocus = function ($elem) {
            $elem.focus();
            editor.selectAll();
          };

          //改变选中内容字体风格样式
          $scope.formatText = function (format, $event) {
            if ($scope.isEditText($scope.layer)) {
              var selection = editor.getSelection();
              if (selection.isCollapsed) {
                return $alert.error("请选中部分或全选文本");
              }
              editor.excute(format, null);
              setTimeout(function () {
                syncEditorState();
              }, 100);
            } else {
              if (format === "bold") {
                if ($scope.layer.content.editorStyle.fontWeight !== "bold") {
                  $scope.toolbar.bold = true;
                  $scope.layer.content.editorStyle.fontWeight = "bold";
                } else {
                  $scope.toolbar.bold = false;
                  $scope.layer.content.editorStyle.fontWeight = "";
                }
              }
              if (format === "italic") {
                if ($scope.layer.content.editorStyle.fontStyle !== "italic") {
                  $scope.toolbar.italic = true;
                  $scope.layer.content.editorStyle.fontStyle = "italic";
                } else {
                  $scope.toolbar.italic = false;
                  $scope.layer.content.editorStyle.fontStyle = "";
                }
              }
              if (format === "underline") {
                if (
                  $scope.layer.content.editorStyle.textDecoration !==
                  "underline"
                ) {
                  $scope.toolbar.underline = true;
                  $scope.layer.content.editorStyle.textDecoration = "underline";
                } else {
                  $scope.toolbar.underline = false;
                  $scope.layer.content.editorStyle.textDecoration = "";
                }
              }
            }
          };

          //监听垂直属性变化
          var initDataWatch = function () {
            //垂直方向是靠margin-top完成
            $scope.$watch(
              "layer.content.editorStyle.verticalAlign",
              function (newVal, oldVal) {
                if (newVal) {
                  $layerManage.resizeVerticalPostion($scope.layer);
                }
              }
            );
          };

          var selectionInfoWarning = function () {
            var selectionInfo = getSelectionInfo();
            if (selectionInfo.range.start === selectionInfo.range.end) {
              $alert.error("请选中部分或全选文本");
            }
          };

          var getFontSizeMap = function (fontSizes) {
            var dic = {};
            for (var i = fontSizes.length - 1; i >= 0; i--) {
              dic[fontSizes[i].value] = parseInt(
                fontSizes[i].label.replace("px", "")
              );
            }
            return dic;
          };

          var getPtSizeMap = function (fontSizes) {
            var dic = {};
            for (var i = fontSizes.length - 1; i >= 0; i--) {
              dic[parseInt(fontSizes[i].label.replace("px", ""))] =
                fontSizes[i].value;
            }
            return dic;
          };
          $scope.fontSizeMap = getFontSizeMap($scope.ftSizeList);
          $scope.ptSizeMap = getPtSizeMap($scope.ftSizeList);
          $scope.tmp = {};
          //字体大小改变
          $scope.onFontSizeChange = function () {
            var layer = $scope.layer;
            if ($scope.isEditText(layer)) {
              var size = $scope.toolbar.fontSize;
              editor.fontSize(size);
              if ($scope.toolbar.fontSize > 7) {
                var range = editor.getRange();
                if (
                  range.startContainer &&
                  range.startContainer.parentElement
                ) {
                  $(range.startContainer.parentElement).attr("size", size);
                }
                if (range.endContainer && range.endContainer.parentElement) {
                  var $ele = $(range.endContainer.parentElement);
                  if ($ele.is("font")) {
                    $ele.attr("size", size);
                  } else {
                    $ele.find("font").each(function () {
                      $(this).attr("size", size);
                    });
                  }
                }
              }
              syncTextHtml();
            } else {
              $scope.clearChildFontSize();
              $scope.layer.content.editorStyle.fontSize =
                $scope.fontSizeMap[$scope.toolbar.fontSize];
              syncTextHtml();
            }
          };
          $scope.clearChildFontSize = function () {
            var $layer = $(".mdl-pg-vessel #" + $scope.layer.id);
            var $layerContent = $layer.find(".content");
            //清楚font标签的size属性
            $layerContent.find("font").each(function () {
              $(this)[0].removeAttribute("size");
            });
            //设置style内的font-size为inherit
            $layerContent.find('*[style*="font-size:"]').each(function () {
              $(this).css("font-size", "inherit");
            });
          };
          $scope.clearChildPStyle = function () {
            var $layer = $(".mdl-pg-vessel #" + $scope.layer.id);
            var $layerContent = $layer.find(".content");
            $layerContent.find("p").each(function () {
              $(this)[0].removeAttribute("style");
            });
          };
          //字体类型改变
          $scope.onFontFamilyChange = function () {
            var val = ftFamilyMap[$scope.toolbar.fontFamily].val;
            if ($scope.isEditText($scope.layer)) {
              editor.fontName(val);
              syncTextHtml();
            } else {
              $scope.layer.content.editorStyle.fontFamily = val;
            }
          };
          // 字体颜色
          $scope.onFontColorChange = function (val) {
            if ($scope.isEditText($scope.layer)) {
              editor.fontColor(val);
              $scope.toolbar.fontColor = val;
              $scope.tmp.fontColor = val;
              syncTextHtml();
            } else {
              $scope.layer.content.editorStyle.color = val;
            }
          };

          //改变背景大小
          $scope.onBackgroundColorChange = function (val) {
            if ($scope.isEditText($scope.layer)) {
              if (val === null) {
                val = "transparent";
              }
              editor.backColor(val);
              $scope.toolbar.backgroundColor = val;
              $scope.tmp.backgroundColor = val;
              syncTextHtml();
            } else {
              $scope.layer.content.editorStyle.backgroundColor = val;
            }
          };

          //初始化
          var init = function () {
            var layer = $scope.layer;
            $layer = getLayerElem(layer);

            $scope.toolbar = angular.copy(defTextConf);
            layer.link = layer.link || {};
            $scope.toolbar.linkType = layer.link.type || "none";
            $scope.toolbar.linkVal = $layerManage.getLinkVal(layer.link);
            initDataWatch();

            if (!$scope.isEditText(layer)) {
              syncTextState($layer);
            }
          };

          //获取分辨率
          var getDPI = function () {
            var arrDPI = new Array();
            if (window.screen.deviceXDPI != undefined) {
              arrDPI[0] = window.screen.deviceXDPI;
              arrDPI[1] = window.screen.deviceYDPI;
            } else {
              var tmpNode = document.createElement("DIV");
              tmpNode.style.cssText =
                "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
              document.body.appendChild(tmpNode);
              arrDPI[0] = parseInt(tmpNode.offsetWidth);
              arrDPI[1] = parseInt(tmpNode.offsetHeight);
              tmpNode.parentNode.removeChild(tmpNode);
            }
            return arrDPI;
          };
          var syncTextState = function ($layer) {
            //不是选中编辑文本
            var $layerContent = $layer.find(".content");
            //字体大小
            var fontSize = ($layerContent.css("font-size") || "14px").replace(
              "px",
              ""
            );

            $scope.toolbar.fontSize = parseInt($scope.ptSizeMap[fontSize]);

            //字体风格
            var fontFamily = $layerContent.css("font-family");
            $scope.toolbar.fontFamily = getFontFamily(fontFamily);

            //颜色
            var color = $layerContent.css("color");
            if (color) {
              color = $utils.rgb2hex(color);
              $scope.toolbar.fontColor = color;
            } else {
              $scope.toolbar.fontColor = "#333333";
            }

            //颜色
            var backgroundColor = $layerContent.css("background-color");
            if (backgroundColor && backgroundColor !== "rgba(0, 0, 0, 0)") {
              backgroundColor = $utils.rgb2hex(backgroundColor);
              $scope.toolbar.backgroundColor = backgroundColor;
            } else {
              $scope.toolbar.backgroundColor = "";
            }

            //加粗
            var fontWeight = $layerContent.css("font-weight");
            $scope.toolbar.bold = fontWeight !== "bold" ? false : true;

            //斜体
            var fontStyle = $layerContent.css("font-style");
            $scope.toolbar.italic = fontStyle !== "italic" ? false : true;

            //下划线
            var textDecoration = $layerContent.css("text-decoration");
            $scope.toolbar.underline =
              textDecoration !== "underline" ? false : true;
          };

          var getFontFamily = function (fontFamilyVal) {
            for (key in ftFamilyMap) {
              if (ftFamilyMap[key].val.indexOf(fontFamilyVal) > -1) {
                return key;
              }
            }
            return "ft-wryh";
          };
          var syncEditorState = function () {
            var ftSize = editor.getFontSize();
            if (!ftSize) {
              if ($scope.layer.content.editorStyle.fontSize) {
                ftSize = parseInt(
                  $scope.ptSizeMap[$scope.layer.content.editorStyle.fontSize]
                );
              } else {
                ftSize = 2;
              }
            }
            var fontSizeState = ftSize;
            var fontFamilyState = document.queryCommandValue("fontName");
            var fontColorState = editor.commandState("foreColor");
            var backgroundColorState = editor.commandState("backColor");
            var boldState = editor.commandState("bold");
            var italicState = editor.commandState("italic");
            var underlineState = editor.commandState("underline");
            $scope.toolbar.fontSize = parseInt(fontSizeState);
            $scope.toolbar.fontFamily = getFontFamily(fontFamilyState);
            $scope.toolbar.bold = boldState === "false" ? false : true;
            $scope.toolbar.italic = italicState === "false" ? false : true;
            $scope.toolbar.underline =
              underlineState === "false" ? false : true;

            if (backgroundColorState !== "rgb(158, 158, 158)") {
              $scope.tmp.backgroundColor = $utils.rgb2hex(backgroundColorState);
            } else {
              $scope.tmp.backgroundColor = "";
            }
            //显示的数值
            var fontColorState = $utils.rgb2hex(fontColorState);
            if (fontColorState && fontColorState !== "undefined") {
              $scope.tmp.fontColor = fontColorState;
            } else {
              $scope.tmp.fontColor = "";
            }
            $scope.$apply();
          };
          var getLayerElem = function (layer) {
            if (!layer) return null;
            return $(".mdl-pg-vessel #" + layer.id);
          };
          var range = {};
          //监听layer被点击消息
          var layerClickOff = $scope.$on(events.layerClick, function (e, data) {
            var layer = data.layer;
            if (data.action === "dbClickText") {
              $layer = getLayerElem(layer);
              $layerContent = $layer.find(".content");
              setTimeout(function () {
                syncEditorState();
              }, 100);
              $layerContent
                .on("click", function () {
                  if ($scope.isEditText(layer)) {
                    setTimeout(function () {
                      syncEditorState();
                    }, 100);
                  }
                })
                .on("keyup", function () {
                  syncTextHtml($(this).html());
                })
                .on("DOMNodeInserted", function (e) {
                  var html = $(this).html();
                  var regex =
                    /<\/{0,1}((input|form|select|button|p|ul|li|img|table|tr|td|tbody|thead|a|dd|dl|dt|ol|a)).*?>/gi;
                  if (/<\/{0,1}br>/.test(html)) {
                    html = html.replace(regex, "<div></div>");
                  }
                  if (regex.test(html)) {
                    html = html.replace(regex, "");
                    $(this).html(html);
                  }
                  syncTextHtml(html);
                })
                .on("keyup", function () {
                  var $elem = $(this);
                  var html = $elem.html();
                  if ($elem.find("div").length === 0) {
                    if ($elem.text()) {
                      //有文本但无div时补充div
                      $(this).html("<div>" + html + "</div>");
                    }
                  }
                });
              editorFocus($layerContent);
              init();
            }
            if (data.action === "chooseLayer") {
              $layer = getLayerElem(layer);
              $scope.clearTextNoneDiv($layer.find(".content"));
              syncTextState($layer);
              // $scope.clearChildPStyle();
            }
          });

          $scope.clearTextNoneDiv = function ($elem) {
            $elem.find("div").each(function () {
              var text = $(this).text();
              if (!text || text === "") {
                $(this).remove();
              }
            });
          };
          $scope.$on("$destory", function () {
            layerClickOff();
            inputColorClickOff();
          });

          // 设置为提交按钮，链接不可用
          $scope.$watch("layer.asSubmitBtn", function (newVal, oldVal) {
            if (newVal) {
              $scope.toolbar.linkType = "none";
            }
          });

          $scope.isEditText = function (layer) {
            return layer && layer.state === 1;
          };

          init();
        },
      };
    },
  ]);
});
