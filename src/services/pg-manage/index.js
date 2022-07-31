//页面管理服务
define([
	'app'
], function(app) {
	app.service('$pgManage', ['config', '$rootScope', function(config, $rootScope) {
		var events = config.EVENTS;

		this.setNewPageID = function(pageid) {
			this.newPageID = pageid;
			this.setCurPageID(pageid);
		};

		this.setCurPageID = function(pageid) {
			this.curPageID = pageid;
		};
		this.setCurPage = function(page) {
			if (this.curPage && page) {
				if (this.curPage.kind === 'custome' && page.kind === 'custome') {
					if (this.curPage.id !== page.id && this.curPage._es === 1) {
						$rootScope.$broadcast(events.pageEditorClick, {
							action: 'savePage',
							page: this.curPage
						});
					}
				}
			}
			this.curPage = page;
		};

		this.clearNewPageID = function() {
			this.newPageID = null;
		};

		this.isNewPage = function(pageid) {
			return this.newPageID === pageid;
		};

		this.isCurPage = function(pageid) {
			return this.curPageID === pageid;
		};
	}]);

});