// bootStrap 默认 $modal 的封装
define(['app'], function(app) {
	app.factory('$modalService', ['$modal', '$modalStack', function($modal, $modalStack) {
		var defaultOptions = {
			backdrop: true,
			keyboard: true,
			windowClass: ''
		};
		return {
			show: function(options) {
				var realOpt = _.cloneDeep(defaultOptions);
				angular.extend(realOpt, options || {});
				return $modal.open(realOpt).result;
			},
			dismissAll: function() {
				$modalStack.dismissAll();
			}
		};
	}]);
});