define(['app'], function(app) {
	app.service('$flyer', ['$q', '$http', '$user', '$alert',
		function($q, $http, $user, $alert) {
			var Flyer = {
				data: {

				},
				set: function(_data) {
					this.data = _data;
				},
				setVal: function(key, val) {
					if (this.data) {
						this.data[key] = val;
					}
				},
				get: function(_flyerID) {
					var self = this,
						delay = $q.defer();
					if (self.data.title && _flyerID === self.data._id) {
						delay.resolve(self.data);
					} else {
						if (!_flyerID) delay.resolve(null);
						var url = '/api/flyers/' + _flyerID + '/info';
						$http({
								method: 'get',
								url: url
							})
							.
						success(function(resData, status, headers, config) {
								if (resData.code === 200) {
									var _flyer = {};

									_.merge(_flyer, resData.msg);

									self.set(_flyer);
									delay.resolve(_flyer);
								}
							})
							.error(function() {
								delay.reject("");
							});
					}
					return delay.promise;
				},
				merge: function(_id, obj) {
					if (_id === this.data._id) {
						_.merge(this.data, obj);
					}
				},
				clone: function(_id, form) {
					var delay = $q.defer();
					$http({
							method: 'post',
							url: '/api/flyers/' + _id + '/clone',
							data: form
						})
						.
					success(function(data, status, headers, config) {
						if (data.code === 200) {
							delay.resolve(data.msg._id);
						} else {
							$alert.error(data.msg);
						}
					});
					return delay.promise;
				}
			};

			return Flyer;
		}
	]);

	app.factory('FlyerService', ['Restangular', '$timeout', 'config',
		function(Restangular, $timeout, config) {
			var model = 'flyers';
			return {
				setModel: function(m) {
					model = m;
				},
				getModel: function() {
					return model;
				},
				list: function(query) {
					return Restangular.all(model).customGET('', query);
				},
				get: function(flyerID) {
					return Restangular.one(model, flyerID)
						.get();
				},
				update: function(flyerID, flyer) {
					return Restangular.one(model, flyerID)
						.customPUT(flyer);
				},
				publish: function(flyerID) {
					return Restangular.one(model, flyerID).one('publish')
						.customPUT();
				},
				remove: function(flyerID, pageID) {
					return Restangular.one(model, flyerID).customDELETE();
				},
				create: function(flyer) {
					return Restangular.all(model)
						.post(flyer);
				},
				clone: function(flyerID, form) {
					return Restangular.one(model, flyerID)
						.one('clone')
						.customPOST(form);
				},
				selectPage: function(flyerID, pageID) {
					return Restangular.one(model, flyerID)
						.one('pages', pageID).one('selected').customPUT();
				},
				removePage: function(flyerID, pageID) {
					return Restangular.one(model, flyerID)
						.one('pages', pageID).customDELETE();
				},
				createPage: function(flyerID, form) {
					return Restangular.one(model, flyerID)
						.one('pages').customPOST(form);
				},
				savePage: function(flyerID, pageID, form) {
					return Restangular.one(model, flyerID)
						.one('pages', pageID).customPUT(form);
				},
				updateContent: function(flyerID, form) {
					return Restangular.one(model, flyerID)
						.one('content')
						.customPUT(form);
				},
				updateAudio: function(flyerID, form) {
					return Restangular.one(model, flyerID)
						.one('audio')
						.customPUT(form);
				},
				updateSetting: function(flyerID, form) {
					return Restangular.one(model, flyerID)
						.one('setting').customPUT(form);
				},
				updateStatus: function(flyerID, form) {
					return Restangular.one(model, flyerID)
						.one('status').customPUT(form);
				},
				updateFreeze: function(flyerID, form) {
					return Restangular.one(model, flyerID)
						.one('freeze').customPUT(form);
				},
				getSetting: function(flyerID) {
					return Restangular.one(model, flyerID)
						.one('setting').get();
				},
				getDataSetting: function(flyerID) {
					return Restangular.one(model, flyerID)
						.one('dataSetting').get();
				},
				setFriendShare: function(flyerID, flyer) {
					return Restangular.one(model, flyerID).all('friendShare')
						.customPUT(flyer);
				},
				// 列出可分享的作品
				listOneShare: function() {
					return Restangular.one('flyers').one('share')
						.customGET();
				},
				// 获取热门作品列表
				listHot: function() {
					return Restangular.one('flyers').one('hot')
						.customGET();
				},
				// 获取推荐作品列表
				listRecommend: function(query) {
					return Restangular.one('flyers').one('recommend')
						.customGET('', query);
				},
				// 获取可共享作品总数
				getShareCount: function() {
					return Restangular.one('flyers').one('share').one('count')
						.customGET();
				},
				getDetail: function(flyerID) {
					return Restangular.one('flyers', flyerID).one('detail')
						.customGET();
				},
				getUser: function(flyerID) {
					return Restangular.one('flyers', flyerID)
						.customGET('user');
				},
				dlPro: function(form) {
					return Restangular.one(model)
						.one('dlPro').customPOST(form);
				}
			};
		}
	]);

});