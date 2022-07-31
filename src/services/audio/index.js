define(['app'], function(app) {
	app.service('$audio', ['$q', '$http', '$user', '$alert', '$upload', '$utils',
		function($q, $http, $user, $alert, $upload, $utils) {
			var $up;
			var AudioService = {
				create: function(options) {
					var delay = $q.defer();
					$http({
						method: 'post',
						url: '/api/audios',
						data: options
					}).
					success(function(data, status, headers, config) {
						if (data.code === 200) {
							delay.resolve(data.msg);
						} else {
							delay.reject(data.msg);
						}
					});
					return delay.promise;
				},
				list: function(options) {
					var delay = $q.defer();
					var queryStr = $utils.makeQuery(options);
					$http({
						method: 'get',
						url: '/api/audios?' + queryStr
					}).
					success(function(data, status, headers, config) {
						if (data.code === 200) {
							delay.resolve(data.msg);
						} else {
							$alert.error(data.msg);
						}
					});
					return delay.promise;
				},
				upload: function($file) {
					var delay = $q.defer();
					$up = $upload.upload({
							url: '/api/audios/upload',
							file: $file
						})
						.progress(function(evt) {
							delay.notify(parseInt(100.0 * evt.loaded / evt.total));
						})
						.success(function(data, status, headers, config) {
							$up = null;
							if (data.code === 200) {
								delay.resolve(data.msg);
							} else {
								delay.reject(data.msg);
							}
						})
						.error(function() {
							$up = null;
							delay.reject();
						});

					this.abort = $up.abort;

					return delay.promise;
				}

			};
			return AudioService;
		}
	]);
});