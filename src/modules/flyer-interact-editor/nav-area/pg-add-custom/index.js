define(["app"], function (app) {
  app.service("$pgAddCustom", [
    "$modalService",
    "$http",
    "PageTemplateService",
    function ($modalService, $http, PageTemplateService) {
      var customCategorys, otherCategorys, allCustomTpl;

      this.getTplLen = function () {
        return this.tplLen;
      };

      this.initTemplates = function () {
        var self = this;
        // PageTemplateService.list().then(function (result) {
        var result = {
          code: 200,
          msg: {
            tags: {
              common: [
                {
                  tag: "all",
                  name: "all",
                },
                {
                  tag: "normal",
                  name: "General",
                },
                {
                  tag: "cover",
                  name: "Cover",
                },
                {
                  tag: "news",
                  name: "Text",
                },
                {
                  tag: "backcover",
                  name: "Back Cover",
                },
                {
                  tag: "form",
                  name: "Form",
                },
              ],
              more: [
                {
                  tag: "intro",
                  name: "Business Card",
                },
                {
                  tag: "gallery",
                  name: "Album",
                },
                {
                  tag: "goods",
                  name: "Product",
                },
                {
                  tag: "timer",
                  name: "Timeline",
                },
              ],
            },
            templates: {
              all: [],
              normal: [],
              cover: [],
              news: [],
              backcover: [],
              intro: [],
              gallery: [],
              goods: [],
              timer: [],
              form: [],
            },
          },
        };
        var data = result.msg;
        customCategorys = data.tags.common;
        _.forEach(customCategorys, function (category) {
          category.label = category.name;
          category.key = category.tag;
          delete category.name;
          delete category.tag;
        });

        otherCategorys = data.tags.more;

        _.forEach(otherCategorys, function (category) {
          category.label = category.name;
          category.key = category.tag;
          delete category.name;
          delete category.tag;
        });
        allCustomTpl = data.templates;
        self.tplLen = data.templates.all.length;
        // });
      };
      this.show = function (callback) {
        $modalService.show({
          templateUrl:
            "/modules/flyer-interact-editor/nav-area/pg-add-custom/index.html",
          width: 860,
          height: 520,
          controller: [
            "$scope",
            "$modalInstance",
            "$pgData",
            function ($scope, $modalInstance, $pgData) {
              $scope.customCategorys = customCategorys;
              $scope.allCustomTpl = allCustomTpl;
              $scope.otherCategorys = otherCategorys;

              // select page template type
              $scope.chooseCategory = function (category) {
                $scope.activeCategory.active = false;
                category.active = true;
                $scope.activeCategory = category;

                $scope.tpls = $scope.allCustomTpl[category.key];
                // clear the select box
                $scope.other = {};
              };

              // The first type of page template is selected by default
              $scope.activeCategory = $scope.customCategorys[0];
              $scope.chooseCategory($scope.customCategorys[0]);

              $scope.other = {};

              $scope.selectCategory = function () {
                $scope.activeCategory.active = false;
                $scope.tpls =
                  $scope.allCustomTpl[$scope.other.selectedCategory.key];
              };

              $scope.createPg = function (tpl) {
                callback(tpl);
                $scope.close();
              };

              $scope.createBlankPg = function () {
                callback();
                $scope.close();
              };

              $scope.close = function () {
                $modalInstance.close();
              };
            },
          ],
        });
      };
    },
  ]);
});
