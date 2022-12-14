window.__DVC = window.__DVC || {};

require.config({
  baseUrl: "/",
  paths: {
    sortable: "modules/sortable/index",
    app: "js/app",
    appRoute: "js/app.route",
    appConfig: "js/app.config",
    pageAnimateBase: "components/custome/animate/effects/base",
    pageAnimateTransform: "components/custome/animate/transform",
    pageAnimateRequire: "components/custome/animate/require",
  },
});

require([
  "app",
  "appConfig",
  "appRoute",
  "config",
  "js/controllers/layout",
  "filters/common/index",
  "services/utils/index",
  "services/validators/index",
  "services/rest-api/index",
  "services/alert/index",
  "services/flyer/index",
  "services/relation/index",
  "services/flyer-share/index",
  "services/user/index",
  "services/follow/index",
  "services/fans/index",
  "services/plan-amount/index",
  "services/account/index",
  "services/modal/index",
  "services/confirm/index",
  "services/image/index",
  "services/audio/index",
  "services/image-upload/index",
  "services/chat/index",
  "services/relation/index",
  "services/collect/index",
  "services/vote/index",
  "services/reply/index",
  "services/like/index",
  "common/service/affirm/index",
  "common/service/notify/index",
  "common/service/flyer-config/index",
  "common/service/flyer-view/index",
  "common/service/tpl-view/index",
  "common/service/tpl-config/index",
  "common/service/tool/index",
  "modules/common-directives/index",
  "modules/publish-required/index",
  "modules/pagination/index",
  "modules/image-upload/index",
  "modules/wechat-pay/index",
  "modules/image-loading/index",
  "modules/qr-block/index",
  "sortable",
  "pageAnimateTransform",
  "pageAnimateBase",
  "pageAnimateRequire",
], function () {
  jQuery.curCSS = jQuery.css;
  moment.locale("zh-cn");
  angular.bootstrap(document, ["app"]);
});
