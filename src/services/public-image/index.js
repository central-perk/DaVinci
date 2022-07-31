define(['app'], function (app) {
	app.factory('PublicImageService', ['Restangular', '$timeout',
        function (Restangular, $timeout) {
			var baseRoute = Restangular.all('public');
			return {
				get: function (imageID) {
					return baseRoute.one('images', imageID).get();
				},
				list: function (query) {
					return baseRoute.one('images').get(query);
				},
				create: function (data) {
					return baseRoute.one('images').customPOST(data);
				},
				update: function (imageID, data) {
					return baseRoute.one('images', imageID).customPUT(data);
				},
				remove: function (imageID) {
					return baseRoute.one('images', imageID).remove();
				},
				updateTags: function (imageID, data) {
					return baseRoute.one('images', imageID).one('tags').customPUT(data);
				}
			};
        }
    ]);

});