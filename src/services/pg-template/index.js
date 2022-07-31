define(['app'], function(app) {
    app.factory('PageTemplateService', ['Restangular', '$timeout',
        function(Restangular, $timeout) {
            var baseRoute = Restangular.all('page');
            return {
                get: function(templateID) {
                    return baseRoute.one('templates',templateID).get();
                },
                list: function(query) {
                    return baseRoute.one('templates').get(query);
                },
                create: function(data) {
                    return baseRoute.one('templates').customPOST(data);
                },
                update: function(templateID, data) {
                    return baseRoute.one('templates', templateID).customPUT(data);
                },
                updateContent: function(templateID, data) {
                    return baseRoute.one('templates', templateID).one('content').customPUT(data);
                },
                remove: function(templateID) {
                    return baseRoute.one('templates', templateID).remove();
                },
                updateTags: function(templateID, data) {
                    return baseRoute.one('templates', templateID).one('tags').customPUT(data);
                }
            };
        }
    ]);

});