define(['app'], function (app) {
	app.factory('LikeService', ['Restangular', 'config',
		function (Restangular, config) {
			var baseTpl = Restangular.all('likes');
			return {
				remove: function (likeID) {
					return baseTpl.one(likeID).customDELETE();
				},
				create: function (like) {
					return baseTpl.post(like);
				}
			};
		}
	]);
});