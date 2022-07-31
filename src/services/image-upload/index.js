/**
 *  窗口-选择作品
 *
 */
define(['app'], function (app) {
	app.service('$imageUpload', ['$modalService', '$q', function ($modalService, $q) {
		// 展示
		this.init = function (options) {
			var imageUploadDelay = $q.defer(),
				__image = options.image,
				__cropSize = options.cropSize,
				__ratio = options.ratio || -1,
				__hideReplaceBtn = options.hideReplaceBtn || false,
				__tip = options.tip;
			$modalService.show({
				templateUrl: '/services/image-upload/index.html',
				windowClass: 'mdl-image-upload',
				width: 676,
				backdrop: 'static',
				marginTop: 200,
				controller: ['config', '$image', '$scope', '$modalInstance', '$http', '$alert', '$timeout', '$rootScope',
					function (config, $image, $scope, $modalInstance, $http, $alert, $timeout, $rootScope) {
						var events = config.EVENTS,
							__storageLocal = false,
							imageCropClickOff;
						$scope.init = function () {
							$scope.hideReplaceBtn = __hideReplaceBtn;
							$scope.cropSize = __cropSize;
							imageCropClickOff = $rootScope.$on(events.imageCropClick, function (event, data) {
								__image = __image || {};
								if (data.action === 'select') {
									if (data.crop) {
										__image.crop = data.crop;
										__image.url = data.url;
									}
								}
								if (data.action === 'preview') {
									if (data.url) {
										__image.url = data.url;
									}
								}
								if (data.action === 'selectBoxDbClick') {
									$scope.save();
								}
								if (data.action === 'init') {
									$scope.$emit(events.pgImageClick, {
										action: 'edit',
										image: __image || {},
										tip: __tip
									});
								}
							});
						};
						$scope.save = function () {
							if ($scope.loading) {
								return;
							}
							var url = __image.url;
							$scope.loading = true;
							$image.crop({
								data: {
									crop: __image.crop,
									url: url,
									local: __storageLocal
								},
								storageLocal: __storageLocal
							}).then(function (result) {
								imageUploadDelay.resolve(result);
								$rootScope.$broadcast(events.imageUpload, {
									action: 'success',
									url: result.url
								});
								$scope.loading = false;
								$scope.close();
							}, function () {
								$scope.loading = false;
							});
						};
						$scope.do = function () {
							$scope.save();
						};

						$scope.replace = function () {
							var imageObj = new Image;
							imageObj.src = __image.url;
							imageObj.onload = function () {
								var result = {
									crop: {
										w: imageObj.width,
										h: imageObj.height
									},
									url: __image.url,
									cropUrl: __image.url
								};
								imageUploadDelay.resolve(result);
								$rootScope.$broadcast(events.imageUpload, {
									action: 'success',
									url: result.url
								});
								$scope.loading = false;
								$scope.close();
							}
						};
						$scope.close = function () {
							$modalInstance.close();
							imageCropClickOff();
						};
					}
				]
			});
			return imageUploadDelay.promise;
		};
	}]);
});